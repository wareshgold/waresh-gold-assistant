import {
    EvaluateAndPublishSP2LSignalUseCase
} from "../strategy/sp2l/EvaluateAndPublishSP2LSignalUseCase";

export class SP2LSignalSchedulerJob {

    constructor(
        private readonly evaluateAndPublishUseCase:
            EvaluateAndPublishSP2LSignalUseCase
    ) {}

    async execute() {
        return this.evaluateAndPublishUseCase.execute();
    }
}