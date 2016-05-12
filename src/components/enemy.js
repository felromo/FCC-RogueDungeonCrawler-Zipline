import React from 'react';

export default ({left, top}) => {
  const styles = {
    left,
    top
  };
  return (
    <div className='enemy' style={styles}></div>
  );
}
