import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import AppContext from './context/AppContext';
import store from './core/store';

import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import CssBaseline from '@material-ui/core/CssBaseline';

import AppLoader from './components/AppLoader';
import AppLoading from './components/AppLoading';
import ToastManager from './components/ToastManager';


ReactDOM.render(
    //<React.StrictMode>
        <ThemeProvider theme={theme.config}>
            <CssBaseline />

            <Provider store={store}>
            <AppContext>
                <AppLoading />
                <ToastManager />
                <AppLoader />
            </AppContext>
            </Provider>
        </ThemeProvider>
    //</React.StrictMode>
    ,
    document.getElementById('root')
);
