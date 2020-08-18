import React, { useState, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Tab, Grid, Header, Button, Segment, Form } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { TextInput } from "../../app/common/form/TextInput";
import { TextAreaInput } from "../../app/common/form/TextAreaInput";
import { Form as FinalForm, Field } from "react-final-form";
import { IProfile, EditProfileValues } from "../../app/Model/profile";
import { combineValidators, isRequired } from "revalidate";

const validate = combineValidators({
  displayName: isRequired({ message: "Display Name is Required" }),
});

const ProfileAbout: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    editProfile,
    isUpdating,
  } = rootStore.profileStore;
  const [editProfileMode, setNewProfile] = useState(false);
  const [userprofile, setProfile] = useState(new EditProfileValues());


  const editUserProfile = (profile: IProfile) => {
    editProfile(profile).then(() => setNewProfile(false));
  };


  useEffect(() => {
    setProfile(new EditProfileValues(profile!))
    
  }, [setProfile,profile]);

  const handleditUserProfile = (prof: IProfile) => {
    const { displayName, bio } = prof;
    if (userprofile) {
        userprofile.displayName = displayName;
        userprofile.bio = bio;
      ////destructure values and remove all the properties in the values object minus the date and time {
      editUserProfile(prof);
    }
  };
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header icon="user" content={userprofile?.displayName} />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editProfileMode ? "Cancel" : "Edit Profile"}
              onClick={() => setNewProfile(!editProfileMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {isCurrentUser && editProfileMode ? (
            <Segment clearing>
              <FinalForm
                validate={validate}
                initialValues={userprofile!}
                onSubmit={handleditUserProfile}
                render={({ handleSubmit, invalid, pristine }) => (
                  <Form onSubmit={handleSubmit} loading={isUpdating}>
                    <Field
                      name="displayName"
                      placeholder="DisplayName"
                      value={userprofile?.displayName}
                      component={TextInput}
                    />
                    <Field
                      name="bio"
                      placeholder="Biography"
                      rows={3}
                      value={userprofile?.bio}
                      component={TextAreaInput}
                    />
                    <Button
                      disabled={isUpdating || invalid || pristine}
                      loading={isUpdating}
                      positive
                      floated="right"
                      type="submit"
                      content="Update Profile"
                    />
                  </Form>
                )}
              />
            </Segment>
          ) : (
            <div>{userprofile?.bio}</div>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileAbout);
