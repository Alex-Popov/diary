import React, {useCallback, useContext} from 'react';

import { context } from '../context/AppContext';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';



export const usePrompt = (question, callback) => {
    const { setPrompt } = useContext(context.setters);
    return useCallback(args => {
        setPrompt({
            show: true,
            question,
            callback: () => callback(args)
        });
    }, [question, callback, setPrompt])
}


function Prompt() {
    const { resetPrompt } = useContext(context.setters);
    const { prompt: {show, question, callback} } = useContext(context.state);

    const handleConfirm = () => {
        callback();
        resetPrompt();
    }

    return (
        <Dialog
            open={show}
            onBackdropClick={resetPrompt}
            onEscapeKeyDown={resetPrompt}
            maxWidth="sm"
        >
            <div className="px-5 pt-4 pb-3 text-align_center">
                {question}
            </div>
            <div className="p-4 text-align_center">
                <Button onClick={resetPrompt}>Отменить</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConfirm}
                    className="ml-4"
                >
                    Подтвердить
                </Button>
            </div>
        </Dialog>
    );
}

export default Prompt;