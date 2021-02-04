import React, { useRef, useState, useCallback } from "react";

const CATEGORY_EDITOR_DEFAULT = {
    show: false,
    id: null
};
const PROMPT_DEFAULT = {
    show: false,
    question: '',
    callback: null
}

const AppContextState = React.createContext({});
const AppContextSetters = React.createContext({});

export const context = {
    state: AppContextState,
    setters: AppContextSetters
}

const AppContext = (props) => {
    const [headerToolbar, setHeaderToolbar] = useState(null);
    const [showCategoriesManager, setShowCategoriesManager] = useState(false);
    const resetShowCategoriesManager = useCallback(() => {
        setShowCategoriesManager(false);
    }, [setShowCategoriesManager]);

    const [categoryEditor, setCategoryEditor] = useState(CATEGORY_EDITOR_DEFAULT);
    const resetCategoryEditor = useCallback(() => {
        setCategoryEditor({...CATEGORY_EDITOR_DEFAULT});
    }, [setCategoryEditor]);

    const [prompt, setPrompt] = useState(PROMPT_DEFAULT);
    const resetPrompt = useCallback(() => {
        setPrompt({...PROMPT_DEFAULT});
    }, [setPrompt]);



    const settersRef = useRef({
        setHeaderToolbar,
        setShowCategoriesManager,
        resetShowCategoriesManager,
        setCategoryEditor,
        resetCategoryEditor,
        setPrompt,
        resetPrompt
    });

    return (
        <AppContextSetters.Provider value={settersRef.current}>
        <AppContextState.Provider value={{
            headerToolbar,
            categoryEditor,
            showCategoriesManager,
            prompt
        }}>
            {props.children}
        </AppContextState.Provider>
        </AppContextSetters.Provider>
    );
}

export default React.memo(AppContext);