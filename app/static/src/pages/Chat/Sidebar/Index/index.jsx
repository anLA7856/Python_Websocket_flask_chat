/*
 * @authors :anLA7856
 * @date    :2017-10-26
 * @description：聊天界面的左边，把联系人放到里面。
 */

import React, { Component, PropTypes } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import classnames from 'classnames';
import actions from "src/actions";

import List from '../List';

import './Index.scss';

class Sidebar extends Component{
    //构造函数，从父页面得到属性。
	constructor(props){
		super(props);
    	this.state = {

    	};
	}
	//第一次加载后。需要做的。
	componentDidMount(){

	}
	
	componentWillUpdate(nextProps, nextState) {
	    //本来想实现，一旦关闭浏览器，就代表这个用户退出的，但在react实现监听浏览器关闭略困难。
 //       let {ACTIONS,_user} = nextProps;
//        window.onunload = function(event) {
//            ACTIONS.set_destroy({
//                user:_user
//            });
//         };
	}
    
     componentWillMount(){

           
     }
	

	
	
	//搜索框的功能
	search(e){
		let {value}=e.target;
		let {ACTIONS} = this.props;
		ACTIONS.filter_search(value);
	}
	//渲染方法。
	render(){
		let {_user} = this.props;
		return (
			<section className="sidebar">
				<div className="card">
				    <header className="user">
				        <img className="avatar" width="40" height="40"  src={(_user.img||require("./images/Bin.jpg"))}/>
				        <p className="name">{_user.name}</p>
				    </header>
				    <footer>
				        <input className="search" type="text" onChange={(e)=>this.search(e)} placeholder="search user..." />
				    </footer>
				</div>
				<List/>
			</section>
		);
	}
};

//react和redux相互绑定。
let mapStateToProps=(state)=>{
	let {user,filterKey} = state.chatIndex;
	return {
		_user:user,
		_filterKey:filterKey
	};
}; 

let mapDispatchToProps=(dispatch)=>{
	return {
		ACTIONS:bindActionCreators(actions,dispatch)
	};
};
export default connect(mapStateToProps,mapDispatchToProps)(Sidebar);

