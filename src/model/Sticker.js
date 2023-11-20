import {
  EVENT_NAME,
  createDeleteStickerEvent,
  createStickerChangeEvent,
} from '../CustomEvent.js';
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

  serialize() {
    return {
      key: this.#key,
      title: this.#title,
      backgroundColor: this.#backgroundColor,
      position: {
        x: this.#position.x,
        y: this.#position.y,
      },
      items: this.#items.map((item) => item.serialize()),
    };
  }

  /**
   * @description 스티커 엘리먼트를 반환해주는 메서드
   */
  getElement() {
    return this.#element;
  }

  /**
   * @description 스티커의 key를 반환해주는 메서드
   */
  getKey() {
    return this.#key;
  }

  /**
   * @description 스티커의 위치를 반환해주는 메서드
   */
  getPosition() {
    return this.#position;
  }

  /**
   * @description 항목을 추가해주는 메서드
   * @param {Item} item
   */
  addItem(item) {
    this.#items.push(item);
  }

  /**
   * @description 항목을 삭제해주는 메서드
   * @param {Item} item
   */
  removeItem(item) {
    this.#items = this.#items.filter((element) => element !== item);
  }

  /**
   * @description 스티커의 항목들을 반환해주는 메서드
   */
  getItemsElement() {
    return this.#itemsElement;
  }

  /**
   * @description 스티커의 항목들을 반환해주는 메서드
   * @returns {Item[]}
   */
  #getItems() {
    return this.#items;
  }

  /**
   * @description 스티커의 항목들을 설정해주는 메서드
   * @param {Item[]} items
   */
  #setItems(items) {
    this.#items = items;
  }

  /**
   * @description 스티커의 제목을 반환해주는 메서드
   */
  #getTitle() {
    return this.#title;
  }

  /**
   * @description 스티커의 위치를 설정해주는 메서드
   * @param {position} position
   */
  #setPosition(position) {
    this.#position = position;
  }

  /**
   * @description 스티커 엘리먼트를 삭제해주는 메서드
   */
  #removeElement() {
    this.#element.remove();
  }

  /**
   * @description 스티커 엘리먼트를 생성해주는 메서드
   */
  #createElement() {
    const $sticker = document.createElement('div');
    $sticker.classList.add('sticker');
    $sticker.id = this.getKey();
    $sticker.style.left = `${this.getPosition().x}px`;
    $sticker.style.top = `${this.getPosition().y}px`;
    $sticker.style.backgroundColor = this.#backgroundColor;
    $sticker.addEventListener('mousedown', this.#handleMouseDown.bind(this));

    const $stickerHeader = document.createElement('div');
    $stickerHeader.classList.add('sticker-header');

    const $stickerTitle = document.createElement('div');
    $stickerTitle.classList.add('sticker-title');
    $stickerTitle.textContent = this.#getTitle();
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
    $buttonRemoveSticker.addEventListener(
      'click',
      this.#handleRemoveSticker.bind(this)
    );
    $controlSticker.append($buttonRemoveSticker);

    const $stickerItems = document.createElement('ul');
    $stickerItems.classList.add('items-container');

    $sticker.append($stickerHeader, $stickerItems);

    $sticker.addEventListener(EVENT_NAME.deleteItem, (event) => {
      this.removeItem(event.detail);
    });

    $sticker.addEventListener(EVENT_NAME.moveItem, (event) => {
      this.#handleMoveItem(event.detail);
    });

    return $sticker;
  }

  #handleMoveItem(item) {
    // 새로운 항목 추가
    if (!this.#getItems().some((x) => x.getKey() === item.getKey())) {
      this.addItem(item);
    }

    const newItems = [];
    for (const itemEl of this.getElement().querySelectorAll(
      '.item:not(.item-place-holder)'
    )) {
      newItems.push(
        this.#getItems().find((x) => x.getKey() === itemEl.dataset.key)
      );
    }

    this.#setItems(newItems);

    this.getElement().dispatchEvent(createStickerChangeEvent(this));
  }

  /**
   * @description 스티커를 삭제하는 이벤트 핸들러
   * @param {event} event
   */
  #handleRemoveSticker(event) {
    if (!event.target.classList.contains('button-remove-sticker')) return;
    this.getElement().dispatchEvent(createDeleteStickerEvent(this));
    this.#removeElement();
  }

  /**
   * @description 항목을 생성하는 이벤트 핸들러
   * @param {event} event
   */
  #handleCreateItem(event) {
    if (!event.target.classList.contains('button-item-add')) return;
    const title = `item-${getPrimaryKey()}`;
    const item = new Item(`item-${getPrimaryKey()}`, title);
    this.addItem(item);
    this.getItemsElement().append(item.getElement());
  }

  /**
   * @description 스티커를 드래그하는 이벤트 핸들러
   * @param {event} event
   */
  #handleMouseDown(event) {
    if (event.target.classList.contains('button-remove-sticker')) return;
    if (event.target.classList.contains('button-item-add')) return;
    if (event.target.classList.contains('item-title')) return;
    if (event.target.classList.contains('item')) return;
    if (event.target.classList.contains('button-remove-item')) return;

    let isDragging = false;
    let startPosition = {};

    isDragging = true;

    startPosition = {
      x: event.clientX - this.getElement().offsetLeft,
      y: event.clientY - this.getElement().offsetTop,
    };

    // 마우스 이동 이벤트 핸들러
    const handleMouseMove = (event) => {
      if (!isDragging) return;

      const newPosition = {
        x: event.clientX - startPosition.x,
        y: event.clientY - startPosition.y,
      };

      this.#setPosition(newPosition);

      this.getElement().style.left = `${this.getPosition().x}px`;
      this.getElement().style.top = `${this.getPosition().y}px`;
    };

    // 마우스 업 이벤트 핸들러
    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
}
