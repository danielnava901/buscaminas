import { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import CellContainer from './CellContainer';

const Cell = ({value, show, adjacentOnes, x, y, grid, revealCell}) => {
    const [flagged, setFlagged] = useState(false);
    const [content, setContent] = useState("");

    const {setGameOver, status, setStatus, addCorrectMinesSeted} = useStore((state) => state)
    const timerRef = useRef(null);
    const longPressTriggered = useRef(false);

    const handleLongPress = () => {
        let cell = grid[x][y];
        
        if(!cell["show"]) {
            
            if(cell.value === 1) {
                if(!flagged) {
                    addCorrectMinesSeted(1); 
                }else {
                    addCorrectMinesSeted(-1);
                }
            }
            
            setFlagged((prev) => {
                return !prev;
            });
        }
        
    };

    const handlePressStart = (e) => {
      e.preventDefault(); 
      longPressTriggered.current = false; // Reset
      timerRef.current = setTimeout(() => {
        longPressTriggered.current = true; // Se activa el long-press
        handleLongPress();
      }, 600);
    };
  
    const handlePressEnd = () => {
        clearTimeout(timerRef.current);
    };

    useEffect(() => {
        if (flagged) {
            setContent("🚩");
        } else if (show) {
            setContent(value === 1 ? "💥" : (adjacentOnes === 0 ? "" : adjacentOnes));
        }else {
            setContent("");
        }
    }, [flagged, show, value, adjacentOnes]);


    return <CellContainer 
            $show={show} 
            $value={value}
            $flagged={flagged}
            
            onMouseDown={handlePressStart} // Para PC
            onTouchStart={handlePressStart} // Para móviles
            onMouseUp={handlePressEnd} // Detiene el long-press si el usuario suelta antes
            onTouchEnd={handlePressEnd} // Para móviles
            onTouchCancel={handlePressEnd}
            
            onClick={() => {
                if (longPressTriggered.current) return; // Evita el click después del long-press
                if (status !== "playing") return;
                if (flagged) return;
    
                if (value === 1) {
                    setGameOver(true);
                    setStatus("gameover");
                    const newGrid = [...grid];
                    //
                    newGrid.forEach((row, i) => {
                        row.forEach((cell, j) => {
                            revealCell(i, j, true);
                        });
                    });
                    
                }else if (value === 0) {
                    revealCell(x, y, false);
                }

            }}
        >{content}</CellContainer>
}

export default Cell;