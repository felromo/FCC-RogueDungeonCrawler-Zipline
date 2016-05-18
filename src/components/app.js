import React, {Component} from 'react';
import $ from 'jquery';
import ScoreBoard from './score-board';
import GameWorld from './game-world';
import * as GameGrid from '../game_grid';
import '../../styles/style.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.Grid = GameGrid.createGrid();
    this.state = {
      health: 100,
      level: 1,
      exp: 0,
      weapon: {type: 'dagger', dmg: 5},
      enemies: GameGrid.generateEnemies(this.Grid),
      boss: GameGrid.generateBoss(this.Grid),
      weapon_crate: GameGrid.generateWeaponCrate(this.Grid),
      health_packs: GameGrid.generateHealthPacks(this.Grid),
      game_over: {
        yes: false,
        won: false
      }
    };
    this.player = {
      x: 10,
      y: 10
    };
    this.canEnterBattleState = true;
    this.keysPressed = {};
    this.movementRate = 1;

    this.calculateNewPosition = this.calculateNewPosition.bind(this);
    this.isAbleToMove = this.isAbleToMove.bind(this);
    this.battleMode = this.battleMode.bind(this);
    this.bossBattle = this.bossBattle.bind(this);
    this.useHealthPack = this.useHealthPack.bind(this);
    this.identifyEnemy = this.identifyEnemy.bind(this);
    this.lineOfSight = this.lineOfSight.bind(this);

    this.canvas = null;
    this.ctx = null;
    this.ctx2 = null;
    this.ctx3 = null;
    this.mDown = false;
    this.r1 = 50;
    this.r2 = 150;
    this.density = .4;
    this.hideOnMove = true;
    this.hideFill = 'rgba(0, 0, 0, 1)';
    this.overlay = 'rgba(0, 0, 0, 1)';

  }

  calculateNewPosition(oldValue, direction1, direction2) {
    return parseInt(oldValue, 10)
         - (this.keysPressed[direction1] ? this.movementRate : 0)
         + (this.keysPressed[direction2] ? this.movementRate : 0);
  }

  isAbleToMove(position) {
    // check all 4 corners of player
    const {x,y} = position;
    if (this.Grid[x][y].walkable && this.Grid[x+19][y].walkable && this.Grid[x][y+19].walkable && this.Grid[x+19][y+19].walkable){
      if (this.Grid[x][y].type == GameGrid.WEAPON || this.Grid[x+19][y].type == GameGrid.WEAPON || this.Grid[x][y+19].type == GameGrid.WEAPON || this.Grid[x+19][y+19].type == GameGrid.WEAPON) {
        // pick up the weapon
        GameGrid.generatorHelper(this.Grid, [this.state.weapon_crate.col, this.state.weapon_crate.row], true, GameGrid.FLOOR);
        this.setState({
          weapon: this.state.weapon_crate.weapon,
          weapon_crate: null
        });
        // remove the weapon from the field

      }
      if (this.Grid[x][y].type == GameGrid.HEALTH || this.Grid[x+19][y].type == GameGrid.HEALTH || this.Grid[x][y+19].type == GameGrid.HEALTH || this.Grid[x+19][y+19].type == GameGrid.HEALTH) {
        this.useHealthPack(position);
      }

      // all of the previous types are walkable so return true
      return true;
    }
    else if (this.Grid[x][y].type == GameGrid.ENEMY || this.Grid[x+19][y].type == GameGrid.ENEMY || this.Grid[x][y+19].type == GameGrid.ENEMY || this.Grid[x+19][y+19].type == GameGrid.ENEMY) {
      this.canEnterBattleState && this.battleMode(position);
    }
    else if (this.Grid[x][y].type == GameGrid.BOSS || this.Grid[x+19][y].type == GameGrid.BOSS || this.Grid[x][y+19].type == GameGrid.BOSS || this.Grid[x+19][y+19].type == GameGrid.BOSS) {
      this.canEnterBattleState && this.bossBattle(position);
    }
    return false;
  }

  useHealthPack(player_location) {
    const {x, y} = player_location;
    let clashing_point = [];
    // run through every corner to figure out where the enemy and player clash
    if (this.Grid[x][y].type == GameGrid.HEALTH) // top left
      clashing_point = [x, y];
    else if (this.Grid[x+19][y].type == GameGrid.HEALTH) // top right
      clashing_point = [x+19, y];
    else if (this.Grid[x][y+19].type == GameGrid.HEALTH) // bottom left
      clashing_point = [x, y+19];
    else if (this.Grid[x+19][y+19].type == GameGrid.HEALTH) // bottom right
      clashing_point = [x+19, y+19];
    const health_origin = this.Grid[clashing_point[0]][clashing_point[1]].origin;
    this.setState({
      health: 100
    });
    const health_unit = this.identifyEnemy(health_origin, this.state.health_packs);
    if (health_unit > -1) {
      const short_one_health = this.state.health_packs;
      short_one_health.splice(health_unit, 1);
      this.setState({
        health_packs: short_one_health
      });
    }
  }

  bossBattle(player_location) {
    console.warn('danger danger boss battle!!');
    const {x, y} = player_location;
    const BASE_DMG = 1;
    const LVL_DMG = this.state.level;
    const WEAPONG_DMG = this.state.weapon.dmg;
    const BOSS_DMG = Math.floor((Math.random()*10)+5);
    let clashing_point = [];
    this.setState({
      health: this.state.health - BOSS_DMG
    });
    const boss_unit = this.state.boss;
    boss_unit.hp -= (BASE_DMG * LVL_DMG) + WEAPONG_DMG;
    this.setState({
      boss: boss_unit
    });
    if(boss_unit.hp < 1) {
      GameGrid.generatorHelper(this.Grid, [this.state.boss.col, this.state.boss.row], true, GameGrid.FLOOR);
      this.setState({
        boss: null
      });
    }
    console.log(this.state.boss);
    /* this.setState({
       boss:
       }) */
    /* const boss_unit = this.Grid[enemy_origin[0]][enemy_origin[1]];
       console.table(boss_unit.hp); */
  }

  battleMode(player_location) {
    // right now its assuming that all clashes came from origin of player + 1
    const {x, y} = player_location;
    const BASE_DMG = 1;
    const LVL_DMG = this.state.level;
    const WEAPONG_DMG = this.state.weapon.dmg;
    const ENEMY_DMG = Math.floor((Math.random()*5)+1);
    let clashing_point = [];
    // run through every corner to figure out where the enemy and player clash
    if (this.Grid[x][y].type == GameGrid.ENEMY) // top left
      clashing_point = [x, y];
    else if (this.Grid[x+19][y].type == GameGrid.ENEMY) // top right
      clashing_point = [x+19, y];
    else if (this.Grid[x][y+19].type == GameGrid.ENEMY) // bottom left
      clashing_point = [x, y+19];
    else if (this.Grid[x+19][y+19].type == GameGrid.ENEMY) // bottom right
      clashing_point = [x+19, y+19];
    const enemy_origin = this.Grid[clashing_point[0]][clashing_point[1]].origin;
    /* console.log('clashing point is at', clashing_point); */
    /* console.log('entering battle mode'); */
    /* console.log(`we are entering battle with ${this.Grid[x][y].type}`); */
    /* console.info('the origin of the enemy is at', enemy_origin); */
    this.setState({
      health: this.state.health - ENEMY_DMG
    });
    const enemy_unit = this.identifyEnemy(enemy_origin, this.state.enemies);
    if (enemy_unit > -1) {
      // if the index of the enemy was found remove it (needs to be altered for hp)
      const short_one_enemy = this.state.enemies;
      short_one_enemy[enemy_unit].hp -= (BASE_DMG * LVL_DMG) + WEAPONG_DMG;
      if (short_one_enemy[enemy_unit].hp < 1) {
        console.info('the unit is dead');
        short_one_enemy.splice(enemy_unit, 1);
        this.setState({
          enemies: short_one_enemy
        });
        this.setState({
          exp: this.state.exp + 50
        });
        if (this.state.exp == 100) {
          this.setState({
            exp: 0,
            level: this.state.level + 1
          });
        }
        GameGrid.generatorHelper(this.Grid, enemy_origin, true, GameGrid.FLOOR);
      }
      /* console.info('i ran both'); */
    }
    /* console.debug('this should be our enemy', this.identifyEnemy(enemy_origin)); */
  }

  identifyEnemy(origin, ofThis) {
    const [col, row] = origin;
    /* console.debug('our col', col, 'our row', row); */
    return ofThis.findIndex(unit => {
      /* console.table(enemy); */
      if (unit.col == col && unit.row == row)
        return true;
      return false;
    });
  }

  lineOfSight(x, y) {
    var pX = x;
    var pY = y;

    var radGrd = this.ctx.createRadialGradient( pX+10, pY+10, this.r1, pX, pY, this.r2);
    radGrd.addColorStop(0, 'rgba(0, 0, 0, 1)');
    radGrd.addColorStop(this.density, 'rgba(0, 0, 0, .1)');
    radGrd.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = radGrd;
    this.ctx.fillRect(pX - this.r2, pY - this.r2, this.r2*2, this.r2*2);

    // partially hide the entire map and re-reveal where we are now
    this.ctx2.globalCompositeOperation = 'source-over';
    this.ctx2.clearRect(0, 0, 1280, 800);
    this.ctx2.fillStyle = this.hideFill;
    this.ctx2.fillRect(0, 0, 1280, 800);

    var radGrd = this.ctx.createRadialGradient(pX+10, pY+10, this.r1, pX, pY, this.r2);
    radGrd.addColorStop(0, 'rgba(0, 0, 0, 1)');
    radGrd.addColorStop(.8, 'rgba(0, 0, 0, .1)');
    radGrd.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx2.globalCompositeOperation = 'destination-out';
    this.ctx2.fillStyle = radGrd;
    this.ctx2.fillRect( pX - this.r2, pY - this.r2, this.r2*2, this.r2*2 );
  }


  componentDidMount() {
    this.canvas = $('canvas');
    this.ctx = this.canvas[0].getContext('2d');
    this.ctx2 = this.canvas[1].getContext('2d');
    this.ctx3 = this.canvas[2].getContext('2d');

    this.ctx.fillStyle = this.overlay;
    this.ctx.fillRect(0, 0, 800, 400);

    this.ctx.globalCompositeOperation = 'destination-out';

    // after we've mounted the componnet start listening for keystrokes
    $(window).keydown(event => {
      this.keysPressed[event.which] = true;
    });
    $(window).keyup(event => {
      this.keysPressed[event.which] = false;
    });
    setInterval(() => {
      // every 20 milliseconds update players position on screen and store those values
      // here perform the checks before updating the player position
      if (this.state.health < 1) {
        console.info('should display you died');
        this.canEnterBattleState = false;
        this.setState({
          game_over: {yes: true, won: false}
        });
      }
      if (this.state.boss === null) {
        console.info('should display you won');
        this.canEnterBattleState = false;
        this.setState({
          game_over: {yes: true, won: true}
        });
      }
      let tmp = {x: 10, y: 10};
      tmp.x = this.calculateNewPosition(this.player.x, 37, 39);
      tmp.y = this.calculateNewPosition(this.player.y, 38, 40);
      if (this.state.health > 0 && this.isAbleToMove(tmp)) {
        this.player.x = tmp.x;
        this.player.y = tmp.y;
        this.lineOfSight(tmp.x, tmp.y);
      }
      $('.player').css({
        left: this.player.x,
        top: this.player.y
      });
    }, 20);
  }


  render() {
    return (
      <div>
        <ScoreBoard
          health={this.state.health}
          level={this.state.level}
          exp={this.state.exp}
          weapon={this.state.weapon}/>
        <GameWorld
          enemies={this.state.enemies}
          boss={this.state.boss}
          weapon_crate={this.state.weapon_crate}
          health_packs={this.state.health_packs}
          game_over={this.state.game_over}
        />
        <div className="unit-keys">
          <span>Units</span>: <div className="key key-enemy"></div>enemies, <div className="key key-boss"></div>boss, <div className="key key-health"></div>health, <div className="key key-weapon"></div>weapon
        </div>
      </div>
    );
  }
}
