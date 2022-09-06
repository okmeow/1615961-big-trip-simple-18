import {getRandomInteger} from '../utils/utils.js';
import {PointTypes} from './const.js';
import {nanoid} from 'nanoid';
import {generateRandomCity} from './destination-city-mock.js';
import {allOffers} from './offers-mock.js';

// Функции для типа трансопрта
const generateRandomTransportType = () => {

  const randomIndex = getRandomInteger(0, PointTypes.length - 1);

  return PointTypes[randomIndex];
};

export const generateTripPoint = () => ({
  id: nanoid(),
  type: generateRandomTransportType(),
  tripDate: `2022-06-${getRandomInteger(10, 30)}T11:22:13.375Z`,
  dateFrom: `2022-06-22T${getRandomInteger(10, 15)}:${getRandomInteger(10, 59)}:13.375Z`,
  dateTo: `2022-06-22T${getRandomInteger(15, 20)}:${getRandomInteger(10, 59)}:13.375Z`,
  price: allOffers[getRandomInteger(0, 5)].offers[0].price,
  destination: generateRandomCity(),
  offers: [getRandomInteger(0, 9)],
  // offers: [1, 2, 3, 4, 5, 6, 7, 8, 9].slice(getRandomInteger(0, 1), getRandomInteger(3, 9)),
});
