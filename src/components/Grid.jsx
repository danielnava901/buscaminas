import Cell from "./Cell";
import {useState, useEffect} from 'react';

    
const Grid = ({grid}) => {
    const [myGrid, setMyGrid] = useState(grid);
    useEffect(() => {
        setMyGrid(grid);
    }, [grid]);
    
    return <div>
        {
            grid.map((row, rowIndex) => {
                return <div key={rowIndex} style={{display: 'flex'}}>
                    {
                        row.map((cell, cellIndex) => {
                            return <Cell key={cellIndex} {...cell} />
                        })
                    }
                </div>
            })
        }
    </div>
}

export default Grid;