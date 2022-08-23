import {createElement} from '../render.js';

const createDestinationTemplate = (destination) => {
  const {description, name, pictures} = destination;

  return (
    `<section class="event__details">
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">${name}</h3>
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
    </section>`
  );
};

export default class TripDestinationView {
  #element = null;
  #destination = null;

  constructor(destination) {
    this.#destination = destination;
  }

  get template() {
    return createDestinationTemplate(this.#destination);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
