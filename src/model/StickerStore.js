export class StickerStore {
  #stickers;
  #totalCount;

  constructor() {
    this.#stickers = new Object();
    this.#totalCount = 0;
  }

  getPositionForCreateSticker() {
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
