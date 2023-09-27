import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  makeSelectProfile,
  makeSelectSubforums,
  selectUserPermissions,
} from '../store/selectors';

const usePermissions = ({ permissionNames = [], subforumId = null }) => {
  const subforums = useSelector(makeSelectSubforums());
  const userPermissions = useSelector(selectUserPermissions);

  const profile = useSelector(makeSelectProfile());
  const { accessLevel, owner } = profile || {};

  const currentSubforum = useMemo(
    () => subforums.find(({ id }) => id === subforumId),
    [subforums, subforumId]
  );

  const permissionsArray = useMemo(
    () =>
      permissionNames.map((permissionName) => {
        let isAllowed = false;

        if (
          !!currentSubforum?.permissions &&
          currentSubforum?.permissions?.length
        ) {
          isAllowed = currentSubforum?.permissions?.find(
            (perm) => perm.name === permissionName
          ).value;
        }

        if (currentSubforum?.id === -1 || !currentSubforum) {
          isAllowed = userPermissions.includes(permissionName);
        }

        // Ignoring any restrictions for admin + super-admin + owner
        if (accessLevel >= 90 || !!owner) {
          isAllowed = true;
        }

        return isAllowed;
      }),
    [permissionNames, currentSubforum, userPermissions, accessLevel, owner]
  );

  return { permissionsArray };
};

export default usePermissions;
