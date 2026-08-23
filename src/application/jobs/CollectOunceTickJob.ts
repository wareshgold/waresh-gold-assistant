import {
    CollectOunceTickUseCase
} from "../sp2l/CollectOunceTickUseCase";

export class CollectOunceTickJob {

    constructor(
        private readonly collectOunceTickUseCase: CollectOunceTickUseCase
    ) {}

    async execute() {
        return this.collectOunceTickUseCase.execute();
    }
}