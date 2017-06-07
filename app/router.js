import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, Redirect} from 'react-router';
import 'babel-polyfill';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Home from './page/Home';
import Number from './page/Number';
import Pay from './page/Pay';
import Orderform from './page/Orderform';
import ConfirmOrder from './page/ConfirmOrder';
import Orderlist from './page/Orderlist';

injectTapEventPlugin();

require("./css/base.css");
require("./css/icon.css");
require("./css/index.css");
require("./css/number.css");
require("./css/pay.css");
require("./css/confirmorder.css");
require("./css/shopcart.css");
require("./css/orderform.css");
require("./css/orderlist.css");
require("./css/loading.css");
require("./css/animate.min.css");

window.statusCode = {
	200:"操作成功",
	201:"操作成功，需调用支付接口",
	500:"系统故障",
	4001:"订单编号错误",
	4002:"订单不存在",
	4003:"订单无效",
	4004:"商家尚未接单",
	4005:"订单已支付",
	4006:"订单已发起支付",
	4010:"无订单列表数据",
	4100:"门店编号错误",
	4101:"无菜品数据",
	4102:"用餐人数为空",
	4103:"购物车无菜品数据",
	4104:"该桌已提交订单",
	4200:"申请支付失效",
	4201:"暂无反馈，可以再次申请“在线支付”",
	4202:"会员支付失败",
	4203:"菜品被退空"};


	// 打开Socket
	function onopen(event) {
		socket.state = 'open';
		socket.trigger("connectStateChange", "open");
	}
	function onmessage(event){
		if(event.data == "success"){
			return ;
		}

		var action = JSON.parse(event.data);
		socket.trigger(action.type, action.state);
	}

	//console.log($.cookie("storeCode", "1473069421738"), $.cookie("tableNum", "0008"))
	//{loginName: "yang", storeCode: "1473069421738", tableNum: "0008"}

	// 老杨

	// $.cookie("storeCode", "1473069421738");
	// $.cookie("tableNum", "0018")
	// $.cookie("loginName", "yang")

	//我的
	// $.cookie("storeCode", "1481779967237")
	// $.cookie("loginName", "wangtianbo")
	// $.cookie("tableNum", "0022")

	//许彤
	$.cookie("storeCode", "1468639959803")
	$.cookie("loginName", "wangtianbo")
	$.cookie("tableNum", "0018")

	// 李丹丹的店
	// $.cookie("storeCode", "1453432140252");
	// $.cookie("tableNum", "00088")
	// $.cookie("loginName", "yang")

	$.cookie("storeCode", "1468639959803")
	$.cookie("loginName", "wangtianbo")
	$.cookie("tableNum", "0018")

	var	rews;
	var socket = {
		state:"close",
		storeCode: $.cookie("storeCode") || location.hash.split("/")[2],
		tableNum : $.cookie("tableNum") || location.hash.split("/")[3],
		loginName : $.cookie("loginName")
	};

	_.extend(socket, Backbone.Events);
	socket.on("connect", function(){
		console.log("开始连接/重连");
		rews = new ReconnectingWebSocket('ws://abtest2.youmeishi.cn/WebSocket/DishWebSocket/'+ socket.storeCode +'/' + socket.tableNum + '/' + socket.loginName,null, {debug: true, reconnectInterval: 3000});
		rews.onopen = onopen;
		rews.onmessage = onmessage;
		rews.onclose = function(){
			socket.state = 'close';
			socket.trigger("connectStateChange", "close");
		};
		socket.send = rews.send.bind(rews)
		socket.close = rews.close.bind(rews)
	})

	var setDocumentTitle = function(title) {
		document.title = title;
		if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
			var i = document.createElement('iframe');
			i.src = '/favicon.ico';
			i.style.display = 'none';
			i.onload = function() {
				setTimeout(function(){
					i.remove();
				}, 9)
			}
			document.body.appendChild(i);
		}
	}
	function onEnter(){
		let route = location.hash.split("/")[1];
		let pageTitle = {"number":"用餐人数","home":"点餐","confirmOrder":"菜品确认","orderform":"订单详情","orderlist":"订单列表"};
		setDocumentTitle(pageTitle[route]);

		if(route != "home" && route != "confirmOrder"){
			localStorage.setItem("remark", "");
		}

	}
	socket.on("saveUnionOrder", (state) => {
		let route = location.hash.split("/")[1];
		console.log("提交订单成功后，所有home、confirmOrder页面的用户都跳转到订单详情页", route)
		if(route == "home" || route == "confirmOrder"){
			location.href="#orderform/" + state.orderNum;
		}
	})
	socket.trigger('connect');
	ReactDOM.render((
		<Router history={hashHistory}>
			<Route path="/number" component={Number} socket={socket}  onEnter={onEnter.bind(this)}/>
			<Route path="/home(/:orderNum)" component={Home} socket={socket}  onEnter={onEnter.bind(this)}/>
			<Route path="/confirmOrder(/:orderNum)" component={ConfirmOrder} socket={socket} onEnter={onEnter.bind(this)}/>
			<Route path="/orderform/:orderNum" component={Orderform} socket={socket}  onEnter={onEnter.bind(this)}/>
			<Route path="/pay/:orderNum" component={Pay} socket={socket}  onEnter={onEnter.bind(this)} />
			<Route path="/orderlist" component={Orderlist} socket={socket}  onEnter={onEnter.bind(this)}/>
			<Redirect from='/' to="/number"/>
		</Router>
	), document.getElementById('app'));
