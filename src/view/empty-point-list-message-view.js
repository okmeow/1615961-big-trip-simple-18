import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../mock/const.js';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
};

const createEmptyPointListMessageTemplate = (filterType) => {
  const noPointTextValue = NoPointsTextType[filterType];

  return (
    `<p class="trip-events__msg">
      ${noPointTextValue}
    </p>`);
};

export default class EmptyPointListMessageView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyPointListMessageTemplate(this.#filterType);
  }
}
