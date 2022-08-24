import {generateTransportType} from '../mock/point-mock.js';

export default class TransportTypeModel {
  #transport = Array.from({length: 3}, generateTransportType);

  get transportType() {
    return this.#transport;
  }
}
