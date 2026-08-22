import {
    OunceTickRepository
} from "../../domain/sp2l/repositories/OunceTickRepository";

import {
    OunceTick
} from "../../domain/sp2l/value-objects/OunceTick";

export interface OunceTickSource {
    getLatestTicks(): Promise<OunceTick[]>;
}

export class CollectOunceTickUseCase {

    constructor(
        private readonly source: OunceTickSource,
        private readonly repository: OunceTickRepository
    ) {}

    async execute(): Promise<OunceTick[]> {
        const ticks =
            await this.source.getLatestTicks();

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