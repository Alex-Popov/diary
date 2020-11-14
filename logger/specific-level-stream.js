'use strict';

const bunyan = require('bunyan');

class SpecificLevelStream {
    constructor(levels, stream) {
        this.levels = levels.map(l => bunyan.resolveLevel(l));
        this.stream = stream;
    }

    write(rec) {
        if (this.levels.includes(rec.level)) {
            this.stream.write(JSON.stringify(rec, bunyan.safeCycles()) + '\n');
        }
    }
}

module.exports = ({level, stream}) => {
    return {
        level: bunyan.TRACE,
        type: 'raw',
        stream: new SpecificLevelStream(level, stream)
    }
}