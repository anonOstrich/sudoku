import { getElementWithId } from './utils/dom_wrangling';

const loaderEl = getElementWithId('loader-screen', 'DIV');

function startLoader(el: HTMLDivElement) {
  el.className = el.className.replace('invisible', 'visible');
}

function endLoader(el: HTMLDivElement) {
  el.className = el.className.replace('visible', 'invisible');
}

export default async function loadWithAnimation<T>(task: () => Promise<T>) {
  startLoader(loaderEl);
  const result = await task();
  endLoader(loaderEl);
  return result;
}
