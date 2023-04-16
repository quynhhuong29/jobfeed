function setLocalStorageContent(key: string, value: string): void {
  window.localStorage.setItem(key, value);
}

function getItem(key: string): string | null {
  return window.localStorage.getItem(key);
}

function removeItem(key: string): void {
  return window.localStorage.removeItem(key);
}

function clearLocalStorageContent(): void {
  window.localStorage.clear();
}

export {
  getItem,
  removeItem,
  setLocalStorageContent,
  clearLocalStorageContent,
};
