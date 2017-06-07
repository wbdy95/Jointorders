import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';

import Alert from '../modules/Alert';
import Popup from '../modules/Popup';

import Search from './home/Search';
import Dinner from './home/Dinner';
import DinnerList from './home/DinnerList';
import DinnerShoppingCartList from './home/DinnerShoppingCartList';
import Footer from './home/Footer';
//         import {statusCode} from '../modules/statusCode'

export default class Home extends Component {
	constructor(props) {
        super(props);

        this.state = {
        	shoppingCart:[], 
        	productCountPrice:0,
        	shoppingCartCount:0,
        	typeList:[],
        	products:[]
        }
    }

    //将产品加入购物车
    update(type, product) {
    	
    	let socket = this.props.route.socket;
    	let shoppingCartCount = this.state.shoppingCartCount;
    	let productCountPrice = this.state.productCountPrice;
    	
    	let item = this.state.products.find(function(item){
    		return item.id === product.id;
    	});

        if(product.number != item.number){
            console.warn("home page product.number, item.number 不一致", product.number, item.number , "id:",product.id,  item.id)
        }
    	if(type == "remove" && item.number <= 0){
    		return false;
    	}
    	
    	let _index = _.findIndex(this.state.typeList, {id:product.dishTypeId});
		let dishTypeObj = this.state.typeList[_index];
		dishTypeObj.number = dishTypeObj.number || 0;
    	
    	//update countNumber and countPrice; 更新typeList
    	if(type == "add"){
    		item.number += 1;
    		dishTypeObj.number += 1;
    		shoppingCartCount += 1;
    		productCountPrice += product.dishPrice * 1;	
    	}else{
    		item.number -= 1;
    		dishTypeObj.number -= 1;
    		shoppingCartCount -= 1;
    		productCountPrice -= product.dishPrice * 1;
    	}

    	let state = {
    		shoppingCartCount : shoppingCartCount,
    		productCountPrice : productCountPrice, 
    		typeList : this.state.typeList,
    		products : this.state.products, 
    		shoppingCart : this.state.products.filter(item => {return item.number > 0})
    	}
    	this.setState(state);
    }

    /**
	 * 将购物车数据渲染到分类统计。
     */
    renderTypeList (typeList, data) {
    	
    	let _index = _.findIndex(typeList, {id:data.dishTypeId});
    	// console.log("分类列表数据：", typeList, "购物车中分类里列表数据", data, _index );
    	if(_index == -1){
    		alert("如果弹出这个说明，购物车出来问题，理论上，这里不会出现-1");
    	}
    	typeList[_index].number = typeList[_index].number || 0;
		typeList[_index].number += data.number;

		return typeList;
    }
    // 将购物车数据渲染到菜品列表
    renderProducts (products, data) {
    	products[data._index] = data;
    	return products;
    }
    renderShoppingCart ( shopCartData ) {
    	//data is Array
    	let allData = this.state;
    	this.state.productCountPrice = 0;
    	this.state.shoppingCartCount = 0;
    	this.state.typeList.forEach(item => {
    		item.number = 0;
    	})
		shopCartData.forEach(item => {
			this.renderTypeList(this.state.typeList, item);
			this.renderProducts(this.state.products, item);
			this.state.shoppingCartCount += item.number;
			this.state.productCountPrice += item.number * item.dishPrice;
    	})
    	this.state.shoppingCart = shopCartData.filter(item => {return item.number > 0});
    	return this.state;
    }

    getServerData (successCB) {
    	let socket = this.props.route.socket;
    	let params = this.props.params;
    	$.ajax({
    		url : "/WeixinServer/Dish/DataDishInfo.json",
    		type : "GET",
    		data: {
    			storeCode:socket.storeCode,
    			tableNum:socket.tableNum,
    			parentOrderNum:params.parentOrderNum
    		},
    		dataType : 'json',
    		success: function(data){
    			if(data.result == 200){
	    			//!important prop for static data;
	    			this.dishData = data.dishData;
	    			var state = {
	    				typeList:data.typeData,
	    				products:data.dishData
	    			}
					successCB();
					console.log(2);
	    			this.setState(state);
    			}else{
    				this.refs.alert.open(statusCode[data.result])
    			}
    		}.bind(this)
    	})
    }

