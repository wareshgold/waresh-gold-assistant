import {
    EvaluateAndPublishStrategyASignalUseCase
} from "../strategy/strategy-a/EvaluateAndPublishStrategyASignalUseCase";

export class StrategyASignalSchedulerJob {

    constructor(
        private readonly evaluateAndPublishUseCase:
            EvaluateAndPublishStrategyASignalUseCase
    ) {}

    async execute() {
        return this.evaluateAndPublishUseCase.execute();
    }
}