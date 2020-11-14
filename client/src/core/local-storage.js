import { DateTime } from 'luxon';
import store from './store';
import { selectSessionId } from '../store/auth';

//
// helpers
//

function checkLocalStorage() {
    try {
        const storage = window.localStorage,
            x = '__test__';

        storage.setItem(x, x);
        storage.removeItem(x);

        return true;
    }

    catch(e) {
        return false;
    }
}

export function getLocalStorageItem(key) {
    if (!checkLocalStorage()) return null;

    const storage = window.localStorage;
    if (storage.getItem(key)) {
        return JSON.parse(storage.getItem(key));

    } else {
        storage.removeItem(key);
        return null;
    }
}

export function setLocalStorageItem(key, value) {
    if (!checkLocalStorage()) return null;
    window.localStorage.setItem(key, JSON.stringify(value));
}

export function clearLocalStorage() {
    window.localStorage.clear();
}


//
// Versioned Cache
// @param v - version, any additional key
//

function getVersionedCache(key, v) {
    if (!checkLocalStorage()) return null;

    let data = getLocalStorageItem(key);

    if (data && data.version && data.version === v) {
        return data.value;

    } else {
        window.localStorage.removeItem(key);
        return null;
    }
}
function setVersionedCache(key, v, value) {
    if (!checkLocalStorage()) return null;

    setLocalStorageItem(key, {
        version: v,
        value: value
    });
}


//
// Session Cache
// the same as versioned, but version == sessionId of logged user
//

function getSessionCache(key) {
    const sessionId = selectSessionId(store.getState());
    if (!checkLocalStorage() || !sessionId) return null;

    return getVersionedCache(key, sessionId);
}
function setSessionCache(key, value) {
    const sessionId = selectSessionId(store.getState());
    if (!checkLocalStorage() || !sessionId) return null;

    setVersionedCache(key, sessionId, value);
}


//
// Dated Cache
// ageObject: {
//      String [months | weeks | days | hours | minutes] key:
//      Number count
// }
// e.g. { days: 2 }
// https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#instance-method-minus
//

function getDatedCache(key, ageObject) {
    if (!checkLocalStorage()) return null;

    let data = getLocalStorageItem(key);

    if ( data && data.date && (data.date > DateTime.utc().minus(ageObject).valueOf()) ) {
        return data.value;

    } else {
        window.localStorage.removeItem(key);
        return null;
    }

}
function setDatedCache(key, value) {
    if (!checkLocalStorage()) return null;

    setLocalStorageItem(key, {
        date: DateTime.utc().valueOf(),
        value: value
    });
}



export default {
    getItem: getLocalStorageItem,
    setItem: setLocalStorageItem,
    clear: clearLocalStorage,
    getVersionedCache,
    setVersionedCache,
    getSessionCache,
    setSessionCache,
    getDatedCache,
    setDatedCache,
};
