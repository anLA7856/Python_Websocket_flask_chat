import React, { Component, PropTypes } from 'react'
// import Three from "src/utils/three";
import './App.scss';
/**
 * 公共父类。app，里面放他的儿子集合。
 */
class Index extends Component {
  render() {
    return (
      <div className="app-container">
        {this.props.children}
      </div>
    )
  }
}

export default Index
