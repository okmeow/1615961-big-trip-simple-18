import {render, replace} from '../framework/render.js';
import TripDestinationPointView from '../view/destination-point-view.js';
import TripDestinationPointEditView from '../view/destination-point-edit-view.js';
import ContentContainerView from './../view/content-container-view.js';
import WrapperContentContainerView from './../view/wrapper-content-container-view.js';
import WrapperFormContentContainerView from './../view/wrapper-form-content-container-view.js';
import TripDestinationView from './../view/destination-view.js';
import TripDestinationWrapperView from './../view/wrapper-destination-view.js';
import TripAddOptionsView from './../view/trip-offers-view.js';
import TripParametersView from './../view/new-trip-parameters-view.js';
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

    this.#renderAppContent();
  };

  #renderAppContent = () => {
    render(this.#tripContentContainerComponent, this.#fieldContainer);

    if(this.#destinationCities.length === 0) {
      render(this.#emptyPointListMessageComponent, this.#tripContentContainerComponent.element);
    } else {
      render(new SortView(), this.#tripContentContainerComponent.element);
      render(this.#tripItemComponent, this.#tripContentContainerComponent.element);
      render(this.#tripItemFormComponent, this.#tripItemComponent.element);
      render(new TripParametersView(), this.#tripItemFormComponent.element);
      render(this.#tripDestinationWrapperComponent, this.#tripItemFormComponent.element);
      render(new TripAddOptionsView(), this.#tripDestinationWrapperComponent.element);
      render(new TripDestinationView(this.#destinationCities[0]), this.#tripDestinationWrapperComponent.element);

      for (let i = 0; i < this.#transportType.length; i++) {
        this.#renderPoint(this.#transportType[i]);
      }
    }
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
}
