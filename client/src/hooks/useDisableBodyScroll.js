import { useEffect } from 'react';


export default function useDisableBodyScroll(toggle) {
    useEffect(() => {
        if (toggle)
            document.body.style.overflow = 'hidden';
        else
            document.body.style.removeProperty('overflow');
    }, [toggle]);
}
