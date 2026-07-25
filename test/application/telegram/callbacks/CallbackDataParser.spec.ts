import {
  describe,
  expect,
  it,
} from "vitest";


import {
  CallbackDataParser,
} from "../../../../src/application/telegram/callbacks/CallbackDataParser";



describe(
  "CallbackDataParser",
  () => {


    const parser =
      new CallbackDataParser();



    it(
      "should parse namespace and action",
      () => {


        const result =
          parser.parse(
            "gold:price",
          );



        expect(result.namespace)
          .toBe("gold");



        expect(result.action)
          .toBe("price");



        expect(result.payload)
          .toBeUndefined();


      },
    );





    it(
      "should parse payload",
      () => {


        const result =
          parser.parse(
            "market:history:7d",
          );



        expect(result.namespace)
          .toBe("market");



        expect(result.action)
          .toBe("history");



        expect(result.payload)
          .toBe("7d");


      },
    );





    it(
      "should preserve complex payload",
      () => {


        const result =
          parser.parse(
            "calculator:start:gold:18k",
          );



        expect(result.payload)
          .toBe("gold:18k");


      },
    );


  },
);