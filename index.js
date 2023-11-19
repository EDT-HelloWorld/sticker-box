import { StickerStore } from './src/StickerStore.js';

export const $canvasSticker = document.querySelector('#sticker-canvas');

export const stickerStore = new StickerStore();
stickerStore.init();
