import { BoardArray, CellValue } from '../logic/logic';

export type ElementsByTagNames = {
  BUTTON: HTMLButtonElement;
  DIV: HTMLDivElement;
  P: HTMLParagraphElement;
  LI: HTMLLIElement;
  INPUT: HTMLInputElement;
  IMG: HTMLImageElement;
};

export type TagName = keyof ElementsByTagNames;

export function isElementWithTag<T extends TagName>(
  el: Element | null,
  name: T
): el is ElementsByTagNames[T] {
  if (el === null) {
    return false;
  }

  // This should work, as long as the tag names are not changed (and I copy them correctly)... But I doubt that will happen
  return el.tagName === name;
}

export function isCellValue(value: number | null): value is CellValue {
  return value === null || [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(value);
}

export function isBoardArray(
  dataArray: Array<number | null>
): dataArray is BoardArray {
  return (
    dataArray.length === 81 && dataArray.every((datum) => isCellValue(datum))
  );
}
