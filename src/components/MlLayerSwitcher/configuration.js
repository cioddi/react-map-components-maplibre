class MlLayerSwitcherConfig {
  constructor() {
    this.baseSourceConfig;
  }

  static createFromStyleObject(styleObject) {

  }
}

/**
 * @param  {Array} exlcudes=[]
 * @param  {Array} exlcudes=[]
 * @param  {Array} exlcudedBaseStyleLayer=[]
 */
class MlLayerSwitcherbaseSourceConfig {
  constructor(exlcudes = [], exlcudedBaseStyleLayer = []) {
    this.exlcudes = exlcudes;
    this.exlcudedBaseStyleLayer = exlcudedBaseStyleLayer;
  }

  getExlcudes() {
    return this.exlcudes;
  }
}
