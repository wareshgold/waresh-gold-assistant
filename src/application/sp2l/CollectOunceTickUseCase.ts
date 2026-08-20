import {
    OunceTickRepository
} from "../../domain/sp2l/repositories/OunceTickRepository";

import {
    OunceTick
} from "../../domain/sp2l/value-objects/OunceTick";

export interface OunceTickSource {
    getLatestTick(
        timestamp?: number
    ): Promise<OunceTick>;
}

export class CollectOunceTickUseCase {

    constructor(
        private readonly source: OunceTickSource,
        private readonly repository: OunceTickRepository
    ) {}

    async execute(): Promise<OunceTick> {
        const tick =
            await this.source.getLatestTick(
                Date.now()
            );

        await this.repository.save(tick);

        return tick;
    }
}