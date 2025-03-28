import styled from 'styled-components'

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
export default NewGameWrapper;