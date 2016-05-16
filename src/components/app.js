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

    /* this.enemies = GameGrid.generateEnemies(this.Grid); */
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


  componentDidMount() {
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
      if (this.isAbleToMove(tmp)) {
        this.player.x = tmp.x;
        this.player.y = tmp.y;
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
        <button
          onClick={()=> { this.setState({health: this.state.health-1});}}>
          taking damage!
        </button>
        <button
          onClick={() => {this.setState({level: this.state.level+1});}}>
          level up
        </button>
        <button
          onClick={() => {this.setState({weapon: {type: 'sword', dmg: 10}});}}>
          gain weapon
        </button>
        <button onClick={() => {console.log(this.player.x,this.player.y);}}>get player location</button>
        <button
          onClick={() => {
              console.log(`left: ${ this.Grid[this.player.x-1][this.player.y].type}|origin ${this.Grid[this.player.x-1][this.player.y].origin}`);
              console.log(`top: ${ this.Grid[this.player.x][this.player.y-1].type }|origin ${ this.Grid[this.player.x][this.player.y-1].origin }`);
            }}>
          Player Surroundings</button>
        <button onClick={() => {GameGrid.locateEveryone(this.Grid, GameGrid.ENEMY);}}>reveal everything</button>
      </div>
    );
  }
}
