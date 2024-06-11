import { useEffect, useRef, useState } from 'react'
import { dictionary } from '../utils';

export const Home = () => {
    const alphabet = `abcdefghijklmnopqrstuvwxyz`;
    const [key, setKey] = useState(null);
    const [rows, setRows] = useState([...Array(10).keys()]);
    const columns = [...Array(10).keys()];
    const [cells, setCells] = useState([{
        x: Math.floor(Math.random() * 10),
        y: 0,
        active: true,
        character: alphabet[Math.floor(Math.random() * 26)],
        highlighted: false,
    }]);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    const render = () => { setRows([...rows]); };

    const handleKeyDown = async (e) => {
        setKey(e.key);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
                setCells(cells => {
                    const activeCell = cells.find(obj => obj.active);
                    if (e.key === 'ArrowRight' && activeCell?.x < 9 && !cells.find(obj => obj.x === activeCell.x + 1 && obj.y === activeCell.y)) {
                        activeCell.x += 1;
                    }
                    else if (e.key === 'ArrowLeft' && activeCell?.x > 0 && !cells.find(obj => obj.x === activeCell.x - 1 && obj.y === activeCell.y)) {
                        activeCell.x -= 1;
                    }
                    else if (e.key === 'ArrowDown' && activeCell?.y < 9 && !cells.find(obj => obj.x === activeCell.x && obj.y === activeCell.y + 1)) {
                        activeCell.y += 1;
                    }
                    else if (e.key === 'ArrowUp') {
                        activeCell.character = alphabet[Math.floor(Math.random() * 26)];
                    }
                    return cells;
                })
                setTimeout(() => setKey(null), 100);
                render();
            }
        }, 0)
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown, false);
        intervalRef.current = setInterval(() => {
            setCells(cells => {
                const activeCell = cells.find(obj => obj.active);
                if (activeCell) {
                    if (activeCell.y < 9 && !cells.find(obj => obj.x === activeCell.x && obj.y === activeCell.y + 1)) {
                        activeCell.y += 1;
                    }
                    else {
                        activeCell.active = false;
                    }
                }
                else {
                    // Look for words, color if word found
                    const rows = [];
                    for (const index of [...Array(10).keys()].map((obj, index) => index)) {
                        const constructedRow = [...Array(10).keys()].map(obj => ' ');
                        const raw = cells.filter(obj => obj.y === index);
                        for (const char of raw) {
                            constructedRow[char.x] = char.character;
                        }
                        const words = constructedRow.join('').split(' ');
                        rows.push({ y: index, raw, words })
                        console.log(`Search ${words}`);
                    }
                    for (const row of rows) {
                        for (const word of row.words.filter(obj => obj.length >= 2)) {
                            const foundWord = dictionary.find(obj => obj === word);
                            console.log(foundWord);

                            if (foundWord) {
                                setCells(cells => {
                                    const foundCells = cells.filter(obj => obj.y === row.y);
                                    for (const cell of foundCells) {
                                        cell.highlighted = true;
                                    }
                                    return cells;
                                })
                            }
                        }
                    }
                    cells.push({
                        x: Math.floor(Math.random() * 10),
                        y: 0,
                        active: true,
                        character: alphabet[Math.floor(Math.random() * 26)],
                        highlighted: false,
                    })
                }
                return cells;
            })
            render();
        }, 500);
        return () => {
            clearInterval(intervalRef.current);
            document.addEventListener("keydown", handleKeyDown, false);
        }
    }, []);


    return (<div className="flex flex-col bg-card p-5 rounded-xl select-none">
        {rows.map((obj, y) => <div key={y} className='flex flex-row justify-center'>
            {columns.map((obj, x) => {
                const cell = cells.find(obj => obj.x === x && obj.y === y);
                return <div key={x} className={`border-[1px] border-border p-2 w-[30px] h-[30px] flex flex-row justify-center items-center uppercase ${cell?.highlighted && 'bg-[#550]'}`}>
                    {cell?.character}
                </div>
            })}
        </div>)}
        <div className='flex flex-row justify-between gap-2 mt-4 select-none'>
            <button className={`bg-black px-4 py-2 rounded-xl sm:hover:opacity-50 ${key === 'ArrowLeft' && 'bg-[#550]'}`} onClick={() => handleKeyDown({ key: 'ArrowLeft' })}>←</button>
            <div className='flex flex-col gap-2 w-full'>
                <button className={`bg-black px-4 py-2 rounded-xl sm:hover:opacity-50 w-full ${key === 'ArrowUp' && 'bg-[#550]'}`} onClick={() => handleKeyDown({ key: 'ArrowUp' })}>↑</button>
                <button className={`bg-black px-4 py-2 rounded-xl sm:hover:opacity-50 w-full ${key === 'ArrowDown' && 'bg-[#550]'}`} onClick={() => handleKeyDown({ key: 'ArrowDown' })}>↓</button>
            </div>
            <button className={`bg-black px-4 py-2 rounded-xl sm:hover:opacity-50 ${key === 'ArrowRight' && 'bg-[#550]'}`} onClick={() => handleKeyDown({ key: 'ArrowRight' })}>→</button>
        </div>
    </div>)
};