import {render} from '../render.js';
import TripDestinationPointView from '../view/destination-point-view.js';
import ContentContainerView from './../view/content-container-view.js';
import WrapperContentContainerView from './../view/wrapper-content-container-view.js';
import WrapperFormContentContainerView from './../view/wrapper-form-content-container-view.js';
import TripDestinationView from './../view/destination-view.js';
import TripDestinationWrapperView from './../view/wrapper-destination-view.js';
import TripAddOptionsView from './../view/trip-offers-view.js';
import TripParametersView from './../view/new-trip-parameters-view.js';


export default class AppPresenter {
  #tripContentContainerComponent = new ContentContainerView();
  #tripItemComponent = new WrapperContentContainerView();
  #tripItemFormComponent = new WrapperFormContentContainerView();
  #tripDestinationWrapperComponent = new TripDestinationWrapperView();

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

    render(this.#tripContentContainerComponent, this.#fieldContainer);
    render(this.#tripItemComponent, this.#tripContentContainerComponent.element);
    render(this.#tripItemFormComponent, this.#tripItemComponent.element);
    render(new TripParametersView(), this.#tripItemFormComponent.element);
    render(this.#tripDestinationWrapperComponent, this.#tripItemFormComponent.element);
    render(new TripAddOptionsView(), this.#tripDestinationWrapperComponent.element);
    render(new TripDestinationView(this.#destinationCities[0]), this.#tripDestinationWrapperComponent.element);

    for (let i = 0; i < this.#transportType.length; i++) {
      this.#renderPoint(this.#transportType[i]);
    }
  };

  #renderPoint = (point) => {
    const pointComponent = new TripDestinationPointView(point);

    render(pointComponent, this.#tripContentContainerComponent.element);
  };
}
