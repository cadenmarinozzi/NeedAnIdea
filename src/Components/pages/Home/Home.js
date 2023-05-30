import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Home.scss';
import {
	faDice,
	faPaperPlane,
	faRotateRight,
	faSearch,
	faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { Component } from 'react';
import Tooltip from 'Components/shared/Tooltip/Tooltip';
import { promptChatGPT } from 'modules/web/OpenAI';
import { Gradient } from 'react-gradient';
import OpenAILogo from 'assets/images/OpenAI.png';
import MarkdownIt from 'markdown-it';

const gradients = [
	['#93f2ff', '#ba9cff'],
	['#ff822f', '#aa11ff'],
];

const exampleInputs = [
	'Give me some cool programming ideas...',
	'What should I code today?',
	'I need some ideas for my AI project...',
	'5 ideas for my next project...',
	'What are some cool programming ideas?',
	'I need a beginner project idea...',
];

class Home extends Component {
	constructor() {
		super();

		this.state = { currentPlaceholder: 0 };
	}

	createPlaceholderInterval() {
		this.placeholderInterval = setInterval(() => {
			let { currentPlaceholder, currentPrompt } = this.state;

			if (currentPrompt) return;

			if (currentPlaceholder === exampleInputs.length - 1) {
				currentPlaceholder = 0;
			} else {
				currentPlaceholder++;
			}

			this.setState({
				currentPlaceholder,
			});
		}, 2000);
	}

	componentDidMount() {
		this.createPlaceholderInterval();
	}

	componentWillUnmount() {
		clearInterval(this.placeholderInterval);
	}

	async submitPrompt() {
		const { currentPrompt } = this.state;

		if (!currentPrompt) return;

		this.setState({
			submittingPrompt: true,
			currentPrompt: null,
		});

		const messages = [
			{
				role: 'system',
				content:
					'When asked to generate project ideas for a programming project, generate a list of ideas or a single idea. Be concise.',
			},
			{
				role: 'user',
				content: currentPrompt,
			},
		];

		const completion = await promptChatGPT(messages);

		this.setState({
			submittingPrompt: false,
			generatedResult: completion,
		});
	}

	async generateRandomPrompt() {
		this.setState({
			generatingPrompt: true,
			currentPrompt: null,
		});

		const messages = [
			{
				role: 'system',
				content:
					'When asked, generate a random prompt for generating a programming project. Include keywords such as "AI" and "cool" etc in the prompt. Keep the prompt short and concise. Ex: "Generate 5 machine learning projects." or "Give me some cool project ideas." Don\'t use the word "Create"',
			},
			{
				role: 'user',
				content: 'Generate me a prompt.',
			},
			{
				role: 'assistant',
				content: 'Give me a list of some cool project ideas.',
			},
			{
				role: 'user',
				content: 'Generate me a prompt.',
			},
		];

		const completion = await promptChatGPT(messages);

		this.setState({
			currentPrompt: completion,
			generatingPrompt: false,
		});
	}

	render() {
		const {
			currentPlaceholder,
			currentPrompt,
			generatingPrompt,
			submittingPrompt,
			generatedResult,
		} = this.state;

		let rendered;

		if (generatedResult) {
			const md = MarkdownIt({
				linkify: true,
				breaks: true,
			});

			rendered = md.render(generatedResult);
		}

		return (
			<div className='home'>
				<Gradient
					gradients={gradients}
					property='text'
					element='h1'
					className='title'
					angle='90deg'>
					Need an Idea?
				</Gradient>
				{rendered ? (
					<div className='result'>
						<div
							className='result-text'
							dangerouslySetInnerHTML={{
								__html: rendered,
							}}
						/>
						<button
							className='button'
							onClick={() => {
								this.setState({
									generatedResult: null,
									currentPrompt: null,
								});
							}}>
							<FontAwesomeIcon icon={faRotateRight} />
							Generate Another
						</button>
					</div>
				) : submittingPrompt ? (
					<div className='loader'>
						Generating... <FontAwesomeIcon icon={faSpinner} spin />
					</div>
				) : (
					<div className='hero'>
						<div className='hero-input'>
							<input
								className='input'
								value={currentPrompt ?? ''}
								type='text'
								placeholder=' '
								onChange={(e) => {
									this.setState({
										currentPrompt: e.target.value,
									});
								}}
							/>
							<span
								className={`placeholder ${
									currentPrompt && 'placeholder-hidden'
								}`}>
								{generatingPrompt ? (
									<FontAwesomeIcon icon={faSpinner} spin />
								) : (
									exampleInputs[currentPlaceholder]
								)}
							</span>
							<FontAwesomeIcon
								className='icon'
								icon={faPaperPlane}
								onClick={this.submitPrompt.bind(this)}
							/>
						</div>
						<div className='randomize-icon'>
							<FontAwesomeIcon
								className='icon'
								icon={faDice}
								onClick={this.generateRandomPrompt.bind(this)}
							/>
							<Tooltip
								message={`Don\'t know what to type? Generate a random prompt!`}
							/>
						</div>
					</div>
				)}
				<span className='caption'>
					Powered by OpenAI{' '}
					<img alt='OpenAI Logo' width={20} src={OpenAILogo} />
				</span>
			</div>
		);
	}
}

export default Home;
