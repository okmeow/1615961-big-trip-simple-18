import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import ContentContainerView from './view/content-container-view.js';
import TripParametersView from './view/new-trip-parameters-view.js';
import TripAddOptionsView from './view/trip-offers-view.js';
// import TripDestinationView from './view/destination-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import {render} from './render.js';
import CityModel from './model/destinations-model.js';
import TransportTypeModel from './model/transport-type-model.js';

const siteFiltersMainElement = document.querySelector('.trip-main__trip-controls');
const siteFilterElement = siteFiltersMainElement.querySelector('.trip-controls__filters');
const siteSortElement = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter();
const destinationCitiesModel = new CityModel();
const transportTypeModel = new TransportTypeModel();

render(new FiltersView(), siteFilterElement);
render(new SortView(), siteSortElement);
render(new ContentContainerView(), siteSortElement);

const siteFormElement = document.querySelector('.event--edit');

render(new TripParametersView(), siteFormElement);
render(new TripAddOptionsView(), siteFormElement);
// render(new TripDestinationView(), siteFormElement);

const siteDestinationPointContainerElement = document.querySelector('.trip-events__list');
boardPresenter.init(siteDestinationPointContainerElement, destinationCitiesModel, transportTypeModel);
