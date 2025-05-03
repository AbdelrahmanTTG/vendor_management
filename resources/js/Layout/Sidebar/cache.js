
let menuCache = null;

export const getMenuCache = () => {
  return menuCache;
};

export const setMenuCache = (items) => {
  menuCache = items;
};

export const clearMenuCache = () => {
  menuCache = null;
};
