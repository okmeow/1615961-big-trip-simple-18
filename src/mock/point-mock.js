import {getRandomInteger} from '../utils/utils.js';
import {PointTypes} from './const.js';
import {nanoid} from 'nanoid';
import {generateRandomCity} from './destination-city-mock.js';

const generateRandomTransportType = () => {

  const randomIndex = getRandomInteger(0, PointTypes.length - 1);

  return PointTypes[randomIndex];
};

const generateOffersId = () => {
  const commonOffersId = [1, 2, 3, 4];
  return commonOffersId.slice(0, getRandomInteger(0, commonOffersId.length - 1));
};

export const generateTripPoint = () => ({
  id: `${getRandomInteger(0, 19)}`,
  type: generateRandomTransportType(),
  destination: generateRandomCity(),
  offers: generateOffersId(),
  dateFrom: `2022-06-${getRandomInteger(10, 20)}T${getRandomInteger(10, 15)}:${getRandomInteger(10, 59)}:13.375Z`,
  dateTo: `2022-06-${getRandomInteger(20, 30)}T${getRandomInteger(15, 20)}:${getRandomInteger(10, 59)}:13.375Z`,
  price: getRandomInteger(10, 1000),
});
