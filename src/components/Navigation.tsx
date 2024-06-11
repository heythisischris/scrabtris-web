import { useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { useGlobalStore } from '../utils';

export const Navigation = () => {
    const darkMode = useGlobalStore(state => state.darkMode);
    useEffect(() => darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark'), [darkMode]);
    return (
        <div className={`bg-background text-text m-auto p-4 flex flex-col items-center justify-center select-none`}>
            <div className='text-2xl'>Scrabtris</div>
            <div className='mb-2 text-subtitle'>Try to make as many words as you can</div>
            <Outlet />
            <div className='text-subtitle text-xs mt-2'>By <a className='underline hover:opacity-50' target='_blank' href="https://heythisischris.com">heythisischris</a></div>
        </div>
    )
}