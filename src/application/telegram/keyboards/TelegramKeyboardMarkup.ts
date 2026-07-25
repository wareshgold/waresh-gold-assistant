import {
  TelegramKeyboardButton,
} from "./TelegramKeyboardButton";


export type TelegramKeyboardType =
  | "REPLY"
  | "INLINE";


export interface TelegramKeyboardMarkup {

  type: TelegramKeyboardType;


  rows: TelegramKeyboardButton[][];
}