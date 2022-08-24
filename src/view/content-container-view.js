import {createElement} from '../render.js';

const createContentContainerTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);


export default class ContentContainerView {
  #element = null;

  get template() {
    return createContentContainerTemplate();
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
