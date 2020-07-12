import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../Model/activity";
import agent from "../api/agent";
import { history } from "../..";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable selectedActivity: IActivity | null | undefined = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())////converts the activity registry to an array
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.dateTime!.getTime() - b.dateTime!.getTime()
    );
    return Object.entries(
      sortedActivities.reduce((activities, selectedActivity) => {
        const date = selectedActivity.dateTime!.toISOString().split("T")[0];
        //activities ={...activities,[date]:[selectedActivity]};
        activities[date] = activities[date]
          ? [...activities[date], selectedActivity]
          : [selectedActivity];
        ////if the current date is equal to a date in the array it should append it...if not form a new array.and assign it to the value...
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
    ////return a new object withe a key and the value
    ///var object= {
    ////key[spetember2019]: [Activity1],
    /////                   [Activity2]
    /////}
  }

  @action loadActivites = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("loading activities", () => {
        activities.forEach((activity) => {
          activity.dateTime = new Date(activity.dateTime!);
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("loading activities error", () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("get Activity", () => {
          activity.dateTime = new Date(activity.dateTime);
          this.selectedActivity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
          return activity;
        });
      } catch (error) {
        runInAction("getting Activity Error", () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  @action clearSelectedActivity = () => {
    this.selectedActivity = null;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("Create activities", () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("Create activities Error", () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action openCreateForm = () => {
    this.selectedActivity = undefined;
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("edit Actitivty", () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("edit Actitivty error", () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.setTarget(event);
    try {
      //const iddelete = this.activityRegistry.get(id);
      await agent.Activities.delete(id);
      runInAction("delete Actitivity", () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
      });
    } catch (error) {
      runInAction("delete Actitivity error", () => {
        this.target = "";
        this.submitting = false;
      });
      console.log(error);
    }
  };
  @action setTarget = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.target = event.currentTarget.name;
  };
}

export default createContext(new ActivityStore());
