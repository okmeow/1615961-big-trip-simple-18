import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeEditPointTime, humanizePointTime} from '../utils/utils.js';
import {PointTypes} from '../mock/const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createTripTransportTypeList = (point) => {
  const eventTypeListTemplate = PointTypes.map((type) => `
    <div class='event__type-item'>
      <input id='event-type-${type}-1' class='event__type-input  visually-hidden' type='radio' name='event-type' value='${type}'
      ${point.type === type ? 'checked' : ''}>
      <label class='event__type-label  event__type-label--${type.toLowerCase()}' for='event-type-${type}-1'>
      ${type}
      </label>
    </div>
  `);

  return eventTypeListTemplate.join('');
};

const createOffersTemplate = (offers) => {
  const offersTemplate = offers.map((offer) => `
      <div class='event__offer-selector'>
      <input class='event__offer-checkbox  visually-hidden' id='event-offer-${offer.id}-1' type='checkbox' name='event-offer-${offer.id}' checked>
      <label class='event__offer-label' for='event-offer-${offer.id}-1'>
        <span class='event__offer-title'>${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class='event__offer-price'>${offer.price}</span>
      </label>
    </div>
    `);

  return offersTemplate.join('');
};

const createDestinationPointEditTemplate = (point, offers) => {
  const {type, price, destination, dateFrom, dateTo, tripDate} = point;

  const timeFrom = dateFrom !== null
    ? humanizePointTime(dateFrom)
    : '';

  const timeTo = dateTo !== null
    ? humanizePointTime(dateTo)
    : '';

  const date = tripDate !== null
    ? humanizeEditPointTime(tripDate)
    : '';

  const pointTypeOffer = offers
    .find((offer) => offer.type === point.type);


  // const offersSelected = pointTypeOffer.offers.filter((offer) => point.offers.includes(offer.id));

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
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
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
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
            <p class="event__destination-description">Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it's renowned for its skiing.</p>
          </section>
        </section>
      </form>
    </li>`
  );
};

export default class TripDestinationPointEditView extends AbstractStatefulView {
  #offer = [];
  #dateFromPicker = null;
  #dateToPicker = null;

  constructor(point, offer) {
    super();
    this._state = TripDestinationPointEditView.parsePointToState(point);
    this.#offer = offer;

    this.setEditPointHandlers();
  }

  get template() {
    return createDestinationPointEditTemplate(this._state, this.#offer);
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

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(TripDestinationPointEditView.parseStateToPoint(this._state));
  };

  setCloseEditFormButtonClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  setEditFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  };

  _restoreHandlers = () => {
    this.setEditPointHandlers();
    this.setEditFormSubmitHandler(this._callback.formSubmit);
    this.setCloseEditFormButtonClickHandler();
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

    this.updateElement({
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
        onInput: this.#changeDateFromHandler
      }
    );

    this.#dateToPicker = flatpickr(
      this.element.querySelector('.event__input--time-to'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: dateTo,
        enableTime: true,
        onInput: this.#changeDateToHandler
      }
    );
  };

  setEditPointHandlers = () => {
    this.#setDatepicker();
    this.element.querySelector('.event__type-group').addEventListener('change', this.#changeTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#changeDestinationInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#changePriceHandler);
  };

  static parsePointToState = (point) => ({...point,

  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    // данные нужные только в состоянии, удаление их

    return point;
  };
}
