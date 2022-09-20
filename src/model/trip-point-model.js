import {generateTripPoint} from '../mock/point-mock.js';
import Observable from '../framework/observable.js';
import {UpdateType} from '../mock/const.js';

export default class TripPointsModel extends Observable {
  #pointsApiService = null;
  #points = Array.from({length: 5}, generateTripPoint);
  // #points = [];
  #serverPoints = [];


  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get tripPoints() {
    // console.log('С моков', this.#points);
    // console.log('С сервера где нужно', this.#serverPoints);
    return this.#points;
  }

  init = async () => {
    try {
      const serverPoints = await this.#pointsApiService.points;
      this.#serverPoints = serverPoints.map(this.#adaptToClient);
    } catch(err) {
      this.#serverPoints = [];
    }
    // console.log('С сервера', this.#serverPoints);
    this._notify(UpdateType.INIT_POINTS);
  };

  updatePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addPoint = (updateType, update) => {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      price: point['base_price'],
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];

    return adaptedPoint;
  };
}
