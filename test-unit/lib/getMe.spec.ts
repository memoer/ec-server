import getMe from '~/lib/getMs';

describe('lib/getMe', () => {
  const oneMs = 1000;
  const oneMinute = 60 * oneMs;
  it('args(1, "ms"), return data is 1000', () => {
    const result = getMe(1, 'ms');
    expect(result).toBe(oneMs);
  });
  it('args(1, "second"), return data is 1000', () => {
    const result = getMe(1, 'second');
    expect(result).toBe(oneMs);
  });
  it('args(1, "minute"), return data is 60 * 1000', () => {
    const result = getMe(1, 'minute');
    expect(result).toBe(oneMinute);
  });
  it('args(1, "hour"), return data is 60 * 60 * 1000', () => {
    const result = getMe(1, 'hour');
    expect(result).toBe(60 * oneMinute);
  });
  it('args(1, "day"), return data is 24 * 60 * 60 * 1000', () => {
    const result = getMe(1, 'day');
    expect(result).toBe(24 * 60 * oneMinute);
  });
});
