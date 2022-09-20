// import {getRandomInteger} from '../utils/utils.js';
// import {PointTypes} from './const.js';
// import {nanoid} from 'nanoid';
// import {generateRandomCity} from './destination-city-mock.js';

// const generateRandomTransportType = () => {

//   const randomIndex = getRandomInteger(0, PointTypes.length - 1);

//   return PointTypes[randomIndex];
// };

// export const generateTripPoint = () => ({
//   id: nanoid(),
//   type: generateRandomTransportType(),
//   dateFrom: `2022-06-${getRandomInteger(10, 20)}T${getRandomInteger(10, 15)}:${getRandomInteger(10, 59)}:13.375Z`,
//   dateTo: `2022-06-${getRandomInteger(20, 30)}T${getRandomInteger(15, 20)}:${getRandomInteger(10, 59)}:13.375Z`,
//   price: getRandomInteger(10, 1000),
//   destination: generateRandomCity(),
//   offers: [getRandomInteger(0, 1)],
// });
