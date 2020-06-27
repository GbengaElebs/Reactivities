import React, {useEffect, Fragment, useContext } from "react";
import {Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import { LoadingComponent } from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import {observer} from 'mobx-react-lite';
import ActivityDashboard from '../../features/activites/dashboard/ActivityDashboard';

// interface IState {
//   activities: IActivity[]////activity array is assigned to activites  and also IState
// }

const App = () => {

  const activityStore = useContext(ActivityStore);
  useEffect(() => {
    activityStore.loadActivites();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content='Getting Activities....'/>

  return (
    <Fragment>
      <NavBar/>
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
        />
      </Container>
    </Fragment>
  );
};

export default observer(App);
