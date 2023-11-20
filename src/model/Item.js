import { createDeleteItemEvent } from '../CustomEvent.js';

export class Item {
  #title;
  #key;
  #$element;
  #$placeHolderItem;
  #$cloneItem;
  #position;

  constructor(key, title) {
    this.#title = title;
    this.#key = key;
    this.#$element = null;
    this.#$cloneItem = null;
    this.#$placeHolderItem = null;
    this.#position = {
      x: null,
      y: null,
      shiftX: null,
      shiftY: null,
    };

    this.#init();
  }

  serialize() {
    return { key: this.key, title: this.#title };
  }

  /**
   * @description 항목의 엘리먼트를 반환해주는 메서드
   */
  getElement() {
    return this.#$element;
  }

  /**
   * @description 항목 초기화
   */
  #init() {
    this.#$element = this.#createElement();
  }

  /**
   * @description 항목의 key를 반환해주는 메서드
   */
  #getKey() {
    return this.#key;
  }

  /**
   * @description 항목의 타이틀을 반환해주는 메서드
   */
  #getTitle() {
    return this.#title;
  }

  /**
   * @description 항목의 위치를 반환해주는 메서드
   */
  #getPosition() {
    return this.#position;
  }

  /**
   * @description 항목의 위치를 설정해주는 메서드
   * @param {position} position
   */
  #setPosition(position) {
    this.#position = position;
  }

  /**
   * @description 항목의 cloneItem 엘리먼트를 반환해주는 메서드
   * @returns cloneItem
   */
  #getCloneElement() {
    return this.#$cloneItem;
  }

  /**
   * @description 항목의 cloneItem 엘리먼트를 설정해주는 메서드
   * @param {element} $cloneItem
   */
  #setCloneElement($cloneItem) {
    this.#$cloneItem = $cloneItem;
  }

  /**
   * @description 항목의 placeHolderItem 엘리먼트를 반환해주는 메서드
   * @returns $placeHolderItem
   */
  #getPlaceHolderElement() {
    return this.#$placeHolderItem;
  }

  /**
   * @description 항목의 placeHolderItem 엘리먼트를 설정해주는 메서드
   * @param {element} $placeHolderItem
   */
  #setPlaceHolderElement($placeHolderItem) {
    this.#$placeHolderItem = $placeHolderItem;
  }

  /**
   * @description 항목의 엘리먼트를 삭제해주는 메서드
   */
  #removeElement() {
    this.getElement().dispatchEvent(createDeleteItemEvent(this));
    this.getElement().remove();
  }

  /**
   * @description 항목의 엘리먼트를 생성해주는 메서드
   */
  #createElement() {
    const $item = document.createElement('li');
    $item.classList.add('item');
    $item.dataset.key = this.#getKey();
    $item.addEventListener('mousedown', this.#handleMouseDown.bind(this));

    // 타이틀 영역
    const $itemTitle = document.createElement('div');
    $itemTitle.classList.add('item-title');
    $itemTitle.textContent = this.#getTitle();
    $item.append($itemTitle);

    // 삭제 버튼
    const $buttonRemoveItem = document.createElement('button');
    $buttonRemoveItem.classList.add('button-remove-item');
    $buttonRemoveItem.textContent = '삭제';
    $buttonRemoveItem.addEventListener('mouseup', () => {
      this.#removeElement();
    });
    $item.append($buttonRemoveItem);

    return $item;
  }

  /**
   * @description 항목 생성 버튼 이벤트 핸들러
   * placeHolderItem : 항목 드래그시 나타나는 그림자 표현을 위한 아이템 (드래그 앤 드랍을 위한 임시 아이템)
   * cloneItem : 항목 드래그시 나타나는 회전된 항목 (드래그 앤 드랍을 위한 임시 아이템)
   * @param {event} event
   */
  #handleMouseDown(event) {
    event.target.closest('.stickers').append(event.target.closest('.sticker'));
    if (event.target.classList.contains('button-remove-item')) return;

    this.#createPlaceHolderItemElement();
    this.#createCloneItemElement();

    this.getElement().style.visibility = 'hidden';

    const shiftX = event.pageX - this.getElement().offsetLeft;
    const shiftY = event.pageY - this.getElement().offsetTop;

    this.#setPosition({
      ...this.#getPosition(),
      shiftX,
      shiftY,
    });

    this.#switchPosition(
      this.getElement().offsetLeft,
      this.getElement().offsetTop
    );

    this.#renderPlaceHolderItemElement();
    this.#renderCloneItemElement();

    // 마우스 이동 이벤트 핸들러
    const handleMouseMove = (event) => {
      this.#setPosition({
        ...this.#getPosition(),
        x: event.pageX - this.#getPosition().shiftX,
        y: event.pageY - this.#getPosition().shiftY,
      });

      this.#switchPlaceHolderPosition(event.clientX, event.clientY);
      this.#switchPosition(this.#getPosition().x, this.#getPosition().y);
    };

    // 마우스 업 이벤트 핸들러
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      this.getElement().style.display = 'flex';

      if (
        this.#$element.parentElement !==
        this.#getPlaceHolderElement.parentElement
      ) {
        this.#$element.dispatchEvent(createDeleteItemEvent(this));
      }

      if (this.#getPlaceHolderElement() != null)
        this.#removePlaceHolderItemElement();
      if (this.#getCloneElement() != null) this.#removeCloneItemElement();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  /**
   * @description 항목이 속한 스티커의 엘리먼트를 반환해주는 메서드
   * @param {element} $item
   */
  #getStickerElementByItemElement($item) {
    return $item.closest('.sticker');
  }

  /**
   * @description CloneItem의 위치를 변경해주는 메서드
   * @param {number} x
   * @param {number} y
   */
  #switchPosition(x, y) {
    this.#getCloneElement().style.left = `${x}px`;
    this.#getCloneElement().style.top = `${y}px`;
  }

  /**
   * @description PlaceHolderItem의 위치를 변경해주는 메서드
   * 전체 엘리먼트를 가져와서 x, y 좌표에 해당하는 엘리먼트를 찾아서 그 엘리먼트를 기준으로 위치를 변경해준다.
   *
   * @param {number} x
   * @param {number} y
   */
  #switchPlaceHolderPosition(x, y) {
    let $item = null;
    let $itemsContainer = null;
    let elements = document.elementsFromPoint(x, y);

    const isSwitchPlaceHolder = elements.some((element) => {
      if (element.classList.contains('item')) {
        // 아이템에 위치하는 경우
        $item = element;
        let $sticker = this.#getStickerElementByItemElement($item);

        this.#$placeHolderItem.style.position = 'static';
        this.getElement().style.display = 'none';

        if (y - $item.offsetTop - $sticker.offsetTop < 50) {
          $item.before(this.#$placeHolderItem);
          $item.before(this.getElement());
        } else {
          $item.after(this.#$placeHolderItem);
          $item.after(this.getElement());
        }
        return true;
      } else if (element.classList.contains('items-container')) {
        // 아이템 컨테이너에 위치하는 경우
        $itemsContainer = element;
        if (!this.#hasClassInChildren($itemsContainer, 'item')) {
          $itemsContainer.appendChild(this.#$placeHolderItem);
          $itemsContainer.appendChild(this.getElement());
        }
        return true;
      }
    });

    if (!isSwitchPlaceHolder) {
      // 옮길 수 없는 위치에 있을 경우
      this.getElement().before(this.#$placeHolderItem);
    }
  }

  /**
   * @description 해당 엘리먼트의 자식 엘리먼트에 className이 있는지 확인하는 메서드
   * @param {element} parentElement
   * @param {string} className
   */
  #hasClassInChildren(parentElement, className) {
    const matchingElement = parentElement.querySelector(`.${className}`);

    return !!matchingElement;
  }

  /**
   * @description placeHolderItem 엘리먼트를 생성해주는 메서드
   */
  #createPlaceHolderItemElement() {
    const $placeHolderItem = this.getElement().cloneNode();
    $placeHolderItem.classList.add('item-place-holder');
    this.#setPlaceHolderElement($placeHolderItem);
  }

  /**
   * @description cloneItem 엘리먼트를 생성해주는 메서드
   */
  #createCloneItemElement() {
    const $cloneItem = this.getElement().cloneNode(true);
    $cloneItem.classList.remove('item');
    $cloneItem.classList.add('item-clone');
    this.#setCloneElement($cloneItem);
  }

  /**
   * @description placeHolderItem 엘리먼트를 렌더링해주는 메서드
   */
  #renderPlaceHolderItemElement() {
    this.getElement().before(this.#$placeHolderItem);
  }

  /**
   * @description cloneItem 엘리먼트를 렌더링해주는 메서드
   */
  #renderCloneItemElement() {
    if (this.#$cloneItem == null) return;
    const $items = this.getElement().parentElement.closest('.items-container');
    $items.appendChild(this.#$cloneItem);
  }

  /**
   * @description placeHolderItem 엘리먼트를 삭제해주는 메서드
   */
  #removePlaceHolderItemElement() {
    this.#getPlaceHolderElement().remove();
    this.#setPlaceHolderElement(null);
  }

  /**
   * @description cloneItem 엘리먼트를 삭제해주는 메서드
   */
  #removeCloneItemElement() {
    this.#getCloneElement().remove();
    this.#setCloneElement(null);

    this.getElement().style.visibility = 'visible';
  }
}
