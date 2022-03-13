class Util {
  static mapping(value:number, minVal: number, maxVal:number, transformMinVal:number, transformMaxVal:number): number {
    const transformDiff = transformMaxVal - transformMinVal;
    const diff = maxVal - minVal;
    const percentage = value / diff;
    return transformDiff * percentage + transformMinVal;
  }
}

export default Util;