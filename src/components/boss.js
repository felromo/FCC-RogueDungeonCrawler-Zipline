import React from 'react';

export default ({left, top}) => {
  const styles = {
    left,
    top
  };
  return (
    <div className='boss' style={styles}></div>
  );
}
