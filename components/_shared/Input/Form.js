import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';

const Form = ({
  children,
  schema,
  defaultValues = {},
  onSubmit,
  onChange,
  watcher,
  setWatcher,
  className = '',
}) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues,
    shouldFocusError: true,
  });

  const state = methods.watch();

  useEffect(() => {
    if (watcher) setWatcher(state[watcher]);
  }, [watcher, state]);

  useEffect(() => {
    if (typeof onChange !== 'undefined') onChange(state);
  }, [state, onChange]);

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={methods.handleSubmit(onSubmit)}
        className={className}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
