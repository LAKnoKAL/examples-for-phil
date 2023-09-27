import React, { Dispatch, useRef, useCallback, useReducer } from 'react';

import { useBrowserLayoutEffect } from 'utils/helper';

type RequestState = {
  status?: 'idle' | 'pending' | 'rejected' | 'resolved';
  error?: string | null;
  data?: Record<string, string> | null;
};

// Separate the types just to make it clear what is an action and
// what is a state in the code's logic.
type ActionTypes = RequestState;

function useSafeDispatch(dispatch: Dispatch<ActionTypes>) {
  const mounted = useRef(false);
  useBrowserLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return useCallback(
    (action: ActionTypes) => (mounted.current ? dispatch(action) : undefined),
    [dispatch]
  );
}

const defaultInitialState: RequestState = {
  status: 'idle',
  data: null,
  error: null,
};

/**
 * It monitors and provides the state of asynchronous calls.
 *
 * @param initialState Optional initial state before any call run.
 * @returns
 */
export function useAsync<T>(initialState?: RequestState) {
  const initialStateRef = useRef({
    ...defaultInitialState,
    ...initialState,
  });

  function reducer(state: RequestState, action: ActionTypes): RequestState {
    return {
      ...state,
      ...action,
    };
  }

  const [{ status, data, error }, setState] = useReducer(
    reducer,
    initialStateRef.current
  );

  const safeSetState = useSafeDispatch(setState);

  const setData = useCallback(
    (newData: T) => safeSetState({ status: 'resolved', data: newData || {} }),
    [safeSetState]
  );
  const setError = useCallback(
    (newError: string) => safeSetState({ status: 'rejected', error: newError }),
    [safeSetState]
  );
  const reset = useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState]
  );

  const run = useCallback(
    (promise: Promise<T>) => {
      if (!promise.then) {
        throw new Error(
          "The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"
        );
      }
      safeSetState({ status: 'pending' });
      return promise
        .then(promiseData => {
          safeSetState({ status: 'resolved', data: promiseData || {} });

          return promiseData;
        })
        .catch(promiseError => {
          if (promiseError instanceof Error) {
            safeSetState({ status: 'rejected', error: promiseError.message });
            return promiseError;
          }

          if (typeof promiseError === 'object' && 'message' in promiseError) {
            const e = new Error(promiseError.message);
            safeSetState({
              status: 'rejected',
              error: promiseError.message,
            });
            return e;
          }

          safeSetState({
            status: 'rejected',
            error: JSON.stringify(promiseError),
          });
          return new Error(JSON.stringify(promiseError));
        });
    },
    [safeSetState]
  );

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
}
