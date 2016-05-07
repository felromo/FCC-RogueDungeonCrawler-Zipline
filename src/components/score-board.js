import React from 'react';

export default ({health, level, weapon}) => {
  return (
    <div className="score-board-container">
      <ul className="player-information">
        <li>Health: {health}</li>
        <li>Level: {level}</li>
        <li>Weapon: {weapon}</li>
      </ul>
    </div>
  );
}
