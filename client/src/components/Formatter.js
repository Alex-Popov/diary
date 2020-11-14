import React from 'react';
import { format } from '../core/formatter';

function Formatter(props) {
    return format(props.format, props.children);
}

export default React.memo(Formatter);