import React from 'react';
import Error404 from '../404';
import LoadingScreen from '../loading-screen';
import { client } from '../api';

import { Header } from '../components/header';
import { Footer } from '../components/footer';

import * as Icon from 'react-feather';

var makeDate = (ms) => {
    let time = new Date(ms);
    return time.customFormat("#MMMM# #D#, #YYYY#, #h#:#mm# #AMPM#");
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

export class Post extends React.Component {
    constructor(props) {
        super(props)
        this.postId = this.props.match.params.post

        this.state = {
            data: undefined,
            ready: false,
            404: false,
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
    render() {
        if (!this.state.ready) {
            return <LoadingScreen />;
        }
        if (this.state[404]) {
            return <Error404 />;
        };

        var viewComponent;
        var post = this.state.data;
        return (
            <>
                <Header />
                <main>
                    <div>
                        <h1>{post.title}</h1>
                        <span style={{textTransform: 'capitalize'}}>{post.status}</span>
                    </div>
                    <div>
                        <a href={"/admin/posts/" + this.postId + "/preview/"}>Preview</a>
                        <button><Icon.Edit2 /> Publish...</button>
                    </div>
                    <details>
                        <summary>Details</summary>
                        <div>
                            Last Edited: {makeDate(post.lastEdited['$date'])}<br />
                            Published: {makeDate(post.published['$date'])}
                        </div>
                    </details>

                    <nav>
                        <ul>
                            <li><button onClick="" value=""><Icon.Settings /> Overview</button></li>
                            <li><button onClick="" value=""><Icon.FileText /> Content</button></li>
                            <li><button onClick="" value=""><Icon.Tag /> Tags</button></li>
                            <li><button onClick="" value=""><Icon.AlertTriangle /> Danger Zone</button></li>
                        </ul>
                    </nav>
                    {viewComponent}
                </main>
                <Footer />
            </>
        )
    }
}
