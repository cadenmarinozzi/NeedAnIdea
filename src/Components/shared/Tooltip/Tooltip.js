import { Component, createRef } from 'react';
import './Tooltip.scss';

class Tooltip extends Component {
	constructor({ showTooltip }) {
		super();

		this.state = { showTooltip };
		this.tooltipRef = createRef();
	}

	componentDidMount() {
		this.tooltipRef.current.parentElement.addEventListener(
			'mouseenter',
			() => {
				this.toggleTooltip(true);
			}
		);

		this.tooltipRef.current.parentElement.addEventListener(
			'mouseleave',
			() => {
				this.toggleTooltip(false);
			}
		);
	}

	toggleTooltip(showTooltip) {
		this.setState({ showTooltip });
	}

	render() {
		const { message } = this.props;
		const { showTooltip } = this.state;

		return (
			<div
				className={`tooltip ${showTooltip && 'tooltip-show'}`}
				ref={this.tooltipRef}>
				<span className='message'>{message}</span>
			</div>
		);
	}
}

export default Tooltip;
