import {generateTripPoint} from '../mock/point-mock.js';
import {allOffers} from '../mock/offers-mock.js';

export default class TripPointsModel {
  #points = Array.from({length: 5}, generateTripPoint);
  #offers = allOffers;

  get tripPoints() {
    return this.#points;
  }

  get tripOffers() {
    return this.#offers;
  }


}
