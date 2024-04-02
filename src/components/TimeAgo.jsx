import { useEffect, useState } from 'react';

import PropType from 'prop-types';
export const TimeAgo = ({ timestamp }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - timestamp;
      const seconds = Math.floor(elapsedTime / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      let ago = '';

      if (days > 0) {
        ago = `${days} day${days > 1 ? 's' : ''} ago`;
      } else if (hours > 0) {
        ago = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (minutes > 0) {
        ago = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else {
        ago = `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
      }

      setTimeAgo(ago);
    };

    updateTimeAgo();
    const intervalId = setInterval(updateTimeAgo, 60000);

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return timeAgo;
};

TimeAgo.propTypes = {
  timestamp: PropType.any,
};
