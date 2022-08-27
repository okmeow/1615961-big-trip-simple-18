import AbstractView from '../framework/view/abstract-view.js';

const createDestinationWrapperTemplate = () => (
  `<section class="event__details">
  </section>`
);

export default class TripDestinationWrapperView extends AbstractView{
  get template() {
    return createDestinationWrapperTemplate();
  }
}
