import {generateTripPoint} from '../mock/point-mock.js';

export default class TripPointsModel {
  #points = Array.from({length: 5}, generateTripPoint);

  get tripPoints() {
    return this.#points;
  }
}
