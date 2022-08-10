import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import ContentContainerView from './view/content-container-view.js';
import tripParametersView from './view/new-trip-parameters-view.js';
import tripAddOptionsView from './view/trip-offers-view.js';
import tripDestinationView from './view/destination-view.js';
import {render} from './render.js';

const siteFiltersMainElement = document.querySelector('.trip-main__trip-controls');
const siteFilterElement = siteFiltersMainElement.querySelector('.trip-controls__filters');
const siteSortElement = document.querySelector('.trip-events');

render(new FiltersView(), siteFilterElement);
render(new SortView(), siteSortElement);
render(new ContentContainerView(), siteSortElement);

const siteFormElement = document.querySelector('.event--edit');

render(new tripParametersView(), siteFormElement);
render(new tripAddOptionsView(), siteFormElement);
render(new tripDestinationView(), siteFormElement);
