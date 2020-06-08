module.exports = (pathsArray) => {
  const dirPathArr = pathsArray[0].split('/');
  let dirPath;
  if (dirPathArr[dirPathArr.length - 1] === '') {
    dirPathArr.splice(-2, 2);
    dirPath = dirPathArr.join('/') + '/';
  } else {
    dirPathArr.splice(-1, 1);
    dirPath = dirPathArr.join('/') + '/';
  }

  return dirPath;
};
