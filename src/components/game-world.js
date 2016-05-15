import React, { Component } from 'react';
import Player from './player';
import Enemy from './enemy';
import Boss from './boss';

export default class GameWorld extends Component {

  constructor(props) {
    super(props);
    this.enemyConstructor = this.enemyConstructor.bind(this);
  }

  enemyConstructor() {
    const {enemies} = this.props;
    if (!enemies) return [];
    /* console.table(enemies); */
    return (
      enemies.map(({col, row, hp}, index) => {
        return <Enemy key={index} left={col} top={row} hp={hp}/>;
      })
    );
  }

  bossConstructor() {
    const {boss} = this.props;
    if(!boss) return [];
    return (
      <Boss left={boss.col} top={boss.row} hp={boss.hp}/>
    );
  }


  render() {
    const enemies = this.enemyConstructor();
    const boss = this.bossConstructor();
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
        {
          enemies
        }
        {
          boss
        }
      </div>
    );
  }
}
