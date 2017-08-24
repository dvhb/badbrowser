import bowser from 'bowser';

export default class DetectBrowser {

  constructor() {
    this._detector = bowser;
  }

  /**
   * Browser name
   *
   * @returns {string}
   */
  get name() {
    return this._detector.name
  }

  get version() {
    return this._detector.version
  }

  get mobile() {
    return this._detector.mobile;
  }

}

