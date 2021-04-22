/**
 * comment test
 * @param value
 * @param type
 * @returns milliseconds good?
 * @description desc
 */
export default (
  value: number,
  type: 'day' | 'hour' | 'minute' | 'second' | 'ms',
): number => {
  const oneMs = 1000;
  const oneSecond = 1 * oneMs;
  const oneMinue = 60 * oneSecond;
  const oneHour = 60 * oneMinue;
  const oneDay = 24 * oneHour;
  switch (type) {
    case 'day':
      return value * oneDay;
    case 'hour':
      return value * oneHour;
    case 'minute':
      return value * oneMinue;
    case 'second':
      return value * oneSecond;
    default:
      return value * oneMs;
  }
};
