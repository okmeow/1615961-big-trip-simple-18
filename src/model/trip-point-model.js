import {generateTripPoint} from '../mock/point-mock.js';
import Observable from '../framework/observable.js';

export default class TripPointsModel extends Observable {
  #points = Array.from({length: 5}, generateTripPoint);

  get tripPoints() {
    return this.#points;
  }
}
