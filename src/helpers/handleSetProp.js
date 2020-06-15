import { changeSetting } from '../actions/settingsActions';

const handleSetProp = (e, settingGroupKey, settingKey, newVal, dispatch) => {
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

  dispatch(changeSetting(settingObj));
};

export default handleSetProp;
