import { observable, action, computed,configure, runInAction} from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../Model/activity";
import agent from "../api/agent";

configure({ enforceActions: 'always'});

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | null | undefined = null;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.dateTime) - Date.parse(b.dateTime)
    );
  }

  @action loadActivites = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list()
      runInAction('loading activities',() => {
        activities.forEach((activity) => {
          activity.dateTime = activity.dateTime.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      })
    } catch (error) {
      runInAction('loading activities error',() => {
        this.loadingInitial = false;
      })
      console.log(error);
    }
  };
  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('Create activities',() => {
        this.activityRegistry.set(activity.id, activity);
      this.editMode = false;
      this.submitting = false;
      })     
    } catch (error) {
      runInAction('Create activities Error',() => {
        this.submitting = false;
      })
      console.log(error);
    }
  };

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction('edit Actitivty',() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      })
    } catch (error) {
      runInAction('edit Actitivty error',() =>{
        this.submitting = false;
      })
      console.log(error);
    }
  };
  @action opeEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode= true;
  }

  @action cancelSelectedActivity =() => {
    this.selectedActivity = undefined;
  }

  @action cancelFormOpen =() => {
    this.editMode = false;
  }

  @action deleteActivity =async (event: SyntheticEvent<HTMLButtonElement> , id : string) => {
    this.submitting = true;
    this.setTarget(event);
    try {
      //const iddelete = this.activityRegistry.get(id);
      await agent.Activities.delete(id);
      runInAction('delete Actitivity',() => {
        this.activityRegistry.delete(id);
        this.editMode = false;
        this.submitting = false;
      })
    } catch (error) {
      runInAction('delete Actitivity error',() => {
        this.target='';
        this.submitting = false;
      })
      console.log(error);
    }
  }
  @action setTarget= (event: SyntheticEvent<HTMLButtonElement> ) => {
    this.target= event.currentTarget.name;
  }


}

export default createContext(new ActivityStore());
