import { Sticker } from './model/Sticker.js';
import { StickerStore } from './model/StickerStore.js';
import { Item } from './model/Item.js';
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
    const item = new Item(
      sticker,
      `item-${sticker.getNextIndex()}`,
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

  handleRemoveItem(key, itemKey) {
    const sticker = this.#stickerStore.getStickers()[key];
    const item = sticker.getItems().find((item) => item.getKey() === itemKey);

    console.log(item, itemKey);

    sticker.removeItem(item);
    this.#view.renderRemoveItem(item);
  }

  // handleMoveItemToOtherSticker(key, itemKey, targetKey) {
  //   const sticker = this.#stickerStore.getStickers()[key];
  //   const targetSticker = this.#stickerStore.getStickers()[targetKey];
  //   const item = sticker.getItems().find((item) => item.getKey() === itemKey);

  //   sticker.removeItem(item);
  //   targetSticker.addItem(item);
  //   this.#view.renderMoveItem(item, targetSticker);
  // }

  // handleDragItem(targetKey, itemKey, position) {
  //   console.log(targetKey, itemKey, position);
  //   const item = this.#stickerStore.getStickers()[targetKey];
  //   // item.removeElement();
  //   // this.#view.renderItemPosition(item);
  // }
}
