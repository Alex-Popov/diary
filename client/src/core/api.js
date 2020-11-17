import { Get, Post } from './query.js';

//
// API methods
//
export default {
    auth: {
        login: (username, password) => Post('/api/auth/login', {username, password}),
        logout: () => Post('/api/auth/logout'),
        changePassword: (oldPassword, newPassword) => Post('/api/auth/changePassword', {oldPassword, newPassword}),
        autoLogin: () => Get('/api/auth/autoLogin', null, {
            printErrorMessages: false,
            catchSessionExpiration: false
        })
    },
    user: {
        getAll: () => Get('/api/user/getAll'),
        getById: id => Get('/api/user/getById', {id}),
        getCurrent: () => Get('/api/user/getCurrent'),
        deleteById: id => Post('/api/user/deleteById', {id})
    },
    category: {
        getAll: () => Get('/api/category/getAll'),
        getById: id => Get('/api/category/getById', {id}),
        save: data => Post('/api/category/save', data),
        deleteById: id => Post('/api/category/deleteById', {id})
    },
    post: {
        getAll: () => Get('/api/post/getAll'),
        getById: id => Get('/api/post/getById', {id}),
        getAllByFilter: filter => Get('/api/post/getAllByFilter', {filter: JSON.stringify(filter)}),
        getAllDates: () => Get('/api/post/getAllDates'),
        save: data => Post('/api/post/save', data),
        deleteById: id => Post('/api/post/deleteById', {id})
    }

};
