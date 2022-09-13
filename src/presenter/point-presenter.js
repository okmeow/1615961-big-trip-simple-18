import {render, replace, remove} from '../framework/render.js';
import {isEscapeKey} from '../utils/utils.js';
import TripDestinationPointView from '../view/destination-point-view.js';
import TripDestinationPointEditView from '../view/destination-point-edit-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {

  #pointListContainer = null;
  #changeData = null;
  #changeMode = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #offers = [];
  #mode = Mode.DEFAULT;

  constructor(pointListContainer, changeData, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, offers) => {
    this.#point = point;
    this.#offers = offers;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new TripDestinationPointView(point, offers);
    this.#pointEditComponent = new TripDestinationPointEditView(point, offers);

    this.#pointComponent.setShowEditFormButtonClickHandler(this.#handleOpenEditClick);
    this.#pointEditComponent.setCloseEditFormButtonClickHandler(this.#handleCloseEditClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      return render(this.#pointComponent, this.#pointListContainer);
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditPointToPoint();
    }
  };

  #replacePointToEditPoint = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escapeKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceEditPointToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escapeKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escapeKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditPointToPoint();
    }
  };

  #handleOpenEditClick = () => {
    this.#replacePointToEditPoint();
  };

  #handleCloseEditClick = () => {
    document.removeEventListener('keydown', this.#escapeKeyDownHandler);
    this.#pointEditComponent.reset(this.#point);
    this.#replaceEditPointToPoint();
  };
}
