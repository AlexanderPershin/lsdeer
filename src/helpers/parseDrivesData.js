const parseDrivesData = (respDrivesArr) => {
  const createDrive = (headers, dataArr) => {
    const drive = {};
    headers.map((item, i) => (drive[item] = dataArr[i]));

    if (drive.mounted === '/') {
      let driveLetter = drive.filesystem.toLowerCase().split('')[0];
      drive.mounted = `/${driveLetter}`;
    }

    return drive;
  };

  let parsedDrives = [];
  let stage0Data = respDrivesArr
    .map((item) => item.split(' ').filter((item) => item !== ''))
    .filter((item) => item.length > 0);

  // check stage0data
  stage0Data = stage0Data.map((item, index) => {
    if(item.length > 6) {
      if (index === 0) return item;
      // Git location added to output, like: C:/Program Files/Git and parsed incorrectly
      const newItem = item;
      const numRedundunt = item.length - 6;
      newItem.splice(1,numRedundunt);
      return newItem
    } else {return item}
  })

  let tableHeaders = stage0Data.shift();

  tableHeaders = tableHeaders.map((item) => {
    return item.replace(/%/g, '').toLowerCase();
  });

  parsedDrives = stage0Data.map((driveData) => {
    driveData[0] = driveData[0].slice(0, 2);
    return createDrive(tableHeaders, driveData);
  });

  return parsedDrives;
};

export default parseDrivesData;
