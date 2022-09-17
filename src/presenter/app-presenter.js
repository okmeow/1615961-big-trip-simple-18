import {remove, render} from '../framework/render.js';
import ContentContainerListView from '../view/content-container-view.js';
import ContentContainerItemView from '../view/wrapper-content-container-view.js';
import TripDestinationPointCreateView from '../view/destination-point-create-view.js';
import EmptyPointListMessageView from '../view/empty-point-list-message-view.js';
import SortView from '../view/sort-view.js';
import ButtonNewEventView from '../view/button-new-event-view.js';
import PointPresenter from './point-presenter.js';
import {sortPointDateUp, sortPointPriceDown, isEscapeKey} from '../utils/utils.js';
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

  #pointPresenter = new Map();
  #currentSortType = SortType.DATE;

  constructor (fieldContainer, destinationCitiesModel, tripPointsModel, tripOffersModel) {
    this.#fieldContainer = fieldContainer;
    this.#destinationCitiesModel = destinationCitiesModel;
    this.#tripPointsModel = tripPointsModel;
    this.#tripOffersModel = tripOffersModel;

    this.#tripPointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#tripPointsModel.tripPoints].sort(sortPointDateUp);
      case SortType.PRICE:
        return [...this.#tripPointsModel.tripPoints].sort(sortPointPriceDown);
    }

    return this.#tripPointsModel.tripPoints;
  }

  get offers() {
    return this.#tripOffersModel.tripOffers;
  }

  get cities() {
    return this.#destinationCitiesModel.tripCities;
  }

  init = () => {
    this.#tripNewPointCreateComponent = new TripDestinationPointCreateView(this.points[0], this.cities[0], this.offers);
    this.#newEventButtonComponent.setNewEventButtonClickHandler(this.#handleNewEventClick);

    this.#renderContent();
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
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
      this.#tripNewPointCreateComponent.reset(this.points);
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

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
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
