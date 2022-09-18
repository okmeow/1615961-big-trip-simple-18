import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeEditPointTime, humanizePointTime} from '../utils/utils.js';
import {PointTypes} from '../mock/const.js';
import dayjs from 'dayjs';
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
      <input class='event__offer-checkbox  visually-hidden' id='event-offer-${offer.id}-1' type='checkbox' name='event-offer-${offer.id}' checked>
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

const createDestinationPointEditTemplate = (point, offers, cities) => {
  const {type, price, destination, dateFrom, dateTo} = point;

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

  // const offersSelected = pointTypeOffer.offers.filter((offer) => point.offers.includes(offer.id));

  return (
    `
    <li class="trip-events__item">
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
          <button class="event__reset-btn event__delete-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${createOffersTemplate(pointTypeOffer.offers)}
            </div>
          </section>
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${cities[0].description}.</p>
          </section>
        </section>
      </form>
    </li>
    `
  );
};

export default class TripDestinationPointEditView extends AbstractStatefulView {
  #offers = [];
  #cities = [];
  #dateFromPicker = null;
  #dateToPicker = null;

  constructor(point, offers, cities) {
    super();
    this._state = TripDestinationPointEditView.parsePointToState(point);
    this.#offers = offers;
    this.#cities = cities;

    this.setInnerEditPointHandlers();
  }

  get template() {
    return createDestinationPointEditTemplate(this._state, this.#offers, this.#cities);
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
      TripDestinationPointEditView.parsePointToState(point),
    );
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(TripDestinationPointEditView.parseStateToPoint(this._state));
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(TripDestinationPointEditView.parseStateToPoint(this._state));
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
    this._setState({
      // dateFrom: userDate
      dateFrom: dayjs(userDate).format('DD/MM/YY HH:mm')
    });
  };

  #changeDateToHandler = ([userDate]) => {
    this._setState({
      // dateTo: userDate
      dateTo: dayjs(userDate).format('DD/MM/YY HH:mm')
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

  setEditFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
  };

  setCloseEditFormButtonClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  setDeleteEditFormButtonClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__delete-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  setInnerEditPointHandlers = () => {
    this.#setDatepicker();
    this.element.querySelector('.event__type-group').addEventListener('change', this.#changeTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#changeDestinationInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#changePriceHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  };

  _restoreHandlers = () => {
    this.setInnerEditPointHandlers();
    this.setEditFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteEditFormButtonClickHandler(this._callback.deleteClick);
    this.setCloseEditFormButtonClickHandler(this._callback.click);
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
