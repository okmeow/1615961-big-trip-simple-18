import {render, replace} from '../framework/render.js';
import TripDestinationPointView from '../view/destination-point-view.js';
import TripDestinationPointEditView from '../view/destination-point-edit-view.js';
import ContentContainerView from './../view/content-container-view.js';
import WrapperContentContainerView from './../view/wrapper-content-container-view.js';
import WrapperFormContentContainerView from './../view/wrapper-form-content-container-view.js';
import TripDestinationView from './../view/destination-view.js';
import TripDestinationWrapperView from './../view/wrapper-destination-view.js';
import TripOffersView from './../view/trip-offers-view.js';
import newTripFormView from './../view/new-trip-parameters-view.js';
import EmptyPointListMessageView from './../view/empty-point-list-message-view.js';
import SortView from './../view/sort-view.js';

export default class AppPresenter {
  #tripContentContainerComponent = new ContentContainerView();
  #tripItemComponent = new WrapperContentContainerView();
  #tripItemFormComponent = new WrapperFormContentContainerView();
  #tripDestinationWrapperComponent = new TripDestinationWrapperView();
  #emptyPointListMessageComponent = new EmptyPointListMessageView();

  #fieldContainer = null;
  #destinationCitiesModel = null;
  #transportTypeModel = null;

  #destinationCities = [];
  #transportType = [];

  constructor (fieldContainer, destinationCitiesModel, transportTypeModel) {
    this.#fieldContainer = fieldContainer;
    this.#transportTypeModel = transportTypeModel;
    this.#destinationCitiesModel = destinationCitiesModel;
  }

  init = () => {
    this.#destinationCities = [...this.#destinationCitiesModel.cities];
    this.#transportType = [...this.#transportTypeModel.transportType];

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

  #renderSort = () => {
    render(new SortView(), this.#tripContentContainerComponent.element);
  };

  #renderPoint = (point) => {
    const pointComponent = new TripDestinationPointView(point);
    const pointEditComponent = new TripDestinationPointEditView(point);

    const replacePointToEditPoint = () => {
      replace(pointEditComponent, pointComponent);
    };

    const replaceEditPointToPoint = () => {
      replace(pointComponent, pointEditComponent);
    };

    const onEscapeKeyDown = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditPointToPoint();
        document.removeEventListener('keydown', onEscapeKeyDown);
      }
    };

    pointComponent.setShowEditFormButtonClickHandler(() => {
      replacePointToEditPoint();
      document.addEventListener('keydown', onEscapeKeyDown);
    });

    pointEditComponent.setEditFormSubmitHandler(() => {
      replaceEditPointToPoint();
      document.removeEventListener('keydown', onEscapeKeyDown);
    });

    pointEditComponent.setCloseEditFormButtonClickHandler(() => {
      replaceEditPointToPoint();
      document.removeEventListener('keydown', onEscapeKeyDown);
    });

    render(pointComponent, this.#tripContentContainerComponent.element);
  };

  #renderPoints = () => {
    for (let i = 0; i < this.#transportType.length; i++) {
      this.#renderPoint(this.#transportType[i]);
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
    this.#renderPoints();
  };
}
