import React, { useContext, Fragment } from "react";
import { Item, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivitityListItem from "./ActivitityListItem";
import { RootStoreContext } from '../../../app/stores/rootStore';
import {format} from 'date-fns';

const ActivityList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { activitiesByDate } = rootStore.activityStore;

  return (
    <Fragment>
      {activitiesByDate.map(([group, activites]) => (
        <Fragment key={group}>
          <Label size="large" color="blue">
            {format(Date.parse(group), 'eeee do MMMM')}
          </Label>
            <Item.Group divided>
              {activites.map((activity) => (
                <ActivitityListItem key={activity.id} activity={activity} />
              ))}
            </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
