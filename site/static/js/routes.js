// import React from 'react';
// import { BrowserRouter, Link, Route } from 'react-router-dom';
// import { Header } from './components/header';
// const axios = require('axios');
//
// class AppRouter extends React.Component {
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             pageData: {},
//             isLoaded: false,
//             error: null
//         };
//     }
//
//     componentDidMount() {
//         axios.post('/page-data', {
//             test: "hello"
//         })
//         .then((response) => {
//             console.log(response.data)
//             this.setState({
//                 isLoaded: true,
//                 pageData: response["data"]
//             });
//         })
//         .catch(function (error) {
//             // handle error
//             console.log(error);
//         });
//     }
//
//     render() {
//         if (this.state.error) {
//         } else if (!this.state.isLoaded) {
//             return (
//                 <BrowserRouter>
//                     <div>
//                         <Route exact path="/" component={Header} />
//                     </div>
//                 </BrowserRouter>
//             )
//         } else {
//             var links = this.state.pageData.map((page, index) => {
//                 return (
//                     <li key={index}><Link to={"/" + page.name}>{page.name}</Link></li>
//                 )
//             })
//             var routes = this.state.pageData.map((page, index) => {
//                 return (
//                     <Route exact path={"/" + page.name} value={page} component={Header} key={index} />
//                 )
//             })
//
//             return (
//                 <BrowserRouter>
//                     <nav>
//                         <ul>
//                             { links }
//                         </ul>
//                     </nav>
//                     <div>
//                         { routes }
//                     </div>
//                 </BrowserRouter>
//             )
//         }
//     }
// }
// export default AppRouter
