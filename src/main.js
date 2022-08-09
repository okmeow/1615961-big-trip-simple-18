import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
// import ContentContainerView from './view/sort-view.js';
import tripParametersView from './view/new-trip-parameters-view.js';
import DestinationView from './view/destination-view.js';
import {render} from './render.js';

const siteFiltersMainElement = document.querySelector('.trip-main__trip-controls');
const siteFilterElement = siteFiltersMainElement.querySelector('.trip-controls__filters');
const siteSortElement = document.querySelector('.trip-events');

render(new FiltersView(), siteFilterElement);
render(new SortView(), siteSortElement);
// render(new ContentContainerView(), siteSortElement);
render(new tripParametersView(), siteSortElement);

const siteFormElement = siteSortElement.querySelector('.event--edit');
render(new DestinationView(), siteFormElement);

