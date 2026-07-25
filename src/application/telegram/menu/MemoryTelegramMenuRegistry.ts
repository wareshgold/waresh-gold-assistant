import {
  TelegramMenuItem,
} from "./TelegramMenuItem";


import {
  TelegramMenuRegistry,
} from "./TelegramMenuRegistry";


export class MemoryTelegramMenuRegistry
implements TelegramMenuRegistry {


  private readonly items =
    new Map<string, TelegramMenuItem>();


  register(
    item: TelegramMenuItem
  ): void {

    this.items.set(
      item.id,
      item,
    );
  }


  getItems(): TelegramMenuItem[] {

    return Array.from(
      this.items.values(),
    );
  }


  getById(
    id: string,
  ): TelegramMenuItem | undefined {

    return this.items.get(id);
  }
}