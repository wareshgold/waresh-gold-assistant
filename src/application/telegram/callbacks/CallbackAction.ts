export enum CallbackNamespace {
  GOLD = "gold",
  MARKET = "market",
  CALCULATOR = "calculator",
  HELP = "help",
  SYSTEM = "system",
}


export interface CallbackAction {

  namespace: CallbackNamespace;

  action: string;

  payload?: string;
}