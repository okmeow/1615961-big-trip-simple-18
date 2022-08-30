import {getRandomInteger} from '../utils/utils.js';
import {PointTypes} from './const.js';
import {nanoid} from 'nanoid';

// Функции для типа трансопрта
const generateRandomTransportType = () => {

  const randomIndex = getRandomInteger(0, PointTypes.length - 1);

  return PointTypes[randomIndex];
};

export const generateTransportType = () => ({
  id: nanoid(),
  type: generateRandomTransportType(),
  dueDate: '2022-06-15T11:22:13.375Z',
});
