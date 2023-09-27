import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import profileAPI from '../services/profile';
import { makeSelectCommunityId } from '../store/selectors';

const useRankings = () => {
  const communityId = useSelector(makeSelectCommunityId());

  const [isRankingsLoading, setIsRankingsLoading] = useState(true);
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const getRankings = async () => {
      setIsRankingsLoading(true);

      try {
        const data = await profileAPI.fetchLevelRankings({
          communityId,
        });
        setRankings(data);
      } catch (err) {
        console.error('Error during fetching level rankings.');
      } finally {
        setIsRankingsLoading(false);
      }
    };

    getRankings();
  }, [communityId]);

  return {
    rankings,
    isRankingsLoading,
  };
};

export default useRankings;
