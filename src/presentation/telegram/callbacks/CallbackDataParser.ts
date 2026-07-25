import {
  CallbackAction,
  CallbackNamespace,
} from "./CallbackAction";


export class CallbackDataParser {

  parse(data: string): CallbackAction {

    const [
      namespace,
      action,
      ...payloadParts
    ] = data.split(":");


    return {
      namespace: namespace as CallbackNamespace,

      action,

      payload:
        payloadParts.length > 0
          ? payloadParts.join(":")
          : undefined,
    };
  }

}