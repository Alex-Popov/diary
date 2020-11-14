import React, { useRef, useState } from "react";

const AppContextState = React.createContext({});
const AppContextSetters = React.createContext({});

export const context = {
    state: AppContextState,
    setters: AppContextSetters
}

const AppContext = (props) => {
    const [headerToolbar, setHeaderToolbar] = useState(null);
    const [categoryEditorOpen, setCategoryEditorOpen] = useState(false);
    const [categoryEditorId, setCategoryEditorId] = useState(null);

    const [test, setTest] = useState(null);

    const settersRef = useRef({
        setHeaderToolbar,
        setCategoryEditorOpen,
        setCategoryEditorId,
        setTest
    });


    return (
        <AppContextSetters.Provider value={settersRef.current}>
        <AppContextState.Provider value={{
            headerToolbar,
            categoryEditorOpen,
            categoryEditorId,
            test
        }}>
            {props.children}
        </AppContextState.Provider>
        </AppContextSetters.Provider>
    );
}

export default React.memo(AppContext);