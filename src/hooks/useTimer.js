import { useState, useEffect, useRef } from 'react';

const useTimer = (initialTime) => {
    const [timeLeft, setTimeLeft] = useState(initialTime); 
    const [isRunning, setIsRunning] = useState(false); 
    const [isComplete, setIsComplete] = useState(false);
    const lastDate = useRef(Date.now());

    // Inicia el timer
    const startTimer = () => {
        setIsRunning(true);
    };

    // Detiene el timer
    const stopTimer = () => {
        setIsRunning(false);
    };

    // Reinicia el timer
    const resetTimer = () => {
        setTimeLeft(initialTime);
        setIsRunning(false);
        setIsComplete(false);
    };

    // Hook useEffect para manejar la cuenta regresiva
    useEffect(() => {
        let interval;
        if (isRunning && timeLeft > 0) {
            lastDate.current = Date.now();
            interval = setInterval(() => {
                let diff = Date.now() - lastDate.current;
                if(diff >= 1000) {
                    setTimeLeft(prevTime => prevTime - 1);
                }
                
            }, 100); // Disminuye el tiempo cada segundo
        } else if (timeLeft === 0) {
            setIsComplete(true); // Marca como completado cuando llegue a 0
            setIsRunning(false);
        }

        return () => clearInterval(interval); // Limpia el intervalo cuando se detiene
    }, [isRunning, timeLeft]);

    return {
        timeLeft,
        isRunning,
        isComplete,
        startTimer,
        stopTimer,
        resetTimer
    };
};

export default useTimer;
