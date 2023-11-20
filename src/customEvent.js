export const EVENT_NAME = {
  stickerChange: 'stickerChange',
  deleteSticker: 'deleteSticker',
  deleteItem: 'deleteStickerItem',
  moveItem: 'moveStikerItem',
};

export function createStickerChangeEvent(sticker) {
  return new CustomEvent(EVENT_NAME.stickerChange, {
    bubbles: true,
    detail: sticker,
  });
}

export function createDeleteStickerEvent(sticker) {
  return new CustomEvent(EVENT_NAME.deleteSticker, {
    bubbles: true,
    detail: sticker,
  });
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
