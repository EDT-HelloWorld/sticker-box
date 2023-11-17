import { Sticker } from './model/Sticker.js';
import { StickerStore } from './model/StickerStore.js';
import { Item } from './model/item.js';
import { View } from './view/View.js';

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
    this.#view.bindRemoveItem(this.handleRemoveItem.bind(this));
  }

  handleCreateSticker(title) {
    const position = { x: 0, y: 0 };
    const key = `sticker-${this.#stickerStore.getNextKey()}`;
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
    const item = new Item(title, `item-${sticker.getNextIndex()}`);

    sticker.addItem(item);
    this.#view.renderCreateItem(sticker, item);
  }

  renderStickers() {
    Object.values(this.#stickerStore.getStickers()).forEach((sticker) => {
      this.#view.renderStickerPosition(sticker);
    });
  }

  handleRemoveItem(key, itemKey) {
    const sticker = this.#stickerStore.getStickers()[key];
    const item = sticker.getItems().find((item) => item.getKey() === itemKey);

    console.log(item, itemKey);

    sticker.removeItem(item);
    this.#view.renderRemoveItem(item);
  }

  // handleRenderItems(sticker) {
  //   const items = sticker.getItems();
  //   const $items = this.#view.getStickerItemsElement(sticker.getKey());
  //   const itemsElement = $items.querySelectorAll('li');
  //   items.forEach((item, index) => {
  //     const itemElement = itemsElement[index];
  //     if (!itemElement) {
  //       this.#view.renderCreateItem(sticker);
  //       return;
  //     }

  //     if (itemElement !== item) {
  //       itemElement.insertAdjacentElement('beforebegin', item);
  //     }
  //   });
  // }
}
