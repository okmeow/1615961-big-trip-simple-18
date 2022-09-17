import {remove, render} from '../framework/render.js';
import ContentContainerListView from '../view/content-container-view.js';
import ContentContainerItemView from '../view/wrapper-content-container-view.js';
import TripDestinationPointCreateView from '../view/destination-point-create-view.js';
import EmptyPointListMessageView from '../view/empty-point-list-message-view.js';
import SortView from '../view/sort-view.js';
import ButtonNewEventView from '../view/button-new-event-view.js';
import PointPresenter from './point-presenter.js';
import {updateArrayElement, sortPointDateUp, sortPointPriceDown, isEscapeKey} from '../utils/utils.js';
import {SortType} from '../mock/const.js';

export default class AppPresenter {
  #tripContentContainerListComponent = new ContentContainerListView();
  #tripItemComponent = new ContentContainerItemView();
  #emptyPointListMessageComponent = new EmptyPointListMessageView();
  #sortComponent = new SortView();
  #newEventButtonComponent = new ButtonNewEventView();

  #fieldContainer = null;
  #destinationCitiesModel = null;
  #tripPointsModel = null;
  #tripOffersModel = null;
  #tripNewPointCreateComponent = null;

  #tripCities = [];
  #tripPoints = [];
  #tripOffers = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedTripPoints = [];

  #point = null;
  #offers = [];
  #cities = [];

  constructor (fieldContainer, destinationCitiesModel, tripPointsModel, tripOffersModel) {
    this.#fieldContainer = fieldContainer;
    this.#destinationCitiesModel = destinationCitiesModel;
    this.#tripPointsModel = tripPointsModel;
    this.#tripOffersModel = tripOffersModel;
  }

  get points() {
    return this.#tripPointsModel.tripPoints;
  }

  get offers() {
    return this.#tripOffersModel.tripOffers;
  }

  get cities() {
    return this.#destinationCitiesModel.tripCities;
  }

  init = () => {
    // this.#point = point;
    // this.#offers = offers;
    // this.#cities = cities;

    // this.#cities = [...this.#destinationCitiesModel.tripCities];
    // this.#tripPoints = [...this.#tripPointsModel.tripPoints];
    // this.#offers = [...this.#tripOffersModel.tripOffers];

    this.#sourcedTripPoints = [...this.#tripPoints.sort(sortPointDateUp)];

    this.#tripNewPointCreateComponent = new TripDestinationPointCreateView(this.points[0], this.cities[0], this.offers);

    this.#newEventButtonComponent.setNewEventButtonClickHandler(this.#handleNewEventClick);

    this.#renderContent();
  };

  #handleNewEventClick = () => {
    this.#renderNewPointForm();
    this.#tripNewPointCreateComponent.setCloseCreatePointClickHandler(this.#handleNewEventCloseClick);
    this.#tripNewPointCreateComponent.setCreateFormSubmitHandler(this.#handleSubmitPointClick);
    document.addEventListener('keydown', this.#escapeKeyDownHandler);
  };

  #handleNewEventCloseClick = () => {
    remove(this.#tripNewPointCreateComponent);
  };

  #escapeKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#tripNewPointCreateComponent.reset(this.#point);
      this.#deleteNewEventForm();
    }
  };

  #deleteNewEventForm = () => {
    remove(this.#tripNewPointCreateComponent);
    document.removeEventListener('keydown', this.#escapeKeyDownHandler);
  };

  #renderCommonWrapper = () => {
    render(this.#tripContentContainerListComponent, this.#fieldContainer);
  };

  #renderTripItemWrapper = () => {
    render(this.#tripItemComponent, this.#tripContentContainerListComponent.element);
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#tripPoints.sort(sortPointDateUp);
        break;
      case SortType.PRICE:
        this.#tripPoints.sort(sortPointPriceDown);
        break;
      default:
        this.#tripPoints = [...this.#sourcedTripPoints];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#tripContentContainerListComponent.element);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateArrayElement(this.#tripPoints, updatedPoint);
    this.#sourcedTripPoints = updateArrayElement(this.#sourcedTripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#offers, this.#cities);
  };

  #renderNewPointForm = () => {
    render(this.#tripNewPointCreateComponent, this.#tripItemComponent.element);
  };

  #renderPoint = (point, offers, cities) => {
    const pointPresenter = new PointPresenter(this.#tripContentContainerListComponent.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point, offers, cities);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPointList = () => {
    for (let i = 0; i < this.points.length; i++) {
      this.#renderPoint(this.points[i], this.offers, this.cities);
    }
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderNoPointsMessage = () => {
    render(this.#emptyPointListMessageComponent, this.#tripContentContainerListComponent.element);
  };

  #renderContent = () => {
    this.#renderCommonWrapper();

    if(this.cities.length === 0) {
      return this.#renderNoPointsMessage();
    }

    this.#renderSort();
    this.#renderTripItemWrapper();
    this.#renderPointList();
  };

  #handleSubmitPointClick = () => {
    // console.log('нужный колбэк');
    // this.#replaceEditPointToPoint();
  };
}
