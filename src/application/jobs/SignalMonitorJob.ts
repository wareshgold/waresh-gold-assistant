import {
    MonitorSignalLevelsUseCase
} from "../strategy/strategy-a/MonitorSignalLevelsUseCase";

export class SignalMonitorJob {

    constructor(
        private readonly monitorUseCase:
            MonitorSignalLevelsUseCase
    ) {}

    async execute() {
        return this.monitorUseCase.execute();
    }
}
