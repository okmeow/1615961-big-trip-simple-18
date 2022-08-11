import {render} from '../render.js';
import tripDestinationPointView from './../view/destination-point.js';
import ContentContainerView from './../view/content-container-view.js';

export default class BoardPresenter {
  boardComponent = new ContentContainerView();

  init = (boardContainer) => {
    this.boardContainer = boardContainer;

    for (let i = 0; i < 3; i++) {
      render(this.boardComponent, this.boardContainer);
      render(new tripDestinationPointView(), this.boardComponent.getElement());
    }
  };
}
