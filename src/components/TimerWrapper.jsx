import styled from "styled-components";

const TimerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const TimerOptionsWrapper = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;

    div {
        cursor: pointer;
    }

    div.active {
        border: 1px solid #0091cb;
        border-radius: 3px;
        padding: 0px 10px;
    }
`

export default TimerWrapper;

export {TimerOptionsWrapper};