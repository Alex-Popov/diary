import React, {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import { useRouteMatch } from 'react-router-dom';

import API from '../core/api';
import css from './Wall.module.css';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import TuneRoundedIcon from "@material-ui/icons/TuneRounded";
import Divider from '@material-ui/core/Divider';
import Sidebar from '../components/Sidebar';
import FilterByDate from '../components/FilterByDate';
import SidebarCategories from '../components/SidebarCategories';
import PostsList from '../components/PostsList';
import Post from '../components/Post';
import EmptyData from '../components/EmptyData';



const toolbarIcon = <TuneRoundedIcon fontSize="small" />;

function Wall() {
    // filters
    const [categories, setCategories] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchTerm/*, setSearchTerm*/] = useState('');
    const [page/*, setPage*/] = useState(1);

    // list data
    const [posts, setPosts] = useState([]);

    // view post state
    let postRouteMatch = useRouteMatch({
        path: '/post/:id',
        exact: true
    });
    const postIdMemo = useMemo(() => (postRouteMatch && postRouteMatch.params.id), [postRouteMatch]);


    //
    // get posts
    //
    const fetchData = useCallback(() => {
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
            .catch(() => {})

    }, [categories, startDate, endDate, searchTerm, page]);

    const isFirstRun = useRef(true);
    const theme = useTheme();
    const minWidthLg = useMediaQuery(theme.breakpoints.up('lg'), {noSsr: true});
    const skipFetchData = useMemo(() => !!(isFirstRun.current && !minWidthLg && postIdMemo), [postIdMemo, minWidthLg]);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;

            if (skipFetchData) return;

            fetchData();

        } else {
            const timeoutId = setTimeout(() => {
                fetchData();
            } , 1000);
            return () => clearInterval(timeoutId);
        }

    }, [fetchData, skipFetchData]);




    return (<>
        <div className="d-flex no-gutters">
            <Sidebar toolbarIcon={toolbarIcon}>
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

        {postIdMemo && (
            <div className={`${css.sidebarPost} ${css.width}`}>
                <Post id={postIdMemo} />
            </div>
        )}
    </>);
}

export default Wall;