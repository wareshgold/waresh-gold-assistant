import {
    OunceTick
} from "../../domain/sp2l/value-objects/OunceTick";

import {
    OunceTickRepository
} from "../../domain/sp2l/repositories/OunceTickRepository";

export class MemoryOunceTickRepository
    implements OunceTickRepository {

    private readonly ticks: OunceTick[] = [];

    async save(
        tick: OunceTick
    ): Promise<void> {
        this.ticks.push(tick);

        // keep last ~5000 ticks in memory
        if (this.ticks.length > 5000) {
            this.ticks.splice(
                0,
                this.ticks.length - 5000
            );
        }
    }

    async getRecent(
        limit: number
    ): Promise<OunceTick[]> {
        return this.ticks
            .slice(-limit)
            .sort(
                (a, b) =>
                    a.timestamp - b.timestamp
            );
    }

    async getSince(
        timestamp: number
    ): Promise<OunceTick[]> {
        return this.ticks
            .filter(
                tick =>
                    tick.timestamp >= timestamp
            )
            .sort(
                (a, b) =>
                    a.timestamp - b.timestamp
            );
    }
}