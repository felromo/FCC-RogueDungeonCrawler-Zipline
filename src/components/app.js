import React, {Component} from 'react';
import ScoreBoard from './score-board';
import GameWorld from './game-world';
import '../../styles/style.scss';
import $ from 'jquery';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      health: 100,
      level: 1,
      weapon: 'dagger'
    };
    this.player = {
      x: 0,
      y: 0
    };
    this.keysPressed = {};
    this.movementRate = 1;
    this.calculateNewPosition = this.calculateNewPosition.bind(this);
  }

  calculateNewPosition(oldValue, direction1, direction2) {
    return parseInt(oldValue, 10)
                 - (this.keysPressed[direction1] ? this.movementRate : 0)
                 + (this.keysPressed[direction2] ? this.movementRate : 0);
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
      $('.player').css({
        left: (index) => {
          // left and right
          return this.calculateNewPosition(this.player.x, 37, 39);
        },
        top: (index)  => {
          // up and down
          return this.calculateNewPosition(this.player.y, 38, 40);
        }
      });
      this.player.x = parseInt($('.player').css('left'));
      this.player.y = parseInt($('.player').css('top'));
    }, 20);
  }


  render() {
    return (
      <div>
        <ScoreBoard
          health={this.state.health}
          level={this.state.level}
          weapon={this.state.weapon}/>
        <GameWorld />
        <button
          onClick={()=> { this.setState({health: this.state.health-1});}}>
          taking damage!
        </button>
        <button
          onClick={() => {this.setState({level: this.state.level+1});}}>
          level up
        </button>
        <button
          onClick={() => {this.setState({weapon: 'sword'});}}>
          gain weapon
        </button>
        <button onClick={() => {console.log(this.player.x,this.player.y);}}>get player location</button>
      </div>
    );
  }
}
