import AbstractView from '../framework/view/abstract-view.js';

const createContentContainerTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class ContentContainerListView extends AbstractView{
  get template() {
    return createContentContainerTemplate();
  }
}
