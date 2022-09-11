import AbstractView from '../framework/view/abstract-view.js';

const createWrapperContentContainerTemplate = () => (
  `<li class="trip-events__item">
  </li>`
);


export default class ContentContainerItemView extends AbstractView{
  get template() {
    return createWrapperContentContainerTemplate();
  }
}
