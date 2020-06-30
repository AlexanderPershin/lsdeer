const dirToLs = (inp) => {
  inp.splice(0, 5);
  inp.splice(-2, 2);

  const parsed = inp.map((item) => {
    const splittedItem = item.split(' ').filter((i) => i);
    const nameItem = [...splittedItem].splice(3, item.length - 1).join(' ');
    if (splittedItem[2] === '<DIR>') {
      // It's a folder
      return nameItem.replace('\r', '/');
    } else {
      return nameItem.replace('\r', '');
    }
  });
  return parsed;
};

module.exports = dirToLs;
