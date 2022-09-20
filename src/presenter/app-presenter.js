import {remove, render, replace} from '../framework/render.js';
import ContentContainerListView from '../view/content-container-view.js';
import ContentContainerItemView from '../view/wrapper-content-container-view.js';
import TripDestinationPointCreateView from '../view/destination-point-create-view.js';
import TripDestinationPointView from '../view/destination-point-view.js';
import EmptyPointListMessageView from '../view/empty-point-list-message-view.js';
import SortView from '../view/sort-view.js';
import ButtonNewEventView from '../view/button-new-event-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import {sortPointDateUp, sortPointPriceDown, isEscapeKey} from '../utils/utils.js';
import {filter} from '../utils/filter.js';
import {nanoid} from 'nanoid';
import {SortType, UpdateType, UserAction, FilterType} from '../mock/const.js';

export default class AppPresenter {
  #tripContentContainerListComponent = new ContentContainerListView();
  #tripItemComponent = new ContentContainerItemView();
  #emptyPointListMessageComponent = null;
  #sortComponent = null;
  #newEventButtonComponent = new ButtonNewEventView();
  #loadingComponent = new LoadingView();

  #fieldContainer = null;
  #destinationCitiesModel = null;
  #tripPointsModel = null;
  #tripOffersModel = null;
  #filterModel = null;
  #tripNewPointCreateComponent = null;
  #changeData = null;
  #pointComponent = null;

  #pointPresenter = new Map();
  #currentSortType = SortType.DATE;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor (fieldContainer, destinationCitiesModel, tripPointsModel, tripOffersModel, filterModel, changeData) {
    this.#fieldContainer = fieldContainer;
    this.#changeData = changeData;
    this.#destinationCitiesModel = destinationCitiesModel;
    this.#tripPointsModel = tripPointsModel;
    this.#tripOffersModel = tripOffersModel;
    this.#filterModel = filterModel;

    this.#tripPointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#tripPointsModel.tripPoints;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredPoints.sort(sortPointDateUp);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointPriceDown);
    }

    return filteredPoints;
  }

  get offers() {
    return this.#tripOffersModel.tripOffers;
  }

  get cities() {
    return this.#destinationCitiesModel.tripCities;
  }

  init = () => {
    this.#pointComponent = new TripDestinationPointView(this.points, this.offers);
    this.#tripNewPointCreateComponent = new TripDestinationPointCreateView(this.points[0], this.cities[0], this.offers);
    this.#newEventButtonComponent.setNewEventButtonClickHandler(this.#handleNewEventClick);

    this.#renderApp();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#tripPointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#tripPointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#tripPointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {

    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearApp();
        this.#renderApp();
        break;
      case UpdateType.MAJOR:
        this.#clearApp({resetSortType: true});
        this.#renderApp();
        break;
      case UpdateType.INIT_POINTS:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        // this.#clearApp();
        this.#renderApp();
        break;
      case UpdateType.INIT_OFFERS:
        this.#renderApp();
        break;
    }
  };

  #clearApp = ({resetSortType = false} = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);

    if (this.#emptyPointListMessageComponent) {
      remove(this.#emptyPointListMessageComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DATE;
    }
  };

  #renderApp = () => {
    this.#renderCommonWrapper();
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const pointsCount = points.length;

    if(pointsCount === 0) {
      return this.#renderNoPointsMessage();
    }

    this.#renderSort();
    this.#renderTripItemWrapper();
    this.#renderPointList();
  };

  #handleNewEventClick = () => {
    this.#renderNewPointForm();
    this.#tripNewPointCreateComponent.setCloseCreatePointClickHandler(this.#handleNewEventCloseClick);
    this.#tripNewPointCreateComponent.setCreateFormSubmitHandler(this.#handleSubmitPointClick);
    document.addEventListener('keydown', this.#escapeKeyDownHandler);
    document.querySelector('.trip-main__event-add-btn').disabled = true;
  };

  #handleNewEventCloseClick = () => {
    remove(this.#tripNewPointCreateComponent);
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  };

  #escapeKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#tripNewPointCreateComponent.reset(this.points);
      this.#deleteNewEventForm();
      document.querySelector('.trip-main__event-add-btn').disabled = false;
    }
  };

  #deleteNewEventForm = () => {
    remove(this.#tripNewPointCreateComponent);
    document.removeEventListener('keydown', this.#escapeKeyDownHandler);
  };

  #renderCommonWrapper = () => {
    render(this.#tripContentContainerListComponent, this.#fieldContainer);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripItemComponent.element);
  };

  #renderTripItemWrapper = () => {
    render(this.#tripItemComponent, this.#tripContentContainerListComponent.element);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearApp();
    this.#renderApp();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#tripContentContainerListComponent.element);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderNewPointForm = () => {
    render(this.#tripNewPointCreateComponent, this.#tripItemComponent.element);
  };

  #renderPoint = (point, offers, cities) => {
    const pointPresenter = new PointPresenter(this.#tripContentContainerListComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, offers, cities);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPointList = () => {
    for (let i = 0; i < this.points.length; i++) {
      this.#renderPoint(this.points[i], this.offers, this.cities);
    }
  };

  #renderNoPointsMessage = () => {
    this.#emptyPointListMessageComponent = new EmptyPointListMessageView(this.#filterType);
    render(this.#emptyPointListMessageComponent, this.#tripContentContainerListComponent.element);
    remove(this.#loadingComponent);
  };

  #replaceCreatePointToPoint = () => {
    replace(this.#pointComponent, this.#tripNewPointCreateComponent);
    document.removeEventListener('keydown', this.#escapeKeyDownHandler);
  };

  #handleSubmitPointClick = (point) => {

    this.#handleViewAction(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    remove(this.#tripNewPointCreateComponent);
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  };
}
