import { useEffect, useRef, useState } from 'react'
import { nameToColor } from '../utils';

let dictionary = [];
export const Home = () => {
    useEffect(() => {
        const async = async () => {
            dictionary = (await (await fetch(`/dictionary.json`)).json());
        }
        async();
    }, [])

    const letters = {
        a: { quantity: 9, value: 1 }, b: { quantity: 2, value: 3 }, c: { quantity: 2, value: 3 },
        d: { quantity: 4, value: 2 }, e: { quantity: 12, value: 1 }, f: { quantity: 2, value: 4 },
        g: { quantity: 3, value: 2 }, h: { quantity: 2, value: 4 }, i: { quantity: 9, value: 1 },
        j: { quantity: 1, value: 8 }, k: { quantity: 1, value: 5 }, l: { quantity: 4, value: 1 },
        m: { quantity: 2, value: 3 }, n: { quantity: 6, value: 1 }, o: { quantity: 8, value: 1 },
        p: { quantity: 2, value: 3 }, q: { quantity: 1, value: 10 }, r: { quantity: 6, value: 1 },
        s: { quantity: 4, value: 1 }, t: { quantity: 6, value: 1 }, u: { quantity: 4, value: 1 },
        v: { quantity: 2, value: 4 }, w: { quantity: 2, value: 4 }, x: { quantity: 1, value: 8 },
        y: { quantity: 2, value: 4 }, z: { quantity: 1, value: 10 },
    };
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [bag, setBag] = useState(Object.entries(letters)
        .map(([key, value]) => [...Array(value.quantity).keys()].map(() => key).join('')).join('')
        .split('').sort(() => 0.5 - Math.random()).join(''));
    const [score, setScore] = useState(0);
    const [key, setKey] = useState(null);
    const [rows, setRows] = useState([...Array(10).keys()]);
    const [level, setLevel] = useState(1);
    const [dropSpeed, setDropSpeed] = useState(1000);
    const [gameOver, setGameOver] = useState(false);
    const [words, setWords] = useState([]);
    const columns = [...Array(10).keys()];
    const [cells, setCells] = useState([{
        x: Math.floor(Math.random() * 10),
        y: 0,
        active: true,
        character: bag[0],
        highlighted: '',
    }]);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    const render = () => { setRows([...rows]); };

    const checkForWords = (cells) => {
        let newScore = 0;
        const newCells = [...cells];
        newCells.forEach(cell => cell.highlighted = '');
        setWords([]);

        for (let y = 0; y < 10; y++) {
            const row = [...Array(10)].map((_) => null);

            newCells.filter(cell => cell.y === y).forEach(cell => {
                row[cell.x] = cell;
            });

            let currentWord = [];
            let currentWordCells = [];

            for (let x = 0; x < row.length; x++) {
                const cell = row[x];

                if (cell && cell.character !== '·') {
                    currentWord.push(cell.character);
                    currentWordCells.push(cell);
                } else {
                    if (currentWord.length >= 2) {
                        const word = currentWord.join('');
                        if (dictionary.includes(word)) {
                            let wordScore = 0;
                            currentWordCells.forEach(wordCell => {
                                wordCell.highlighted = nameToColor(word);
                                wordScore += letters[wordCell.character].value;
                                newScore += wordScore;
                            });
                            setWords(value => [...value, `${word} (${wordScore})`]);
                        }
                    }
                    currentWord = [];
                    currentWordCells = [];
                }
            }

            if (currentWord.length >= 2) {
                const word = currentWord.join('');
                if (dictionary.includes(word)) {
                    let wordScore = 0;
                    currentWordCells.forEach(wordCell => {
                        wordCell.highlighted = nameToColor(word);
                        wordScore += letters[wordCell.character].value;
                        newScore += wordScore;
                    });
                    setWords(value => [...value, `${word} (${wordScore})`]);
                }
            }
        }

        for (let x = 0; x < 10; x++) {
            const column = [...Array(10)].map((_) => null);

            newCells.filter(cell => cell.x === x).forEach(cell => {
                column[cell.y] = cell;
            });

            let currentWord = [];
            let currentWordCells = [];

            for (let y = 0; y < column.length; y++) {
                const cell = column[y];

                if (cell && cell.character !== '·') {
                    currentWord.push(cell.character);
                    currentWordCells.push(cell);
                } else {
                    if (currentWord.length >= 2) {
                        const word = currentWord.join('');
                        if (dictionary.includes(word)) {
                            let wordScore = 0;
                            currentWordCells.forEach(wordCell => {
                                wordCell.highlighted = nameToColor(word);
                                wordScore += letters[wordCell.character].value;
                                newScore += wordScore;
                            });
                            setWords(value => [...value, `${word} (${wordScore})`]);
                        }
                    }
                    currentWord = [];
                    currentWordCells = [];
                }
            }

            if (currentWord.length >= 2) {
                const word = currentWord.join('');
                if (dictionary.includes(word)) {
                    let wordScore = 0;
                    currentWordCells.forEach(wordCell => {
                        wordCell.highlighted = nameToColor(word);
                        wordScore += letters[wordCell.character].value;
                        newScore += wordScore;
                    });
                    setWords(value => [...value, `${word} (${wordScore})`]);
                }
            }
        }
        return { newCells, newScore };
    };

    useEffect(() => {
        if (score > level * 10) {
            setLevel(prev => prev + 1);
            setDropSpeed(prev => Math.max(prev * 0.9, 20));
        }
    }, [score]);

    const replenishBag = () => {
        setBag(Object.entries(letters)
            .map(([key, value]) => [...Array(value.quantity).keys()].map(() => key).join(''))
            .join('')
            .split('')
            .sort(() => 0.5 - Math.random())
            .join('')
        );
    };

    // Use this when bag is running low
    useEffect(() => {
        if (bag.length - cells.length < 10) { // When fewer than 10 letters remain
            replenishBag();
        }
    }, [bag.length, cells.length]);

    const handleKeyDown = async (e) => {
        if (gameOver) return;
        setKey(e.key);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) {
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
                        setSelectedIndex(selectedIndex => {
                            const newSelectedIndex = selectedIndex < 6 ? selectedIndex + 1 : 0;
                            const bagIndex = cells.length - 1 + newSelectedIndex;

                            // Guard against undefined bag characters
                            if (bagIndex < bag.length && activeCell) {
                                activeCell.character = bag[bagIndex];
                            }

                            return newSelectedIndex;
                        });
                    }
                    else if (e.key === ' ') {
                        activeCell.character = activeCell.character === '·' ? bag[cells.length - 1 + selectedIndex] : '·';
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
                if (cells.some(cell => cell.y === 0 && !cell.active)) {
                    clearInterval(intervalRef.current);
                    setGameOver(true);
                    return cells;
                }

                const activeCell = cells.find(obj => obj.active);
                if (activeCell) {
                    if (activeCell.y < 9 && !cells.find(obj => obj.x === activeCell.x && obj.y === activeCell.y + 1)) {
                        activeCell.y += 1;
                    }
                    else {
                        activeCell.active = false;
                        const { newCells, newScore } = checkForWords(cells);
                        setCells(newCells);
                        setScore(newScore);
                    }
                }
                else {
                    cells.push({
                        x: Math.floor(Math.random() * 10),
                        y: 0,
                        active: true,
                        character: cells.length < bag.length ? bag[cells.length] : '·', // Add fallback character
                        highlighted: '',
                    })
                    setSelectedIndex(0);
                }
                return cells;
            });
            render();
        }, dropSpeed);

        return () => {
            clearInterval(intervalRef.current);
            document.removeEventListener("keydown", handleKeyDown, false);
        }
    }, [dropSpeed]);

    return (
        <div>
            <div className='uppercase text-center flex flex-row justify-center items-center gap-2'>
                {gameOver ? <div>Game Over! Final Score: {score}</div> :
                    [...bag.slice(cells.length - 1, cells.length + 6)].map((obj, index) =>
                        <div key={index} className={`w-[20px] ${selectedIndex === index ? 'bg-text text-background' : ''}`}>{obj}</div>
                    )}
            </div>
            <div className="flex flex-col p-2 select-none">
                {rows.map((obj, y) => <div key={y} className='flex flex-row justify-center'>
                    {columns.map((obj, x) => {
                        const cell = cells.find(obj => obj.x === x && obj.y === y);
                        return <div key={x} className={`border-[1px] border-border p-2 w-[30px] h-[30px] flex flex-row justify-center items-center uppercase`}
                            style={{ backgroundColor: `${cell?.highlighted}` }}
                        >
                            {cell?.character}
                        </div>
                    })}
                </div>)}
                <div className='flex flex-row justify-between my-1'>
                    <div>Words: {words.length}</div>
                    <div>Score: {score}</div>
                    <div>Level: {level}</div>
                </div>
                <div className='w-[300px] h-[50px] text-xs bg-[#222] overflow-x-scroll p-2'>
                    {words.length > 0 ? words.join(', ') : 'No words yet...'}
                </div>
                <div className='flex flex-row justify-between gap-2 mt-2 select-none'>
                    <button className={`bg-card px-4 py-2 sm:hover:opacity-50 ${key === 'ArrowLeft' && 'bg-[#550]'}`} onClick={() => handleKeyDown({ key: 'ArrowLeft' })}>←</button>
                    <div className='flex flex-col gap-2 w-full'>
                        <button className={`bg-card px-4 py-2 sm:hover:opacity-50 w-full ${key === 'ArrowUp' && 'bg-[#550]'}`} onClick={() => handleKeyDown({ key: 'ArrowUp' })}>↑</button>
                        <button className={`bg-card px-4 py-2 sm:hover:opacity-50 w-full ${key === 'ArrowDown' && 'bg-[#550]'}`} onClick={() => handleKeyDown({ key: 'ArrowDown' })}>↓</button>
                    </div>
                    <button className={`bg-card px-4 py-2 sm:hover:opacity-50 ${key === 'ArrowRight' && 'bg-[#550]'}`} onClick={() => handleKeyDown({ key: 'ArrowRight' })}>→</button>
                </div>
                <button className={`mt-2 bg-card px-4 py-2 sm:hover:opacity-50 ${key === 'Space' && 'bg-[#550]'}`} onClick={() => handleKeyDown({ key: ' ' })}>Space</button>
            </div>
        </div>
    );
};