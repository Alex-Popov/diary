import { markSessionAsExpired } from '../store/auth';
import LocalStorage from './local-storage';
import store from './store';
import { addErrorAlert } from '../store/alerts';



class QueryError extends Error {
    constructor(context, data, messages) {
        super(messages.join('\n'));

        this.name = 'QueryError';
        this.stack = (new Error()).stack;

        this.context = context
        this.data = data;
        this.messages = messages;
    }
}



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
    // process INIT
    //
    let options = {
        headers: new Headers(),
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
    if (method === 'POST' && data) {
        if (typeof data === 'string') {
            options.body = data;
        }
        if (typeof data === 'object') {
            if (data instanceof File || data instanceof FormData) {
                options.body = data;

            } else {
                options.body = JSON.stringify(data);
                options.headers.set('Content-Type', 'application/json');
            }
        }
    }


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


    return fetch(url, options)
        //
        // process standard http/fetch response
        //
        .then(async response => {
            if (response.ok) {
                return response.json();

            } else {
                // catch in request return 401
                if (catchSessionExpiration && response.status === 401) {
                    printErrorMessages = false;
                    store.dispatch(markSessionAsExpired());
                }

                // create error wrapper
                const text = await response.text();
                throw new QueryError(
                    response,
                    null,
                    [
                        text || `${response.status}: ${response.statusText}`
                    ]
                );
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
                throw new QueryError(
                    json,
                    json.data,
                    (json.messages.length > 0 ? json.messages : ['API query error'])
                );
            }
        })
        //
        // process any errors from response and 2 "then" above
        //
        .catch(e => {
            if (printErrorMessages) {
                if (e instanceof QueryError) {
                    e.messages.forEach(m => {
                        store.dispatch(addErrorAlert(m));
                    });
                } else {
                    store.dispatch(addErrorAlert(e.message));
                }
            }

            throw e;
        });
};


export const Get = (...params) => Query('GET', ...params);
export const Post = (...params) => Query('POST', ...params);