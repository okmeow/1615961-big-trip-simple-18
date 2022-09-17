import AbstractView from '../framework/view/abstract-view.js';
import {humanizeTaskDueDate, humanizePointTime} from '../utils/utils.js';

const createOffersTemplate = (offer) => {
  const offerTemplate = offer.map((offers) =>
    `
    <li class='event__offer' id='${offer.id}'>
      <span class='event__offer-title'>${offers.title}</span>
      &plus;&euro;&nbsp;
      <span class='event__offer-price'>${offers.price}</span>
    </li>
    `
  );

  return offerTemplate.join('');
};

const createDestinationPointTemplate = (point, offers) => {
  const {type, tripDate, price, destination, dateFrom, dateTo} = point;

  const offersByType = offers.find((offer) => offer.type === point.type);
  // const offersSelected = offersByType.offers.filter((offer) => offers.includes(offer.id));

  const date = tripDate
    ? humanizeTaskDueDate(tripDate)
    : '';

  const timeFrom = dateFrom ? humanizePointTime(dateFrom) : '';
  const timeTo = dateTo ? humanizePointTime(dateTo) : '';


  return (
    `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${timeTo}</time>
          </p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersTemplate(offersByType.offers)}
        </ul>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
    `
  );
};

export default class TripDestinationPointView extends AbstractView{
  #point = null;
  #offer = [];

  constructor(point, offer) {
    super();
    this.#point = point;
    this.#offer = offer;
  }

  get template() {
    return createDestinationPointTemplate(this.#point, this.#offer);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  setShowEditFormButtonClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };
}
