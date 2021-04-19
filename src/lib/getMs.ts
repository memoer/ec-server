/**
 * comment test
 * @param value
 * @param type
 * @returns milliseconds good?
 * @description desc
 */
export default (
  value: number,
  type: 'day' | 'hour' | 'minutes' | 'seconds' | 'ms',
): number => {
  const oneMs = 1000;
  const oneSeconds = 1 * oneMs;
  const oneMinues = 60 * oneSeconds;
  const oneHours = 60 * oneMinues;
  const oneDay = 24 * oneHours;
  switch (type) {
    case 'day':
      return oneDay * value;
    case 'hour':
      return oneHours * value;
    case 'minutes':
      return oneMinues * value;
    case 'seconds':
      return oneSeconds * value;
    default:
      return oneMs * value;
  }
};
