import { describe,expect,it } from "vitest";
import { FakeTelegramUpdateReceiver } from "../../../src/infrastructure/telegram/receivers/FakeTelegramUpdateReceiver";


describe(
    "FakeTelegramUpdateReceiver",
    ()=>{


        it(
            "should store telegram updates",
            async()=>{


                const receiver =
                    new FakeTelegramUpdateReceiver();


                await receiver.receive({

                    update_id:1,

                    message:{
                        from:{
                            id:456
                        },
                        text:"قیمت طلا"
                    }

                });


                expect(
                    receiver.updates.length
                )
                .toBe(1);


            }
        );


    }
);