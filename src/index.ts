import { createApp } from "./bootstrap/createApp";
import { createContainer } from "./bootstrap/createContainer";

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const container = createContainer(env);

    const app = createApp(container);

    return app.fetch(request, env, ctx);
  },
};