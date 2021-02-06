import React, {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import {useRouteMatch} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectCategories} from '../store/categories';

import API from '../core/api';
import css from './Wall.module.css';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Sidebar from '../components/Sidebar';
import FilterByDate from '../components/FilterByDate';
import Pagination from '../components/Pagination';
import PostsList from '../components/PostsList';
import Post from '../components/Post';
import EmptyData from '../components/EmptyData';
import Search from '../components/Search';
import CategoriesSelector from '../components/CategoriesSelector';
import useDisableBodyScroll from '../hooks/useDisableBodyScroll';



function Wall() {

    //
    // filters
    //
    const [filters, setFilters] = useState({
        categories: [],
        startDate: null,
        endDate: null,
        searchTerm: '',
        page: 1
    });

    const setCategories = useCallback(categories => {
        setFilters(prevFilters => {
            if (prevFilters.categories === categories) return prevFilters;
            if (!prevFilters.categories.length && !categories.length) return prevFilters;

            return {
                ...prevFilters,
                page: 1,
                categories
            };
        });
    }, []);
    const setDates = useCallback((startDate, endDate) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            page: 1,
            startDate,
            endDate
        }))
    }, []);
    const setSearchTerm = useCallback(searchTerm => {
        setFilters(prevFilters => ({
            ...prevFilters,
            searchTerm
        }))
    }, []);
    const setPage = useCallback(page => {
        setFilters(prevFilters => ({
            ...prevFilters,
            page
        }))
    }, []);



    //
    // reset selected on categories update
    //
    const categories = useSelector(selectCategories);

    useEffect(() => {
        setCategories([]);
    }, [setCategories, categories]);


    //
    // view post state
    //
    let postRouteMatch = useRouteMatch({
        path: '/post/:id',
        exact: true
    });
    const postIdMemo = useMemo(() => (postRouteMatch && postRouteMatch.params.id), [postRouteMatch]);



    //
    // get posts
    //

    // list data
    const [data, setData] = useState({
        posts: [],
        total: 0
    });

    // first loading state
    const isFirstRun = useRef(true);
    const theme = useTheme();
    const minWidthLg = useMediaQuery(theme.breakpoints.up('lg'), {noSsr: true});
    const skipFetchData = useMemo(() => !!(isFirstRun.current && !minWidthLg && postIdMemo), [postIdMemo, minWidthLg]);

    useDisableBodyScroll(minWidthLg || postIdMemo);


    // call API, fires when filters changed
    const fetchData = useCallback(() => {
        API.post.getAllByFilter(filters)
            .then(data => {
                console.log(data);
                setData({
                    posts: data.posts,
                    total: data.total
                });
            })
            .catch(() => {})
    }, [filters]);

    // (!!!) main action to fetch, fires when (fetchData <- filters) changes
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;

            if (skipFetchData) return;

            fetchData();

        } else {
            fetchData();
        }
    }, [fetchData, skipFetchData]);



    return (
        <div className={`d-flex no-gutters ${css.layout}`}>
            <Sidebar>
                <div className="px-3 py-3 b-b">
                    <Search
                        value={filters.searchTerm}
                        onChange={setSearchTerm}
                    />
                </div>
                <div className="px-3 py-3 b-b">
                    <FilterByDate
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        onChange={setDates}
                    />
                </div>
                <div className="px-3 py-3">
                    <CategoriesSelector
                        value={filters.categories}
                        onChange={setCategories}
                    />
                </div>
            </Sidebar>

            <div className="flex-grow-1 vertical-scroll">
                <PostsList posts={data.posts} />
                <Pagination total={data.total} page={filters.page} onSelect={setPage} />
            </div>

            {postIdMemo && (
                <div className={`${css.post} ${css.postWidth} vertical-scroll flat-on-print`}>
                    <Post id={postIdMemo} onDelete={fetchData} />
                </div>
            )}
            {!postIdMemo && (
                <div className={`flex-shrink-0 ${css.postWidth} p-4 d-none d-xl-block`}>
                    <EmptyData>Выберите пост</EmptyData>
                </div>
            )}
        </div>
    );
}

export default Wall;