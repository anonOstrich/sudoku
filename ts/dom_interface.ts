export function createInfoUpdater(el: HTMLParagraphElement) {
  return function updateInfo(text: string) {
    el.innerText = text;
  };
}
