import { getRandomColor } from '../utils/getRandomColor.js';

export class Sticker {
  #title;
  #key;
  #items;
  #position;
  #element;
  #itemsElement;
  #backgroundColor;

  constructor(title, key, position) {
    this.#title = title;
    this.#key = key;
    this.#position = position;
    this.#items = [];
    this.#backgroundColor = getRandomColor();
    this.#element = this.#createElement();
    this.#itemsElement = this.#element.querySelector('.items-container');
  }

  #createElement() {
    const $sticker = document.createElement('div');
    $sticker.classList.add('sticker');
    $sticker.id = this.getKey();
    $sticker.style.left = `${this.#position.x}px`;
    $sticker.style.top = `${this.#position.y}px`;
    $sticker.style.backgroundColor = this.#backgroundColor;

    const $stickerHeader = document.createElement('div');
    $stickerHeader.classList.add('sticker-header');

    const $stickerTitle = document.createElement('div');
    $stickerTitle.classList.add('sticker-title');
    $stickerTitle.textContent = this.getTitle();
    $stickerHeader.append($stickerTitle);

    const $controlSticker = document.createElement('div');
    $controlSticker.classList.add('control-sticker');
    $stickerHeader.append($controlSticker);

    const $buttonItemAdd = document.createElement('button');
    $buttonItemAdd.classList.add('button-item-add');
    $buttonItemAdd.textContent = '항목 추가';
    $controlSticker.append($buttonItemAdd);

    const $buttonRemoveSticker = document.createElement('button');
    $buttonRemoveSticker.classList.add('button-remove-sticker');
    $buttonRemoveSticker.textContent = '스티커 삭제';
    $controlSticker.append($buttonRemoveSticker);

    const $stickerItems = document.createElement('ul');
    $stickerItems.classList.add('items-container');

    $sticker.append($stickerHeader, $stickerItems);
    return $sticker;
  }

  getElement() {
    return this.#element;
  }

  getItemsElement() {
    return this.#itemsElement;
  }

  getTitle() {
    return this.#title;
  }

  getKey() {
    return this.#key;
  }

  getPosition() {
    return this.#position;
  }

  getItems() {
    return this.#items;
  }

  setPosition(position) {
    this.#position = position;
  }

  addItem(item) {
    this.#items.push(item);
  }

  remove() {
    this.#element.remove();
  }

  removeItem(item) {
    this.#items = this.#items.filter((element) => element !== item);
  }

  updateSticker(item) {
    const targetItem = this.#items.find((element) => element.getKey() === item.getKey());
    const targetItemIndex = this.#items.indexOf(targetItem);

    if (targetItemIndex === -1) {
      this.#items.push(item);
    } else {
      this.#items.splice(targetItemIndex, 1);
    }
  }
}
