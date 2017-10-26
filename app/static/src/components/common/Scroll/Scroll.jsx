import React, { Component, PropTypes } from 'react'
import classnames from 'classnames';
import IScroll from 'iscroll/build/iscroll-probe.js';
import Event from 'src/utils/events';
//scroll这个元素。
class Scroll extends Component {

  constructor(props) {
    super(props);
    this.state = {
      myScroll: null
    }
  }

  //scroll第一次加载完。
  componentDidMount() {
    setTimeout( () => {
        //没有scrollwrapper。
      if(!this.refs.scrollWrapper){
        return false;
      }
      this.state.myScroll = new IScroll(this.refs.scrollWrapper, { 
        mouseWheel: true,
        probeType: 3,
        bounce: false,
        preventDefault: false,
        disablePointer: false,
        fadeScrollbars:true,
        scrollbars: this.props.scrollbar,
      });

      //停止移动。
      this.stopTouchmove = (e) => {
        e.preventDefault();
      };
      //把下拉条移动到哪个位置。
      this.state.myScroll.on('scroll', () => {
        this.props.onScroll && this.props.onScroll(this.state.myScroll.y);
      });

      let allowScroll = this.props.allowScroll;
      //如果不允许移动，则注册移动的监听事件。
      if(!allowScroll){
        Event.on(this.refs.scrollWrapper, 'touchmove', this.stopTouchmove); 
        Event.on(document, 'touchmove', this.stopTouchmove); 
      };
      //到底。
      this.toBottom();
    }, 250);

  }
  //把对话框拉倒底。
  toBottom(){
    let {isToBottom} = this.props;
    if(!isToBottom){return;};
    let {myScroll} = this.state;
    myScroll.scrollTo(0,myScroll.maxScrollY, 5);
  }
  //移动。
  manualTouchMove(allowScroll){     
      if(allowScroll){
          Event.off(document, 'touchmove', this.stopTouchmove);                             
      }else{
          Event.on(document, 'touchmove', this.stopTouchmove); 
      }
  }

  //组件更新，直接到最底。
  componentDidUpdate() {
    setTimeout(() => {
        //有点停留的刷新
        this.state.myScroll.refresh();
        this.toBottom();
    }, 350);
  }

  //组件接受属性。
  componentWillReceiveProps(nextProps) {
    this.manualTouchMove(nextProps.allowScroll);
    if(nextProps.refresh) {
      setTimeout(() => {
          this.state.myScroll && this.state.myScroll.refresh();
      }, 150);
    }
    const { ScrollToY } = nextProps;

    if(!ScrollToY || this.updateY == nextProps.updateY) {
      return;
    }

    this.updateY = nextProps.updateY;
    //操作scroll的属性。
    this.state.myScroll.scrollTo(0, -ScrollToY, 500)
  }

  componentWillUnmount() {
    Event.off(this.refs.scrollWrapper, 'touchmove', this.stopTouchmove); 
    Event.off(document, 'touchmove', this.stopTouchmove);
  }

  render() {    
    const props = this.props;
    const { children, className, ...others } = props; //把所有属性都加上。
    return (
      <div className="scroll-wrapper" ref="scrollWrapper">
        <div className="scroller">
          { children }
        </div>
      </div>
    )
  }
}

export default Scroll
