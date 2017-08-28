import badbrowser from '../src/lib/badbrowser';

/**
 * check browsers
 *
 * desktop
 * Microsoft Edge, 12+;
 * Mozilla Firefox, 37+;
 * Google Chrome, 41+;
 * Opera, 28+;
 * Apple Safari, 8+;
 * Yandex Browser, 15+.
 *
 * mobile
 * Mobile Safari, 7+
 * Android Browser, 4+
 * Chrome Mobile, 41+;
 * Internet Explorer Mobile, 11+;
 */
const supported = {
  msedge: '12',
  firefox: '37',
  chrome: '41',
  opera: '28',
  safari: '8',
  yandexbrowser: '15',
  safari_mobile: '7',
  android: '4',
  chrome_mobile: '41',
  msie_mobile: '11'
};

describe(`Check supported browser: ${JSON.stringify(supported)}`, () => {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/37.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/41.0.696.57 Safari/534.24',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.52 Safari/537.36 OPR/28.0.1147.100',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.13+ (KHTML, like Gecko) Version/8.1.7 Safari/534.57.2',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 YaBrowser/15.4.2272.3420 (beta) Yowser/2.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/7.0 Mobile/14E8301 Safari/602.1',
    'Mozilla/5.0 (Linux; U; Android 4.3; de-de; Galaxy Nexus Build/JWR66Y) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_1 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/41.0.2661.95 Mobile/13E238 Safari/601.1.46',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/11.0; ARM; Touch; NOKIA; Lumia 920; Vodafone)'
  ];

  userAgents.forEach((userAgent) => {
    const bb = new badbrowser({ userAgent, supported });
    const isSupported = bb.check();

    it(`Supported: ${bb.name} ${bb.version} >= min supported version ${bb.minSupportVersion} "${userAgent}"`, () => {
      expect(isSupported).toBe(true);
    });
  });

  userAgents.forEach((userAgent) => {
    const bb = new badbrowser({ userAgent, unsupported: supported});
    const isSupported = bb.check();

    it(`Unsupported: ${bb.name} ${bb.version} < min supported version ${bb.minSupportVersion} "${userAgent}"`, () => {
      expect(isSupported).toBe(false);
    });
  });

});

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

describe('check badbrowser options fullscreen', () => {

  it('fullscreen', () => {
    const fullscreen = true;
    const bb = new badbrowser({ fullscreen });
    expect(bb.settings.fullscreen).toBe(fullscreen);
  });

});


describe('default supported browsers', () => {

  const userAgentsSupported = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.3029.110 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/38.0',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.2; Trident/6.0; ARM; Touch; WPDesktop)',
    'Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/26',
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_7; en-us) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/6.0.5 Safari/533.21.1',
    'Mozilla/5.0 (Linux; U; Android 4.3; de-de; Galaxy Nexus Build/JWR66Y) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0'
  ];

  const userAgentsUnSupported = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.3029.110 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/37.0',
    'Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.2; Trident/6.0; ARM; Touch; WPDesktop)',
    'Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14',
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_7; en-us) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
    'Mozilla/5.0 (Linux; U; Android 4.3; de-de; Galaxy Nexus Build/JWR66Y) AppleWebKit/534.30 (KHTML, like Gecko) Version/3.0 Mobile Safari/534.30',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/11.0'
  ];

  userAgentsSupported.forEach((userAgent) => {
    const bb = new badbrowser({ userAgent });
    const isSupported = bb.check();

    it(`support ${JSON.stringify(bb.minVersions)} (${bb.version}>=${bb.minSupportVersion}) "${userAgent}"`, () => {
      expect(isSupported).toBe(true);
    });
  });

  userAgentsUnSupported.forEach((userAgent) => {
    const bb = new badbrowser({ userAgent });
    const isSupported = bb.check();

    it(`unsupport ${JSON.stringify(bb.minVersions)} (${bb.version}<${bb.minSupportVersion}) "${userAgent}"`, () => {
      expect(isSupported).toBe(false);
    });
  });

});
