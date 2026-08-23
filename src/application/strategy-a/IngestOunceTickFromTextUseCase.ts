import {
    OunceTickRepository
} from "../../domain/strategy-a/repositories/OunceTickRepository";

import {
    OunceTick
} from "../../domain/strategy-a/value-objects/OunceTick";

import {
    OuncePriceParser
} from "../../infrastructure/strategy-a/parsers/OuncePriceParser";

export class IngestOunceTickFromTextUseCase {

    constructor(
        private readonly repository: OunceTickRepository
    ) {}

    async execute(
        text: string,
        timestamp: number = Date.now()
    ): Promise<OunceTick | null> {
        const tick =
            OuncePriceParser.tryParse(
                text,
                timestamp
            );

        if (!tick) {
            return null;
        }

        await this.repository.save(
            tick
        );

        return tick;
    }
}