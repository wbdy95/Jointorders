import React, { Component } from 'react';
import Alert from '../modules/Alert';

const renshupic = require('../images/number/renshupic.png')

export default class Number extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userNumber:"0"
        }
    }

    getServerData (callback) {
        let socket = this.props.route.socket;
        let params = this.props.params;
        $.ajax({
            url : "/WeixinServer/Dish/PeopleNum.do",
            type : "GET",
            data: {
                storeCode:socket.storeCode,
                tableNum:socket.tableNum,   //桌号
                peopleNum : this.state.userNumber
            },
            dataType : 'json',
            success: callback
        })
    }

    delet () {
        this.setState({
            userNumber : "0"
        })
    }

    onSelectUser (number) {
        if(parseInt(this.state.userNumber + String(number)) < 1000){
            this.state.userNumber += String(number);
            this.setState({
                userNumber : parseInt(this.state.userNumber)
            })
        }else{
            this.refs.alert.open("点餐人数不能超过3位数");
        }

        
    }
    goHome () {
        let socket = this.props.route.socket;
        socket.userNumber = this.state.userNumber;
        this.getServerData((data) => {
            console.log(data.result);
            if(data.result == 200){
                if(socket.userNumber > 0){
                    location.href="#home";    
                }else{
                    this.refs.alert.open("点餐人数不能为0");
                }
            }else{
                this.refs.alert.open("服务器请求失败，请重试")
            }
        })
    }

    render() {
        let _arr = [];
        for (let i = 1; i <= 9; i++) {
            _arr.push(<li className="key" key={i} onClick={this.onSelectUser.bind(this, i)}><span>{i}</span></li>);
        }
        _arr.push(<li className="key" key={0} onClick={this.onSelectUser.bind(this, 0)}><span>{0}</span></li>)
        _arr.push(<li className="key delet" key={11} onClick={this.delet.bind(this)}><span>{"清除"}</span></li>)

        return (
            <div className="number-bg">
                <div className="wrap">
                    <div className="number-img"><img src={renshupic} width="141" height="125" alt="" /></div>
                    <div className="number-info">
                        <div className="fl"> <span>桌号</span> <span className="digital">{this.props.route.socket.tableNum}</span></div>
                        <div className="fr"> <span>用餐人数</span> <span className="digital">{this.state.userNumber}</span> <span>人</span> </div>
                    </div>
                        <ul className="keyboard">
                            {_arr}
                        </ul>
                        <div className="btn">
                            <input type="button" className="btn-bg" value="开始点餐" onClick={this.goHome.bind(this)} />
                        </div>
                </div>
                <Alert ref="alert"/>
            </div>
        );
    }
}