const { DateUtils } = require('../utils');

describe('Utils Test', () => {
  beforeAll(async () => {});

  it('should get current timestamp', async () => {
    const now = DateUtils.now();
    const now2 = DateUtils.getUnixTimestamp();
    expect(now).toBeGreaterThan(1676377840);
    expect(now2).toBeGreaterThan(1676377840);
  });
});
