import React from 'react';
import { Button } from '../button';
import * as Icon from 'react-feather';
Icon.Quote = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={props.className}>
            <path d="M3 14.7122C3 13.3256 3.47147 11.8539 4.41442 10.2972C5.37029 8.72747 7.08827 7.29506 9.56835 6L10.0334 6.88299C8.79333 7.77253 7.87621 8.51817 7.28202 9.11991C6.23574 10.2057 5.71259 11.2456 5.71259 12.2398C5.71259 12.5799 5.80947 12.8023 6.00323 12.907C6.19699 13.0247 6.36491 13.0836 6.507 13.0836C6.99785 13.0182 7.32077 12.9855 7.47578 12.9855C8.30248 12.9855 8.98062 13.2929 9.51023 13.9077C10.0398 14.5094 10.3046 15.242 10.3046 16.1054C10.3046 17.0734 10.014 17.8844 9.43272 18.5385C8.85145 19.1795 8.05059 19.5 7.03014 19.5C5.82885 19.5 4.85361 19.0683 4.10441 18.2049C3.36814 17.3285 3 16.1642 3 14.7122ZM13.6954 14.7122C13.6954 13.2471 14.1991 11.7362 15.2067 10.1795C16.2142 8.62282 17.8999 7.22965 20.2637 6L20.7287 6.88299C19.5662 7.70712 18.6749 8.43314 18.0549 9.06105C16.9569 10.173 16.408 11.2064 16.408 12.1613C16.408 12.436 16.479 12.6584 16.6211 12.8285C16.7632 12.9985 16.9569 13.0836 17.2024 13.0836C17.6932 13.0182 18.0161 12.9855 18.1712 12.9855C18.9849 12.9855 19.6566 13.2863 20.1862 13.8881C20.7287 14.4898 21 15.2289 21 16.1054C21 17.1257 20.7029 17.9499 20.1087 18.5778C19.5145 19.1926 18.7072 19.5 17.6868 19.5C16.5242 19.5 15.5684 19.0683 14.8192 18.2049C14.07 17.3285 13.6954 16.1642 13.6954 14.7122Z" fill="black"/>
        </svg>
    )
}
Icon.OrderedList = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
			<line x1="8" y1="6" x2="21" y2="6"/>
			<line x1="8" y1="12" x2="21" y2="12"/>
			<line x1="8" y1="18" x2="21" y2="18"/>
			<text textAnchor="middle" style={{fontFamily: 'Inter', textAlign: 'center', transform: 'scale(.4) translate(1px, 12px)'}} x="7" y="7">1</text>
			<text textAnchor="middle" style={{fontFamily: 'Inter', textAlign: 'center', transform: 'scale(.4) translate(1px, 21px)'}} x="7" y="14">2</text>
			<text textAnchor="middle" style={{fontFamily: 'Inter', textAlign: 'center', transform: 'scale(.4) translate(1px, 30px)'}} x="7" y="21">3</text>
		</svg>
	)
}

export class Text extends React.Component {
	render() {
		return (
			<>
				<label className={"TextInput  f-2  " + this.props.className} htmlFor={this.props.inputId}>
					<span className="TextInput__label">{this.props.label}</span>
					<input className="TextInput__element  f-1" type={this.props.password ? "password" : "text"} id={this.props.inputId} defaultValue={this.props.defaultValue} />
				</label>
			</>
		)
	}
}

export class FormattedText extends React.Component {
	render() {
		return (
			<div className={"FormattedTextInput__wrapper  " + this.props.className}>
				<div className="FormattedTextInput__toolbar flex flex-justifyBetween flex-alignCenter">
					<div>
						<Button><Icon.Bold className="Icon" /></Button>
						<Button><Icon.Italic className="Icon" /></Button>
						<Button><Icon.List className="Icon" /></Button>
						<Button><Icon.OrderedList className="Icon" /></Button>
						<Button><Icon.Link className="Icon" /></Button>
						<Button><Icon.Quote className="Icon" /></Button>
					</div>
					<div>
						<Button><Icon.Eye className="Icon" /></Button>
					</div>
				</div>
				<div
	                contentEditable
	                style={{display: 'inline-block', width: '100%'}}
					className="FormattedTextInput  f-1"
					id={this.props.id}
	                dangerouslySetInnerHTML={{__html: this.props.value}}
	            ></div>
			</div>
		)
	}
}
