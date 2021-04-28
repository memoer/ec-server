export default (fn: any, number = 0) => fn.mock.calls[0][number];
