export class Controller {
  #view;
  #stickerStore;
  constructor() {
    this.#view = new View();
    this.#stickerStore = new StickerStore();
  }

  init() {}
}
