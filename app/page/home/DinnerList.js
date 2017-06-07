import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import DinnerItem from './DinnerItem';
/*DinnerItem.propTypes = {
	data : React.PropTypes.shape({
	  	number: React.PropTypes.number.isRequired
	})
}*/
var count =0 ;

export default class DinnerList extends Component{
	constructor(props) {
        super(props);
        this.dishTypeId = 0;
        this.state = {
       		list : this.props.products
        }
    }

    componentWillReceiveProps(nextProps) {
    	this.setState({
    		list : nextProps.products
    	})
    }

	render () {
		let list = this.state.list;
		let types = this.props.types;
		let typesObj = _.indexBy(types, "id");
		
		let title = "";
		function stopDrop() {
			if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
				var lastY;//最后一次y坐标点
				$('.main').on('touchstart', function(event) {
					lastY = event.originalEvent.changedTouches[0].clientY;//点击屏幕时记录最后一次Y度坐标。
				});
				$('.main').on('touchmove', function(event) {
					var y = event.originalEvent.changedTouches[0].clientY;
					// console.log("y="+ y);
					var st = $('.main').scrollTop(); //滚动条高度
					// console.log("mainHegith = "+$('.main').height());
					// console.log("scrollHeight = "+$('.main')[0].scrollHeight)
					// console.log("st = "+st);
					// console.log("body:"+$('body').height());
					if (y >= lastY && st <= 0) {//如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
						// console.log("下拉触发");
						lastY = y;
						event.preventDefault();
					}
					else if (y <= lastY && st >= $('.main')[0].scrollHeight-$('.main').height()-50) {
						// console.log("上拉触发");
						lastY=y;
						event.preventDefault()
					}
					lastY = y;
				});
			}

		}
		stopDrop();
		var orderListStr = list.map(function(item, index){
			item.number = item.number || 0;
			let orderObj = typesObj[item.dishTypeId] || {};
			let title = "";
			if(item.dishTypeId !== this.dishTypeId){
				title = <div id={item.dishTypeId} className="title">{orderObj["name"]}</div>
				this.dishTypeId = item.dishTypeId;
			}
			return (
				<div key={index}>
					{title}
					<DinnerItem {...this.props} data={item} index={index} />
				</div>
			)
		}.bind(this))
		return (
			<div className="main" data-spy="scroll">
				{orderListStr}
			</div>
		)
	}
}