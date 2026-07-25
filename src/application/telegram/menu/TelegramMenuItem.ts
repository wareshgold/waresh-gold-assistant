import {
  TelegramMenuAction,
} from "./TelegramMenuAction";


export interface TelegramMenuItem {

  id: string;

  label: string;

  action: TelegramMenuAction;

  description?: string;
}