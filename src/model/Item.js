export class Item {
  #title;
  #key;
  #sticker;
  #$element;
  #$placeHolderItem;
  #$cloneItem;
  #position;

  constructor(sticker, key, title, findStickerByKey) {
    this.#sticker = sticker;
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

    // findStickerByKey은 테스트용으로 차후 종속성 없애는 로직으로 구현
    this.findStickerByKey = findStickerByKey;
    this.#init();
  }

  #init() {
    this.#$element = this.#createElement();
  }

  #createElement() {
    const $item = document.createElement('li');
    $item.classList.add('item');
    $item.dataset.key = this.getKey();
    $item.addEventListener('mousedown', this.handleMouseDown.bind(this));

    // 타이틀 영역
    const $itemTitle = document.createElement('div');
    $itemTitle.classList.add('item-title');
    $itemTitle.textContent = this.getTitle();
    $item.append($itemTitle);

    // 삭제 버튼
    const $buttonRemoveItem = document.createElement('button');
    $buttonRemoveItem.classList.add('button-remove-item');
    $buttonRemoveItem.textContent = '삭제';
    $item.append($buttonRemoveItem);

    return $item;
  }

  handleMouseDown(event) {
    event.stopPropagation();
    if (event.target.classList.contains('button-remove-item')) return;

    this.#createPlaceHolderItemElement();
    this.#createCloneItemElement();

    this.#renderPlaceHolderItemElement();

    const shiftX = event.pageX - this.#$element.offsetLeft;
    const shiftY = event.pageY - this.#$element.offsetTop;

    this.#position.shiftX = shiftX;
    this.#position.shiftY = shiftY;

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove = (event) => {
    this.#renderCloneItemElement();

    this.#$element.style.visibility = 'hidden';

    this.#position.x = event.pageX - this.#position.shiftX;
    this.#position.y = event.pageY - this.#position.shiftY;

    this.#switchPlaceHolderPosition(event.clientX, event.clientY);
    this.#switchPosition(this.#position.x, this.#position.y);
  };

  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);

    this.#$element.style.display = 'flex';

    let $originSticker = this.#getStickerElementByItemElement(this.#$cloneItem);
    let $targetSticker = this.#getStickerElementByItemElement(this.#$placeHolderItem);

    if ($originSticker.id != $targetSticker.id) {
      // 다른 스티커로 이동했을 때
      // $originSticker.updateSticker(this);
      // this.#setSticker($targetSticker.getSticker());
      // $targetSticker.updateSticker(this);
      let originSticker = this.findStickerByKey($originSticker.id);
      let targetSticker = this.findStickerByKey($targetSticker.id);
      this.#setSticker(targetSticker);
      originSticker.removeItem(this);
      targetSticker.addItem(this);
    }

    if (this.#$placeHolderItem != null) this.#removePlaceHolderItemElement();
    if (this.#$cloneItem != null) this.#removeCloneItemElement();
  };

  #getStickerElementByItemElement($item) {
    return $item.closest('.sticker');
  }

  #switchPosition(x, y) {
    this.#$cloneItem.style.left = `${x}px`;
    this.#$cloneItem.style.top = `${y}px`;
  }

  #switchPlaceHolderPosition(x, y) {
    let $item = null;
    let $itemsContainer = null;
    let elements = document.elementsFromPoint(x, y);

    elements.forEach((element) => {
      if (element.classList.contains('item')) {
        $item = element;
      } else if (element.classList.contains('items-container')) {
        $itemsContainer = element;
      }
    });

    if ($item != null) {
      let $sticker = this.#getStickerElementByItemElement($item);

      this.#$placeHolderItem.style.position = 'static';
      this.#$element.style.display = 'none';

      if (y - $item.offsetTop - $sticker.offsetTop < 45) {
        $item.before(this.#$placeHolderItem);
        $item.before(this.#$element);
      } else {
        $item.after(this.#$placeHolderItem);
        $item.after(this.#$element);
      }
    } else if ($itemsContainer != null) {
      $itemsContainer.appendChild(this.#$placeHolderItem);
      $itemsContainer.appendChild(this.#$element);
    } else {
      this.#$element.before(this.#$placeHolderItem);
    }
  }

  #createPlaceHolderItemElement() {
    this.#$placeHolderItem = this.#$element.cloneNode();
    this.#$placeHolderItem.classList.add('item-place-holder');
  }

  #createCloneItemElement() {
    this.#$cloneItem = this.#$element.cloneNode(true);
    this.#$cloneItem.classList.remove('item');
    this.#$cloneItem.classList.add('item-clone');
  }

  #renderPlaceHolderItemElement() {
    this.#$element.before(this.#$placeHolderItem);
  }

  #renderCloneItemElement() {
    if (this.#$cloneItem == null) return;
    const $items = this.getSticker().getItemsElement();
    $items.appendChild(this.#$cloneItem);
  }

  #removePlaceHolderItemElement() {
    this.#$placeHolderItem.remove();
    this.#$placeHolderItem = null;
  }

  #removeCloneItemElement() {
    this.#$cloneItem.remove();
    this.#$cloneItem = null;

    this.#$element.style.visibility = 'visible';
  }

  getSticker() {
    return this.#sticker;
  }

  #setSticker(sticker) {
    this.#sticker = sticker;
  }

  getElement() {
    return this.#$element;
  }

  getKey() {
    return this.#key;
  }

  getTitle() {
    return this.#title;
  }

  removeElement() {
    this.#$element.remove();
  }
}
