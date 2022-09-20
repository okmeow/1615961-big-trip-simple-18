import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class DestinationsApiService extends ApiService {
  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  updatePoint = async (destination) => {
    const response = await this._load({
      url: `destinations/${destination.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(destination)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (destination) => {
    const adaptedDestination = {...destination,

    };

    return adaptedDestination;
  };
}
