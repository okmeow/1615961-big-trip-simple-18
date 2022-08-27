import {generateCity} from '../mock/destination-city-mock.js';

export default class CityModel {
  #cities = Array.from({length: 3}, generateCity);

  get cities() {
    return this.#cities;
  }
}