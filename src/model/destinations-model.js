import {generateCity} from '../mock/destination-city-mock.js';
import Observable from '../framework/observable.js';

export default class CityModel extends Observable {
  #cities = Array.from({length: 3}, generateCity);

  get tripCities() {
    return this.#cities;
  }
}
