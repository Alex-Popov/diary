import { useState, useEffect } from 'react';

function getScrollOffset(elRef) {
    if (elRef.current) {
        return window.scrollTo({
            behavior: 'smooth',
            top: elRef.current.offsetTop,
        });
    }
}

export default function useScrollToElement(elRef) {
    const [offset, setOffset] = useState(getScrollOffset(elRef));

    useEffect(() => {
        setOffset(getScrollOffset(elRef));
    }, [elRef]);

    return offset;
}
