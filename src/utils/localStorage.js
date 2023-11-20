export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = (key) => {
  if (localStorage.getItem(key) === 'undefined') {
    return null;
  }
  return JSON.parse(localStorage.getItem(key)) || null;
};
