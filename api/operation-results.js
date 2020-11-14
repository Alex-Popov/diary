'use strict';

class OperationResults {
    isSuccessful = false;
    messages = [];
    data;

    constructor(isSuccessful, messages, data) {
        this.isSuccessful = !!isSuccessful;
        this.messages = this.messages.concat(messages);
        this.data = data;
    }
}

module.exports = OperationResults;