import {generateTransportType} from '../mock/point-mock.js';

export default class TransportTypeModel {
  #transport = Array.from({length: 1}, generateTransportType);

  get transportType() {
    return this.#transport;
  }
}
