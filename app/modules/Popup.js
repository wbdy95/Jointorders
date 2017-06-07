import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';

/**
 * Popup类，一个弹窗组件.
 * @constructor
 * @param {boolean} isShow - 是否显示，默认false
 * <Popup ref="popup" isShow={true|false}>
 *		弹窗内容
 *	</Popup>
 */
export default class Popup extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	isShow: this.props.isShow || false,
        	zIndex: this.props.zIndex || 1,
        	disableClick:this.props.disableClick || false
        }
    }
    /**
     * 交替显示
     */
    toggle () {
    	this.setState({isShow: !this.state.isShow});
    }
	/**
     * 隐藏弹窗
     */
    hide () {
    	this.setState({isShow: false});
    }

    maskOnClick (){
    	!this.state.disableClick && this.hide();
    }
    /**
     * 隐藏弹窗
     */
    show () {
    	this.setState({isShow: true});
    }

    componentWillReceiveProps(nextProps) {
    	this.setState({isShow: nextProps.isShow||this.state.isShow});	
    }

    componentDidUpdate () {
    	if(this.state.isShow){
    		$(findDOMNode(this.refs.popup)).fadeIn('slow').addClass("popup-active");
            $("body").css("overflow", "hidden").scrollTop(0);
    	}else{
    		$(findDOMNode(this.refs.popup)).removeClass("popup-active").fadeOut('slow');
            $("body").css("overflow", "auto");
    	}
    }
	render(){
        let _className = "popup " + this.props.className;
        $('#loadBooking').bind('touchmove',function(event){event.preventDefault();});
		return <div ref="popup"  className={_className} style={{zIndex:this.state.zIndex}} >
			<div ref="mask" className="popup-mask"  id="loadBooking" onClick={this.maskOnClick.bind(this)}></div>			<div className="popup-content">{this.props.children}</div>
		</div>
	}
}
