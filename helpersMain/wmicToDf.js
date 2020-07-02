var bytes = require('bytes');

const wmicToDf = (inp) => {
  if (!inp) return [];
  const inpArr = inp.split('\n');
  let inpArrOfStrings = [];
  inpArrOfStrings = inpArr.map((item, index) => {
    if (index === 0) return;
    const itemArr = item
      .split(' ')
      .filter((itm) => itm !== '' && itm !== '\r\r');
    const letter = itemArr[0];
    const free = parseInt(itemArr[1]);
    const size_init = parseInt(itemArr[2]);
    // Remove \r\r file ending on windows
    itemArr.splice(itemArr.length - 1, 1);
    if (letter && (free || free === 0) && size_init) {
      const filesystem = letter;
      const size = bytes(size_init, { decimalPlaces: 0 });
      const used = bytes(size_init - free, { decimalPlaces: 0 });
      const avail = bytes(free, { decimalPlaces: 0 });
      const use =
        Number(((size_init - free) / size_init) * 100).toFixed(0) + '%';
      const mounted = letter + '/';
      return `${filesystem} ${size} ${used} ${avail} ${use} ${mounted} `;
    }
  });

  inpArrOfStrings = inpArrOfStrings.filter((i) => i);
  inpArrOfStrings.unshift('Filesystem Size Used Avail Use% Mounted on');
  const unitedString = inpArrOfStrings.join('\n');

  return unitedString;
};

module.exports = wmicToDf;
