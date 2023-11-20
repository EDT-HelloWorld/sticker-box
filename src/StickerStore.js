import { getPrimaryKey } from './utils/getPrimaryKey.js';
import { getLocalStorage, setLocalStorage } from './utils/localStorage.js';
import { Sticker } from './model/Sticker.js';
import { $canvasSticker } from '../index.js';
import { EVENT_NAME } from './CustomEvent.js';

export class StickerStore {
  #stickers;
  #totalCount;
  #$buttonCreateSticker;
  #saveStickers;

  /**
   * @description 스티커 스토어 초기화
   */
  init() {
    this.#stickers = new Object();
    this.#totalCount = 1;

    this.#saveStickers = _.debounce(() => {
      const stickers = [];
      Object.values(this.#stickers).forEach((sticker) => {
        stickers.push(sticker.serialize());
      });
      this.savePrimerity();
      this.saveTotalCount();
      setLocalStorage('stickers', stickers);
    }, 200);

    this.#$buttonCreateSticker = document.querySelector(
      '#button-create-sticker'
    );
    this.#$buttonCreateSticker.addEventListener(
      'click',
      this.#handleCreateSticker.bind(this)
    );

    $canvasSticker.addEventListener(EVENT_NAME.stickerChange, (event) => {
      this.handleStickerChange(event.detail);
    });

    $canvasSticker.addEventListener(EVENT_NAME.deleteSticker, (event) => {
      this.removeSticker(event.detail);
    });

    this.loadStickers();
    this.#renderStickers();
  }

  handleStickerChange(sticker) {
    $canvasSticker.append(sticker.getElement());
    this.#saveStickers();
  }

  /**
   * @description key로 스티커를 찾아 반환
   * @param {string} key
   */
  findStickerByKey(key) {
    return this.#stickers[key];
  }

  /**
   * @description 스티커를 stickers에서 삭제
   * @param {Sticker} sticker
   */
  removeSticker(sticker) {
    delete this.#stickers[sticker.getKey()];
    this.#saveStickers();
  }

  /**
   * @description stickers에 있는 스티커를 전체 렌더링해주는 메서드
   */
  #renderStickers() {
    Object.values(this.#getStickers()).forEach((sticker) => {
      this.#renderStickerPosition(sticker);
    });
  }

  /**
   * @description 스티커가 없으면 추가하고 있으면 위치를 렌더링해주는 메서드
   * @param {Sticker} sticker
   */
  #renderStickerPosition(sticker) {
    const $sticker = document.querySelector(`#${sticker.getKey()}`);

    if ($sticker) {
      $sticker.style.left = `${sticker.getPosition().x}px`;
      $sticker.style.top = `${sticker.getPosition().y}px`;
    } else {
      this.#renderCreateSticker(sticker, sticker.getPosition());
    }
  }

  /**
   * @description 스티커 엘리먼트를 가져와서 렌더링해주는 메서드
   * @param {Sticker} sticker
   */
  #renderCreateSticker(sticker) {
    const $sticker = sticker.getElement();
    $canvasSticker.append($sticker);
  }

  /**
   * @description 스티커 생성 버튼 클릭 이벤트 핸들러
   */
  #handleCreateSticker() {
    const key = `sticker-${getPrimaryKey()}`;
    const title = `Sticker ${this.#getNextCount()}`;
    const position = this.#getPositionForCreateSticker();
    const sticker = new Sticker(title, key, position);

    this.#addSticker(sticker);

    this.#renderStickers();
  }

  /**
   * @description 스티커를 렌더링할 위치를 반환해주는 메서드
   */
  #getPositionForCreateSticker() {
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

  /**
   * @description 전체 스티커를 반환해주는 메서드
   */
  #getStickers() {
    return this.#stickers;
  }

  /**
   * @description 다음 스티커 카운트를 반환해주는 메서드
   */
  #getNextCount() {
    return this.#totalCount++;
  }

  #setTotalCount(count) {
    this.#totalCount = count;
  }

  /**
   * @description 스티커를 데이터에 추가해주는 메서드
   * @param {Sticker} sticker
   */
  #addSticker(sticker) {
    this.#stickers[sticker.getKey()] = sticker;
    this.#saveStickers();
  }

  saveTotalCount() {
    setLocalStorage('totalCount', this.#totalCount);
  }

  savePrimerity() {
    const children = $canvasSticker.querySelectorAll('.sticker');
    const priorityElement = [];

    for (let i = 0; i < children.length; i++) {
      priorityElement.push(children[i].id);
    }

    setLocalStorage('priorityElement', priorityElement);
  }

  loadStickers() {
    const priorityElement = getLocalStorage('priorityElement');
    const datas = getLocalStorage('stickers');
    if (datas === null) {
      return null;
    }

    this.#setTotalCount(getLocalStorage('totalCount'));

    datas.forEach((data) => {
      const sticker = Sticker.deserialize(data);
      this.#addSticker(sticker);
    });

    priorityElement.forEach((id) => {
      $canvasSticker.appendChild(this.#stickers[id].getElement());
    });
  }
}
