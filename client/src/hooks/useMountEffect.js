import { useEffect } from 'react';

export default function useMountEffect(fun) {
    useEffect(fun, []);
}