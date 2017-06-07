import React, { Component } from 'react';

export default class Prefer extends Component {
	constructor(props) {
        super(props);

        this.state = {
        	perferInfo : "满25减12；满50减20"
        }
    }

	render() {
		var preferInfo = this.state.perferInfo;
		return (
			<div>
				<div className="prefer">
				    <span className="icon">减</span>{preferInfo}
				    <span className=" fr arrow"><i className="iconfont">&#xe607;</i></span>
				</div>
				<div className="prefer-border"></div>
			</div>
		);
	}
}