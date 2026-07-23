import { CacheStore }
from "../../infrastructure/cache/CacheStore";


import { MarketSnapshotRepository }
from "../../domain/market/repositories/MarketSnapshotRepository";


import { MetricsStore }
from "./observability/SystemMonitoringService";


import { HealthStatus }
from "../../domain/system/HealthStatus";




export class HealthCheckService {



    constructor(


        private readonly cache:
            CacheStore,


        private readonly snapshotRepository:
            MarketSnapshotRepository,


        private readonly metricsStore:
            MetricsStore


    ) {}





    async execute():

    Promise<HealthStatus> {



        let cacheStatus:
            "up" | "down" = "up";


        let storageStatus:
            "up" | "down" = "up";


        let metricsStatus:
            "up" | "down" = "up";




        try {

            await this.cache.get(
                "health-check"
            );


        }

        catch {

            cacheStatus = "down";

        }






        try {


            await this.snapshotRepository.getLatest();


        }

        catch {

            storageStatus = "down";

        }






        try {


            await this.metricsStore.getAll();


        }

        catch {

            metricsStatus = "down";

        }






        const healthy =


            cacheStatus === "up" &&

            storageStatus === "up" &&

            metricsStatus === "up";






        return {


            status:

                healthy

                ? "healthy"

                : "degraded",



            services: {


                cache:

                    cacheStatus,


                storage:

                    storageStatus,


                metrics:

                    metricsStatus


            },



            timestamp:

                new Date()


        };


    }



}