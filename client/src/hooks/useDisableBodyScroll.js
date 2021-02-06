import { useEffect } from 'react';


export default function useDisableBodyScroll(toggle) {
    useEffect(() => {
        if (toggle)
            document.body.classList.add('disable-body-scroll');
        else
            document.body.classList.remove('disable-body-scroll');

        return () => {
            document.body.classList.remove('disable-body-scroll');
        }
    }, [toggle]);
}
