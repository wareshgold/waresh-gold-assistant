export enum TelegramMenuActionType {
  COMMAND = "COMMAND",
  CALLBACK = "CALLBACK",
  URL = "URL",
  WEB_APP = "WEB_APP",
}


export interface TelegramMenuAction {
  type: TelegramMenuActionType;

  value: string;
}