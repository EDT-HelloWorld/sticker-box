export const EVENT_NAME = {
  stickerChange: 'stickerChange',
  deleteItem: 'deleteStickerItem',
  moveItem: 'moveStikerItem',
};

export function createStickerChangeEvent() {
  return new CustomEvent(EVENT_NAME.stickerChange, { bubbles: true });
}

export function createDeleteItemEvent(item) {
  return new CustomEvent(EVENT_NAME.deleteItem, {
    bubbles: true,
    detail: item,
  });
}

export function createMoveItemEvent(item) {
  return new CustomEvent(EVENT_NAME.moveItem, {
    bubbles: true,
    detail: item,
  });
}
