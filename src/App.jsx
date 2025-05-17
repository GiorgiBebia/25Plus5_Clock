import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const timerRef = useRef(null);
  const beepRef = useRef(null);

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 0) {
            beepRef.current.play();
            if (isSession) {
              setIsSession(false);
              return breakLength * 60;
            } else {
              setIsSession(true);
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, isSession, breakLength, sessionLength]);

  const handleReset = () => {
    clearInterval(timerRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
    setHasStarted(false);
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  };

  const handleStartStop = () => {
    if (!isRunning) {
      if (!hasStarted) {
        setTimeLeft(sessionLength * 60);
        setHasStarted(true);
      }
    }
    setIsRunning(prev => !prev);
  };


  const changeLength = (type, amount) => {
    if (isRunning) return;

    if (type === 'break') {
      setBreakLength(prev => {
        const newLength = Math.min(60, Math.max(1, prev + amount));
        return newLength;
      });
    }

    if (type === 'session') {
      setSessionLength(prev => {
        const newLength = Math.min(60, Math.max(1, prev + amount));
        if (isSession) setTimeLeft(newLength * 60);
        return newLength;
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center text-gray-800">
      <h1 className="text-4xl font-bold mb-8">25 + 5 Clock</h1>

      <div className="flex gap-10 mb-8">
        <div>
          <h2 id="break-label" className="text-xl font-semibold">Break Length</h2>
          <div className="flex items-center justify-center gap-4 mt-2">
            <button id="break-decrement" onClick={() => changeLength('break', -1)} className="bg-red-500 text-white px-3 py-1 rounded">-</button>
            <span id="break-length" className="text-lg">{breakLength}</span>
            <button id="break-increment" onClick={() => changeLength('break', 1)} className="bg-green-500 text-white px-3 py-1 rounded">+</button>
          </div>
        </div>

        <div>
          <h2 id="session-label" className="text-xl font-semibold">Session Length</h2>
          <div className="flex items-center justify-center gap-4 mt-2">
            <button id="session-decrement" onClick={() => changeLength('session', -1)} className="bg-red-500 text-white px-3 py-1 rounded">-</button>
            <span id="session-length" className="text-lg">{sessionLength}</span>
            <button id="session-increment" onClick={() => changeLength('session', 1)} className="bg-green-500 text-white px-3 py-1 rounded">+</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md w-64">
        <h2 id="timer-label" className="text-2xl font-semibold">{isSession ? "Session" : "Break"}</h2>
        <div id="time-left" className="text-5xl font-mono my-4">{formatTime(timeLeft)}</div>
        <div className="flex justify-center gap-4">
          <button id="start_stop" onClick={handleStartStop} className="bg-blue-500 text-white px-4 py-2 rounded">
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button id="reset" onClick={handleReset} className="bg-gray-600 text-white px-4 py-2 rounded">
            Reset
          </button>
        </div>
      </div>

      <audio
        id="beep"
        ref={beepRef}
        preload="auto"
        src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
      />
    </div>
  );
};

export default App;
