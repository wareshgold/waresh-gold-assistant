import { createApp } from "./bootstrap/createApp";
import { createContainer } from "./bootstrap/createContainer";
import { AppEnv } from "./shared/config/env";


export default {

  async fetch(
    request: Request,
    env: AppEnv,
    ctx: ExecutionContext
  ) {

    const container =
      createContainer(env);


    const app =
      createApp(container);


    return app.fetch(
      request,
      env,
      ctx
    );

  },


  async scheduled(
    event: ScheduledEvent,
    env: AppEnv,
    ctx: ExecutionContext
  ) {

    const container =
      createContainer(env);


    await container
      .priceRefreshService
      .refresh();

  }

};