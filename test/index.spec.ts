import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
  SELF,
} from "cloudflare:test";

import { describe, it, expect } from "vitest";
import worker from "../src/index";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Waresh Gold Assistant API", () => {
  it("should return health status (unit style)", async () => {
    const request = new IncomingRequest(
      "http://example.com/health"
    );

    const ctx = createExecutionContext();

    const response = await worker.fetch(
      request,
      env,
      ctx
    );

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body).toEqual({
      status: "ok",
      service: "waresh-gold-assistant",
      version: "0.1.0",
    });
  });


  it("should return health status (integration style)", async () => {
    const response = await SELF.fetch(
      "https://example.com/health"
    );

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body.status).toBe("ok");
  });
});