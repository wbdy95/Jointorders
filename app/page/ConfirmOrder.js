import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import Alert from '../modules/Alert';
import Button from '../modules/Button';

export default class ConfirmOrder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            remark: localStorage.getItem("remark") || "",
            shoppingCart:[]
        }
    }


    /**
    参数说明:
    storeCode 门店编号
    tableNum 桌号
    parentOrderNum 主订单号
    */

    getRemark (remark) {
        const node = findDOMNode(remark);
        return node.value.trim();
    }
    getServerData(){
        let params = this.props.params;
        if (params.orderNum) {
            return false
        }else{
            $.ajax({
                url : "/WeixinServer/Dish/GetTablewarefee.do",
                type : "GET",
                data: {
                    storeCode:this.props.route.socket.storeCode,
                    tableNum:this.props.route.socket.tableNum
                },
                dataType : 'json',
                success: (data) => {
                    if(data.result == 200){
                        this.setState(data.data);
                    }else{
                        this.refs.alert.open(statusCode[data.result])
                    }
                }

            })
        }
    }
    saveUnionOrder () {
        // let statusCode = {
        //     0: "下单成功",
        //     1: "订单已提交",
        //     2: "点餐人数为空",
        //     3: "系统异常",
        //     4: "该桌已下单"
        // }
        let params = this.props.params;
        let socket = this.props.route.socket;
        $.ajax({
            url : "/WeixinServer/Order/SaveUnionOrder.do",
            type : "GET",
            data: {
                storeCode:socket.storeCode,
                tableNum:socket.tableNum,   //桌号
                parentOrderNum:params.orderNum || "",
                remark : this.getRemark(this.refs.remark)
            },
            dataType : 'json',
            success: (data) => {
                console.log(data);
                if(data.result == 200){
                    /*
                    1. 扫1号桌下单(商家接单)
                    2. 扫2号桌下单(商家接单)
                    3. 点订单列表再跳到1号桌点 继续加菜 > 提交订单
                    4. 加菜单反而加到了2号桌
                    所以要判定返回的订单号 和 路由里的订单号是否一致
                    */
                    if (data.orderNum　== params.orderNum) {
                        this.refs.alert.open("");
                    }
                    socket.send(
                        JSON.stringify({
                            type:"saveUnionOrder",
                            state:{
                                orderNum: data.orderNum
                            }
                        })
                    )
                    location.href = ["#orderform", data.orderNum||""].join("/")
                }
                else if(data.result == 4104 || data.result == 4103){
                    this.refs.alert.open(statusCode[data.result]);
                    setTimeout(function(){
                        location.href = ["#orderform", data.orderNum||""].join("/")
                    }, 2000)
                }else{
                    this.refs.alert.open(statusCode[data.result]);
                }
            }
        })
    }


    pullServerShopCart () {
        let socket = this.props.route.socket;
        //socket.state = "close";
        // console.log("pullServerShopCart")
        this.heartbeatConnect(function(){
            if(socket.state == "open"){
                socket.send(JSON.stringify({
                    type:"newUserOnline"
                }))
            }
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

    /**
    * 返回继续点餐
    */
    back () {
        history.back(-1);
    }

    componentDidMount() {
        let socket = this.props.route.socket;
        this.pullTimer = setInterval(() => {
            this.pullServerShopCart();
        }, 1000);

        //当有新用户扫码进入点餐页面后，通过服务器的购物车数据到所有用户
        socket.on("newUserOnline", function(state){
            // console.log("购物车数据回来了")
            this.setState({
                shoppingCart:state
            })
        }.bind(this));
    }
    componentWillMount(){
        this.getServerData()
    }
    componentWillUnmount() {
        var socket = this.props.route.socket;
        socket.off("newUserOnline");
        clearInterval(this.pullTimer);
    }

    initTotalPrice(money,digit){
        var tpMoney = '0.00';
        if(undefined != money){
            tpMoney = money;
        }
        tpMoney = new Number(tpMoney);
        if(isNaN(tpMoney)){
            return '0.00';
        }
        tpMoney = tpMoney.toFixed(digit) + '';
        var re = /^(-?\d+)(\d{3})(\.?\d*)/;
        while(re.test(tpMoney)){
            tpMoney = tpMoney.replace(re, "$1,$2$3")
        }

        return tpMoney;
    }

    handleChange (event) {

        //只能输入中文、英文、数字、空格、小数点

        let remark = event.target.value;
        let reg = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\s\.\']/g;
        remark = remark.replace(reg,'');
        // remark = remark.substr(0, 15);
        this.setState({
            remark : remark
        })
        setTimeout(()=>{
            localStorage.setItem("remark", remark);
        }, 0)

    }
    render() {
        var state = this.state;
        var totalPrice = 0;
        var totalCount = 0;

        var _arr = this.state.shoppingCart.map((item, index) => {
            let price =item.number * 10000 * item.dishPrice / 10000;
            totalPrice += price;
            totalCount += item.number;
            return (
                <li className="list-wrap" key={index}>
                    <div className="list-explain">
                        <span className="fl dish-name">{item.dishName}</span>
                        <span className="fl dish-number">x{item.number}</span>
                        <span className="fr dish-price">¥{price}</span>
                    </div>
                    <div className="dish-explain"></div>
                </li>
            )
        })
        //主单显示餐具费 ：餐具费不是0 且 不是加菜单时候
        if (this.state.tablewarefee !== 0 && !this.props.params.orderNum) {
            _arr.push(
                <li className="list-wrap" key={this.state.shoppingCart.length + 1}>
                    <div className="list-explain">
                        <span className="fl dish-name">餐具费</span>
                        <span className="fl dish-number">x {this.state.peopleNum}</span>
                        <span className="fr dish-price">¥{this.state.peopleNum*this.state.tablewarefee}</span>
                    </div>
                    <div className="dish-explain"></div>
                </li>
            )
        }
        if (this.state.peopleNum && this.state.tablewarefee && totalPrice) {
            totalPrice = parseFloat(parseInt((totalPrice * 10000 + this.state.peopleNum * this.state.tablewarefee * 10000))/10000)
        } else {
            totalPrice = parseFloat(parseInt(totalPrice * 10000)/10000)
        }
        // this.state.peopleNum && this.state.tablewarefee && totalPrice!=0 ? totalPrice = parseFloat(parseInt((totalPrice + this.state.peopleNum * this.state.tablewarefee) * 100)/100) : ""  // 在peopleNum  tablewarefee  totalPrice 都取到的情况下在算出小计金额并显示

        // console.log("Before:",totalPrice);
        // totalPrice = this.initTotalPrice(totalPrice,2);
        // console.log("After:",totalPrice);
        // console.log(this.props.route.socket);
        return (
            <div>
                <div className="head">
                    <span>菜品数量：{totalCount}</span>
                    <span className="fr">小计金额：¥{totalPrice}</span>
                </div>
                {this.props.params.orderNum ? "" : (<div className="tableware-fee">
                    <span>人数：{this.state.peopleNum}</span>
                    {this.state.tablewarefee != 0 ? (<span className="fr">餐具费：{this.state.tablewarefee}元/套</span>) : ""}
                </div>)}
                {this.props.params.orderNum ? "" : (<div className="grey-bar"></div>)}
                <div className="order-remark">
                    <span className="remark">备注：</span>
                    <span className="remark-input">
                        <input ref="remark" type="text" className="input-text" maxLength = "15" value={state.remark} onChange={this.handleChange.bind(this)} placeholder="可填写口味、偏好等"/>
                    </span>
                </div>
                <div className="grey-bar"></div>
                <div className="orderlist-wrap">
                    <ul className="orderlist">
                        {_arr}
                    </ul>
                    <div className="grey-bar"></div>
                    <div className="outside"></div>
                </div>
                <div className="page-footer">
                    <Button className="back" onTap={this.back.bind(this)}>返回加菜</Button>
                    <Button className="submit" onTap={this.saveUnionOrder.bind(this)}>提交订单</Button>
                </div>
                <Alert ref="alert" content=""/>
            </div>
        );
    }
}
