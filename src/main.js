import FiltersView from './view/filters-view.js';
import ContentContainerView from './view/content-container-view.js';
import ButtonNewEventView from './view/button-new-event-view.js';
import AppPresenter from './presenter/app-presenter.js';
import {render} from './framework/render.js';
import CityModel from './model/destinations-model.js';
import TripPointsModel from './model/trip-point-model.js';
import TripOffersModel from './model/offers-model.js';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteTripEventsElement = document.querySelector('.trip-events');
const siteButtonNewEventWrapperElement = document.querySelector('.trip-main');

const tripCitiesModel = new CityModel();
const tripPointsModel = new TripPointsModel();
const tripOffersModel = new TripOffersModel();
const appPresenter = new AppPresenter(siteTripEventsElement, tripCitiesModel, tripPointsModel, tripOffersModel);

render(new ButtonNewEventView(), siteButtonNewEventWrapperElement);
render(new FiltersView(), siteFilterElement);
render(new ContentContainerView(), siteTripEventsElement);

appPresenter.init();
