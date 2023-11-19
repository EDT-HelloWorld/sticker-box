import { Sticker } from './model/Sticker.js';
import { StickerStore } from './model/StickerStore.js';
import { Item } from './model/Item.js';
import { View } from './view/View.js';
import { getPrimaryKey } from './utils/getPrimaryKey.js';

export const stickerStore = new StickerStore();
export const $canvasSticker = document.querySelector('#sticker-canvas');
export const $buttonCreateSticker = document.querySelector('#button-create-sticker');

export class Controller {
  #view;

  constructor() {
    this.#view = new View();
  }

  init() {
    this.#view.bindCreateStickerButton(this.handleCreateSticker.bind(this));
  }

  handleCreateSticker() {
    const position = stickerStore.getPositionForCreateSticker();
    const key = `sticker-${getPrimaryKey()}`;
    const title = `Sticker ${stickerStore.getNextCount()}`;
    const sticker = new Sticker(title, key, position);

    stickerStore.addSticker(sticker);

    this.renderStickers();
  }

  renderStickers() {
    Object.values(stickerStore.getStickers()).forEach((sticker) => {
      this.#view.renderStickerPosition(sticker);
    });
  }
}
