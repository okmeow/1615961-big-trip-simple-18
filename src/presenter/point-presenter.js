import {render, replace} from '../framework/render.js';
import TripDestinationPointView from '../view/destination-point-view.js';
import TripDestinationPointEditView from '../view/destination-point-edit-view.js';

export default class PointPresenter {

  #pointListContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;

  constructor(pointListContainer) {
    this.#pointListContainer = pointListContainer;
  }

  init = (point) => {
    this.#point = point;

    this.#pointComponent = new TripDestinationPointView(point);
    this.#pointEditComponent = new TripDestinationPointEditView(point);

    this.#pointComponent.setShowEditFormButtonClickHandler(this.#handleOpenEditClick);
    this.#pointEditComponent.setCloseEditFormButtonClickHandler(this.#handleCloseEditClick);

    render(this.#pointComponent, this.#pointListContainer);
  };

  #replacePointToEditPoint = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escapeKeyDownHandler);
  };

  #replaceEditPointToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escapeKeyDownHandler);
  };

  #escapeKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditPointToPoint();
    }
  };

  #handleOpenEditClick = () => {
    this.#replacePointToEditPoint();
  };

  #handleCloseEditClick = () => {
    this.#replaceEditPointToPoint();
  };
}
