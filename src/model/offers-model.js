import {allOffers} from '../mock/offers-mock.js';
import Observable from '../framework/observable.js';

export default class TripOffersModel extends Observable {
  #offers = allOffers;

  get tripOffers() {
    return this.#offers;
  }
}
