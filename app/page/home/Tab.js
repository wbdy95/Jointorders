import React, { Component } from 'react';

export default class Tab extends Component {
	constructor(props) {
        super(props);

        this.state = {
        	tabs:[
				{
					text: '菜单',
					actived: true
				}, {
					text: '订单',
					actived: false
				}, {
					text: '我的',
					actived: false
				}
			]
        }
    }

	render() {
		var self = this;
		var list = this.state.tabs.map(function(item, index){
			var actived = item.actived ? "tab-item active" : "tab-item";
			return <div key={index} className={actived} >{item.text}</div>
		})
		return (
			<div>
				<div className="tab">
			        {list}
			    </div>
		    </div>
		);
	}
}