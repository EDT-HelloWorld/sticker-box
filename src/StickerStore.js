import { getPrimaryKey } from './utils/getPrimaryKey.js';
import { Sticker } from './model/Sticker.js';
import { $canvasSticker } from '../index.js';

export class StickerStore {
  #stickers;
  #totalCount;
  #$buttonCreateSticker;

  init() {
    this.#$buttonCreateSticker = document.querySelector('#button-create-sticker');
    this.#$buttonCreateSticker.addEventListener('click', this.#handleCreateSticker.bind(this));

    this.#stickers = new Object();
    this.#totalCount = 1;

    this.#renderStickers();
  }

  findStickerByKey(key) {
    return this.#stickers[key];
  }

  removeSticker(sticker) {
    delete this.#stickers[sticker.getKey()];
  }

  #renderStickers() {
    Object.values(this.#getStickers()).forEach((sticker) => {
      this.#renderStickerPosition(sticker);
    });
  }

  #handleCreateSticker() {
    const position = this.#getPositionForCreateSticker();
    const key = `sticker-${getPrimaryKey()}`;
    const title = `Sticker ${this.#getNextCount()}`;
    const sticker = new Sticker(title, key, position);

    this.#addSticker(sticker);

    this.#renderStickers();
  }

  #renderStickerPosition(sticker) {
    const $sticker = document.querySelector(`#${sticker.getKey()}`);

    if ($sticker) {
      $sticker.style.left = `${sticker.getPosition().x}px`;
      $sticker.style.top = `${sticker.getPosition().y}px`;
    } else {
      this.#renderCreateSticker(sticker, sticker.getPosition());
    }
  }

  #renderCreateSticker(sticker) {
    const $sticker = sticker.getElement();
    $canvasSticker.append($sticker);
  }

  #getPositionForCreateSticker() {
    const position = {
      x: 0,
      y: 0,
    };

    Object.entries(this.#stickers).forEach(([key, sticker]) => {
      const { x, y } = sticker.getPosition();
      if (position.x === x && position.y === y) {
        position.x += 10;
        position.y += 10;
      }
    });

    return position;
  }

  #getStickers() {
    return this.#stickers;
  }

  #getNextCount() {
    return this.#totalCount++;
  }

  #addSticker(sticker) {
    this.#stickers[sticker.getKey()] = sticker;
  }
}
