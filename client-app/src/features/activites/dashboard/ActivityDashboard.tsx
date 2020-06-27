//rafc
import React, { useContext } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import  ActivityList  from "./ActivityList";
import ActivityDetails  from "../details/ActivityDetails";
import ActivityForm  from "../form/ActivityForm";
import {observer} from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore'


const ActivityDashboard: React.FC = ({
}) => {
  const activityStore=  useContext(ActivityStore);
  const {editMode, selectedActivity} = activityStore
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
        />
      </Grid.Column>
      <GridColumn width={6}>
        {selectedActivity && !editMode && (
          <ActivityDetails
          />
        )}
        {editMode && (
          <ActivityForm
            //key={selectedActivity && selectedActivity.id || 0}
            key={selectedActivity?.id}
            activity={selectedActivity!}
          />
        )}
      </GridColumn>
    </Grid>
  );
};


export default observer(ActivityDashboard);