import React from 'react';

export class NoMatch extends React.Component {
    render() {
        return (
            <>
                <main className="error-page">
                <h1 className="error-page__title">404 - Can't find that one...</h1>

                <svg className="periscope" width="312" height="242" viewBox="0 0 312 242" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="131.69" y="54.3328" width="44.1055" height="134.873" fill="#172B38" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M154.369 85.066C172.197 85.066 186.649 90.2854 186.649 96.7239V105.153C186.649 105.153 186.649 105.154 186.649 105.154C186.647 111.592 172.196 116.811 154.369 116.811C136.542 116.811 122.091 111.592 122.089 105.154C122.089 105.154 122.089 105.153 122.089 105.153V96.7239C122.089 90.2854 136.541 85.066 154.369 85.066Z"
                    fill="#213E50" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M214.148 5.75289L175.795 10.2274C151.437 10.2274 131.69 29.9741 131.69 54.3328L131.677 54.3328V97.1599H131.966C131.962 97.21 131.96 97.2603 131.96 97.3107C131.96 100.901 141.81 103.811 153.96 103.811C166.11 103.811 175.96 100.901 175.96 97.3107C175.96 97.0298 175.9 96.7531 175.783 96.4816V54.3328L175.795 54.3328L214.148 58.8073V5.75289Z"
                    fill="#172B38" />
                    <rect x="217.983" y="3.8147e-06" width="10.2274" height="64.5602" fill="#213E50" />
                    <ellipse cx="228.211" cy="32.2801" rx="21.7331" ry="32.2801" fill="#213E50" />
                    <ellipse cx="218.623" cy="32.2801" rx="21.7331" ry="32.2801" fill="#213E50" />
                    <g filter="url(#filter0_i)">
                        <ellipse cx="226.932" cy="32.2801" rx="17.8979" ry="26.5272" fill="white" />
                    </g>
                    <ellipse cx="228.211" cy="32.2801" rx="4.47447" ry="6.7117" fill="black" className="pupil" />
                    <path d="M19.0995 241.621C19.0995 183.019 66.6061 135.512 125.208 135.512V135.512C183.811 135.512 231.317 183.019 231.317 241.621V241.621H19.0995V241.621Z" fill="#0966C0" />
                    <path d="M159.163 241.621C159.163 201.772 191.468 169.467 231.317 169.467V169.467C271.167 169.467 303.471 201.772 303.471 241.621V241.621H159.163V241.621Z" fill="#047EF5" />
                    <path d="M7.42761 241.621C7.42761 213.199 30.4683 190.159 58.8904 190.159V190.159C87.3125 190.159 110.353 213.199 110.353 241.621V241.621H7.42761V241.621Z" fill="#0471DB" />
                    <circle cx="281.188" cy="167.345" r="12.7331" fill="#CDCDCD" />
                    <circle cx="281.188" cy="154.612" r="12.7331" fill="#EBEBEB" />
                    <circle cx="299.227" cy="154.612" r="12.7331" fill="#CDCDCD" />
                    <circle cx="12.7331" cy="160.979" r="12.7331" fill="#EBEBEB" />
                    <defs>
                        <filter id="filter0_i" x="209.034" y="5.75289" width="38.7958" height="53.0544" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dx="3" />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                            <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
                        </filter>
                    </defs>
                </svg>

                <a className="error-page__link" href="/admin/">Go back to the Backend</a>
                </main>
            </>
        )
    }
}
