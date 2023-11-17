export class StickerStore {
  #stickers;

  constructor() {
    this.#stickers = [];
  }

  getStickers() {
    return this.#stickers;
  }

  addSticker(sticker) {
    this.#stickers.push(sticker);
  }

  removeSticker(sticker) {
    this.#stickers = this.#stickers.filter((s) => s !== sticker);
  }
}
