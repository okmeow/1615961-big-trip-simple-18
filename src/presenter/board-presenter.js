import {render} from '../render.js';
import tripDestinationPointView from '../view/destination-point-view.js';
import ContentContainerView from './../view/content-container-view.js';

import TripDestinationView from './../view/destination-view.js';


export default class BoardPresenter {
  #fieldComponent = new ContentContainerView();

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

    render(new TripDestinationView(this.#destinationCities[0]), this.#fieldComponent.element);

    for (let i = 0; i < 3; i++) {
      render(this.#fieldComponent, this.#fieldContainer);
      render(new tripDestinationPointView(this.#transportType[0]), this.#fieldComponent.element);
    }
  };
}
