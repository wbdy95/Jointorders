import React, { Component } from 'react';


export default class ShoppingCart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        }
    }

    render() {
        
        return (
			<div>
                 <div className="shopcart-wrap" id="loadBooking">
                    <div className="shopcart">
                        <span className="redbar"></span>
                        <span className="greybar">购物车</span>
                    </div>
                    <ul className="cartlist">
                        <li className="cartlist-wrap">
                            <div>
                                <span className="dishname">鱼香肉丝</span>
                                <span className="dishcost">¥12255</span>
                                <span className="fr">
                            <span className="dishadd fl"></span>
                                <span className="cartcopies fl">1</span>
                                <span className="dishsum fl"></span>
                            </span>
                            </div>
                            <div className="dishremark">大份</div>
                        </li>
                        <li className="cartlist-wrap">
                            <div>
                                <span className="dishname">鱼香肉丝</span>
                                <span className="dishcost">¥12255</span>
                                <span className="fr">
                            <span className="dishadd fl"></span>
                                <span className="cartcopies fl">1</span>
                                <span className="dishsum fl"></span>
                                </span>
                            </div>
                            <div className="dishremark">大份</div>
                        </li>
                        <li className="cartlist-wrap">
                            <div>
                                <span className="dishname">鱼香肉丝</span>
                                <span className="dishcost">¥12255</span>
                                <span className="fr">
                            <span className="dishadd fl"></span>
                                <span className="cartcopies fl">1</span>
                                <span className="dishsum fl"></span>
                                </span>
                            </div>
                            <div className="dishremark">大份</div>
                        </div>
                    </li>  
                </ul>
                <div className="grey-bar"></div>
            </div>
        );
    }
}