    componentDidMount() {
        this.refs.connectLoading.show();

        var socket = this.props.route.socket;
        socket.on("addProductFromShoppingCart", function(state){
            this.update("add", state);
        }.bind(this));

        socket.on("removeProductFromShoppingCart", function(state){
            this.update("remove", state);
        }.bind(this))


        //当有新用户扫码进入点餐页面后，通过服务器的购物车数据到所有用户
        socket.on("newUserOnline", function(shopCartData){
            console.log("购物车数据已返回:", new Date().getTime())
            if(!!this.state.products.length){
                this.setState(this.renderShoppingCart(shopCartData))
            }
        }.bind(this));

        this.getServerData(()=>{
            console.log("菜品数据已返回", new Date().getTime(), "socket.state", socket.state);
            //判断socket链接状态，close时，打开popup，提示连接断开
            socket.on("connectStateChange", (stateMsg) => {
                if(stateMsg == "close"){
                    this.refs.connectLoading.show();
                }else{
                    //断线重连后，拉取服务器数据
                    this.pullServerShopCart();
                    this.refs.connectLoading.hide();
                }
            })
            
            $('[data-spy="scroll"]').scrollspy('refresh');
            //拉取购物车数据
            this.pullServerShopCart();
        });
    }

    componentWillUnmount() {
        var socket = this.props.route.socket;
        socket.off("newUserOnline");
    }

    pullServerShopCart () {
        let socket = this.props.route.socket;
        //socket.state = "close";
        console.log("pullServerShopCart");
		let self = this;
        this.heartbeatConnect(function(){
            if(socket.state == "open"){
                socket.send(JSON.stringify({
                    type:"newUserOnline"
                }))
            }
			self.refs.connectLoading.hide();
            return socket.state == "open";
        });
    }
    // 心跳连接函数，使用定时器对callback进行循环调用
    heartbeatConnect (callback, maxTime) {
        let result = callback();
        if(result){
            return false;
        }
        
        let _repeatTime = 0;
        let _maxTime = maxTime || 100;
        let _timer = setInterval(function(){
            if( callback() || _repeatTime > _maxTime){
                clearInterval(_timer);
            }
            _repeatTime++;
        }, 100)
    }
    
    //显示购物车
    toggleShoppingCart() {
    	this.refs.popup.toggle();
    }

    componentDidUpdate(prevProps, prevState) {
    	var socket = this.props.route.socket;
    	if(!this.state.shoppingCartCount){
    		this.refs.popup.hide();
    	}
    }

    pickBtnClick () {
    	let params = this.props.params;
    	location.href = ["#confirmOrder", params.orderNum||""].join("/");
    }

    render() {
        var self = this;
        var socket = this.props.route.socket;
        var _shoppingCart = {
            shoppingCartCount : this.state.shoppingCartCount,
            productCountPrice : this.state.productCountPrice
        }
        let styles={
            height50empty:{
                height:'50px'
            }
        }
        //console.log("render--", new Date().getTime())
     //   $('#loadBooking').add('touchmove',function(event){event.preventDefault();});
        return (
            <div className="container">
                <Search data={this.state.todos} getRefreshData={this.pullServerShopCart.bind(this)}socket={socket}/>
                <div style={styles.height50empty}></div>
                <div ref="content" className="content">
                    <Dinner typelist={this.state.typeList}/>
                    <DinnerList types={this.state.typeList} products={this.state.products} update={this.update.bind(this)} socket={socket} />
                </div>
                <Footer ref="footerComponent" pickBtnClick={this.pickBtnClick.bind(this)} shoppingCart={_shoppingCart} toggleShoppingCart={this.toggleShoppingCart.bind(this)}></Footer>
                <Popup ref="popup" className="popup-bottom" id="loadBooking">
                    <DinnerShoppingCartList products={this.state.shoppingCart} update={this.update.bind(this)} socket={socket}/>
                </Popup>
                <Popup ref="connectLoading" className="popup-center" disableClick="true" zIndex="9999">
                    <p className="confirm-info">努力加载中</p>
                </Popup>
                <Alert ref="alert"/>
            </div>
        );
    }
}