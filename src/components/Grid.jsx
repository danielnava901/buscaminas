import Cell from "./Cell";
import {useState, useEffect} from 'react';

    
const Grid = ({grid, revealCell}) => {
    
    return <div>
        {
            grid.map((row, rowIndex) => {
                return <div key={rowIndex} style={{display: 'flex'}}>
                    {
                        row.map((cell, cellIndex) => {
                            return <Cell 
                                x={rowIndex}
                                y={cellIndex}
                                key={`${rowIndex}-${cellIndex}`}
                                grid={grid}
                                revealCell={revealCell}
                                {...cell} />
                        })
                    }
                </div>
            })
        }
    </div>
}

export default Grid;