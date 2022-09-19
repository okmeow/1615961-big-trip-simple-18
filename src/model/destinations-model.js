import {generateCity} from '../mock/destination-city-mock.js';
import Observable from '../framework/observable.js';

export default class CityModel extends Observable {
  #cities = Array.from({length: 3}, generateCity);

  get tripCities() {
    return this.#cities;
  }

  updateCity = (updateType, update) => {
    const index = this.#cities.findIndex((city) => city.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting city');
    }

    this.#cities = [
      ...this.#cities.slice(0, index),
      update,
      ...this.#cities.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addCity = (updateType, update) => {
    this.#cities = [
      update,
      ...this.#cities,
    ];

    this._notify(updateType, update);
  };

  deleteCity = (updateType, update) => {
    const index = this.#cities.findIndex((city) => city.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting city');
    }

    this.#cities = [
      ...this.#cities.slice(0, index),
      ...this.#cities.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
