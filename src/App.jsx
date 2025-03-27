import { useEffect, useState } from 'react'
import './App.css'
import Grid from './components/Grid'
import GridNode from './lib/TreeNode'
import Modal from './components/Modal'
import useStore from './store/useStore'
import styled from 'styled-components'

const LEVEL = {
  easy: "easy",
  medium: "medium",
  hard: "hard",
  demente: "demente"
}

function getInitValues(level, size = 8) {
  let onesByLevel = {
    easy: 10,
    medium: 20,
    hard: 30,
    demente: 90
  };
  
  let totalCells = size * size;
  let shouldBeOnes = Math.floor((onesByLevel[level] * totalCells) / 100);
  let shouldBeZeros = totalCells - shouldBeOnes;
  
  
  return {shouldBeOnes, shouldBeZeros, size}
}

function generateRandomGrid(level, size = 8) {
  let {shouldBeOnes, shouldBeZeros} = getInitValues(level, size);
  let count = 0;
  let array = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));

  while (count < shouldBeOnes) {
    let randomRow = Math.floor(Math.random() * size); 
    let randomCol = Math.floor(Math.random() * size); 
    
    // Si la posición está vacía, coloca un 1
    if (array[randomRow][randomCol] === 0) {
      array[randomRow][randomCol] = 1;
      count++;
    }
  }

  //console.log({array});
  return array
}

const GameOverTitle = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: red;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  height: 100%;

  h1 {
    @media (max-width: 740px) {
      font-size: 1.2rem;
    }
  }

  h1.gameover {
    font-size: 2rem;
  }

  button.newgame { 
    background-color:rgb(24, 104, 44);
    width: 90%;
    
    &:hover {
      background-color: #45a049;
    }
    &:active {
      background-color: #3e8e41;
    }
  }
  
  
  
`
const NewGameWrapper = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  

  .board-size {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;

    :hover {
      background-color: rgb(163, 146, 146);
      cursor: pointer;
    }
    
  }
  
  .board-size-btn {
    padding: 10px 20px;
    border-radius: 5px;
    @media (max-width: 480px) {
        font-size: 14px;
        padding: 5px 10px;
      }
  }

  .board-size-btn.active {
    background-color: rgb(72, 112, 214);
    color: white;
    font-weight: bold;
  }

  button {
    cursor: pointer;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s;
    outline: none;
      @media (max-width: 480px) {
        font-size: 14px;
        padding: 5px 10px;
      }
  }

  
  button.active {
    background-color:rgb(72, 112, 214);
    }

  button.new {
    background-color: #4CAF50;
    &:hover {
      background-color: #45a049;
    }
    &:active {
      background-color: #3e8e41;
    }
  }

  
`;

