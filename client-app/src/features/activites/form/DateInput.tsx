import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label } from "semantic-ui-react";
import {DateTimePicker} from 'react-widgets';

interface IProps extends FieldRenderProps<Date, HTMLElement>, FormFieldProps {id?: string | undefined}

export const DateInput: React.FC<IProps> = ({
  input,
  width,
  type,
  date=false,
  time = false,
  placeholder,
  meta: { touched, error },
  ...rest
}) => {
  return (
    <Form.Field error={touched && !!error} type={type} width={width}>
        <DateTimePicker
        placeholder = {placeholder}
        value={input.value || null}
        onChange = {input.onChange}
        onBlur ={input.onBlur}
        ////event that fires when a user loses focus or does not do something
        onKeyDown = {(e) => e.preventDefault()}
        date={date}
        time={time}
        {...rest}
        />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};
