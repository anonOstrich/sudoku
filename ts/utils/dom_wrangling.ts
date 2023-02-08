import { ElementsByTagNames, TagName, isElementWithTag } from './type_checkers';

export function getElementWithId<T extends TagName>(
  id: string,
  tagName: T
): ElementsByTagNames[T] {
  const el = document.getElementById(id);
  if (el !== null && isElementWithTag(el, tagName)) {
    return el;
  } else {
    console.error(`Element with id ${id} is not of type ${tagName}`);
  }

  console.error(
    `Was not able to find element with id ${id}. The type checks might be at fault.`
  );
  throw new Error('Cannot continue without the element.');
}

export function isHTMLElement(el: Element): el is HTMLElement {
  return 'style' in el;
}

export function getElementsWithClassName<T extends TagName>(
  className: string,
  tag: T
): Array<ElementsByTagNames[T]> {
  const els = [...document.getElementsByClassName(className)];

  if (!els.every(isHTMLElement)) throw new Error('Voi itku');

  const res: Array<ElementsByTagNames[T]> = [];

  for (const el of els) {
    if (isElementWithTag(el, tag)) res.push(el);
  }

  return res;
}
