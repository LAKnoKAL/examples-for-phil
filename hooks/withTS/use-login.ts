import { SubmitHandler, useForm } from 'react-hook-form';

import { useAsync } from 'hooks/use-async';
import { login } from 'services/auth';

type FormInputs = {
  email: string;
  password: string;
};

interface Props {
  redirectTo?: string;
}

export function useLogin({ redirectTo }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<FormInputs>();

  const { error, status, isLoading, isError, run, isSuccess } = useAsync();

  const onSubmit: SubmitHandler<FormInputs> = ({ email, password }) => {
    const caseInsensitiveEmail = email.toLowerCase().trim();
    run(
      login({
        email: caseInsensitiveEmail,
        password,
        redirectTo,
      })
    );
  };

  return {
    handleSubmit: handleSubmit(onSubmit),
    register,
    formErrors,
    isError,
    error,
    status,
    isLoading,
    isSuccess,
  };
}
