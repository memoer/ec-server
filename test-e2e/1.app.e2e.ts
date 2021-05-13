import { MockApp } from './config';

export default (mockApp: MockApp) =>
  it(mockApp.getDesc('query', 'hello'), () =>
    mockApp
      .testData({
        query: '{hello}',
        expectFn: (res) => {
          const data = mockApp.getDataFromBody(res, 'hello');
          expect(data).toBe('hello');
        },
      })
      .sendGql(),
  );
