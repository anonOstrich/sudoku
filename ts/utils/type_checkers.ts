export type ElementsByTagNames = {
  BUTTON: HTMLButtonElement
  DIV: HTMLDivElement
  P: HTMLParagraphElement
}

export type TagName = keyof ElementsByTagNames

export function isElementWithTag<T extends TagName>(
  el: HTMLElement | null,
  name: T
): el is ElementsByTagNames[T] {
  if (el === null) {
    return false
  }

  // This should work, as long as the tag names are not changed (and I copy them correctly)... But I doubt that will happen
  return el.tagName === name
}
