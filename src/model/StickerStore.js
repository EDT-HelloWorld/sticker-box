export class StickerStore {
  #stickers;
  #totalCount;

  constructor() {
    this.#stickers = new Object();
    this.#totalCount = 0;
  }

  getStickers() {
    return this.#stickers;
  }

  findStickerByKey(key) {
    return this.#stickers[key];
  }

  getNextKey() {
    return this.#totalCount++;
  }

  addSticker(sticker) {
    this.#stickers[sticker.getKey()] = sticker;
  }

  removeSticker(sticker) {
    delete this.#stickers[sticker.getKey()];
  }
}
