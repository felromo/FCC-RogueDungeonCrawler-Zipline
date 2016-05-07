import React,{Component} from 'react';
import $ from 'jquery';

// 37 -left
// 38 - top
// 39 - right
// 40 - bot

export default class Player extends Component {

  constructor(props) {
    super(props);
    this.state = {x: 0,
                  y: 0};
  }

  render() {
    return (
      <div className="player"></div>
    );
  }
}
