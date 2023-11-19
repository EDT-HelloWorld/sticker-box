import { $canvasSticker, $buttonCreateSticker } from '../Controller.js';

export class View {
  renderCreateSticker(sticker) {
    const $sticker = sticker.getElement();
    $canvasSticker.append($sticker);
  }

  bindCreateStickerButton(handler) {
    $buttonCreateSticker.addEventListener('click', () => {
      handler();
    });
  }

  renderStickerPosition(sticker) {
    const $sticker = document.querySelector(`#${sticker.getKey()}`);

    if ($sticker) {
      $sticker.style.left = `${sticker.getPosition().x}px`;
      $sticker.style.top = `${sticker.getPosition().y}px`;
    } else {
      this.renderCreateSticker(sticker, sticker.getPosition());
    }
  }
}
