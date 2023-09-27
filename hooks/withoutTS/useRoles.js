import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { toastMessage } from '../components/_shared';

import dashboardApi from '../services/dashboard';
import { makeSelectUserCommunityId } from '../store/selectors';

const useRoles = (props = {}) => {
  const filterFn = useMemo(
    () => (props.filterFn ? props.filterFn : () => true),
    [props]
  );

  const communityId = useSelector(makeSelectUserCommunityId());

  const [rolesList, setRolesList] = useState([]);
  const [rolesLimit, setRolesLimit] = useState(null);
  const [isRolesLoading, setIsRolesLoading] = useState(false);

  useEffect(() => {
    const getRolesList = async () => {
      setIsRolesLoading(true);

      try {
        const { roles, limit } = await dashboardApi.getRolesList({
          communityId,
        });
        setRolesList(
          roles.filter(filterFn).map((role) => {
            const permissionsNames = role?.permissions?.map((p) => p.name);
            return {
              ...role,
              isAdminRole: permissionsNames.includes('admin'),
              isModerRole: permissionsNames.includes('moderator'),
            };
          })
        );
        setRolesLimit(limit);
      } catch (err) {
        console.log(err);
        toastMessage.error('Something went wrong, please try again.');
      } finally {
        setIsRolesLoading(false);
      }
    };

    getRolesList();
  }, [communityId]);

  return {
    rolesList,
    rolesLimit,
    isRolesLoading,
    setRolesList,
    setRolesLimit,
  };
};

export default useRoles;
