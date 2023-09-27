import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import FormTextField from './FormTextField';

const FormInput = ({ name, ...rest }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <FormTextField {...rest} {...field} error={error} />
      )}
    />
  );
};

export default FormInput;
