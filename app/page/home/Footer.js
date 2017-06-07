import React, { Component } from 'react';
import Button from '../../modules/Button';
var logo = require('../../images/index/logo.jpg');

// class FooterTip extends Component{
//
//     render () {
//         return (
//             <div className=" pic-wrap" style={{display:"none"}}>
//                 <span ><img className="portrayal" src={logo} width="30" height="30" /></span>
//                 <span className="dishname">水电费水电费水电费水电费是的无可奈何花落去</span>
//             </div>
//         )
//     }
//
// }

export default class Footer extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	productCountPrice: this.props.shoppingCart.productCountPrice,
        	shoppingCartCount: this.props.shoppingCart.shoppingCartCount
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.shoppingCart.productCountPrice.toFixed(2) <= -0.00) {
            this.setState({
                productCountPrice: 0,
                shoppingCartCount:0
            })
        } else {
			$("#amount").removeClass("animated rubberBand");
			setTimeout(() => {
				$('#amount').addClass('animated rubberBand');
			}, 200);
            this.setState({
                productCountPrice: nextProps.shoppingCart.productCountPrice.toFixed(2),
                shoppingCartCount: nextProps.shoppingCart.shoppingCartCount
            })
        }
    }

	render() {
		var state = this.state;
        let isDisable = !state.shoppingCartCount ? "disable" : "";
        $('footer').on('touchmove', function (event) {
            event.preventDefault();
        });
		return (
			<footer className={[isDisable,"footer"].join(" ")} ref="footer">

        		<div className="price" onTouchTap={() => {state.shoppingCartCount && this.props.toggleShoppingCart() }}>
            		<span className="amount">¥{state.productCountPrice}</span>
            		<div className="icon cart" id="amount">
                		<div className="count">{state.shoppingCartCount}</div>
            		</div>
             	</div>
                <Button className="pick" disable={!state.shoppingCartCount} onTap={this.props.pickBtnClick}> 选好了</Button>
    		</footer>
		);
	}
}
//限制输出类型，否则报错
Footer.propTypes = {
	productCountPrice: React.PropTypes.number,
	shoppingCartCount : React.PropTypes.number
}