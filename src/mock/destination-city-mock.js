import {getRandomInteger} from '../utils/utils.js';
import {CitiesToTrip, CitiesDescription} from './const.js';


// Функции для объекта назначение (Описывает город)
export const generateRandomCity = () => {

  const randomIndex = getRandomInteger(0, CitiesToTrip.length - 1);

  return CitiesToTrip[randomIndex];
};

const generateRandomCityDescription = () => {

  const randomIndex = getRandomInteger(0, CitiesDescription.split('. ').length - 1);

  return CitiesDescription.split('. ')[randomIndex];
};

export const generateCity = () => ({
  id: 0,
  description: generateRandomCityDescription(),
  name: generateRandomCity(),
  pictures: [
    {
      src: `https://placekitten.com/200/${getRandomInteger(1, 1000)}`,
      description: generateRandomCityDescription(),
    },
    {
      src: `https://placekitten.com/200/${getRandomInteger(1, 1000)}`,
      description: generateRandomCityDescription(),
    },
    {
      src: `https://placekitten.com/200/${getRandomInteger(1, 1000)}`,
      description: generateRandomCityDescription(),
    },
    {
      src: `https://placekitten.com/200/${getRandomInteger(1, 1000)}`,
      description: generateRandomCityDescription(),
    },
    {
      src: `https://placekitten.com/200/${getRandomInteger(1, 1000)}`,
      description: generateRandomCityDescription(),
    }
  ]
});
