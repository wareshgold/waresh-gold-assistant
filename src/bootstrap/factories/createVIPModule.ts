import {
    VIPAccessService
} from "../../application/vip/VIPAccessService";

import {
    D1VIPCodeRepository
} from "../../infrastructure/vip/D1VIPCodeRepository";

import {
    D1UserVIPAccessRepository
} from "../../infrastructure/vip/D1UserVIPAccessRepository";

export function createVIPModule(
    env: {
        waresh_gold_db: D1Database;
    }
) {
    const codeRepository =
        new D1VIPCodeRepository(
            env.waresh_gold_db
        );

    const accessRepository =
        new D1UserVIPAccessRepository(
            env.waresh_gold_db
        );

    const vipAccessService =
        new VIPAccessService(
            codeRepository,
            accessRepository
        );

    return {
        vipAccessService,
        vipCodeRepository: codeRepository,
        userVIPAccessRepository: accessRepository
    };
}
