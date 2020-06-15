import { changeSetting } from '../actions/settingsActions';

const getPropAction = (e, settingGroupKey, settingKey, newVal) => {
  let settingObj;

  if (e) {
    settingObj = {
      [settingGroupKey]: {
        [settingKey]: e.target.value,
      },
    };
  } else {
    settingObj = {
      [settingGroupKey]: {
        [settingKey]: newVal,
      },
    };
  }

  return changeSetting(settingObj);
};

export default getPropAction;
