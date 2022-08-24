import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import ContentContainerView from './view/content-container-view.js';
import AppPresenter from './presenter/board-presenter.js';
import {render} from './render.js';
import CityModel from './model/destinations-model.js';
import TransportTypeModel from './model/transport-type-model.js';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteTripEventsElement = document.querySelector('.trip-events');

const appPresenter = new AppPresenter();
const destinationCitiesModel = new CityModel();
const transportTypeModel = new TransportTypeModel();

render(new FiltersView(), siteFilterElement);
render(new SortView(), siteTripEventsElement);
render(new ContentContainerView(), siteTripEventsElement);

appPresenter.init(siteTripEventsElement, destinationCitiesModel, transportTypeModel);
