import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomValue = (items) => (
  items[getRandomInteger(0, items.length - 1)]
);

const humanizeTaskDueDate = (time) => dayjs(time).format('DD MMMM');
const humanizePointTime = (time) => dayjs(time).format('hh:mm');
const humanizeEditPointTime = (time) => dayjs(time).format('DD/MM/YY');

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortPointDateUp = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.tripDate, pointB.tripDate);

  return weight ?? dayjs(pointA.tripDate).diff(dayjs(pointB.tripDate));
};

const sortPointPriceDown = (pointA, pointB) => pointB.price - pointA.price;

const isEscapeKey = (evt) => evt.key === 'Escape';

export {getRandomInteger, getRandomValue, humanizeTaskDueDate, humanizePointTime, humanizeEditPointTime, sortPointDateUp, sortPointPriceDown, isEscapeKey};
