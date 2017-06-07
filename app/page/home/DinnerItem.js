import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import LazyLoad from 'react-lazyload';
import AddButton from '../../modules/AddButton';
import Button from '../../modules/Button';

export default class DinnerItem extends Component{
   constructor(props) {
	   super(props);
	   this.state = {
	   };
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
	   // console.log("右边item 比较");
	   return (this.state.number !== nextState.number);
	   // && nextState.number >= 0
   }
   render () {
	   // console.log("右边item渲染");
	//    console.log(this.state);
	   var self = this;
	   var item = this.state;
	   var index = this.state.index;
	   item["_index"] = this.state.index;
	   return (
		   <div key={index} className="menu">
			   <div className="menu-pic">
				   <LazyLoad overflow={true} height={95} >
					   <img ref="dishPicture" className="nophoto" src={item.dishPicture} alt="" />
				   </LazyLoad>
			   </div>
			   <div className="menu-right">
				   <div className="menu-right-title">{item.dishName}</div>
				   <div className="menu-right-vip">
					   <span className="icon vipicon"></span>
					   <span>¥{item.vipprice}</span>
				   </div>
				   <div className="menu-right-title">¥{item.dishPrice}</div>
				   <div className="menu-oprate fr ">
					   <Button className="fl icon remove" onTap={self.update.bind(self, "remove", item)}/>
					   <span className="fl addsub-number">{item.number||0}</span>
					   <AddButton className="fl icon add"  onTap={self.update.bind(self, "add", item)} />
				   </div>
			   </div>
		   </div>
	   )
   }
}
