import {generateCity} from '../mock/trip.js';

export default class TripModel {
  cities = Array.from({length: 3}, generateCity);

  getCities = () => this.cities;
}
