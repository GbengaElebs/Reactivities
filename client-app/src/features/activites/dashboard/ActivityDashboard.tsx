//rafc
import React, { useEffect, useContext } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import  ActivityList  from "./ActivityList";
import {observer} from 'mobx-react-lite';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';


const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {loadActivites,loadingInitial}= rootStore.activityStore;

  useEffect(() => {
    loadActivites();
  }, [loadActivites]);

  if (loadingInitial)
    return <LoadingComponent content="Getting Activities...." />;
    
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
        />
      </Grid.Column>
      <GridColumn width={6}>
        <h2>Activity Filters</h2>
      </GridColumn>
    </Grid>
  );
};


export default observer(ActivityDashboard);