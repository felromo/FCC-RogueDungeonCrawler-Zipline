import React, {Component} from 'react';
import ScoreBoard from './score-board';
import GameWorld from './game-world';
import '../../styles/style.scss';
import keydown from 'react-keydown';

@keydown
export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    // store keydown: event in event constant
    const { keydown: { event } } = nextProps;
    if (event) {
      switch (event.which) {
        case 37:
          console.log('move left');
          break;
        case 38:
          console.log('move top');
          break;
        case 39:
          console.log('move right');
          break;
        case 40:
          console.log('move bot');
          break;

      }
    }
  }

  render() {
    return (
      <div>
        <ScoreBoard />
        <GameWorld />
      </div>
    );
  }
}
