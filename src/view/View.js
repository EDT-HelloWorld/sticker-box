export class View {
  #$canvasSticker;
  #$buttonCreateSticker;

  constructor() {
    this.#$canvasSticker = document.querySelector('#sticker-canvas');
    this.#$buttonCreateSticker = document.querySelector(
      '#button-create-sticker'
    );
  }

  renderCreateSticker(sticker) {
    const $sticker = sticker.getElement();
    this.#$canvasSticker.append($sticker);
  }

  bindCreateStickerButton(handler) {
    this.#$buttonCreateSticker.addEventListener('click', () => {
      handler();
    });
  }

  bindMoveSticker(handler) {
    let isDragging = false;
    let $currentSticker = null;
    let startPosition = {};

    const onMouseMove = (event) => {
      if (!isDragging) return;

      const newPosition = {
        x: event.clientX - startPosition.x,
        y: event.clientY - startPosition.y,
      };

      handler($currentSticker.id, newPosition);
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousedown', (event) => {
      if (event.target.classList.contains('button-remove-sticker')) return;
      if (event.target.classList.contains('button-item-add')) return;
      $currentSticker = event.target.closest('.sticker');
      if (!$currentSticker) return;

      isDragging = true;
      startPosition = {
        x: event.clientX - $currentSticker.offsetLeft,
        y: event.clientY - $currentSticker.offsetTop,
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  bindRemoveSticker(handler) {
    this.#$canvasSticker.addEventListener('click', (event) => {
      const $buttonRemoveSticker = event.target.closest(
        '.button-remove-sticker'
      );
      if (!$buttonRemoveSticker) return;

      const $sticker = $buttonRemoveSticker.closest('.sticker');
      const key = $sticker.id;

      handler(key);
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

  renderCreateItem(sticker, item) {
    const $sticker = document.querySelector(`#${sticker.getKey()}`);
    const $stickerItems = $sticker.querySelector('.sticker-items');
    const $item = item.getElement();
    $stickerItems.append($item);
  }

  bindCreateItem(handler) {
    this.#$canvasSticker.addEventListener('click', (event) => {
      const $itemAddButton = event.target.closest('.button-item-add');
      if (!$itemAddButton) return;

      const $sticker = $itemAddButton.closest('.sticker');
      const key = $sticker.id;
      const title = 'test';

      handler(key, title);
    });
  }

  bindRemoveItem(handler) {
    this.#$canvasSticker.addEventListener('click', (event) => {
      const $buttonRemoveItem = event.target.closest('.button-remove-item');
      if (!$buttonRemoveItem) return;

      const $item = $buttonRemoveItem.closest('.item');
      const $sticker = $item.closest('.sticker');
      const key = $sticker.id;
      const itemKey = $item.dataset.key;

      handler(key, itemKey);
    });
  }

  getStickerElement(key) {
    return document.querySelector(`#${key}`);
  }

  getStickerItemsElement(key) {
    return document.querySelector(`#${key} .sticker-items`);
  }

  removeSticker(sticker) {
    sticker.remove();
  }

  renderRemoveItem(item) {
    item.remove();
  }
}
