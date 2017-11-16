import React, { Component, PropTypes } from 'react'
// import Three from "src/utils/three";
import './App.scss';
/**
 * 公共父类。app，里面放他的儿子集合。
 * 这是Index外面放的一层封装的组件，div下面放所有他的儿子的集合。
 * {this.props.children}:这样就是把他所有孩子节点都展示出来。
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
