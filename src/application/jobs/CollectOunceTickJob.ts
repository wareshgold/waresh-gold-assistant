import {
    CollectOunceTickUseCase
} from "../strategy-a/CollectOunceTickUseCase";

export class CollectOunceTickJob {

    constructor(
        private readonly collectOunceTickUseCase: CollectOunceTickUseCase
    ) {}

    async execute() {
        return this.collectOunceTickUseCase.execute();
    }
}