import {createElement} from '../render.js';

const createWrapperContentContainerTemplate = () => (
  `<li class="trip-events__item">

  </li>`
);


export default class WrapperContentContainerView {
  #element = null;

  get template() {
    return createWrapperContentContainerTemplate();
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
