import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {timeStamp} from './util'
import Timer from './Timer'
/**
 * 简单定时类.
 * @constructor
 */
export default class SimpleTimer extends Timer {

	
	render(){
        let _className = "timer " + this.props.className;
        let time = timeStamp(this.state.second);
		return <span ref="timer" className={_className} style={{display:"none"}}> 倒计时{time}</span>
	}
}
