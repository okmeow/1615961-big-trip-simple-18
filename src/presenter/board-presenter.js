import {render} from '../render.js';
import tripDestinationPointView from './../view/destination-point.js';
import ContentContainerView from './../view/content-container-view.js';

import TripDestinationView from './../view/destination-view.js';


export default class BoardPresenter {
  fieldComponent = new ContentContainerView();

  init = (fieldContainer, destinationCitiesModel) => {
    this.fieldContainer = fieldContainer;
    this.destinationCitiesModel = destinationCitiesModel;
    this.destinationCities = [...this.destinationCitiesModel.getCities()];

    render(new TripDestinationView(this.destinationCities), this.fieldComponent.getElement());
    console.log(this.destinationCities);

    for (let i = 0; i < 3; i++) {
      render(this.fieldComponent, this.fieldContainer);
      render(new tripDestinationPointView(), this.fieldComponent.getElement());
    }
  };
}
