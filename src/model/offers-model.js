import {allOffers} from '../mock/offers-mock.js';
import Observable from '../framework/observable.js';
import {UpdateType} from '../mock/const.js';

export default class TripOffersModel extends Observable {
  #offersApiService = null;
  #offers = allOffers;
  #serverOffers = null;
  // #offers = null;

  constructor(offersApiService) {
    super();
    this.#offersApiService = offersApiService;
  }

  get tripOffers() {
    // console.log('С сервера где нужно offers', this.#serverOffers);
    return this.#offers;
  }

  init = async () => {
    try {
      const serverOffers = await this.#offersApiService.offers;
      this.#serverOffers = serverOffers.map(this.#adaptToClient);
    } catch(err) {
      this.#serverOffers = [];
    }
    // console.log('С сервера', this.#serverOffers);
    this._notify(UpdateType.INIT_OFFERS);
  };

  updateOffer = (updateType, update) => {
    const index = this.#offers.findIndex((offer) => offer.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting offer');
    }

    this.#offers = [
      ...this.#offers.slice(0, index),
      update,
      ...this.#offers.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addOffer = (updateType, update) => {
    this.#offers = [
      update,
      ...this.#offers,
    ];

    this._notify(updateType, update);
  };

  deleteOffer = (updateType, update) => {
    const index = this.#offers.findIndex((offer) => offer.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting offer');
    }

    this.#offers = [
      ...this.#offers.slice(0, index),
      ...this.#offers.slice(index + 1),
    ];

    this._notify(updateType);
  };

  #adaptToClient = (offer) => {
    const adaptedOffer = {...offer,
    };

    return adaptedOffer;
  };
}
