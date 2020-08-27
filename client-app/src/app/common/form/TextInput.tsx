import React from "react";
import { FormFieldProps, Form, Label } from "semantic-ui-react";
import { FieldRenderProps } from "react-final-form";

interface IProps
  extends FieldRenderProps<string, HTMLElement>,
    FormFieldProps {}

export const TextInput: React.FC<IProps> = ({
  input,
  width,
  type,
  placeholder,
  meta: { touched, error }
}) => {
  return (
    <Form.Field error={touched && !!error} type={type} width={width}>
      <input {...input} placeholder={placeholder} />
      {touched && error && (
        <Label basic color="blue">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};
