import React, { Component } from 'react';
/* import keydown from 'react-keydown'; */
import Player from './player';

export default class GameWorld extends Component {

  constructor(props) {
    super(props);
    this.state = { key: 'n/a' };
  }


  render() {
    return (
      <div className="game-container">
        <div className="area-great-hall">
        </div>
        <div className="area-sleeping-quarters"></div>
        <div className="area-barracks"></div>
        <div className="area-kings-room"></div>
        <div className="bridge-1"></div>
        <div className="bridge-2"></div>
        <Player />
      </div>
    );
  }
}

