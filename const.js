'use strict';

const path = require('path');
const root = require('root');

// proxy to /client/src/constants
// workaround, because create-react-app can't import files outside /src/ without reject
module.exports = require(path.join(root, 'client/src/const'));
