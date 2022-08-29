import AbstractView from '../framework/view/abstract-view.js';

const createEmptyPointListMessageTemplate = () => (
  `
  <p class="trip-events__msg">Click New Event to create your first point</p>`
);

export default class EmptyPointListMessageView extends AbstractView {
  get template() {
    return createEmptyPointListMessageTemplate();
  }
}
