import styled from 'styled-components'

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

export default GameOverTitle;