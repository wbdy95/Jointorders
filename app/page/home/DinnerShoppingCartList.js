import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import DinnerShoppingCartItem from './DinnerShoppingCartItem';

/*DinnerItem.propTypes = {
	data : React.PropTypes.shape({
	  	number: React.PropTypes.number.isRequired
	})
}*/


export default class DinnerShoppingCartList extends Component{

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

	//重构render方法，其他的不动
	render () {
		let list = this.state.list;
		let title = "";
		var orderListStr = list.map(function(item, index){
			item.number = item.number || 0;
			return (
				<DinnerShoppingCartItem {...this.props} data={item} index={item._index} key={index} />
			)
		}.bind(this))
			$('#loadBooking').bind('touchmove',function(event){event.preventDefault();});
		function stopShopCart() {
			if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
				var lastY;//最后一次y坐标点
				$('.cartlist').on('touchstart', function(event) {
					lastY = event.originalEvent.changedTouches[0].clientY;//点击屏幕时记录最后一次Y度坐标。
				});
				$('.cartlist').on('touchmove', function(event) {
					var y = event.originalEvent.changedTouches[0].clientY;
					var st = $('.cartlist').scrollTop(); //滚动条高度
					if (y >= lastY && st <= 0) {//如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
						// console.log("下拉触发");
						lastY = y;
						event.preventDefault();
					}
					else if (y <= lastY && st >= $('.cartlist')[0].scrollHeight-$('.cartlist').height()) {
						// console.log("上拉触发");
						lastY=y;
						event.preventDefault()
					}
					lastY = y;
				});
			}
		}
		stopShopCart();
		return (
			<div className="shopcart-wrap" >
                <div className="shopcart">
                    <span className="redbar"></span>
                    <span className="greybar">购物车</span>
                </div>
                <ul className="cartlist">
				{orderListStr}	
				</ul>
				<div className="grey-bar"></div>
			</div>
		)
	}
}
