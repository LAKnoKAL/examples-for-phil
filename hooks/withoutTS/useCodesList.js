import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectCodesData,
  selectCodesList,
  selectCodesListError,
  selectIsCodesListLoading,
} from '../store/selectors';
import { redeemCodesList } from '../store/actions/builder';

const useCodesList = () => {
  const dispatch = useDispatch();

  const codes = useSelector(selectCodesList);
  const codesData = useSelector(selectCodesData);
  const codesListError = useSelector(selectCodesListError);
  const codesListLoading = useSelector(selectIsCodesListLoading);

  const { totalAvailable = 0, startingSubscriptionPlan = {} } = codesData;

  useEffect(() => {
    if (!codes.length && !Object.keys(codesData).length) {
      dispatch(redeemCodesList());
    }
  }, [dispatch, codes, codesData]);

  return {
    codes,
    codesListError,
    codesListLoading,
    totalAvailable,
    startingSubscriptionPlan,
  };
};

export default useCodesList;
