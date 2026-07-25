import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
  SELF,
} from "cloudflare:test";

import { describe, it, expect } from "vitest";

import worker from "../src/index";


const IncomingRequest =
  Request<unknown, IncomingRequestCfProperties>;



describe(
  "Waresh Gold Assistant API",
  () => {



    it(
      "should return health status (unit style)",
      async () => {


        const request =
          new IncomingRequest(
            "http://example.com/health"
          );


        const ctx =
          createExecutionContext();



        const response =
          await worker.fetch(
            request,
            env,
            ctx
          );



        await waitOnExecutionContext(ctx);



        expect(response.status)
          .toBe(200);



        const body:any =
          await response.json();



        expect(body.status)
          .toBe("healthy");


        expect(body.service)
          .toBe(
            "waresh-gold-assistant"
          );


        expect(body.version)
          .toBe(
            "0.1.0"
          );


        expect(body.services)
          .toEqual({

            cache:
              "up",

            storage:
              "up",

            metrics:
              "up"

          });


      }
    );









    it(
      "should return health status (integration style)",
      async () => {


        const response =
          await SELF.fetch(
            "https://example.com/health"
          );



        expect(response.status)
          .toBe(200);



        const body:any =
          await response.json();



        expect(body.status)
          .toBe("healthy");


        expect(body.services)
          .toBeDefined();


      }
    );









    it(
      "should record http request metrics",
      async () => {


        const healthResponse =
          await SELF.fetch(

            "https://example.com/health"

          );



        expect(healthResponse.status)
          .toBe(200);




        const response =
          await SELF.fetch(

            "https://example.com/system/metrics"

          );



        expect(response.status)
          .toBe(200);



        const body =
          await response.json();



        expect(body)
          .toHaveProperty(
            "summary"
          );


        expect(body)
          .toHaveProperty(
            "items"
          );



        expect(
          Array.isArray(body.items)
        )
          .toBe(true);



        expect(body.summary)
          .toHaveProperty(
            "requests"
          );


        expect(body.summary)
          .toHaveProperty(
            "cacheHits"
          );


        expect(body.summary)
          .toHaveProperty(
            "marketFetchSuccess"
          );



        const metricTypes =

          body.items.map(

            (item:any)=>
              item.type

          );



        expect(metricTypes)
          .toContain(
            "http_request_count"
          );



        expect(metricTypes)
          .toContain(
            "http_request_duration"
          );


      }
    );









    it(
      "should return market history",
      async () => {


        const response =
          await SELF.fetch(
            "https://example.com/market/history"
          );



        console.log(
          "MARKET HISTORY STATUS:",
          response.status
        );


        const rawBody =
          await response.text();



        console.log(
          "MARKET HISTORY BODY:",
          rawBody
        );



        expect(response.status)
          .toBe(200);



        const body =
          JSON.parse(rawBody);



        expect(body)
          .toHaveProperty(
            "items"
          );



        expect(
          Array.isArray(body.items)
        )
          .toBe(true);



      }
    );









    it(
      "should process telegram webhook",
      async () => {


        const response =
          await SELF.fetch(

            "https://example.com/telegram/webhook",

            {

              method:"POST",


              headers:{

                "Content-Type":
                  "application/json",


                "X-Telegram-Bot-Api-Secret-Token":
                  "development-secret"

              },


              body:
                JSON.stringify({

                  update_id:1,


                  message:{

                    chat:{

                      id:12345

                    },


                    text:
                      "/start"

                  }

                })

            }

          );



        expect(response.status)
          .toBe(200);



        const body =
          await response.json();



        expect(body)
          .toEqual({

            ok:true

          });



      }
    );









    it(
      "should reject telegram webhook without secret",
      async () => {



        const response =
          await SELF.fetch(

            "https://example.com/telegram/webhook",

            {

              method:"POST",


              headers:{

                "Content-Type":
                  "application/json"

              },


              body:
                JSON.stringify({

                  update_id:1,


                  message:{

                    chat:{

                      id:12345

                    },


                    text:
                      "/start"

                  }

                })

            }

          );



        expect(response.status)
          .toBe(401);



        const body =
          await response.json();



        expect(body)
          .toEqual({

            ok:false,

            error:
              "Unauthorized"

          });



      }
    );




  }
);