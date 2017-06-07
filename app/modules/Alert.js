import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import Button from './Button';

/**
 * Alert类，一个提示组件.
 * @constructor
 * @param {boolean} isShowCloseBtn - 是否显示，默认false
 * @param {string} title - 标题，默认""
 * <Popup ref="popup" isShow={true|false}>
 *		弹窗内容
 *	</Popup>
 */
export default class Alert extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	title : this.props.title,
            content : this.props.content
        }
    }
    /**
     * 
     */
    open (str) {
        this.setState({
            content : str
        })
        $(findDOMNode(this.refs.alert)).fadeIn('slow', ()=>{
            setTimeout(() => {
                this.close();
            }, 2000)
        });
    }

    close () {
        console.log("close")
        $(findDOMNode(this.refs.alert)).fadeOut('slow');
    }

	render(){
        let title = null, closeBtn = null, isShowCloseBtn = this.props.isShowCloseBtn || false;
        if(isShowCloseBtn){
            closeBtn = <Button className={this.props.className} onTap={this.close.bind(this)} value="关闭"/>;
        }

        if(this.state.title){
            title = <h6 className="title">{this.state.title}</h6>
        }
		return <div ref="alert" className="confirm-info" style={{display:"none"}}>
            {closeBtn}
            {title}
			<span>{this.state.content}</span>
		</div>
	}
}
