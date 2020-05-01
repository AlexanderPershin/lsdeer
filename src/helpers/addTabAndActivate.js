import { nanoid } from 'nanoid';
import { addTab } from '../actions/tabsActions';
import { setActiveTab } from '../actions/activeTabActions';
import { clearSelectedFiles } from '../actions/selectFilesActions';

// Should pass dispatch = useDispatch()

const addTabAndActivate = (dispatch) => {
  const newTab = {
    id: nanoid(),
    name: 'New',
    content: [],
    createNew: true,
    path: '/',
  };
  dispatch(clearSelectedFiles());
  dispatch(addTab(newTab));
  dispatch(setActiveTab(newTab.id));
};

export default addTabAndActivate;
