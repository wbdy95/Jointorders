import React, { Component } from 'react';
import Button from '../modules/Button'
import Alert from '../modules/Alert'
import SimpleTimer from '../modules/SimpleTimer'

export default class Pay extends Component {
    constructor(props) {
        super(props);
        this.isLoad = false;
        //cardFlag 会员卡支付标识（1代表用会员卡支付）
        //VIPCARD 0 代表有会员卡
        this.VIPCARD = 0;
        this.VIPPAY = 1;
        this.WXPAY = 0;
        this.state = {
            cardFlag : 0
        }
    }

    paySuccess () {
        location.href = "#orderform/"+this.props.params.orderNum
    }

    callpay(appid, timeStamp, nonceStr, packages, paySign){
        window.WeixinJSBridge && WeixinJSBridge.invoke('getBrandWCPayRequest',{
            "appId" : appid,
            "timeStamp" : timeStamp,
            "nonceStr" : nonceStr, 
            "package" : packages,
            "signType" : "MD5", 
            "paySign" : paySign 
        },(res) => {
            if(res.err_msg == "get_brand_wcpay_request:ok"){
                //支付成功
                this.paySuccess();
            }else if(res.err_msg == "get_brand_wcpay_request:cancel"){  
                //alert("用户取消支付!");
                this.refs.alert.open("用户取消支付!")
               
            }else{
                //支付失败
                this.refs.alert.open("支付失败")
            }  
        })
    }

    pay () {
        // let statusCode = {
        //     0 : "付款成功",
        //     1 : "订单编号错误",
        //     2 : "订单不存在",
        //     3 : "系统故障",
        //     4 : "订单无效",
        //     5 : "订单已付款",
        //     6 : "申请支付信息为空",
        //     7 : "申请支付信息失效",
        //     8 : "会员付款接口调用失败",
        //     9 : "需调用微信付款接口"
        // }
        let params = this.props.params;
        $.ajax({
            url : "/WeixinServer/OrderPay/UnionOrderPay.do",
            type : "GET",
            data: {
                orderNum:params.orderNum,
                cardFlag : this.state.cardFlag
            },
            dataType : 'json',
            success: (data) => {
                let _data = data.data;
                if(data.result == 201){
                    this.callpay(_data.appid, _data.timeStamp, _data.nonceStr, _data.packages, _data.paySign)
                }else if(data.result == 200){
                    //付款成功跳转到订单详情页
                    this.paySuccess();
                }else{
                    this.refs.alert.open(statusCode[data.result]||500);
                }
            }
        })
    }

    getServerData (successCB) {
        //http://172.16.38.222:8080/WeixinServer/Dish/DataDishInfo.json?storeCode=1473069421738&tableNum=008
        let params = this.props.params;
        $.ajax({
            url : "/WeixinServer/Order/OrderCompute.do",
            type : "GET",
            data: {
                orderNum:params.orderNum
            },
            dataType : 'json',
            success: successCB
        })
    }

    componentDidMount() {
        // let statusCode = {
        //     0 : "计算成功",
        //     1 : "订单编号错误",
        //     2 : "菜品信息为空",
        //     3 : "系统故障",
        //     4 : "申请支付信息失效"
        // }
        this.getServerData((data) =>{
            this.isLoad = true;
            //data.cardResult = 0;
            /*cardResult:0,代表有会员卡，
            cardFlag:1, 代表使用会员卡支付；*/
            if(data.result == 200){
                let _data = data.data;
                let _state = {
                    cardFlag : _data.cardResult == this.VIPCARD ? this.VIPPAY : this.WXPAY
                }
                this.setState(
                    Object.assign(_state, _data)
                );
                this.refs.simpleTimer.start(300);
            }else{
                this.refs.alert.open(statusCode[data.result]);
            }
            
        });
    }

    renderCart () {
        let state = this.state;
        let isChecked = state.cardFlag == this.VIPPAY ? "fr icon checked" : "fr icon check";
        if(state.cardResult == this.VIPCARD){
            return (
                <div className="contain">
                    <span className="pay-card"></span>
                    <span className="ml">会员卡支付</span>
                    
                    <Button className={isChecked} onTap={this.selectCardFlag.bind(this, this.VIPPAY)}></Button>
                    <span className="fr">余额：{state.surplusMoney||0}</span>
                </div>
            )
        }else{
            /*return (
                <div className="contain">
                    <span className="pay-card"></span>
                    <span className="ml">会员卡支付</span>
                    <span className="pay-ico fr"></span>
                    <span className="pay-go fr">前往开通</span>
                </div>
            )*/
            return null;
        }
    }

    //使用优惠券
    renderDiscount () {
        let state = this.state;
        return (
            <div className="coupon">
                <div className="fl">使用优惠券</div>
                <div className="fr">
                    <span className="text">4.0元代金券</span>
                    <span className="ico"></span>
                </div>
            </div>
        )
    }

    selectCardFlag (cardFlag) {
        this.setState({
            cardFlag:cardFlag
        })
    }

    render() {
        let socket = this.props.route.socket;
        let state = this.state;
        let cutMoney = "", price = state.price;

        //会员卡标识 cardResult 是否有会员卡（0有，1没有）
        if(state.cardResult == 0){
            price = state.vipPrice;
        }

        if(state.cutMoney > 0){
            cutMoney = <div className="order-list"><span>满减优惠</span><span className="fr">¥{state.cutMoney}</span></div>
        }
        
        let isChecked = state.cardFlag != this.VIPPAY ? "fr icon checked" : "fr icon check";

        return (
			<div>
                <div className="head">
                    <span>桌号{socket.tableNum}</span>
                </div>
                <div className="pay-wrap">
                    <div className="content-list">请选择支付方式</div>
                    {this.renderCart()}
                    <div className="content-list">
                        <span className="pay-weixin"></span>
                        <span className="ml">微信支付</span>
                        <Button className={isChecked} onTap={this.selectCardFlag.bind(this, this.WXPAY)}></Button>
                    </div>
                </div>
                <div className="grey-bar"></div>
                <div className="pay-wrap">
                    <div className="order-list">
                        <span>商品金额</span>
                        <span className="fr">¥{price}</span>
                    </div>
                    {cutMoney}
                </div>
                <div className="pay-price">
                    <p>实付{state.actualPay}</p>
                </div>
                <div className="grey-bar"></div>
                <Button className="footer-pay" onTap={this.pay.bind(this)}>
                    <span>立即支付</span>
                    <SimpleTimer ref="simpleTimer"></SimpleTimer>
                </Button>
                <Alert ref="alert"/>
            </div>
        );
    }
}