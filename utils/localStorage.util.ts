function setLocalStorageContent(key: string, value: string): void {
  if (typeof window !== "undefined") window.localStorage.setItem(key, value);
}

function getItem(key: string): string | null | undefined {
  if (typeof window !== "undefined") return window.localStorage.getItem(key);
}

function removeItem(key: string): void {
  if (typeof window !== "undefined") return window.localStorage.removeItem(key);
}

function clearLocalStorageContent(): void {
  if (typeof window !== "undefined") window.localStorage.clear();
}

export {
  getItem,
  removeItem,
  setLocalStorageContent,
  clearLocalStorageContent,
};
