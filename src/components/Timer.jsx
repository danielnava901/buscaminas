import { useEffect } from 'react';
import useTimer from '../hooks/useTimer'
import styled from 'styled-components';

function secondsToClock(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60) ;
    const _seconds = seconds % 60;
    return `${`${hours}`.padStart(2, "0")}:${`${minutes}`.padStart(2, "0")}:${`${_seconds}`.padStart(2, "0")}`;
}

const TimerCover = styled.div`
    font-size: 2rem;
    font-weight: bold;
    color: ${(props) => props.$timeLeft < 20 ? "#f9461a" : (props.$timeLeft < 60 ? "#e7ff00": "white")}
`;

const Timer = ({onTimeout, timerInit, gameStatus}) => {
    const {timeLeft, startTimer, isComplete, stopTimer, resetTimer} = useTimer(timerInit);
   
    useEffect(() => {
        startTimer();
    }, []);

    useEffect(() => {
        if(isComplete) {
            onTimeout();
        }
    }, [isComplete]);

    useEffect(() => {
        if(gameStatus === "restart") {
            resetTimer();
            startTimer();
        }else if(gameStatus === "paused"){
            stopTimer();
        }else if(gameStatus === "playing") {
            startTimer();
        }else {
            stopTimer()
        }
    }, [gameStatus]);

    return <TimerCover $timeLeft={timeLeft}>
            {secondsToClock(timeLeft)}
    </TimerCover>
}

export default Timer;