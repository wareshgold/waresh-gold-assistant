export interface HealthStatus {


    status:
        "healthy" | "degraded";


    services: {


        cache:
            "up" | "down";


        storage:
            "up" | "down";


        metrics:
            "up" | "down";


    };


    timestamp:
        Date;


}