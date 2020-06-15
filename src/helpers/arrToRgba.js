import { isValidRgba } from 'hex-and-rgba';

const arrToRgba = (rgbaArr, alpha) =>
  isValidRgba(rgbaArr)
    ? `rgba(${rgbaArr[0]},${rgbaArr[1]},${rgbaArr[2]},${
        alpha ? alpha : rgbaArr[3]
      })`
    : 'rgba(0,0,0,0.5)';

export default arrToRgba;
