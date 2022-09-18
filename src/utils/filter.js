import {FilterType} from '../mock/const.js';
import dayjs from 'dayjs';

const isPointFuture = ({dateFrom, dateTo}) =>
  dayjs().isSame(dayjs(dateFrom)) ||
  dayjs().isBefore(dayjs(dateFrom)) ||
  dayjs().isAfter(dayjs(dateFrom)) &&
  dayjs().isBefore(dayjs(dateTo));

const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
};

export {filter};
