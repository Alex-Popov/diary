import React from 'react';
import css from './Fullscreen.module.css';


function Fullscreen(props) {
    return (
        <div className={`d-flex align-items-center justify-content-center ${css.size}`}>
            {props.children}
        </div>
    );
}

export default React.memo(Fullscreen);