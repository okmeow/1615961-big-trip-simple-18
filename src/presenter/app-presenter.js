import {render} from '../framework/render.js';
import ContentContainerView from '../view/content-container-view.js';
import WrapperContentContainerView from '../view/wrapper-content-container-view.js';
import WrapperFormContentContainerView from '../view/wrapper-form-content-container-view.js';
import TripDestinationView from '../view/destination-view.js';
import TripDestinationWrapperView from '../view/wrapper-destination-view.js';
import TripOffersView from '../view/trip-offers-view.js';
import newTripFormView from '../view/new-trip-parameters-view.js';
import EmptyPointListMessageView from '../view/empty-point-list-message-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import {updateArrayElement, sortPointDateUp, sortPointPriceDown} from '../utils/utils.js';
import {SortType} from '../mock/const.js';

export default class AppPresenter {
  #tripContentContainerComponent = new ContentContainerView();
  #tripItemComponent = new WrapperContentContainerView();
  #tripItemFormComponent = new WrapperFormContentContainerView();
  #tripDestinationWrapperComponent = new TripDestinationWrapperView();
  #emptyPointListMessageComponent = new EmptyPointListMessageView();
  #sortComponent = new SortView();

  #fieldContainer = null;
  #destinationCitiesModel = null;
  #tripPointsModel = null;

  #destinationCities = [];
  #tripPoints = [];
  #tripOffers = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedTripPoints = [];

  constructor (fieldContainer, destinationCitiesModel, tripPointsModel) {
    this.#fieldContainer = fieldContainer;
    this.#tripPointsModel = tripPointsModel;
    this.#destinationCitiesModel = destinationCitiesModel;
  }

  init = () => {
    this.#destinationCities = [...this.#destinationCitiesModel.cities];
    this.#tripPoints = [...this.#tripPointsModel.tripPoints];
    this.#tripOffers = [...this.#tripPointsModel.tripOffers];

    this.#sourcedTripPoints = [...this.#tripPoints.sort(sortPointDateUp)];

    this.#renderContent();
  };

  #renderAboutDestination = () => {
    render(this.#tripDestinationWrapperComponent, this.#tripItemFormComponent.element);
    this.#renderOffers();
    this.#renderDestinationDescription();
  };

  #renderOffers = () => {
    render(new TripOffersView(), this.#tripDestinationWrapperComponent.element);
  };

  #renderDestinationDescription = () => {
    render(new TripDestinationView(this.#destinationCities[0]), this.#tripDestinationWrapperComponent.element);
  };

  #renderNewTripForm = () => {
    render(new newTripFormView(), this.#tripItemFormComponent.element);
  };

  #renderAboutDestinationWrapper = () => {
    render(this.#tripDestinationWrapperComponent, this.#tripItemFormComponent.element);
  };

  #renderTripParametersWrapper = () => {
    render(this.#tripItemComponent, this.#tripContentContainerComponent.element);
    render(this.#tripItemFormComponent, this.#tripItemComponent.element);
  };

  #renderCommonWrapper = () => {
    render(this.#tripContentContainerComponent, this.#fieldContainer);
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
    render(this.#sortComponent, this.#tripContentContainerComponent.element);
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

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripContentContainerComponent.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderPointList = () => {
    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderPoint(this.#tripPoints[i]);
    }
  };

  #renderNoPointsMessage = () => {
    render(this.#emptyPointListMessageComponent, this.#tripContentContainerComponent.element);
  };

  #renderContent = () => {
    this.#renderCommonWrapper();

    if(this.#destinationCities.length === 0) {
      return this.#renderNoPointsMessage();
    }
    this.#renderSort();
    this.#renderAboutDestinationWrapper();
    this.#renderTripParametersWrapper();
    this.#renderNewTripForm();
    this.#renderAboutDestination();
    this.#renderPointList();
  };
}
