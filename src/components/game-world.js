import React, { Component } from 'react';
import Player from './player';
import Enemy from './enemy';
import Boss from './boss';
import WeaponCrate from './weapon-crate';
import HealthPack from './health-pack';
import $ from 'jquery';

export default class GameWorld extends Component {

  constructor(props) {
    super(props);
    this.enemyConstructor = this.enemyConstructor.bind(this);
    this.bossConstructor = this.bossConstructor.bind(this);
    this.weaponCrateConstructor = this.weaponCrateConstructor.bind(this);
    this.healthPackConstructor = this.healthPackConstructor.bind(this);

  }

  randomPlaceHolder(nextProps) {
    const {fog_of_war} = nextProps;
    if (fog_of_war) {
      console.info(fog_of_war.locationX, fog_of_war.locationY);
    }
    /*
    var pX = ev.pageX;
    var pY = ev.pageY;

    var radGrd = this.ctx.createRadialGradient(pX, pY, this.r1, pX, pY, this.r2);
    radGrd.addColorStop(0, 'rgba(0, 0, 0, 1)');
    radGrd.addColorStop(this.density, 'rgba(0, 0, 0, .1)');
    radGrd.addColorStop(0, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = radGrd;
    this.ctx.fillRect(pX - this.r2, pY - this.r2, this.r2*2, this.r2*2); */
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

  healthPackConstructor() {
    const {health_packs} = this.props;
    if(!health_packs) return [];
    return (
      health_packs.map(({col, row}, index) => {
        return <HealthPack key={index} left={col} top={row} />;
      })
    );
  }


  render() {
    const enemies = this.enemyConstructor();
    const boss = this.bossConstructor();
    const weapon_crate = this.weaponCrateConstructor();
    const health_packs = this.healthPackConstructor();
    const should_display = this.props.game_over.yes;
    return (
      <div className="game-container" >
        <canvas width="800" height="400"></canvas>
        <canvas width="800" height="400"></canvas>
        <canvas width="800" height="400"></canvas>
        <div className="area-great-hall"></div>
        <div className="area-sleeping-quarters"></div>
        <div className="area-barracks"></div>
        <div className="area-kings-room"></div>
        <div className="bridge-1"></div>
        <div className="bridge-2"></div>
        <Player />
        {enemies}
        {boss}
        {weapon_crate}
        {health_packs}
        <div className={`outcome-section ${should_display ? 'outcome-section-show' : ''}`}>
          <p className={this.props.game_over.won ? 'win-message' : 'lose-message'}>
            You {this.props.game_over.won ? 'Win' : 'Died'}!
          </p>
        </div>
      </div>
    );
  }
}
