import {
    OunceTick
} from "../../domain/strategy-a/value-objects/OunceTick";

import {
    OunceTickRepository
} from "../../domain/strategy-a/repositories/OunceTickRepository";

export class D1OunceTickRepository
    implements OunceTickRepository {

    constructor(
        private readonly db: D1Database
    ) {}

    async save(
        tick: OunceTick
    ): Promise<void> {
        await this.db
            .prepare(
`
INSERT INTO ounce_ticks
(
    price,
    direction,
    raw_message,
    timestamp,
    created_at
)
SELECT ?, ?, ?, ?, ?
WHERE NOT EXISTS (
    SELECT 1
    FROM ounce_ticks
    WHERE timestamp = ?
      AND price = ?
      AND direction = ?
)
`
            )
            .bind(
                tick.price,
                tick.direction ?? null,
                tick.rawMessage ?? null,
                tick.timestamp,
                Date.now(),
                tick.timestamp,
                tick.price,
                tick.direction ?? null
            )
            .run();
    }

    async getRecent(
        limit: number
    ): Promise<OunceTick[]> {
        const result =
            await this.db
                .prepare(
`
SELECT price, direction, raw_message, timestamp
FROM ounce_ticks
ORDER BY timestamp DESC
LIMIT ?
`
                )
                .bind(limit)
                .all<{
                    price: number;
                    direction: string | null;
                    raw_message: string | null;
                    timestamp: number;
                }>();

        return (result.results ?? [])
            .map(row => ({
                price: Number(row.price),
                direction:
                    (row.direction as OunceTick["direction"]) ??
                    "unknown",
                rawMessage:
                    row.raw_message ?? undefined,
                timestamp: Number(row.timestamp)
            }))
            .reverse();
    }

    async getSince(
        timestamp: number
    ): Promise<OunceTick[]> {
        const result =
            await this.db
                .prepare(
`
SELECT price, direction, raw_message, timestamp
FROM ounce_ticks
WHERE timestamp >= ?
ORDER BY timestamp ASC
`
                )
                .bind(timestamp)
                .all<{
                    price: number;
                    direction: string | null;
                    raw_message: string | null;
                    timestamp: number;
                }>();

        return (result.results ?? []).map(row => ({
            price: Number(row.price),
            direction:
                (row.direction as OunceTick["direction"]) ??
                "unknown",
            rawMessage:
                row.raw_message ?? undefined,
            timestamp: Number(row.timestamp)
        }));
    }
}