import React, { useContext } from 'react';
import { context } from '../context/AppContext';

function HeaderToolbar() {
    const { headerToolbar } = useContext(context.state);

    return <>
        {headerToolbar}
    </>;
}


export default React.memo(HeaderToolbar);
