import {createElement} from '../render.js';

const createContentContainerTemplate = () => (
  `<ul class="trip-events__list">
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
      </form>
    </li>
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
