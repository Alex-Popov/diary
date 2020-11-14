import React, {useEffect, useState} from 'react';
import { Route } from 'react-router-dom';

import API from '../core/api';
import css from './Wall.module.css';

import TuneRoundedIcon from "@material-ui/icons/TuneRounded";
import Divider from '@material-ui/core/Divider';
import Sidebar from '../components/Sidebar';
import FilterByDate from '../components/FilterByDate';
import SidebarCategories from '../components/SidebarCategories';
import PostsList from '../components/PostsList';
import Post from '../components/Post';
import EmptyData from '../components/EmptyData';



function Wall() {

    // filters
    const [categories, setCategories] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    // data
    const [posts, setPosts] = useState([]);


    // get posts
    useEffect(() => {
        console.log('-- change filters --', categories, startDate, endDate);
        const timeoutId = setTimeout(() => {
            console.log('-- real call filters --');
            API.post.getAllByFilter({
                categories,
                startDate,
                endDate,
                searchTerm,
                page
            })
                .then(data => {
                    console.log(data);
                    setPosts(data);
                })
                .catch(error => {})
        } , 1000);

        return () => clearInterval(timeoutId);
    }, [categories, startDate, endDate, searchTerm, page]);


    return (<>
        <div className="d-flex no-gutters">
            <Sidebar toolbarIcon={<TuneRoundedIcon fontSize="small" />}>
                <FilterByDate
                    startDate={startDate}
                    onChangeStartDate={setStartDate}
                    endDate={endDate}
                    onChangeEndDate={setEndDate}
                />
                <Divider />
                <SidebarCategories
                    categories={categories}
                    setCategories={setCategories}
                />
            </Sidebar>

            <div className="flex-grow-1 p-4">
                <PostsList posts={posts} />
            </div>

            <div className={`d-none d-lg-flex align-items-center justify-content-center flex-shrink-0 ${css.width}`}>
                <EmptyData>Выберите пост</EmptyData>
            </div>
        </div>

        <Route path="/post/:id" exact>
            <div className={`${css.sidebarPost} ${css.width}`}>
                <Post />
            </div>
        </Route>
    </>);
}


export default Wall;