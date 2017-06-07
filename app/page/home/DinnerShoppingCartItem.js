import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import DinnerItem from './DinnerItem'
import Button from '../../modules/Button';

export default class DinnerShoppingCartItem extends Component{

	constructor(props) {
        super(props);
        this.state = Object.assign({
        	index : this.props.index
        }, this.props.data);
    }

    update (type, item) {    	
    	let oldItem = Object.assign({}, item);
    	this.props.update(type, oldItem);

    	if(type == "remove" && item.number <= 0){
    		return false;
    	}
    	let socket = this.props.socket;
    	let action = {
    		type : type + "ProductFromShoppingCart"
    	}
		socket.send(JSON.stringify(
    		Object.assign(action, {state:oldItem}) 
    	))
    }

    componentWillReceiveProps(nextProps) {
    	this.setState(Object.assign({
        	index : nextProps.index
        }, nextProps.data))
    }

    shouldComponentUpdate(nextProps, nextState) {
        //console.log("数量一致：",this.state.number == nextState.number, "id一致：", this.state.id == nextState.id, this.state.dishName, nextState.dishName)
        return (this.state.id == nextState.id && this.state.number != nextState.number) || (this.state.id != nextState.id);
    }

	render () {
		var self = this;
        var item = this.state;
        var index = this.state.index;
        item["_index"] = this.state.index;
		let typeCountPrice = Math.round(item.dishPrice * item.number * 100)/100;
		return (
	        <li key={index} className="cartlist-wrap">
                <div>
                    <span className="fl dishname">{item.dishName}</span>
                    <span className="fl dishcost">¥{typeCountPrice}</span>
                    <span className="fr dishsum">
                    	<Button className="fl icon remove" onTap={self.update.bind(self, "remove", item)}/>
	                	<span className="cartcopies fl">{item.number}</span>
	                	<Button className="fl icon add" onTap={self.update.bind(self, "add", item)} />
                    </span>
                </div>
            </li>
		)
	}
}

/*DinnerItem.propTypes = {
	data : React.PropTypes.shape({
	  	number: React.PropTypes.number.isRequired
	})
}*/