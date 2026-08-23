export type TelegramWebhookAbuseDecision =
    | {
        allowed: true;
      }
    | {
        allowed: false;
        reason: "duplicate_update" | "rate_limited";
        retryAfterSeconds: number;
      };

interface TelegramUpdateLike {
    update_id?: number;
    message?: {
        from?: {
            id?: number;
        };
    };
    edited_message?: {
        from?: {
            id?: number;
        };
    };
    callback_query?: {
        from?: {
            id?: number;
        };
    };
    inline_query?: {
        from?: {
            id?: number;
        };
    };
    my_chat_member?: {
        from?: {
            id?: number;
        };
    };
    chat_member?: {
        from?: {
            id?: number;
        };
    };
}

interface RateLimitRow {
    window_started_at: number;
    request_count: number;
}

export class TelegramWebhookAbuseGuard {
    private readonly shortWindowSeconds = 10;
    private readonly shortWindowLimit = 10;
    private readonly longWindowSeconds = 60;
    private readonly longWindowLimit = 60;

    constructor(
        private readonly db: D1Database
    ) {}

    async check(
        update: TelegramUpdateLike
    ): Promise<TelegramWebhookAbuseDecision> {
        const now = Math.floor(Date.now() / 1000);

        if (typeof update.update_id === "number") {
            const duplicate = await this.isDuplicateUpdate(
                update.update_id
            );

            if (duplicate) {
                return {
                    allowed: false,
                    reason: "duplicate_update",
                    retryAfterSeconds: 0
                };
            }
        }

        const userId = this.extractUserId(update);

        if (userId === null) {
            return { allowed: true };
        }

        const shortWindow = await this.consumeRateLimit(
            `user:${userId}`,
            this.shortWindowSeconds,
            this.shortWindowLimit,
            now
        );

        if (!shortWindow.allowed) {
            return shortWindow;
        }

        return this.consumeRateLimit(
            `user:${userId}`,
            this.longWindowSeconds,
            this.longWindowLimit,
            now
        );
    }

    async markProcessed(
        updateId: number
    ): Promise<void> {
        const now = Math.floor(Date.now() / 1000);
        const checkpointKey = "telegram:webhook";

        await this.db
            .prepare(
                `INSERT INTO telegram_webhook_update_checkpoints
                    (checkpoint_key, last_update_id, updated_at)
                 VALUES (?, ?, ?)
                 ON CONFLICT(checkpoint_key)
                 DO UPDATE SET
                    last_update_id = excluded.last_update_id,
                    updated_at = excluded.updated_at
                 WHERE excluded.last_update_id > telegram_webhook_update_checkpoints.last_update_id`
            )
            .bind(
                checkpointKey,
                updateId,
                now
            )
            .run();
    }

    private async isDuplicateUpdate(
        updateId: number
    ): Promise<boolean> {
        const row = await this.db
            .prepare(
                `SELECT last_update_id
                 FROM telegram_webhook_update_checkpoints
                 WHERE checkpoint_key = ?`
            )
            .bind("telegram:webhook")
            .first<{ last_update_id: number }>();

        return Boolean(
            row &&
            updateId <= Number(row.last_update_id)
        );
    }

    private async consumeRateLimit(
        key: string,
        windowSeconds: number,
        limit: number,
        now: number
    ): Promise<TelegramWebhookAbuseDecision> {
        const windowStartedAt =
            now - (now % windowSeconds);

        await this.db
            .prepare(
                `INSERT INTO telegram_webhook_rate_limits
                    (
                        rate_limit_key,
                        window_seconds,
                        window_started_at,
                        request_count,
                        updated_at
                    )
                 VALUES (?, ?, ?, 1, ?)
                 ON CONFLICT(rate_limit_key, window_seconds)
                 DO UPDATE SET
                    window_started_at =
                        CASE
                            WHEN telegram_webhook_rate_limits.window_started_at = excluded.window_started_at
                            THEN telegram_webhook_rate_limits.window_started_at
                            ELSE excluded.window_started_at
                        END,
                    request_count =
                        CASE
                            WHEN telegram_webhook_rate_limits.window_started_at = excluded.window_started_at
                            THEN telegram_webhook_rate_limits.request_count + 1
                            ELSE 1
                        END,
                    updated_at = excluded.updated_at`
            )
            .bind(
                key,
                windowSeconds,
                windowStartedAt,
                now
            )
            .run();

        const row = await this.db
            .prepare(
                `SELECT window_started_at, request_count
                 FROM telegram_webhook_rate_limits
                 WHERE rate_limit_key = ?
                   AND window_seconds = ?`
            )
            .bind(
                key,
                windowSeconds
            )
            .first<RateLimitRow>();

        if (!row) {
            return { allowed: true };
        }

        if (
            Number(row.request_count) > limit
        ) {
            return {
                allowed: false,
                reason: "rate_limited",
                retryAfterSeconds: Math.max(
                    1,
                    windowSeconds -
                    (now - Number(row.window_started_at))
                )
            };
        }

        return { allowed: true };
    }

    private extractUserId(
        update: TelegramUpdateLike
    ): string | null {
        const userId =
            update.message?.from?.id ??
            update.edited_message?.from?.id ??
            update.callback_query?.from?.id ??
            update.inline_query?.from?.id ??
            update.my_chat_member?.from?.id ??
            update.chat_member?.from?.id;

        return typeof userId === "number"
            ? String(userId)
            : null;
    }
}
