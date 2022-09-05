import {generateTransportType} from '../mock/point-mock.js';

export default class TripPointsModel {
  #points = Array.from({length: 5}, generateTransportType);

  get tripPoints() {
    return this.#points;
  }
}
