import { useEffect } from 'react';


export default function useDisableBodyScrollWhileMounted() {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.removeProperty('overflow');
        }
    }, []);
}