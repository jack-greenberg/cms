import React from 'react';
import Error404 from '../404';
import LoadingScreen from '../loading-screen';
import { client } from '../api';

import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Input } from '../components/inputs/';

import * as Icon from 'react-feather';

var makeDate = (ms) => {
    if (!ms) {
        //* If there is no date, just return an em dash
        return "—";
    } else {
        let time = new Date(ms);
        return time.customFormat("#MMMM# #D#, #YYYY#, #h#:#mm# #AMPM#");    
    };
}
Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    YY = ((YYYY=this.getFullYear())+"").slice(-2);
    MM = (M=this.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=this.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
    h=(hhh=this.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    hhhh = hhh<10?('0'+hhh):hhh;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=this.getMinutes())<10?('0'+m):m;
    ss=(s=this.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
};
function id(oid) {
    return oid['$oid'];
}

export class Post extends React.Component {
    constructor(props) {
        super(props)
        this.postId = this.props.match.params.post
        this.changeTab = this.changeTab.bind(this)

        this.state = {
            data: undefined,
            ready: false,
            404: false,
            viewComponent: "overview",
        }
    }
    componentDidMount() {
        client.get('/api/v1/posts/' + this.postId)
        .then(res => {
            console.log(res)
            this.setState({
                data: res.data,
                ready: true,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                404: true,
                ready: true,
            })
        })
    }
    changeTab(e) {
        this.setState({
            viewComponent: e.target.value,
        });
    }
    render() {
        var post = this.state.data;

        if (!this.state.ready) {
            return <LoadingScreen />;
        }
        if (this.state[404]) {
            return <Error404 />;
        };

        var viewComponent;
        switch (this.state.viewComponent) {
            case "overview":
                viewComponent = <Overview post={post} />
                break;
            case "content":
                viewComponent = <Content post={post} />
                break;
            case "tags":
                viewComponent = <Tags post={post} />
                break;
            case "dangerzone":
                viewComponent = <DangerZone post={post} />
                break;
        };

        if (post['published'] === null) {
            post['published'] = false;
        }

        return (
            <>
                <Header />
                <main className="p-1">                 
                    <div>
                        <h1 className="h3  blue  inline  mr-1">{post.title}</h1>
                        <span className={"Label  f-2  " + (post.status == 'live' ? "Label--green" : "")}>{post.status}</span>
                    </div>
                    <details className="Details  f-1  my-1">
                        <summary className="Details__summary">
                            Details
                            <a href={"/admin/posts/" + this.postId + "/preview/"} style={{fontWeight: 400}} className="ml-2  blue  link  underline  dim">Preview</a>
                            {post.status !== 'live' ? <button className="Button  Button--green  f-1  bold  ml-2  dim" style={{float: 'right'}}>Publish...</button> : null}
                        </summary>
                        <div className="Details__content">
                            Last Edited: <strong>{makeDate(post.lastEdited['$date'])}</strong><br />
                            Published: <strong>{makeDate(post.published['$date'])}</strong><br />
                        </div>
                    </details>
                    {post.status !== 'live'
                    ? (
                        <div className="flex  flex-justifyEnd  mb-2">
                            
                        </div>
                    )
                    : null
                    }

                    <nav className="Tabs">
                        <ul className="Tabs__tab-container">
                            <li className={"Tabs__tab  f-2  mr-3" + (this.state.viewComponent === "overview" ? "  Tabs__tab--active" : "")}>
                                <label htmlFor="tab-overview" className="Tabs__tab__button">
                                    <Icon.Settings className="Icon  mr-1" /> Overview
                                    <input type="radio" name="tab" id="tab-overview" onClick={this.changeTab} value="overview" defaultChecked={this.state.viewComponent === "overview"}/>
                                </label>
                            </li>
                            <li className={"Tabs__tab  f-2  mr-3" + (this.state.viewComponent === "content" ? "  Tabs__tab--active" : "")}>
                                <label htmlFor="tab-content" className="Tabs__tab__button">
                                    <Icon.FileText className="Icon  mr-1" /> Content
                                    <input type="radio" name="tab" id="tab-content" onClick={this.changeTab} value="content" defaultChecked={this.state.viewComponent === "content"}/>
                                </label>
                            </li>
                            <li className={"Tabs__tab  f-2  mr-3" + (this.state.viewComponent === "tags" ? "  Tabs__tab--active" : "")}>
                                <label htmlFor="tab-tags" className="Tabs__tab__button">
                                    <Icon.Tag className="Icon  mr-1" /> Tags
                                    <input type="radio" name="tab" id="tab-tags" onClick={this.changeTab} value="tags" defaultChecked={this.state.viewComponent === "tags"}/>
                                </label>
                            </li>
                            <li className={"Tabs__tab  f-2" + (this.state.viewComponent === "dangerzone" ? "  Tabs__tab--danger--active" : "")} style={{marginRight: '10vw'}}>
                                <label htmlFor="tab-dangerzone" className="Tabs__tab__button  Tabs__tab__button--danger">
                                    <Icon.AlertTriangle className="Icon  mr-1" /> Danger Zone
                                    <input type="radio" name="tab" id="tab-dangerzone" onClick={this.changeTab} value="dangerzone" defaultChecked={this.state.viewComponent === "dangerzone"}/>
                                </label>
                            </li>
                        </ul>
                    </nav>
                    {viewComponent}
                </main>
                <Footer />
            </>
        )
    }
}

class Overview extends React.Component {
    render() {
        return (
            <>
                <Input.Text label="Title" defaultValue={this.props.post.title} className="my-2" />
                <Input.Text label="Description / Subtitle" defaultValue={this.props.post.subtitle} className="my-2" />
            </>
        )
    }
}

class Content extends React.Component {
    render() {
        var content = this.props.post.content;
        
        var renderedContent = content.map((contentModule, index) => {
            switch(contentModule.type) {
                case "text":
                    return (
                        <Input.FormattedText
                            key={index}
                            id={id(contentModule['_id'])}
                            value={contentModule.value}
                            className="my-2"
                        />
                        )
                    break;
                case "image":
                    return (
                        <Input.Image
                            key={index}
                            id={id(contentModule['_id'])}
                            className="my-2"
                        />
                    )
                    break;
                case "video":
                    return <Input.Text label="YouTube Id" key={index} id={id(contentModule['_id'])} />
                    break;
                default:
                    throw new Error("No content module by that name")
                    break;
            }
        })

        return (
            <>
                {renderedContent}
            </>
        )
    }
}

class Tags extends React.Component {
    render() {
        return <h2>Tags</h2>
    }
}

class DangerZone extends React.Component {
    render() {
        return <h2>DangerZone</h2>
    }
}
