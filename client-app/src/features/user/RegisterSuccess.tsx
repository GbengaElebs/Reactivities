import React from "react";
import { RouteComponentProps } from "react-router-dom";
import queryString from "query-string";
import { Segment, Header, Icon, Button } from "semantic-ui-react";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";

const RegisterSuccess: React.FC<RouteComponentProps> = ({ location }) => {
  const { email } = queryString.parse(location.search);

  const handleConfirmEmailResend = () => {
    agent.User.resendVerifyEmail(email as string)
      .then(() => {
        toast.success("Please check your email for the verification link");
      })
      .catch((error) => console.log(error));
  };
  return (
    <Segment>
      <Header>
        <Icon name="check" />
        Successfully Registered!
      </Header>
      <Segment.Inline>
        <div>
          <p>Please check your email for the verfication email</p>
          {email && (
            <>
              <p>Resend Email?</p>
              <Button
                onClick={handleConfirmEmailResend}
                primary
                content="Resend Email"
                size="huge"
              />
            </>
          )}
        </div>
      </Segment.Inline>
    </Segment>
  );
};

export default RegisterSuccess;
