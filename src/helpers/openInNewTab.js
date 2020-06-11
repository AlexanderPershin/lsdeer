import { nanoid } from 'nanoid';
import { closeSearch } from '../actions/searchActions';
import { addTab } from '../actions/tabsActions';
import { setActiveTab } from '../actions/activeTabActions';

const { ipcRenderer } = window.require('electron');

export default function (name, path, isFile, dispatch) {
  if (!isFile) {
    const newId = nanoid();

    const newTab = {
      id: newId,
      name: name,
      content: [],
      createNew: true,
      path: 'new-tab-path',
    };

    dispatch(closeSearch());
    dispatch(addTab(newTab));
    dispatch(setActiveTab(newTab.id));
    ipcRenderer.send('open-directory', newId, path, isFile);
  } else {
    ipcRenderer.send('open-directory', 'placeholderid', path, isFile);
  }
}
