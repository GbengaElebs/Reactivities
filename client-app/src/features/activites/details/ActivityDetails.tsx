import React, { useContext, useEffect } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActitvityDetailChat  from "./ActitvityDetailChat";
import ActivityDetailSidebar  from "./ActivityDetailSidebar";
import { RootStoreContext } from '../../../app/stores/rootStore';

interface DetailParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    selectedActivity: activity,
    loadActivity,
    loadingInitial,
  } = rootStore.activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  },[loadActivity, match.params.id]);

  if (loadingInitial || !activity)
    return <LoadingComponent content="loading activity..." />;
  if(!activity)
    return <h2>Not Found</h2>

  return (
    <Grid>
      <GridColumn width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActitvityDetailChat />
      </GridColumn>
      <GridColumn width={6}>
        <ActivityDetailSidebar attendees={activity.attendees}/>
      </GridColumn>
    </Grid>
  );
};

export default observer(ActivityDetails);
