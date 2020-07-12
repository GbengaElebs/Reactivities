import React, {Fragment, useContext, useEffect } from "react";
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
import LoginForm from '../../features/user/LoginForm';
import { RootStoreContext } from '../stores/rootStore';
import { LoadingComponent } from './LoadingComponent';
import  ModalContainer  from '../common/modals/ModalContainer';

// interface IState {
//   activities: IActivity[]////activity array is assigned to activites  and also IState
// }

const App: React.FC<RouteComponentProps> = ({location}) => {
  const rootStore = useContext(RootStoreContext);
  const {setAppLoaded, token, appLoaded} = rootStore.commonStore;
  const {getUser} = rootStore.userStore;

  useEffect(() => {
    if(token) {
      getUser().finally(() => setAppLoaded())
    } else {
      setAppLoaded()
    }
  }, [getUser, setAppLoaded, token])

if (!appLoaded) return <LoadingComponent content='Loading app....'/>

  return (
    <Fragment>
      <ModalContainer/>
       <ToastContainer position='bottom-right'/>
        <Route exact path="/" component={HomePage} />
        <Route path={'/(.+)'} render={() => (
       <Fragment>
          <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <Switch>
        {/* <Switch /> component will only render the first route that matches/includes the path. Once it finds the first route that matches the path, it will not look for any other matches. Not only that, it allows for nested routes to work properly, which is something that <Router /> will not be able to handle */}
        <Route exact path="/activities" component={ActivityDashboard} />
        <Route exact path="/activities/:id" component={ActivityDetails} />
        <Route
          key={location.key}
          path={["/createActivity", "/manage/:id"]}
          component={ActivityForm}
        />
        <Route path='/login' component={LoginForm}/>
        <Route component={NotFound}/>
        </Switch>
      </Container>
       </Fragment>
  )}/>
    </Fragment>
  );
};

export default withRouter(observer(App));
