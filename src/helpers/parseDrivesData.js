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
  const stage0Data = respDrivesArr
    .map((item) => item.split(' ').filter((item) => item !== ''))
    .filter((item) => item.length > 0);

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
