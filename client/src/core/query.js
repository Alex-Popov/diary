import { markSessionAsExpired } from '../store/auth';
import LocalStorage from './local-storage';
import store from './store';
import { addErrorAlert } from '../store/alerts';




/**
 * Wrapper for native fetch() method
 *
 * @param method [String] default 'GET'
 * @param url [String]
 * @param data [Object | Array]
 * - for GET method: data will be converted to query string and must be Object (pairs name/value)
 * - for POST method: data will be stringify to JSON and may be any type of data
 * @param loading [Boolean] default false - if true: global page loader will shown during request process
 * @param cacheType [false | 'session' | {ageCount, ageUnit}] default false - set caching for specific url. Required method GET
 * @param printErrorMessages
 * @return Promise
 */
export const Query = (
    method = 'GET',
    url,
    data,
    { // options
        cacheType = false,
        printErrorMessages = true,
        catchSessionExpiration = true
    } = {}
) => {

    //
    // process Headers
    //
    let headers = new Headers();

    // Content Type
    headers.set('Content-Type', 'application/json');


    // CSRF header
    /*
    let csrfHeaderName = document.querySelector('meta[name=_csrf_header]').content;
    let csrfHeaderValue = document.querySelector('meta[name=_csrf]').content;

    headers.set(csrfHeaderName, csrfHeaderValue);
     */


    //
    // process INIT
    //
    let init = {
        headers,
        method
    };


    //
    // process Query-String for GET
    //
    if (method === 'GET' && data) {
        url += '?'+ Object.keys(data)
            .map(k => encodeURIComponent(k) +'='+ encodeURIComponent(data[k]) )
            .join('&');
    }


    //
    // process BODY for POST
    //
    if (method === 'POST' && data)
        init.body = typeof data === 'string' ? data : JSON.stringify(data);


    //
    // process caching
    //
    if (method === 'GET' && cacheType) {
        let cachedData = null;
        if (cacheType === 'session') {
            cachedData = LocalStorage.getSessionCache(url);
        }
        if (typeof cacheType === 'object') {
            cachedData = LocalStorage.getDatedCache(url, cacheType);
        }

        if (cachedData) {
            return Promise.resolve(cachedData);
        }
    }


    return fetch(url, init)
        //
        // process standard http/fetch response
        //
        .then(response => {
            if (response.ok) {
                return response.json();

            } else {
                // catch in request return 401
                if (catchSessionExpiration && response.status === 401) {
                    store.dispatch(markSessionAsExpired());
                }

                // create error wrapper
                throw {
                    context: response,
                    data: null,
                    messages: [
                        'Status: ' +response.status +(response.statusText && ', Message: '+response.statusText)
                    ]
                };
            }
        })
        //
        // process business logic response
        //
        .then(json => {
            if (json.isSuccessful) {

                // process caching
                if (method === 'GET' && cacheType) {
                    if (cacheType === 'session') {
                        LocalStorage.setSessionCache(url, json.data);
                    }
                    if (typeof cacheType === 'object') {
                        LocalStorage.setDatedCache(url, json.data);
                    }
                }

                return json.data;

            } else {
                // create error wrapper
                throw {
                    context: json,
                    data: json.data,
                    messages: (json.messages.length > 0 ? json.messages : ['API query error'])
                };
            }
        })
        //
        // process any errors from response and 2 "then" above
        //
        .catch(error => {
            if (printErrorMessages) {
                console.error('catch in query', error);

                error.messages.forEach(m => {
                    store.dispatch(addErrorAlert(m));
                });
            }

            throw error;
        });
};


export const Get = (...params) => Query('GET', ...params);
export const Post = (...params) => Query('POST', ...params);