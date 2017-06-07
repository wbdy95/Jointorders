import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';

export default class AddButton extends Component {
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
	// 	this.startClientX = e.changedTouches[0].clientX;
	// 	this.startClientY = e.changedTouches[0].clientY;
	// 	e.preventDefault();
	// }
	//
	// onTouchEnd (e) {
	// 	this.endClientX = e.changedTouches[0].clientX;
	// 	this.endClientY = e.changedTouches[0].clientY;
	//
	// 	// var offset = $('#amount').offset();
	// 	// var addcar = $(this);
	// 	// var flyer = $('<img class="u-flyer" src="./logo.png">');
	// 	//
	// 	// // console.log(e.changedTouches[0].pageX-20,e.changedTouches[0].pageY-20);
	// 	//
	// 	// flyer.fly({
	// 	// 	start: {
	// 	// 		left: e.changedTouches[0].clientX-20,
	// 	// 		top: e.changedTouches[0].clientY-20
	// 	// 	},
	// 	// 	end: {
	// 	// 		left: offset.left+10,
	// 	// 		top: offset.top+10,
	// 	// 		width: 0,
	// 	// 		height: 0
	// 	// 	},
	// 	// 	onEnd: function(){
	// 	// 		addcar.css("cursor","default").removeClass('orange').unbind('click');
	// 	// 		this.destory();
	// 	// 	}
	// 	// });
	//
	// 	if(Math.abs(this.endClientY - this.startClientY) < 10 && Math.abs(this.endClientX - this.startClientX) < 10){
	// 		!this.state.disable && this.props.onTap();
	// 	}
	// 	e.preventDefault();
	// }

	onC(e){
		// var offset = $('#amount').offset();
		// var addcar = $(this);
		// var flyer = $('<img class="u-flyer" src="./logo.png">');
		// // console.log(e.clientX,e.clientY,offset.left+10,offset.top+10);
		// flyer.fly({
		// 	start: {
		// 		left: e.clientX-20,
		// 		top: e.clientY-20
		// 	},
		// 	end: {
		// 		left: offset.left+10,
		// 		top: offset.top+10,
		// 		width: 0,
		// 		height: 0
		// 	},
		// 	onEnd: function(){
		// 		addcar.css("cursor","default").removeClass('orange').unbind('click');
		// 		this.destory();
		// 	}
		// });
		!this.state.disable && this.props.onTap();
	}
	// ios中的 属性 onTouchStart={this.onTouchStart.bind(this)} onTouchEnd={this.onTouchEnd.bind(this)}
	render(){
		// console.log(Math.random()*10);
		let android = (<span className={this.props.className} onTouchTap={this.onC.bind(this)}>{this.props.value || this.props.children || ""}</span>)
		let ios = (<span className={this.props.className} onTouchTap={this.onC.bind(this)}>{this.props.value || this.props.children || ""}</span>)
		return (
			/ip(hone|od|ad)/i.test(navigator.userAgent) ?
			ios : android
		)
	}
}
