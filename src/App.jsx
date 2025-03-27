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
  hard: "hard"
}
function generateRandomGrid(level) {
  let onesByLevel = {
    easy: 10,
    medium: 20,
    hard: 30
  };

  let m = 18;
  let totalCells = m * m;
  let shouldBeOnes = Math.floor((onesByLevel[level] * totalCells) / 100);
  let count = 0;
  
  let array = Array.from({ length: m }, () => Array.from({ length: m }, () => 0));
  
  while (count < shouldBeOnes) {
    let randomRow = Math.floor(Math.random() * m); 
    let randomCol = Math.floor(Math.random() * m); 
    
    // Si la posición está vacía, coloca un 1
    if (array[randomRow][randomCol] === 0) {
      array[randomRow][randomCol] = 1;
      count++;
    }
  }

  console.log({array});
  return array
}

const GameOverTitle = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: red;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`
const NewGameWrapper = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 70px;

  button.active {
    background-color:rgb(72, 112, 214);
    }

  button.new {
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s;
    &:hover {
      background-color: #45a049;
    }
    &:active {
      background-color: #3e8e41;
    }
  }
`;

function App() {
  let [level, setLevel] = useState(LEVEL.easy);
  let [gridNode, setGridNode] = useState(new GridNode(generateRandomGrid(level)));
  let [grid, setGrid] = useState(gridNode.getGridToPrint());
  const {gameOver, setGameOver, setStatus} = useStore((state) => state)
  
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
          if (grid[curX][curY].value === 1) continue;
          
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
    const newRealGrid = generateRandomGrid(level);
    const newGridNode = new GridNode(newRealGrid);
    const gridToPrint = newGridNode.getGridToPrint();
    
    setGrid(gridToPrint);
    setGridNode(newGridNode);
    setStatus("playing");
  }



  return (
    <div style={{display: 'flex',
      flexDirection: 'column', 
      justifyContent: 'flex-start', 
      alignItems: 'center', 
      height: '100vh',
      width: '90vw',
      }}>
      
        <NewGameWrapper>
          <button className={`${level === LEVEL.easy ? "active" : ""}`} onClick={() => {setLevel(LEVEL.easy)}}>Fácil</button>
          <button className={`${level === LEVEL.medium ? "active" : ""}`} onClick={() => {setLevel(LEVEL.medium)}}>Medium</button>
          <button className={`${level === LEVEL.hard ? "active" : ""}`} onClick={() => {setLevel(LEVEL.hard)}}>Difícil</button>
          <button className='new' onClick={newGame}>Nuevo Juego</button>
        </NewGameWrapper>
      
        <Grid key={gridNode.id} grid={grid} revealCell={revealCell}/>
        {
          gameOver ? <Modal onClose={() => {setGameOver(false)}}>
            <GameOverTitle>
              <h1>Game Over</h1>
            </GameOverTitle>
          </Modal>   : null
        }
    </div>
  )
}

export default App
