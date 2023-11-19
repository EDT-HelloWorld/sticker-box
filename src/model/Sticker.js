import { stickerStore, $canvasSticker } from '../../index.js';
import { getPrimaryKey } from '../utils/getPrimaryKey.js';
import { getRandomColor } from '../utils/getRandomColor.js';
import { Item } from './Item.js';

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
    $sticker.addEventListener('mousedown', this.#handleMouseDown.bind(this));

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
    $buttonItemAdd.addEventListener('click', this.#handleCreateItem.bind(this));
    $controlSticker.append($buttonItemAdd);

    const $buttonRemoveSticker = document.createElement('button');
    $buttonRemoveSticker.classList.add('button-remove-sticker');
    $buttonRemoveSticker.textContent = '스티커 삭제';
    $buttonRemoveSticker.addEventListener('click', this.#handleRemoveSticker.bind(this));
    $controlSticker.append($buttonRemoveSticker);

    const $stickerItems = document.createElement('ul');
    $stickerItems.classList.add('items-container');

    $sticker.append($stickerHeader, $stickerItems);
    return $sticker;
  }

  #handleRemoveSticker(event) {
    if (!event.target.classList.contains('button-remove-sticker')) return;
    stickerStore.removeSticker(this);
    this.remove();
  }

  #handleCreateItem(event) {
    if (!event.target.classList.contains('button-item-add')) return;
    const title = `item-${getPrimaryKey()}`;
    const item = new Item(this, `item-${getPrimaryKey()}`, title);
    this.addItem(item);
    this.getItemsElement().append(item.getElement());
  }

  #handleMouseDown(event) {
    if (event.target.classList.contains('button-remove-sticker')) return;
    if (event.target.classList.contains('button-item-add')) return;
    if (event.target.classList.contains('item-title')) return;
    if (event.target.classList.contains('item')) return;
    if (event.target.classList.contains('button-remove-item')) return;

    let isDragging = false;
    let startPosition = {};

    $canvasSticker.appendChild(this.getElement());
    isDragging = true;

    startPosition = {
      x: event.clientX - this.getElement().offsetLeft,
      y: event.clientY - this.getElement().offsetTop,
    };

    const handleMouseMove = (event) => {
      if (!isDragging) return;

      const newPosition = {
        x: event.clientX - startPosition.x,
        y: event.clientY - startPosition.y,
      };

      this.setPosition(newPosition);

      this.getElement().style.left = `${this.getPosition().x}px`;
      this.getElement().style.top = `${this.getPosition().y}px`;
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
}
