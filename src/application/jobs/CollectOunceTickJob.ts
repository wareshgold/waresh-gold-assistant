export interface CollectOunceTickExecutable {
    execute(): Promise<unknown>;
}

export class CollectOunceTickJob {

    constructor(
        private readonly collectOunceTickUseCase: CollectOunceTickExecutable
    ) {}

    async execute() {
        return this.collectOunceTickUseCase.execute();
    }
}