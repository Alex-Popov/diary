import React from 'react';

import {useDispatch} from 'react-redux';
import {addErrorAlert, addInfoAlert, addSuccessAlert, addWarningAlert, addAlert} from '../store/alerts';



function Tester() {
    const dispatch = useDispatch();

    return (
        <div className="app">
            <h1>[Tester]</h1>
            <button onClick={() => dispatch(addAlert('warning', 0, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at interdum sapien. Proin ante magna, finibus sed neque sit amet, viverra venenatis augue. In sagittis interdum quam, vel pellentesque risus sodales vel. Cras sollicitudin eleifend bibendum. Sed placerat rutrum augue, quis ultrices nisi elementum vitae. Etiam placerat sapien et maximus ullamcorper. Sed at dapibus nunc. Etiam varius, justo quis porttitor bibendum, odio purus vehicula mi, vitae posuere urna ante sed libero.'))}>Add Fixed Error</button>
            <button onClick={() => dispatch(addAlert('error', 0, 'Lorem ipsum dolor sit amet.'))}>Add Fixed Error</button>
            <button onClick={() => dispatch(addAlert('warning', 0, 'In at interdum sapien.'))}>Add Fixed Error</button>
            <button onClick={() => dispatch(addInfoAlert(Math.random()))}>Add Info</button>
            <button onClick={() => dispatch(addWarningAlert(Math.random()))}>Add Warning</button>
            <button onClick={() => dispatch(addErrorAlert(Math.random() +' '+ Math.random()))}>Add Error</button>
            <button onClick={() => dispatch(addSuccessAlert(Math.random() +' '+ Math.random() +' '+ Math.random() +' '+ Math.random() +' '+ Math.random() +' '+ Math.random()))}>Add Success</button>
        </div>
    );
}
export default Tester;