import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { IActivity } from "../Model/activity";
import agent from "../api/agent";
import { history } from "../..";
import { RootStore } from "./rootStore";
import { setActivityProps, createAttendee } from "../common/util/util";
import { toast } from "react-toastify";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();
  @observable selectedActivity: IActivity | null | undefined = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";
  @observable loading = false;
  @observable.ref hubConnection: HubConnection | null = null;

  @action createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/chat", {
        accessTokenFactory: () => this.rootStore.commonStore.token!,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection!.state))
      .then(() => {
        console.log("Attempting to join the party");
        if (this.hubConnection!.state === "Connected")
          this.hubConnection?.invoke("AddToGroup", activityId);
      })
      .catch((error) => console.log("Error establishing connection", error));

    this.hubConnection.on("ReceiveComment", (comment) => {
      runInAction(() => {
        this.selectedActivity!.comments.push(comment);
      });
    });

    this.hubConnection.on("Send", (message) => {
      toast.info(message);
    });
  };

  @action stopHubConnection = () => {
    this.hubConnection!.invoke("RemoveFromGroup", this.selectedActivity!.id)
      .then(() => {
        this.hubConnection!.stop();
      })
      .then(() => console.log("Connection stopped"))
      .catch((err) => console.log(err));
  };

  @action addComment = async (values: any) => {
    values.activityId = this.selectedActivity?.id;
    try {
      await this.hubConnection!.invoke("SendComment", values);
    } catch (error) {
      console.log(error);
    }
  };

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values()) ////converts the activity registry to an array
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
          setActivityProps(activity, this.rootStore.userStore.user!);
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
          setActivityProps(activity, this.rootStore.userStore.user!);
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
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.comments = [];
      ////for this activity the first attendee will be the person that created the activity
      activity.isHost = true;
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

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity) {
          this.selectedActivity.attendees.push(attendee);
          this.selectedActivity.isGoing = true;
          this.activityRegistry.set(
            this.selectedActivity.id,
            this.selectedActivity
          );
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        toast.error("Problem signing up to activity");
      });
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity) {
          this.selectedActivity.attendees = this.selectedActivity.attendees.filter(
            (a) => a.userName !== this.rootStore.userStore.user!.userName
          );
          this.selectedActivity.isGoing = false;
          this.activityRegistry.set(
            this.selectedActivity.id,
            this.selectedActivity
          );
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        toast.error("Problem cancelling activity");
      });
    }
  };
}

// export default createContext(new ActivityStore());
