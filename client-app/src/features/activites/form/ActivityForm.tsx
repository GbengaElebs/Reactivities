import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid, FormGroup } from "semantic-ui-react";
import {
  ActivityFormValues,
} from "../../../app/Model/activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import { TextInput } from "../../../app/common/form/TextInput";
import { TextAreaInput } from "../../../app/common/form/TextAreaInput";
import { SelectInput } from "../../../app/common/form/SelectInput";
import { category } from "../../../app/common/options/categoryOptions";
import { DateInput } from "./DateInput";
import { combineDateAndTime } from "../../../app/common/util/util";
import {combineValidators, isRequired, composeValidators, hasLengthGreaterThan} from 'revalidate';

const validate = combineValidators({
  title: isRequired({message:'The event Title is Required'}),
  category: isRequired('Category'),
  description: composeValidators (
    isRequired('Description is Required'),
    hasLengthGreaterThan(4)({message: 'Description must be at greater then 4'})
  )(),

  venue: isRequired('Venue'),
  city: isRequired('City'),
  dateTime: isRequired('Date is Required'),
  time : isRequired('Time is Required')
});

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    editActivity,
    submitting,
    loadActivity,
    createActivity,
  } = activityStore;
  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then((activity) => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);

  // const handleInputChange = (
  //   event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = event.currentTarget;
  //   setActivity({ ...activity, [name]: value });
  //   ///spread the activity into a new object by the right
  // };
  // const handleSubmit = () => {
  //   if (activity.id.length === 0) {
  //     let newActivity = {
  //       ...activity,
  //       id: uuid(),
  //     };
  //     createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
  //   } else {
  //     editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
  //   }
  // };

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.dateTime, values.time);
    const { dateTime, time, ...activity } = values;
    ////destructure values and remove all the properties in the values object minus the date and time
    activity.dateTime = dateAndTime;
    console.log(values);
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };
  ////spread the activity object to access its values and then append the name{object} in the activity and then replace the stuff the person is typing
  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine}) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  name="description"
                  placeholder="Description"
                  rows={3}
                  value={activity.description}
                  component={TextAreaInput}
                />
                <Field
                  placeholder="Category"
                  name="category"
                  value={activity.category}
                  component={SelectInput}
                  options={category}
                />
                <FormGroup widths="equal">
                  <Field
                    type="datetime-local"
                    placeholder="Date"
                    name="dateTime"
                    date={true}
                    value={activity.dateTime}
                    component={DateInput}
                  />
                  <Field
                    type="datetime-local"
                    placeholder="Time"
                    name="time"
                    time={true}
                    value={activity.dateTime}
                    component={DateInput}
                  />
                </FormGroup>

                <Field
                  placeholder="City"
                  name="city"
                  value={activity.city}
                  component={TextInput}
                />
                <Field
                  placeholder="Venue"
                  name="venue"
                  value={activity.venue}
                  component={TextInput}
                />
                <Button
                  loading={submitting}
                  disabled={loading || invalid || pristine} 
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
                <Button
                  onClick={activity.id ? () =>  history.push(`/activities/${activity.id}`) :() => history.push("/activities")}
                  disabled={loading}
                  floated="right"
                  type="button"
                  content="Cancel"
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
