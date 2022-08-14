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
  getTemplate() {
    return createContentContainerTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
