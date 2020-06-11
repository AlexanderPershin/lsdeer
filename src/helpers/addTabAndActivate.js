import { nanoid } from 'nanoid';
import { addTab } from '../actions/tabsActions';
import { setActiveTab } from '../actions/activeTabActions';
import { closeSearch } from '../actions/searchActions';

// Should pass dispatch = useDispatch()
// Watch the new tab path, cause '/' is bugged in chokidar

const addTabAndActivate = (dispatch) => {
  const newTab = {
    id: nanoid(),
    name: 'New',
    content: [],
    createNew: true,
    path: 'new-tab-path',
  };

  dispatch(closeSearch());
  dispatch(addTab(newTab));
  dispatch(setActiveTab(newTab.id));
};

export default addTabAndActivate;
