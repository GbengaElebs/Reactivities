import React from "react";
import { Tab } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowings";
import { observer } from "mobx-react-lite";

const panes = [
  { menuItem: "About", render: () => <ProfileAbout /> },
  { menuItem: "Photos", render: () => <ProfilePhotos /> },
  {
    menuItem: "Activities",
    render: () => <Tab.Pane>Activities Content</Tab.Pane>,
  },
  { menuItem: "Followers", render: () => <ProfileFollowings /> },
  { menuItem: "Following", render: () => <ProfileFollowings /> },
];

interface IProps {
  setActiveTab: (activeTab: any) => void;
}

const ProfileContent: React.FC<IProps> = ({setActiveTab}) => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true, color: "teal" }}
      menuPosition="right"
      panes={panes}
      onTabChange={(e, data) => setActiveTab(data.activeIndex)}
    />
  );
};

export default observer(ProfileContent);
