import {getRandomInteger} from './utils.js';
import {CitiesToTrip, CitiesDescription} from './const.js';

const generateRandomCity = () => {

  const randomIndex = getRandomInteger(0, CitiesToTrip.length - 1);

  return CitiesToTrip[randomIndex];
};

const generateRandomCityDescription = () => {

  const randomIndex = getRandomInteger(0, CitiesDescription.split('. ').length - 1);

  return CitiesDescription.split('. ')[randomIndex];
};

export const generateCity = () => ({
  id: 1,
  description: generateRandomCityDescription(),
  name: generateRandomCity(),
  pictures: [
    {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 100000)}`,
      description: generateRandomCityDescription(),
    }
  ]
});
