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
  //let m = Math.floor(Math.random() * 9) + 2;
  let onesByLevel = {
    easy: 10,
    medium: 20,
    hard: 30
  };

  let m = 18;
  let totalCells = m * m;
  let shouldBeOnes = Math.floor((onesByLevel[level] * totalCells) / 100);
  let count = 0;
  
  let array = Array.from({ length: m }, () => 
    Array.from({ length: m }, () => {
      let value = Math.random() < 0.5 ? 0 : 1;
      
      if (value === 1) {
        if(shouldBeOnes > 0) {
          shouldBeOnes--;
        }else {
          value = 0;
        }
        count++;
      }
      return value;
    })
  );
  
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
  
  console.log({gridNode})
  const newGame = () => {
    setGameOver(false);
    const newRealGrid = generateRandomGrid();
    const newGridNode = new GridNode(newRealGrid);
    const gridToPrint = newGridNode.getGridToPrint();
    console.log({gridToPrint})
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
      
        <Grid key={gridNode.id} grid={grid} />
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
