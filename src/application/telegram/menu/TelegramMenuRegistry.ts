import {
  TelegramMenuItem,
} from "./TelegramMenuItem";


export interface TelegramMenuRegistry {

  register(
    item: TelegramMenuItem
  ): void;


  getItems(): TelegramMenuItem[];


  getById(
    id: string
  ): TelegramMenuItem | undefined;
}