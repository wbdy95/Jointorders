import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import Button from '../../modules/Button';
const renshupic = require('../../images/number/renshupic.png')

export default class Search extends Component {
	constructor(props) {
        super(props);

        this.state = {

        }
    }

    getServerData () {
        //http://172.16.38.222:8080/WeixinServer/Dish/DataDishInfo.json?storeCode=1473069421738&tableNum=008
        
        let socket = this.props.socket;
        $.ajax({
            url : "/WeixinServer/Store/StoreQuery.do",
            type : "GET",
            data: {
                storeCode:socket.storeCode
            },
            dataType : 'json',
            success: (data) => {
				// console.log(data);
                if(data.result == 200){
                    this.setState(data.data);
                }
            }
        })
    }

    componentDidMount() {
        this.getServerData();
    }

    goOrderList () {
        location.href = "#orderlist";
    }

	handleRefresh(){
		let $homeRefresh = $(findDOMNode(this.refs.homeRefresh));
		$homeRefresh.addClass("animation");
		this.props.getRefreshData();
		setTimeout(()=>{
				this.lock = false;
				$homeRefresh.removeClass("animation");
			}, 1000)
	}
	render() {
		let state = this.state;
		$('.header').on('touchmove', function (event) {
			event.preventDefault();
		});
		return (
            <div className="header">
                <span><img className="logo" src={renshupic} width="30" height="30" /></span>
                <span className="store-name">{state.storeName}</span>
				<i onClick={this.handleRefresh.bind(this)} ref="homeRefresh" className="order-ico icon home-refresh"></i>
                <Button className="order-ico icon order" onTap={this.goOrderList.bind(this)}></Button>
             </div>
		);
	}
}
