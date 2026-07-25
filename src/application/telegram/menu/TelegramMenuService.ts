import {
  TelegramMenuRegistry,
} from "./TelegramMenuRegistry";


import {
  TelegramMenuItem,
} from "./TelegramMenuItem";


export class TelegramMenuService {


  constructor(
    private readonly registry: TelegramMenuRegistry,
  ) {}


  registerMenu(
    items: TelegramMenuItem[],
  ): void {

    for (const item of items) {

      this.registry.register(item);
    }
  }


  getMainMenu(): TelegramMenuItem[] {

    return this.registry.getItems();
  }
}