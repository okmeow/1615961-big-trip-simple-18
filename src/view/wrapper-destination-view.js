import {createElement} from '../render.js';

const createDestinationWrapperTemplate = () => (
  `<section class="event__details">
  </section>`
);

export default class TripDestinationWrapperView {
  #element = null;

  get template() {
    return createDestinationWrapperTemplate();
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
