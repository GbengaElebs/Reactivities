import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/Model/activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    editActivity,
    submitting,
    selectedActivity: initialFormState,
    loadActivity,
    clearSelectedActivity,
    createActivity
  } = activityStore;
  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    dateTime: "",
    city: "",
    venue: "",
  });
  useEffect(() => {
    if (match.params.id && activity.id.length ===0) {
      loadActivity(match.params.id).then(
        () => initialFormState && setActivity(initialFormState)
      );
    }
    return () => {
      clearSelectedActivity();
    }
  },[loadActivity,clearSelectedActivity,match.params.id,initialFormState,activity.id.length]);

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
    ///spread the activity into a new object by the right
  };
  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
    } else {
      editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
    }
  };
  ////spread the activity object to access its values and then append the name{object} in the activity and then replace the stuff the person is typing
  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          onChange={handleInputChange}
          name="title"
          placeholder="Title"
          value={activity.title}
        />
        <Form.TextArea
          rows={2}
          onChange={handleInputChange}
          name="description"
          placeholder="Description"
          value={activity.description}
        />
        <Form.Input
          placeholder="Category"
          onChange={handleInputChange}
          name="category"
          value={activity.category}
        />
        <Form.Input
          type="datetime-local"
          placeholder="Date"
          onChange={handleInputChange}
          name="dateTime"
          value={activity.dateTime}
        />
        <Form.Input
          placeholder="City"
          onChange={handleInputChange}
          name="city"
          value={activity.city}
        />
        <Form.Input
          placeholder="Venue"
          onChange={handleInputChange}
          name="venue"
          value={activity.venue}
        />
        <Button
          loading={submitting}
          floated="right"
          positive
          type="submit"
          content="Submit"
        />
        <Button
          onClick={() => history.push('/activities')}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
