import React, { Component } from 'react';
import {Link} from 'react-router'

export default class Orderlist extends Component {

    constructor(props) {
        super(props);

        this.state = {
            wait:true,
            order:{
                result:"",
                data:[]
            }
        }
    }

    getServerData (callback) {
        console.log("调接口");
        $.ajax({
            url : "/WeixinServer/Order/OrderListQuery.do",
            type : "GET",
            data: {
            },
            dataType : 'json',
            success: (data) => {
                console.log(data);
                this.setState({
                    wait:false,
                    order:data
                });  // 这里没有完善
            }
        })
    }

    componentDidMount(e) {
        this.getServerData();
    }

    delet () {
        this.setState({
            userNumber : "0"
        })
    }

    onSelectUser (number) {
        if(parseInt(this.state.userNumber + String(number)) < 100){
            this.state.userNumber += String(number);
        }
        this.setState({
            userNumber : parseInt(this.state.userNumber)
        })
    }
    goHome () {
        this.getServerData((data) => {
            if(data.result == 200){
                location.href="#home/" + this.props.params.storeCode + "/" + this.props.params.tableNum;
            }
        })
    }
    handleJump (orderNum) {
        location.href = ["#orderform", orderNum].join("/");
    }

    render() {
        let list = this.state.order.data;
        let statusCode = {1:"待确认", 2:"",3:"无效单",4:"就餐中",5:"已完成",6:"无效单"};
        let statusColor = {1:"#3fca66",2:"",3:"#888888",4:"#ffad3a",5:"#2190fe",6:"#888888"};
        let styles = {
            load:{
                display:this.state.wait ? "block" : "none"
            }
        }
        var orderListStr = list.reverse().map((item,i) => {
            return (
                <div className="orderstatus-detail" onClick={this.handleJump.bind(this,item.orderNum)} key={i}>
                    <div>
                        <span className="finish" style={{background:statusColor[item.status]}}>{statusCode[item.status]}</span>
                        <span className="fr">
                        <span className="storename">{item.storeName}</span>
                        <span className="data">{item.orderTime}</span>
                        </span>
                    </div>
                    <div className="order-number">订单编号：{item.orderNum}</div>
                    <div className="amount">合计:¥{item.totalPrice}</div>
                </div>
            )
        })
        return (
            <div>
                <div className="popup-mask" style={styles.load}>
                    <div className="loadEffect">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                {orderListStr}
                <div className="masterless">
                    <span className="line"></span>
                    <span className="no-content">没有更多订单啦</span>
                    <span className="line"></span>
                </div>
            </div>
        );
    }
}
