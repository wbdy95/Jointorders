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
export default class Button extends Component {
	constructor(props) {
        super(props);
        this.state = {
            disable: this.props.disable
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    // onTouchStart (e) {
    //     this.startClientX = e.changedTouches[0].clientX;
    //     this.startClientY = e.changedTouches[0].clientY;
    //     e.preventDefault();
    // }
	//
    // onTouchEnd (e) {
    //     this.endClientX = e.changedTouches[0].clientX;
    //     this.endClientY = e.changedTouches[0].clientY;
	//
    //     if(Math.abs(this.endClientY - this.startClientY) < 10 && Math.abs(this.endClientX - this.startClientX) < 10){
    //         !this.state.disable && this.props.onTap();
    //     }
    //     e.preventDefault();
    // }

	onC(){
		!this.state.disable && this.props.onTap();
	}

	render(){
		// onTouchStart={this.onTouchStart.bind(this)}
		// onTouchEnd={this.onTouchEnd.bind(this)}
		return (
            <span className={this.props.className}
            onTouchTap={this.onC.bind(this)}
            >{this.props.value || this.props.children || ""}</span>
        )
	}
}
