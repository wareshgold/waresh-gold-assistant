import {
    OunceTick
} from "../value-objects/OunceTick";

export interface OunceTickRepository {
    save(
        tick: OunceTick
    ): Promise<void>;

    getRecent(
        limit: number
    ): Promise<OunceTick[]>;

    getSince(
        timestamp: number
    ): Promise<OunceTick[]>;
}