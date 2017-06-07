import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';

import Popup from '../modules/Popup';
import Timer from '../modules/Timer';
import Alert from '../modules/Alert';
import Button from '../modules/Button';

  // 您已下单成功！等待商家确认
  //
  // 商家已接单！正在为您准备菜品
  //
  // 订单已取消！
  //
  // 订单已完成！
  //
  // 联合点餐时当“在线支付”申请通过后，支付权限锁定为第一个提交支付申请的ID。其他ID页面停留在订单详情页面，此时其他ID点击“在线支付”、“继续加菜”按钮则提示：“订单正在支付中”；



export default class Orderform extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order:{
                orderNum:"",
                detail:[]
            }
        }
    }

    //订单详情页，获取订单详情
    getServerData (successCB) {
        let params = this.props.params;
        // let statusCode = {0:"申请成功", 1:"订单编号错误",2:"商家尚未接单",3:"系统故障",4:"订单已支付",5:"订单无效",6:"订单已发起支付",7:"暂无反馈，可以再次申请“在线支付”"};
        $.ajax({
            url : "/WeixinServer/Order/QueryOrder.do",
            type : "GET",
            data: {
                orderNum:params.orderNum
            },
            dataType : 'json',
            success: (data) => {
                if(data.result == 200){
                    this.setState(data);
                }else{
                    this.refs.alert.open(statusCode[data.result])
                }
                successCB && successCB();
            }

        })
    }
    addFood () {
        //请求后台，查看订单状态，如果状态是商家确认订单，跳转到点餐页面, 加菜前必须确认订单状态，必须是商家已接单才可以继续加菜
        //接口地址 http://api.youmeishi.cn/ApiDocument/Document/MainPage.do
        //0验证成功，1订单编号错误，2商家尚未接单，3系统故障，4订单无效，5订单被锁定
        // let statusCode = {0:"申请成功", 1:"订单编号错误",2:"商家尚未接单",3:"系统故障",4:"订单已支付",5:"订单已发起支付"};
        let params = this.props.params;
        $.ajax({
            url : "/WeixinServer/Order/CheckOrder.do",
            type : "GET",
            data: {
                orderNum:params.orderNum
            },
            dataType : 'json',
            success: (data) => {
                if(data.result == 200){
                    location.href = ["#home", params.orderNum].join("/")
                }
                else if(data.result == 4005 || data.result == 4003){
                    if (this.state.order.status != 3 && this.state.order.status !=5 && this.state.order.status != 6) {
                        // console.log("开始获取服务");
                        this.refs.alert.open(statusCode[data.result]);
                        this.getServerData();
                    }
                }
                else{
                        this.refs.alert.open(statusCode[data.result]);
                        this.getServerData();
                }
            }
        })
    }

    /**
     * 判断商家是否接单
     */
    isAcceptedBySeller () {
        let params = this.props.params;
        // let statusCode = {0:"申请成功", 1:"订单编号错误",2:"商家尚未接单",3:"系统故障",4:"订单已支付",5:"订单无效",6:"订单已发起支付",7:"暂无反馈，可以再次申请“在线支付”"};
        $.ajax({
            url : "/WeixinServer/Order/OrderApply.do",
            type : "GET",
            data: {
                orderNum:params.orderNum
            },
            dataType : 'json',
            success: (data) => {
                console.log(data.result);
                if(data.result == 200){
                    //如果订单状态为商家已接单,调用申请支付接口
                    this.onlinePay();
                    this.getServerData();
                }else if(data.result == 4005 || data.result == 4003){
                    // this.refs.alert.open(statusCode[data.result]);
                    // setTimeout(() => {
                    //     this.getServerData();
                    // }, 4300);
                    if (this.state.order.status != 3 && this.state.order.status != 5 && this.state.order.status != 6) {
                        // console.log("开始获取服务");
                            this.getServerData();
                            this.refs.alert.open(statusCode[data.result])
                    }
                }else{
                    this.getServerData();
                    this.refs.alert.open(statusCode[data.result]);
                }
            }
        })
    }

    /**
     * 在线支付, 接口暂时未写
     * 0申请成功，1订单编号错误，2商家尚未接单，3系统故障，4订单已支付，5订单无效，6订单已发起支付，7暂无反馈，可以再次申请“在线支付”
     */
    onlinePay () {
        //添加全局等待loading，30秒倒计时
        let params = this.props.params;
        this.refs.popup.show();
        this.refs.timer.start();
        // let hidenPopup=setTimeout(() => {
        //     this.refs.popup.hide();
        // }, 32000);
        $.ajax({
            url : "/WeixinServer/Order/OrderSocket.do",
            type : "GET",
            data: {
                orderNum:params.orderNum
            },
            dataType : 'json',
            success: (data) => {
                // clearTimeout(hidenPopup);
                this.refs.timer.remove();
                this.refs.popup.hide();
                if(data.result == 200){
                    location.href = "/WeixinServer/Pay/UnionOrderPay.htm?orderNum="+params.orderNum
                }
                else{
                    this.refs.alert.open(statusCode[data.result]);
                }
            }
        })
    }

    componentDidMount() {
        this.getServerData();
    }

    refresh() {
        let $refresh = $(findDOMNode(this.refs.refresh));
        $refresh.addClass("animation");
        if(this.lock){
            return false;
        }
        this.getServerData((data) => {
            setTimeout(()=>{
                this.lock = false;
                $refresh.removeClass("animation");
            }, 1000)
        });
        this.lock = true;
    }

    renderDetail(detail) {
        return detail.map(function(item, index){
            if (item.dishName == '餐具费' && item.cost == 0) {
                return null
            }
            return (
                <div className="dish-wrap" key={index}>
                    <span className="dish-name">{item.dishName}</span>
                    <span className="dish-number">x{item.count}</span>
                    <span className="fr dish-total">¥{item.cost}</span>
                </div>
            )
        })
    }

    renderOrder (detail) {
        return detail.map((item, index) => {
            //订单状态（1下单成功，2商家已接单，3无效订单，4商家安排上菜，5订单完成）
            let orderStatus = ["icon"];
            let orderStatusStr;
            let status = {1:"not-confirmed", 2 : "dining", 3 : "invalid", 4 : "dining", 5 : "done", 6 :"invalid"};

            orderStatus.push(status[item.status||1]);
            orderStatusStr = orderStatus.join(" ");
            let styles = {
                xiaoji:{
                    borderTop:"1px solid #dedede"
                }
            }
            return (
                <div className="order-item" key={index}>
                    <div className="line-item">
                        <div className={orderStatusStr}></div>
                        <div className="order-list">{index == 0 ? "订单编号" : "加菜单号"}<span className="fr">{item.orderNum}</span></div>
                        <div className="order-list">下单时间<span className="fr">{item.orderTime}</span></div>
                        <div className="order-list">订单备注<span className="fr">{item.remark||"无"}</span></div>
                        <div className="order-list">订单明细</div>
                        {this.renderDetail(item.detail)}
                        <div className="order-list">订单小计：<span>¥{item.subtotal}</span></div>
                    </div>
                    <div className="grey-bar"></div>
                </div>
            )
        })
    }

    goOrderList(orderNum){
      location.href = ["#","orderlist"].join("/");
    }

    render() {
        let socket = this.props.route.socket;
        let state = this.state;
        let params = this.props.params;
        let order = state.order;
        let orderStatus = {1:"您已下单成功", 2 : "", 3 : "订单已取消！", 4 : "商家已接单", 5 : "订单已完成！",6 : "订单已取消！"};
        let waitMessage = {1:"等待商家确认",2 : "", 3 : "",4:"正在为您准备菜品",5 : ""}
        let orders = [];

        let bottomButtonClassName = ["page-footer"];
        let bottomButtonStatus = {1:"", 2 : "", 3 : "disable", 4 : "", 5 : "disable", 6 :"disable"};
        let bottomButtonClassNameStr;
        bottomButtonClassName.push(bottomButtonStatus[order.status]);
        bottomButtonClassNameStr = bottomButtonClassName.join(" ");




        let styles = {
          head:{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center"
          },
          waitMessage:{
            display:waitMessage[state.order.status] == "" ? "none" : "block"
          },
          orderIco:{
            display: "inline-block",
            backgroundSize:"208px 163px",
            backgroundPosition: "-93px 2px",
            padding:" 0px 0px 1px 0px"
          }
        }
        orders.push(order);
        orders = orders.concat(state.addOrder || []);
        return (
            <div className="orderform-content">
                <div className="head" style={styles.head}>
                    <span>桌号：{order.tableNum}</span>
                    <span style={styles.orderIco} className="icon order" onClick={this.goOrderList.bind(this,order.orderNum)}></span>
                </div>
                <div className="wait-order">
                    <span className="order-status">{orderStatus[state.order.status]}</span>
                    <span className="wait-message">{waitMessage[state.order.status]}</span>
                </div>
                <div className="grey-bar"></div>
                <div className="column-totals">
                    <span>金额总计：¥{order.totalPrice}</span>
                    <Button ref="refresh" className="fr order-refresh" onTap={this.refresh.bind(this)}></Button>
                </div>
                <div className="grey-bar"></div>
                {this.renderOrder(orders)}
                <div className= {bottomButtonClassNameStr}>
                    <Button className="back" onTap={this.addFood.bind(this)} value="继续加菜" />
                    <Button className="submit" onTap={this.isAcceptedBySeller.bind(this)} value="在线支付" />
                </div>
                <Popup ref="popup" className="popup-center" disableClick="true" zIndex="9999">
                    <Timer ref="timer" className="confirm-info" second="30"/>
                </Popup>
                <Alert ref="alert"/>
            </div>
        );
    }
}
