import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';

const CellContainer = styled.div`
    width: 25px; 
    height: 25px;
    border: 1px solid rgba(125, 114, 114, 0.5);
    background-color: ${props => {
        return props.$flagged ? 'rgb(109, 98, 98)' :  // No cambia el fondo si está marcada
                props.$show ? (props.$value === 1 ? "red" : "white") 
                : 'rgb(103, 192, 87)'
            }
        };
    color: ${props => props.$show ? 'black' : 'black'};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;

    &:hover {
        opacity: ${props => props.$show ? '1' : '0.8'};
        cursor: pointer;
        color: white;
    }

    @media (max-width: 480px) {
        width: 20px; 
        height: 20px;
        font-size: 0.9rem;
    }
`;


const Cell = ({value, show, adjacentOnes, x, y, grid, revealCell}) => {
    const [flagged, setFlagged] = useState(false);
    //const [show, setShow] = useState(false);
    const [content, setContent] = useState("");
    const {setGameOver, status, setStatus} = useStore((state) => state)
    const timerRef = useRef(null);
    const longPressTriggered = useRef(false);
    

    const handlePressStart = (e) => {
      e.preventDefault(); 

      longPressTriggered.current = false; // Reset

      timerRef.current = setTimeout(() => {
        longPressTriggered.current = true; // Se activa el long-press
        setFlagged((prev) => {
            return !prev
        });
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