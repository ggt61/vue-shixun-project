class Stroage {
  set(name: string, item: any) {
    return localStorage.setItem(name, JSON.stringify(item));
  }
  get(name: string) {
    const item = localStorage.getItem(name);
    return item && item !== "undefined" ? JSON.parse(item) : null;
  }
  remove(name: string) {
    return localStorage.removeItem(name);
  }
  clear() {
    return localStorage.clear();
  }
}

export default new Stroage();
