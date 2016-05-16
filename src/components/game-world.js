import React, { Component } from 'react';
import Player from './player';
import Enemy from './enemy';
import Boss from './boss';
import WeaponCrate from './weapon-crate';

export default class GameWorld extends Component {

  constructor(props) {
    super(props);
    this.enemyConstructor = this.enemyConstructor.bind(this);
    this.bossConstructor = this.bossConstructor.bind(this);
    this.weaponCrateConstructor = this.weaponCrateConstructor.bind(this);
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

  weaponCrateConstructor() {
    const {weapon_crate} = this.props;
    if(!weapon_crate) return [];
    return (
      <WeaponCrate left={weapon_crate.col} top={weapon_crate.row} />
    );
  }


  render() {
    const enemies = this.enemyConstructor();
    const boss = this.bossConstructor();
    const weapon_crate = this.weaponCrateConstructor();
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
        {enemies}
        {boss}
        {weapon_crate}
      </div>
    );
  }
}
