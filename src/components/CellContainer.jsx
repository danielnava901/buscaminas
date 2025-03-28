import styled from 'styled-components';

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
    }

    @media (max-width: 480px) {
        width: 20px; 
        height: 20px;
        font-size: 0.9rem;
    }
`;

export default CellContainer;