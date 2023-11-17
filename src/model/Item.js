export class Item {
  #title;
  #key;
  #element;

  constructor(title, key) {
    this.#title = title;
    this.#key = key;
    this.#element = this.#createElement();
  }

  #createElement() {
    const $item = document.createElement('li');
    $item.classList.add('item');
    $item.dataset.key = this.getKey();

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

  getElement() {
    return this.#element;
  }

  getKey() {
    return this.#key;
  }

  getTitle() {
    return this.#title;
  }

  remove() {
    this.#element.remove();
  }
}
