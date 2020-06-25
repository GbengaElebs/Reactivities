import React, { useState, useEffect, Fragment } from "react";
import {Container } from "semantic-ui-react";
import axios from "axios";
import { IActivity } from "../Model/activity";
import NavBar from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activites/dashboard/ActivityDashboard";

// interface IState {
//   activities: IActivity[]////activity array is assigned to activites  and also IState
// }

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>();

  const [editMode, setEditMode] = useState(false);

  const handleSelectectedActivity = (id: string) => {
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm =() => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity= (activity : IActivity) =>{
 setActivities([...activities, activity])
 setSelectedActivity(activity);
 setEditMode(false);

 ////spread the activities array place it by the right and add  the new  activity to the arrary
 ///as it changes
  };

  const handleeditActivity= (activity : IActivity) =>{
    setActivities([...activities.filter(a => a.id !== activity.id), activity])
    setSelectedActivity(activity);
 setEditMode(false);
  };

  const handledeleteActivity= (id : string) =>{
    setActivities([...activities.filter(a => a.id !== id)])

  };

  ////setActivities---name of the action
  ////useState---enables the action to be used to change state
  /////activities---name of the activity
  ////Hooks are simply functions that allow us to manage state,
  ///utilize the React lifecycle, and connect to the React
  ///internals such as context. Hooks are imported from the react library and can only be used in function components:

  useEffect(() => {
    axios
      .get<IActivity[]>("http://localhost:5000/api/activities") ////returning type IACtivity
      .then(response => {
        let activities : IActivity[] =[];
        response.data.forEach(activity => {
          activity.dateTime = activity.dateTime.split('.')[0];
          activities.push(activity);
        })
        setActivities(activities);
      });
  }, []);
  ////name of the activity and the action then you set it to be equal to useState of type activity

  // readonly state: IState= {/////everything in the state must be of type IState which is also of type IActivity which is an arrary
  //   activities: []
  // }
  // componentDidMount() {
  //   axios.get<IActivity[]>('http://localhost:5000/api/activities')////returning type IACtivity
  //       .then((response) => (
  //         this.setState({
  //           activities: response.data
  //         })
  //       ))
  // this.setState({
  //   values: [{id:1, name:'Value 101'},{id:2, name:'Value 102'}]
  // })////we are setting the state of the values in side state function once the page is loaded or triggered
  // }
  // render() {
  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm}/>
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectectedActivity}
          selectedActivity= {selectedActivity!}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleeditActivity}
          deleteActivity={handledeleteActivity}
        />
      </Container>
    </Fragment>
  );
};

export default App;
