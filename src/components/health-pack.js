import React from 'react';

export default ({left, top}) => {
  const styles = {
    left,
    top
  };
  return (
    <div className='health-pack' style={styles}></div>
  );
}
