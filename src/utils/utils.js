import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomValue = (items) => (
  items[getRandomInteger(0, items.length - 1)]
);

const humanizeTaskDueDate = (dueDate) => dayjs(dueDate).format('D MMMM YY');

const updateArrayElement = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

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
  const weight = getWeightForNullDate(pointA.dueDate, pointB.dueDate);

  return weight ?? dayjs(pointA.dueDate).diff(dayjs(pointB.dueDate));
};

const sortPointPriceDown = (pointA, pointB) => pointB.price - pointA.price;

const isEscapeKey = (evt) => evt.key === 'Escape';

export {getRandomInteger, getRandomValue, humanizeTaskDueDate, updateArrayElement, sortPointDateUp, sortPointPriceDown, isEscapeKey};
