import {createElement} from '../render.js';

const createEmptyPointListMessageTemplate = () => (
  `
  <p class="trip-events__msg">Click New Event to create your first point</p>`
);

export default class EmptyPointListMessageView {
  #element = null;

  get template() {
    return createEmptyPointListMessageTemplate();
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
