import { useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { useGlobalStore } from '../utils';

export const Navigation = () => {
    const darkMode = useGlobalStore(state => state.darkMode);
    useEffect(() => darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark'), [darkMode]);
    return (
        <div className={`bg-background text-text m-auto p-4 flex flex-col items-center justify-center select-none`}>
            <div className='flex flex-row items-center justify-center gap-2 mb-2'>
                <img className='w-[40px] h-[40px] border-[1px] border-[#666] rounded-md' src='/logo.png' />
                <div className='flex flex-col gap-0'>
                    <div className='flex flex-row items-center justify-start gap-1'>
                        <div className='font-bold'>Scrabtris</div>

                        <div className='text-subtitle text-xs'>by <a className='underline hover:opacity-50' target='_blank' href="https://heythisischris.com">heythisischris</a></div>
                    </div>
                    <div className='text-blue text-xs mt-[-4px]'>Try to make as many words as you can!</div>
                </div>
            </div>
            <Outlet />
            <div className='text-subtitle text-xs'>Enjoy this game? <a className='underline hover:opacity-50' target='_blank' href="https://donate.stripe.com/aEU29ocB22syc2kdQR">Consider donating here!</a></div>
        </div >
    )
}