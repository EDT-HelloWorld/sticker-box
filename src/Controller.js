import { Sticker } from './model/Sticker.js';
import { StickerStore } from './model/StickerStore.js';
import { Item } from './model/Item.js';
import { View } from './view/View.js';
import { getPrimaryKey } from './utils/getPrimaryKey.js';

export const stickerStore = new StickerStore();

export class Controller {
  #view;

  constructor() {
    this.#view = new View();
  }

  init() {
    this.#view.bindCreateStickerButton(this.handleCreateSticker.bind(this));
    this.#view.bindMoveSticker(this.handleMoveSticker.bind(this));
    this.#view.bindCreateItem(this.handleCreateItem.bind(this));
    this.#view.bindRemoveSticker(this.handleRemoveSticker.bind(this));
  }

  handleCreateSticker() {
    const position = stickerStore.getPositionForCreateSticker();
    const key = `sticker-${getPrimaryKey()}`;
    const title = `Sticker ${stickerStore.getNextCount()}`;
    const sticker = new Sticker(title, key, position);

    stickerStore.addSticker(sticker);

    this.renderStickers();
  }

  handleMoveSticker(key, position) {
    const sticker = stickerStore.getStickers()[key];

    sticker.setPosition(position);
    this.#view.renderStickerPosition(sticker);
  }

  handleRemoveSticker(key) {
    const sticker = stickerStore.getStickers()[key];

    stickerStore.removeSticker(sticker);
    this.#view.removeSticker(sticker);
  }

  handleCreateItem(key, title) {
    const sticker = stickerStore.getStickers()[key];
    const item = new Item(sticker, `item-${getPrimaryKey()}`, title);

    sticker.addItem(item);
    this.#view.renderCreateItem(sticker, item);
  }

  renderStickers() {
    Object.values(stickerStore.getStickers()).forEach((sticker) => {
      this.#view.renderStickerPosition(sticker);
    });
  }
}
