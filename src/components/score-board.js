import React from 'react';

export default ({health, level, weapon, exp}) => {
  return (
    <div className="score-board-container">
      <ul className="player-information">
        <li>Health: {health}</li>
        <li>Level: {level}</li>
        <li>Exp: {exp}</li>
        <li>Weapon: {weapon.type}</li>
      </ul>
    </div>
  );
}
