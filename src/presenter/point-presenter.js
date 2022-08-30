import {render, replace, remove} from '../framework/render.js';
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

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new TripDestinationPointView(point);
    this.#pointEditComponent = new TripDestinationPointEditView(point);

    this.#pointComponent.setShowEditFormButtonClickHandler(this.#handleOpenEditClick);
    this.#pointEditComponent.setCloseEditFormButtonClickHandler(this.#handleCloseEditClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      return render(this.#pointComponent, this.#pointListContainer);
    }

    if (this.#pointListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointListContainer.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
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
