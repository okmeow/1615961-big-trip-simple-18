import {createElement} from '../render.js';

const createWrapperFormContentContainerTemplate = () => (
  `<form class="event event--edit" action="#" method="post">
  </form>`
);

export default class WrapperFormContentContainerView {
  #element = null;

  get template() {
    return createWrapperFormContentContainerTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
