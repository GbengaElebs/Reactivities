import { IActivity, IAttendee } from "../../Model/activity";
import { IUser } from "../../Model/user";

export const combineDateAndTime = (date: Date, time: Date) => {
  // const timeString = time.getHours() + ":" + time.getMinutes() + ":00";

  // const year = date.getFullYear();
  // const month = date.getMonth() + 1;
  // const day = date.getDate();

  // const dateString = `${year}-${month}-${day}`;

  const dateString = date.toISOString().split('T')[0];
  const timeString = time.toISOString().split('T')[1];

  return new Date(dateString + " " + timeString);
};

export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.dateTime = new Date(activity.dateTime!);
  activity.isGoing = activity.attendees.some(
    (a) => a.userName === user?.userName
  );
  activity.isHost = activity.attendees.some(
    (a) => a.userName === user?.userName && a.isHost === true
  );

  return activity;
};

export const createAttendee = (user: IUser): IAttendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    userName: user.userName,
    image: user.image!
  };
};
