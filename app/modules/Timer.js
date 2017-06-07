import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';

/**
 * Popup类，一个弹窗组件.
 * @constructor
 * @param {boolean} isShow - 是否显示，默认false
 * <Popup ref="popup" isShow={true|false}>
 *		弹窗内容
 *	</Popup>
 */
export default class Timer extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	second : this.props.second || 0
        }
    }
    /**
     * 交替显示
     */
    start (sec) {
        //debugger;
        let second = parseInt(this.state.second) || sec || 30;
        this.setState({second: second});
        this._timer = setInterval(() => {
            second -= 1;
            this.setState({second: second});    
            if(second <= 0){
                this.remove();
            }
        }, 1000)
        $(findDOMNode(this.refs.timer)).fadeIn('slow');
    }

    remove () {
        this._timer && clearInterval(this._timer);
        $(findDOMNode(this.refs.timer)).fadeOut('slow');
    }

    // componentWillReceiveProps(nextProps) {
    // 	this.setState({second: nextProps.second});	
    // }
    
	render(){
        let _className = "timer " + this.props.className;
		return <div ref="timer" className="loadEffect" style={{display:"none"}}>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
		</div>
	}
}
