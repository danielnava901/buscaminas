import { useEffect, useState } from 'react'
import './App.css'
import Grid from './components/Grid'
import GridNode from './lib/TreeNode'
import Modal from './components/Modal'
import useStore from './store/useStore'
import NewGameWrapper from './components/NewGameWrapper'
import GameOverTitle from './components/GameOverTitle'
import Wrapper from './components/Wrapper'

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


function App() {
  const [size, setSize] = useState(8);
  const [prevSize, setPrevSize] = useState(8);
  const [level, setLevel] = useState(LEVEL.easy);
  const [prevLevel, setPrevLevel] = useState(LEVEL.easy);
  const [initValues, setInitialValues] = useState(getInitValues(level, size));
  const [gridNode, setGridNode] = useState(new GridNode(generateRandomGrid(level, size)));
  const [grid, setGrid] = useState(gridNode.getGridToPrint());
  const [showNewModal, setShowNewModal] = useState(false);
  const {gameOver, 
    status, 
    zerosClicked, 
    setStatus, 
    setGameOver, 
    setClickCel, 
    minesSeted, 
    addCorrectMinesSeted, 
    setCorrectMinesSeted,
    setZerosClicked} = useStore((state) => state)
  
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

  const revealAllCells = () => {
    const newGrid = [...grid];
        newGrid.forEach((row, i) => {
            row.forEach((cell, j) => {
                revealCell(i, j, true);
            });
        });
  }

  const newGame = () => {
    setGameOver(false);
    const newRealGrid = generateRandomGrid(level, size);
    const newGridNode = new GridNode(newRealGrid);
    const gridToPrint = newGridNode.getGridToPrint();
    
    setGrid(gridToPrint);
    setGridNode(newGridNode);
    setStatus("playing");
    addCorrectMinesSeted(0);
    setInitialValues(getInitValues(level, size));
    setZerosClicked(0);
    setCorrectMinesSeted(0)
  }

 
  useEffect(() => {
    newGame();
  }, [level, size]);


  useEffect(() => {
    //console.log("B", {zerosClicked, shouldBeZeros: initValues.shouldBeZeros});
    if(minesSeted === initValues.shouldBeOnes && zerosClicked === initValues.shouldBeZeros) {
      setGameOver(true);
      setStatus("win");
      revealAllCells();
    }
  }, [zerosClicked]);

  useEffect(() => {
    //console.log("A", {minesSeted, mines: initValues.shouldBeOnes});
    if(minesSeted === initValues.shouldBeOnes && zerosClicked === initValues.shouldBeZeros) {
      setGameOver(true);
      setStatus("win");
      revealAllCells();
    }

  }, [minesSeted]);

  return ( 
    <Wrapper>
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
        
        <Modal open={gameOver} onClose={() => {setGameOver(false)}}>
          <GameOverTitle>
            {status === "gameover" ? <h1 className="gameover">Game Over</h1> : 
            <h1 className="gameover">¡Ganaste!</h1>}
          </GameOverTitle>
        </Modal>
        
        <Modal open={showNewModal} onClose={() => {setShowNewModal(false)}}>
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
          
        </Modal>
    </Wrapper>
  )
}

export default App
