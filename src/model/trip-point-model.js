import {generateTripPoint} from '../mock/point-mock.js';
import {allOffers} from '../mock/offers-mock.js';

export default class TripPointsModel {
  #points = Array.from({length: 5}, generateTripPoint);
  #offers = allOffers;

  get tripPoints() {
    // console.log(this.#points);
    return this.#points;
  }

  get tripOffers() {
    // console.log(this.#offers);
    return this.#offers;
  }


}
