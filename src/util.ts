class Util {
  static mapping(value:number, minVal: number, maxVal:number, transformMinVal:number, transformMaxVal:number): number {
    const transformDiff = transformMaxVal - transformMinVal;
    const diff = maxVal - minVal;
    const percentage = value / diff;
    const result =  transformDiff * percentage + transformMinVal;

    if (result < transformMinVal) {
      return transformMinVal
    } else if (result > transformMaxVal) {
      return transformMaxVal;
    } else {
      return result;
    }
  }
}

export default Util;