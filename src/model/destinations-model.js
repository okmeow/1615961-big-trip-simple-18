import {generateCity} from '../mock/destination-city-mock.js';
import Observable from '../framework/observable.js';
import {UpdateType} from '../mock/const.js';

export default class CityModel extends Observable {
  #destinations = Array.from({length: 3}, generateCity);
  #destinationsApiService = null;
  // #cities = [];
  #serverDestinations = null;

  constructor(destinationsApiService) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }


  init = async () => {
    try {
      this.#serverDestinations = await this.#destinationsApiService.destinations;
    } catch(err) {
      this.#serverDestinations = [];
    }

    this._notify(UpdateType.INIT_DESTINATIONS);
  };


  get tripCities() {
    console.log('С сервера где нужно', this.#serverDestinations);
    return this.#destinations;
  }

  updateCity = (updateType, update) => {
    const index = this.#destinations.findIndex((destination) => destination.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting city');
    }

    this.#destinations = [
      ...this.#destinations.slice(0, index),
      update,
      ...this.#destinations.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addCity = (updateType, update) => {
    this.#destinations = [
      update,
      ...this.#destinations,
    ];

    this._notify(updateType, update);
  };

  deleteCity = (updateType, update) => {
    const index = this.#destinations.findIndex((destination) => destination.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting city');
    }

    this.#destinations = [
      ...this.#destinations.slice(0, index),
      ...this.#destinations.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
