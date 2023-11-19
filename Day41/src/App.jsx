import React, { Component, Fragment } from 'react'
import Body from './components/Body';
import Loading from './components/loading';
import './assets/style.scss';
import './assets/loading.css'
// import "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: false };
    }
    handleLoading = (boolean) => {
        this.setState({
            isLoading: boolean,
        });
    };
    addLoading(btn) {
        if (btn) {
            btn.disabled = true;
        } 
        this.handleLoading(true);
    }
    removeLoading(btn) {
        if (btn) {
            btn.disabled = false;
        } 
        this.handleLoading(false);
    }
    render() {
        return (
            <>
                {this.state.isLoading && <Loading />}
                <Body
                    handleLoading={this.handleLoading}
                    addLoading={this.addLoading}
                    removeLoading={this.removeLoading}
                />
            </>
        );
    }
}

