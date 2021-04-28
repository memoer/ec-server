export type TMock<T> = Record<keyof T, jest.Mock<any, any>>;
