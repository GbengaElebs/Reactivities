import React, {Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import { observer } from "mobx-react-lite";
import ActivityDashboard from "../../features/activites/dashboard/ActivityDashboard";
import { Route, withRouter, RouteComponentProps, Switch } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activites/form/ActivityForm";
import ActivityDetails from "../../features/activites/details/ActivityDetails";
import NotFound from './NotFound';
import {ToastContainer} from 'react-toastify';

// interface IState {
//   activities: IActivity[]////activity array is assigned to activites  and also IState
// }

const App: React.FC<RouteComponentProps> = ({location}) => {
  return (
    <Fragment>
       <ToastContainer position='bottom-right'/>
        <Route exact path="/" component={HomePage} />
        <Route path={'/(.+)'} render={() => (
       <Fragment>
          <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <Switch>
        <Route exact path="/activities" component={ActivityDashboard} />
        <Route exact path="/activities/:id" component={ActivityDetails} />
        <Route
          key={location.key}
          path={["/createActivity", "/manage/:id"]}
          component={ActivityForm}
        />
        <Route component={NotFound}/>
        </Switch>
      </Container>
       </Fragment>
  )}/>
    </Fragment>
  );
};

export default withRouter(observer(App));
