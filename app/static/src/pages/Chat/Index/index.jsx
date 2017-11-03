/*
 * @authors :anLA7856
 * @date    :2017-10-25
 * @description：Login和，Messages，Sidebar的父类，用于整合着三个子组件。
 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import classnames from 'classnames';
import actions from "src/actions";
import Sidebar from "../Sidebar/Index";
import Messages from "../Messages/Index";
import Login from "../Login";
import { fetchJson } from "src/utils/fetch";
import Storage from 'src/utils/storage';

import './Index.scss';

let _store = new Storage(),
    Storage_Key = 'username';

class wechat extends Component {
    constructor( props ) {
        super( props );

        this.state = {

        };
    }
    //初始头一次加载，
    componentDidMount() {
        //dia(this);
        let { ACTIONS } = this.props;
        ACTIONS.chat_init();
    }
    //获取组件属性。
    render() {
        let { _sessions, _user } = this.props;
        //获取当前状态，然后更改。判断是否有值，
        //没有值的话，就说明处于登录状态，所以就是login组件
        return (
            <div className="myDiv">
                {_sessions.length > 0 && Object.keys( _user ).length > 0 ? (
                    <section className="wechat">
                        <Sidebar />
                        <Messages />
                    </section>
                ) : (
                        <Login />
                    )
                }

            </div>
        );
    }
};

//绑定react和redux。
let mapStateToProps = ( state ) => {
    let { sessions, user } = state.chatIndex;
    return {
        _sessions: sessions,
        _user: user
    };
};

let mapDispatchToProps = ( dispatch ) => {
    return {
        ACTIONS: bindActionCreators( actions, dispatch )
    };
};
export default connect( mapStateToProps, mapDispatchToProps )( wechat );

