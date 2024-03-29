import React from 'react';

import PropType from 'prop-types';

const DisplayError = ({ error }) => {
  return (
    <div className="error" style={{ visibility: error ? '' : 'hidden' }}>
      {error}
    </div>
  );
};

export default DisplayError;
DisplayError.propTypes = {
  error: PropType.string,
};
