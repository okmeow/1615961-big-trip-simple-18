import AbstractView from '../framework/view/abstract-view.js';

const createContentContainerTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);


export default class ContentContainerView extends AbstractView{
  get template() {
    return createContentContainerTemplate();
  }
}
