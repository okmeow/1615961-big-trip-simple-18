import {render} from '../framework/render.js';
import ContentContainerListView from '../view/content-container-view.js';
import ContentContainerItemView from '../view/wrapper-content-container-view.js';
import TripDestinationPointCreateView from '../view/destination-point-create-view.js';
import EmptyPointListMessageView from '../view/empty-point-list-message-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import {updateArrayElement, sortPointDateUp, sortPointPriceDown, getRandomInteger} from '../utils/utils.js';
import {SortType} from '../mock/const.js';

export default class AppPresenter {
  #tripContentContainerListComponent = new ContentContainerListView();
  #tripItemComponent = new ContentContainerItemView();
  #emptyPointListMessageComponent = new EmptyPointListMessageView();
  #sortComponent = new SortView();

  #fieldContainer = null;
  #destinationCitiesModel = null;
  #tripPointsModel = null;
  #tripNewPointCreateComponent = null;

  #tripCities = [];
  #tripPoints = [];
  #tripOffers = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedTripPoints = [];

  #point = null;
  #offers = [];
  #city = null;

  constructor (fieldContainer, destinationCitiesModel, tripPointsModel) {
    this.#fieldContainer = fieldContainer;
    this.#tripPointsModel = tripPointsModel;
    this.#destinationCitiesModel = destinationCitiesModel;
  }

  init = (point, offers, city) => {
    this.#point = point;
    this.#offers = offers;
    this.#city = city;

    this.#tripCities = [...this.#destinationCitiesModel.tripCities];
    this.#tripPoints = [...this.#tripPointsModel.tripPoints];
    this.#tripOffers = [...this.#tripPointsModel.tripOffers];

    this.#sourcedTripPoints = [...this.#tripPoints.sort(sortPointDateUp)];

    this.#tripNewPointCreateComponent = new TripDestinationPointCreateView(this.#tripCities[getRandomInteger(0, 2)], this.#tripOffers, this.#tripPoints[getRandomInteger(0, 4)]);

    this.#renderContent();
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
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #renderNewPointForm = () => {
    render(this.#tripNewPointCreateComponent, this.#tripItemComponent.element);
  };

  #renderPoint = (point, offer) => {
    const pointPresenter = new PointPresenter(this.#tripContentContainerListComponent.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point, offer);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPointList = () => {
    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderPoint(this.#tripPoints[i], this.#tripOffers);
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

    if(this.#tripCities.length === 0) {
      return this.#renderNoPointsMessage();
    }

    this.#renderSort();
    this.#renderTripItemWrapper();
    this.#renderNewPointForm();
    this.#renderPointList();
  };
}
