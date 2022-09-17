import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeEditPointTime, humanizePointTime} from '../utils/utils.js';
import {PointTypes} from '../mock/const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createTripTransportTypeList = (point) => {
  const eventTypeListTemplate = PointTypes.map((type) =>
    `
    <div class='event__type-item'>
      <input id='event-type-${type}-1' class='event__type-input  visually-hidden' type='radio' name='event-type' value='${type}'
      ${point.type === type ? 'checked' : ''}>
      <label class='event__type-label  event__type-label--${type.toLowerCase()}' for='event-type-${type}-1'>
        ${type}
      </label>
    </div>
    `
  );

  return eventTypeListTemplate.join('');
};

const createOffersTemplate = (offers) => {
  const offersTemplate = offers.map((offer) =>
    `
    <div class='event__offer-selector'>
      <input class='event__offer-checkbox  visually-hidden' id='event-offer-${offer.id}-1' type='checkbox' name='event-offer-${offer.id}'>
      <label class='event__offer-label' for='event-offer-${offer.id}-1'>
        <span class='event__offer-title'>${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class='event__offer-price'>${offer.price}</span>
      </label>
    </div>
    `
  );

  return offersTemplate.join('');
};

const createNewPointTemplate = (point, city, offers) => {
  const {description, name, pictures} = city;
  const {type, destination, price, dateFrom, dateTo} = point;

  const timeFrom = dateFrom
    ? humanizePointTime(dateFrom)
    : '';

  const timeTo = dateTo
    ? humanizePointTime(dateTo)
    : '';

  const date = dateFrom
    ? humanizeEditPointTime(dateFrom)
    : '';

  const pointTypeOffer = offers
    .find((offer) => offer.type === point.type);

  return (
    `
    <form class="event event--edit" action="#" method="">
      <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            ${createTripTransportTypeList(point)}

          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time event__input--time-from" id="event-start-time-1" type="text" name="event-start-time" value="${date} ${timeFrom}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time event__input--time-to" id="event-end-time-1" type="text" name="event-end-time" value="${date} ${timeTo}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>

      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">

            ${createOffersTemplate(pointTypeOffer.offers)}

          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination: ${name}</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              <img class="event__photo" src=${pictures[0].src} alt="Event photo">
              <img class="event__photo" src=${pictures[1].src} alt="Event photo">
              <img class="event__photo" src=${pictures[2].src} alt="Event photo">
              <img class="event__photo" src=${pictures[3].src} alt="Event photo">
              <img class="event__photo" src=${pictures[4].src} alt="Event photo">
            </div>
          </div>
        </section>
      </section>
    </form>
    `
  );
};

export default class TripDestinationPointCreateView extends AbstractStatefulView {
  #offers = [];
  #city = null;
  #dateFromPicker = null;
  #dateToPicker = null;

  constructor(point, city, offers) {
    super();
    this._state = TripDestinationPointCreateView.parsePointToState(point);
    this.#city = city;
    this.#offers = offers;

    this.setInnerCreatePointHandlers();
  }

  get template() {
    return createNewPointTemplate(this._state, this.#city, this.#offers);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }

    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
  };

  reset = (point) => {
    this.updateElement(
      TripDestinationPointCreateView.parsePointToState(point),
    );
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #changeTypeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
    });
  };

  #changeDestinationInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      destination: evt.target.value,
    });
  };

  #changePriceHandler = (evt) => {
    evt.preventDefault();

    this._setState({
      price: evt.target.value
    });
  };

  #changeDateFromHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate
    });
  };

  #changeDateToHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate
    });
  };

  #setDatepicker = () => {
    const {dateFrom, dateTo} = this._state;

    this.#dateFromPicker = flatpickr(
      this.element.querySelector('.event__input--time-from'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: dateFrom,
        enableTime: true,
        onChange: this.#changeDateFromHandler
      }
    );

    this.#dateToPicker = flatpickr(
      this.element.querySelector('.event__input--time-to'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: dateTo,
        enableTime: true,
        onChange: this.#changeDateToHandler
      }
    );
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(TripDestinationPointCreateView.parseStateToPoint(this._state));
  };

  setCreateFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
  };

  setCloseCreatePointClickHandler = (callback) => {
    this._callback.click = callback;
  };

  setInnerCreatePointHandlers = () => {
    this.#setDatepicker();
    this.element.querySelector('.event__type-group').addEventListener('change', this.#changeTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeDestinationInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#changePriceHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#clickHandler);
    // console.log(document.querySelector('.event--edit'));
    // document.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  };

  _restoreHandlers = () => {
    this.setInnerCreatePointHandlers();
    this.setCreateFormSubmitHandler(this._callback.formSubmit);
    this.setCloseCreatePointClickHandler(this._callback.click);
  };

  static parsePointToState = (point) => (
    {...point,

    }
  );

  static parseStateToPoint = (state) => {
    const point = {...state};

    return point;
  };
}
