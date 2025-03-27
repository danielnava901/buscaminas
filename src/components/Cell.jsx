import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';

const CellContainer = styled.div`
    width: 25px; 
    height: 25px;
    border: 2px solid white;
    background-color: ${props => 
        props.$flagged ? 'rgb(109, 98, 98)' :  // No cambia el fondo si está marcada
        props.$show ? (props.$value === 1 ? "red" : "white") 
        : 'rgb(109, 98, 98)'};
    color: ${props => props.$show ? 'black' : 'black'};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;

    &:hover {
        background-color: ${props => props.$show ? '' : 'rgb(163, 146, 146)'};
        cursor: pointer;
        color: white;
    }
`;


const Cell = ({value, adjacentOnes}) => {
    const [flagged, setFlagged] = useState(false);
    const [show, setShow] = useState(false);
    const [content, setContent] = useState("");
    const {setGameOver, status, setStatus} = useStore((state) => state)
    const timerRef = useRef(null);
    const longPressTriggered = useRef(false);
    

    const handlePressStart = (e) => {
      e.preventDefault(); 

      console.log("Long press triggered");
      longPressTriggered.current = false; // Reset

      timerRef.current = setTimeout(() => {
        longPressTriggered.current = true; // Se activa el long-press
        setFlagged((prev) => !prev);
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
                if (flagged) return; // No abrir celdas con bandera

                setShow(true);
    
                if (value === 1) {
                    setGameOver(true);
                    setStatus("gameover");
                }
            }}
        >{content}</CellContainer>
}

export default Cell;