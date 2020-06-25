//rafc
import React, { SyntheticEvent } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import { IActivity } from "../../../app/Model/activity";
import { ActivityList } from "./ActivityList";
import { ActivityDetails } from "../details/ActivityDetails";
import { ActivityForm } from "../form/ActivityForm";

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  selectedActivity: IActivity | null;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (activity: IActivity | null) => void;
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
  deleteActivity: (event: SyntheticEvent<HTMLButtonElement>,id: string) => void;
  submitting : boolean
  target: string

}

export const ActivityDashboard: React.FC<IProps> = ({
  activities,
  selectActivity,
  selectedActivity,
  editMode,
  setEditMode,
  setSelectedActivity,
  createActivity,
  editActivity,
  deleteActivity,
  submitting,
  target
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
          target={target}
          deleteActivity={deleteActivity}
          submitting={submitting}
        />
      </Grid.Column>
      <GridColumn width={6}>
        {selectedActivity && !editMode && (
          <ActivityDetails
            activity={selectedActivity}
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}
          />
        )}
        {editMode && (
          <ActivityForm
            //key={selectedActivity && selectedActivity.id || 0}
            key={selectedActivity?.id}
            setEditMode={setEditMode}
            activity={selectedActivity!}
            editActivity={editActivity}
            createActivity={createActivity}
            submitting={submitting}
          />
        )}
      </GridColumn>
    </Grid>
  );
};
