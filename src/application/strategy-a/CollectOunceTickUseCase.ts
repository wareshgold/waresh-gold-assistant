import {
    OunceTickRepository
} from "../../domain/strategy-a/repositories/OunceTickRepository";

import {
    OunceTick
} from "../../domain/strategy-a/value-objects/OunceTick";

export interface OunceTickSource {
    getLatestTick(
        timestamp?: number
    ): Promise<OunceTick>;

    getLatestTicks?(): Promise<OunceTick[]>;
}

export class CollectOunceTickUseCase {

    constructor(
        private readonly source: OunceTickSource,
        private readonly repository: OunceTickRepository
    ) {}

    async execute(): Promise<OunceTick[]> {
        const ticks =
            this.source.getLatestTicks
                ? await this.source.getLatestTicks()
                : [
                    await this.source.getLatestTick(
                        Date.now()
                    )
                ];

        const uniqueTicks =
            this.deduplicate(ticks);

        for (const tick of uniqueTicks) {
            await this.repository.save(tick);
        }

        return uniqueTicks;
    }

    private deduplicate(
        ticks: OunceTick[]
    ): OunceTick[] {
        const seen = new Set<string>();

        return ticks.filter(tick => {
            const key = [
                tick.timestamp,
                tick.price,
                tick.direction
            ].join(":");

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);
            return true;
        });
    }
}