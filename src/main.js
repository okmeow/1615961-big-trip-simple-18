import FiltersView from './view/filters-view.js';
import ContentContainerView from './view/content-container-view.js';
import AppPresenter from './presenter/app-presenter.js';
import {render} from './framework/render.js';
import CityModel from './model/destinations-model.js';
import TransportTypeModel from './model/trip-point-model.js';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteTripEventsElement = document.querySelector('.trip-events');

const destinationCitiesModel = new CityModel();
const transportTypeModel = new TransportTypeModel();
const appPresenter = new AppPresenter(siteTripEventsElement, destinationCitiesModel, transportTypeModel);

render(new FiltersView(), siteFilterElement);
render(new ContentContainerView(), siteTripEventsElement);

appPresenter.init();
