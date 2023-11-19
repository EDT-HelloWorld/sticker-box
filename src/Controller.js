import { Sticker } from './model/Sticker.js';
import { StickerStore } from './model/StickerStore.js';
import { Item } from './model/Item.js';
import { View } from './view/View.js';
import { getPrimaryKey } from './utils/getPrimaryKey.js';

export class Controller {
  #view;
  #stickerStore;

  constructor() {
    this.#view = new View();
    this.#stickerStore = new StickerStore();
  }

  init() {
    this.#view.bindCreateStickerButton(this.handleCreateSticker.bind(this));
    this.#view.bindMoveSticker(this.handleMoveSticker.bind(this));
    this.#view.bindCreateItem(this.handleCreateItem.bind(this));
    this.#view.bindRemoveSticker(this.handleRemoveSticker.bind(this));
  }

  handleCreateSticker() {
    const position = this.#stickerStore.getPositionForCreateSticker();
    const key = `sticker-${getPrimaryKey()}`;
    const title = `Sticker ${this.#stickerStore.getNextCount()}`;
    const sticker = new Sticker(title, key, position);

    this.#stickerStore.addSticker(sticker);

    this.renderStickers();
  }

  handleMoveSticker(key, position) {
    const sticker = this.#stickerStore.getStickers()[key];

    sticker.setPosition(position);
    this.#view.renderStickerPosition(sticker);
  }

  handleRemoveSticker(key) {
    const sticker = this.#stickerStore.getStickers()[key];

    this.#stickerStore.removeSticker(sticker);
    this.#view.removeSticker(sticker);
  }

  handleCreateItem(key, title) {
    const sticker = this.#stickerStore.getStickers()[key];
    const item = new Item(
      sticker,
      `item-${getPrimaryKey()}`,
      title,
      this.#stickerStore.findStickerByKey.bind(this.#stickerStore),
    );

    sticker.addItem(item);
    this.#view.renderCreateItem(sticker, item);
  }

  renderStickers() {
    Object.values(this.#stickerStore.getStickers()).forEach((sticker) => {
      this.#view.renderStickerPosition(sticker);
    });
  }
}
