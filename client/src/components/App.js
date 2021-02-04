import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { loadCategories } from '../store/categories';
import { loadPostDates } from '../store/postDates';

import Header from './Header';
import CategoryEditor from './CategoryEditor';
import CategoriesManager from './CategoriesManager';
import ExpiredSessionDialog from './ExpiredSessionDialog';
import Prompt from './Prompt';

// pages
import Profile from '../pages/Profile';
import Editor from '../pages/Editor';
import Wall from '../pages/Wall';


function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadCategories());
        dispatch(loadPostDates());
    }, [dispatch]);


    return (
        <Router>
            <Header />
            <CategoryEditor />
            <CategoriesManager />
            <ExpiredSessionDialog />
            <Prompt />

            <Switch>
                <Route path="/profile" exact component={Profile} />
                <Route path={['/new', '/edit/:id']} exact component={Editor} />
                <Route path={['/', '/post/:id']} exact component={Wall} />
                <Redirect to="/" />
            </Switch>
        </Router>
    );
}

export default App;