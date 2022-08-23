import {render} from '../render.js';
import tripDestinationPointView from '../view/destination-point-view.js';
import ContentContainerView from './../view/content-container-view.js';
import WrapperContentContainerView from './../view/wrapper-content-container-view.js';
import WrapperFormContentContainerView from './../view/wrapper-form-content-container-view.js';
import TripDestinationView from './../view/destination-view.js';
import TripAddOptionsView from './../view/trip-offers-view.js';
import TripParametersView from './../view/new-trip-parameters-view.js';


export default class AppPresenter {
  #tripListComponent = new ContentContainerView();
  #tripItemComponent = new WrapperContentContainerView();
  #tripItemFormComponent = new WrapperFormContentContainerView();

  #fieldContainer = null;
  #destinationCitiesModel = null;
  #transportTypeModel = null;

  #destinationCities = [];
  #transportType = [];

  init = (fieldContainer, destinationCitiesModel, transportTypeModel) => {
    this.#fieldContainer = fieldContainer;
    this.#destinationCitiesModel = destinationCitiesModel;
    this.#destinationCities = [...this.#destinationCitiesModel.cities];
    this.#transportTypeModel = transportTypeModel;
    this.#transportType = [...this.#transportTypeModel.transportType];

    render(this.#tripListComponent, this.#fieldContainer);
    render(this.#tripItemComponent, this.#tripListComponent.element);
    render(this.#tripItemFormComponent, this.#tripItemComponent.element);
    render(new TripParametersView(), this.#tripItemFormComponent.element);
    render(new TripAddOptionsView(), this.#tripItemFormComponent.element);
    render(new TripDestinationView(this.#destinationCities[0]), this.#tripItemFormComponent.element);

    for (let i = 0; i < 3; i++) {
      render(this.#tripListComponent, this.#fieldContainer);
      render(new tripDestinationPointView(this.#transportType[0]), this.#tripListComponent.element);
    }
  };
}
