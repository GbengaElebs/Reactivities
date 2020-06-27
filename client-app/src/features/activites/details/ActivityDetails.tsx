import React, { useContext } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import ActivityStore from '../../../app/stores/activityStore';
import {observer} from 'mobx-react-lite';



const ActivityDetails: React.FC = ({
}) => {
  const activityStore=  useContext(ActivityStore);
  const {selectedActivity: activity, opeEditForm, cancelSelectedActivity} = activityStore

  return (
    <Card>
      <Image
        src={`/assets/categoryImages/${activity!.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span className="date">{activity!.dateTime}</span>
        </Card.Meta>
        <Card.Description>{activity!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            basic
            content="Edit"
            color="blue"
            onClick={() => opeEditForm(activity?.id!)}
          />
          <Button onClick={() => cancelSelectedActivity()} basic content="Cancel" color="grey" />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetails);
