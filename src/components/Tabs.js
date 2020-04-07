import React from 'react';
import Tab from './Tab';

const Tabs = ({ list }) => {
  const renderTabs = () => {
    return list.map((item) => <Tab key={item.id} name={item.name} />);
  };

  return <div>{renderTabs()}</div>;
};

Tabs.defaultProps = {
  list: [],
};

export default Tabs;