function App() {
  const [size, setSize] = useState(8);
  const [prevSize, setPrevSize] = useState(8);
  const [level, setLevel] = useState(LEVEL.easy);
  const [prevLevel, setPrevLevel] = useState(LEVEL.easy);
  const [initValues] = useState(getInitValues(level, size));

  const [gridNode, setGridNode] = useState(new GridNode(generateRandomGrid(level, size)));
  const [grid, setGrid] = useState(gridNode.getGridToPrint());
  const [showNewModal, setShowNewModal] = useState(false);
  const {gameOver, setGameOver, status, setStatus, zerosClicked, setClickCel} = useStore((state) => state)
  
  const revealCell = (x, y, reveal = false) => {
    
    let newGrid = [...grid];

    const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0], 
        [1, 1], [-1, -1], [1, -1], [-1, 1]
    ];

    const queue = [[x, y]];
    const visited = new Set();

    while (queue.length) {
        const [curX, curY] = queue.shift();
        const key = `${curX},${curY}`;
        
        if (visited.has(key)) continue;
        visited.add(key);

        if(!reveal) {
          // Asegurar que la celda no sea una mina
          if (grid[curX][curY].value === 1) {
            continue;
          }else {
            if(!newGrid[curX][curY].show) {
                setClickCel(1);
            }
            
          }
        }

        // Mostrar la celda en la interfaz
        newGrid[curX][curY].show = true;
        

        // Si es un "0", propagar la búsqueda a vecinos
        
        if (grid[curX][curY].adjacentOnes === 0) {
            for (let [dx, dy] of directions) {
                let newX = curX + dx;
                let newY = curY + dy;

                if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
                    queue.push([newX, newY]);
                }
            }
        }
    }

    setGrid([...newGrid]);
  };


  const newGame = () => {
    setGameOver(false);
    const newRealGrid = generateRandomGrid(level, size);
    const newGridNode = new GridNode(newRealGrid);
    const gridToPrint = newGridNode.getGridToPrint();
    
    setGrid(gridToPrint);
    setGridNode(newGridNode);
    setStatus("playing");
  }

  const changeGameLevel = (level) => {
    setShowNewModal(true);
    setPrevLevel(level);
  }

  useEffect(() => {
    console.log("new game", level, " y size", size);
    newGame();
  }, [level, size])


  useEffect(() => {
    let shouldBeZeros = initValues.shouldBeZeros;
      if(zerosClicked === shouldBeZeros) {
        setGameOver(true);
        setStatus("win");
        const newGrid = [...grid];
        newGrid.forEach((row, i) => {
            row.forEach((cell, j) => {
                revealCell(i, j, true);
            });
        });
      }
  }, [zerosClicked])

  return (
    <div style={{display: 'flex',
      flexDirection: 'column', 
      justifyContent: 'flex-start', 
      alignItems: 'center', 
      flexWrap: 'wrap',
      gap: '1rem',
      }}>
      
        <NewGameWrapper>
          <div className="board-size">
            <span className={`board-size-btn ${size === 8 ? "active" : ""}`}
              onClick={() => {
                setShowNewModal(true);
                setPrevSize(8);
                }}>8x8</span>
            <span className={`board-size-btn ${size === 12 ? "active" : ""}`} 
              onClick={() => {
                setShowNewModal(true);
                setPrevSize(12);
              }}>12x12</span>
            <span className={`board-size-btn ${size === 18 ? "active" : ""}`} 
              onClick={() => {
                setShowNewModal(true);
                setPrevSize(18);
                }}>18x18</span>
          </div>
          <div style={{display: 'flex', gap: '1rem'}}>
            <button 
              className={`${level === LEVEL.easy ? "active" : ""}`} 
              onClick={() => {
                setShowNewModal(true);
                setPrevLevel(LEVEL.easy);
              }}>Fácil</button>
            <button 
              className={`${level === LEVEL.medium ? "active" : ""}`}
              onClick={() => {
                setShowNewModal(true);
                setPrevLevel(LEVEL.medium);
              }}>Medium</button>
            <button 
              className={`${level === LEVEL.hard ? "active" : ""}`} 
              onClick={() => {
                setShowNewModal(true);
                setPrevLevel(LEVEL.hard);
              }}>Difícil</button>
            <button 
              className={`demente ${level === LEVEL.demente ? "active" : ""}`} 
              onClick={() => {
                setShowNewModal(true);
                setPrevLevel(LEVEL.demente);
              }}>Demente</button>
            <button 
              className='new' 
              onClick={newGame}>Nuevo Juego</button>
          </div>
        </NewGameWrapper>
          
        <Grid key={gridNode.id} grid={grid} revealCell={revealCell}/>
        
        {
          gameOver ? <Modal onClose={() => {setGameOver(false)}}>
            <GameOverTitle>
              {status === "gameover" ? <h1 className="gameover">Game Over</h1> : 
              <h1 className="gameover">¡Ganaste!</h1>}
            </GameOverTitle>
          </Modal>   : null
        }
        {
          showNewModal ? <Modal onClose={() => {setShowNewModal(false)}}>
            <GameOverTitle>
              <h1>¿Quieres empezar un juego nuevo en nivel {` `}
                <span style={{
                  textTransform: "uppercase", 
                  textDecoration: "underline",
                  backgroundColor: "yellow", 
                  padding: "0 20px"}}>
                    {LEVEL[prevLevel]}
                </span> {` `}
                y tamaño 
                <span style={{
                  textTransform: "uppercase", 
                  textDecoration: "underline",
                  backgroundColor: "yellow", 
                  padding: "0 20px"}}>
                  <span style={{fontWeight: "bold", fontSize: "3.5rem"}}>{prevSize}</span>x
                  <span style={{fontWeight: "bold", fontSize: "3.5rem"}}>{prevSize}</span>
                </span>
              </h1>
              <button className="newgame" onClick={() => {
                setLevel(prevLevel);
                setSize(prevSize);
                setShowNewModal(false);
              }}>Nuevo Juego</button>
            </GameOverTitle>
            
          </Modal> : null
        }
    </div>
  )
}

export default App
