import FiltersView from './view/filters-view.js';
import {render} from './render.js';

const siteFiltersMainElement = document.querySelector('.trip-main__trip-controls');
const siteFilterElement = siteFiltersMainElement.querySelector('.trip-controls__filters');

render(new FiltersView(), siteFilterElement);
