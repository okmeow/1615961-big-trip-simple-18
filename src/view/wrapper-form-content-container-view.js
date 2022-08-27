import AbstractView from '../framework/view/abstract-view.js';

const createWrapperFormContentContainerTemplate = () => (
  `<form class="event event--edit" action="#" method="post">
  </form>`
);

export default class WrapperFormContentContainerView extends AbstractView{
  get template() {
    return createWrapperFormContentContainerTemplate();
  }
}
