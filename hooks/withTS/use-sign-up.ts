import { useAsync } from 'hooks/use-async';
import { signUp, resendRegistrationLink } from 'services/auth';
import { SignUpAttributes } from 'services/auth/types';

interface Params {
  email: string;
  password: string;
  attributes: SignUpAttributes;
  onSuccess?: () => void;
}

/**
 * Custom hook for handling sign up logic.
 * This hook uses the `useAsync` hook to handle asynchronous operations.
 *
 * @returns An object with properties and functions related to sign up functionality.
 */

export function useSignUp() {
  // Using the useAsync hook to handle the asynchronous logic
  const { error, status, isLoading, isError, run, isSuccess } = useAsync();

  /**
   * Register a user with the provided email, password, and attributes.
   *
   * @param email - The email of the user to register.
   * @param password - The password of the user to register.
   * @param attributes - Additional attributes for the user registration.
   * @param onSuccess - Optional callback function to be called upon successful registration.
   */
  const register = async ({
    email,
    password,
    attributes,
    onSuccess = () => {},
  }: Params) => {
    try {
      await run(signUp(email, password, attributes, onSuccess));
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * Re-send email verification letter at provided email.
   *
   * @param email - registered user email.
   */
  const resendRegistration = async (email: string) => {
    try {
      await run(resendRegistrationLink(email));
    } catch (e) {
      console.log(e);
    }
  };

  return {
    register,
    resendRegistration,
    isError,
    error,
    status,
    isLoading,
    isSuccess,
  };
}
