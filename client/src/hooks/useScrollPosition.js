import { useLayoutEffect, useState } from 'react';

const isBrowser = typeof window !== `undefined`;

function getScrollPosition(e) {
    if (!isBrowser) {
        return { x: 0, y: 0 };
    }

    const { scrollX: x, scrollY: y } = window;

    return {
        x,
        y,
    };
}

export default function useScrollPosition() {
    const [position, setPosition] = useState(getScrollPosition());

    useLayoutEffect(() => {
        function handleScroll(e) {
            setPosition(getScrollPosition(e));
        }

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return position;
}
