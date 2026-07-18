import { describe, expect, it } from "vitest";
import { TelegramMessageMapper } 
from "../../../src/application/telegram/mappers/TelegramMessageMapper";

describe(
    "TelegramUpdateMapper",
    ()=>{


        it(
            "should map telegram update to incoming message",
            ()=>{


                const mapper = new TelegramMessageMapper();



                const result =
                    mapper.map({

                        update_id:123,

                        message:{

                            from:{
                                id:456
                            },

                            chat:{
                                id:456
                            },

                            text:"قیمت طلا"

                        }

                    });



                expect(result)
                    .toEqual({

                        userId:"456",
                        text:"قیمت طلا"

                    });


            }
        );


    }
);