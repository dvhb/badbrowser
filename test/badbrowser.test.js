import badbrowser from '../src/lib/badbrowser';

describe('badbrowser init', () => {

  it('init badbrowser with custom useragent', () => {
    const userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 9 Build/LMY48T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Safari/537.36';
    const bb = new badbrowser({ userAgent });
    expect(bb.userAgent).toBe(userAgent);
  });

  it('init badbrowser with current browser useragent', () => {
    const userAgent = window.navigator.userAgent;
    const bb = new badbrowser();
    expect(bb.userAgent).toBe(userAgent);
  })

});
