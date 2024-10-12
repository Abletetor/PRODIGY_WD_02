import { useState, useRef, useEffect } from "react";
import { FaSun, FaMoon } from 'react-icons/fa';
import './Stopwatch.css';

const Stopwatch = () => {
   const [time, setTime] = useState(0);
   const [isActive, setIsActive] = useState(false);
   const [laps, setLaps] = useState([]);
   const [darkMode, setDarkMode] = useState(false);
   const intervalRef = useRef(null);

   // Load laps and dark mode preference from local storage on mount
   useEffect(() => {
      const savedLaps = JSON.parse(localStorage.getItem('laps'));
      if (savedLaps) setLaps(savedLaps);

      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);
   }, []);

   // Save laps and dark mode preference to local storage
   useEffect(() => {
      localStorage.setItem('laps', JSON.stringify(laps));
      localStorage.setItem('darkMode', darkMode);
   }, [laps, darkMode]);

   // Format time into mm:ss:ms
   const formatTime = (time) => {
      const milliseconds = `0${(time % 1000)}`.slice(-3);
      const seconds = Math.floor(time / 1000);
      const displaySeconds = `0${seconds % 60}`.slice(-2);
      const minutes = Math.floor(seconds / 60);
      const displayMinutes = `0${minutes}`.slice(-2);
      return `${displayMinutes}:${displaySeconds}.${milliseconds}`;
   };

   // Start the stopwatch
   const startStopwatch = () => {
      setIsActive(true);
      intervalRef.current = setInterval(() => {
         setTime((prevTime) => prevTime + 10);
      }, 10);
   };

   // Pause the stopwatch
   const pauseStopwatch = () => {
      clearInterval(intervalRef.current);
      setIsActive(false);
   };

   // Reset the stopwatch and laps
   const resetStopwatch = () => {
      clearInterval(intervalRef.current);
      setIsActive(false);
      setTime(0);
      setLaps([]);
   };

   // Add a lap and play sound
   const addLap = () => {
      setLaps([...laps, time]);
   };

   // Toggle dark mode
   const toggleDarkMode = () => {
      setDarkMode(!darkMode);
   };

   // Get class for fastest/slowest lap highlighting
   const getLapClass = (lap) => {
      if (lap === Math.min(...laps)) return 'fastest-lap';
      if (lap === Math.max(...laps)) return 'slowest-lap';
      return '';
   };

   return (
      <div className={ `stopwatch-container ${darkMode ? 'dark-mode' : ''}` }>
         <button onClick={ toggleDarkMode } className="dark-mode-btn">
            { darkMode ? <FaSun /> : <FaMoon /> }
         </button>
         <h1 className="stopwatch-time">{ formatTime(time) }</h1>
         <div className="controls">
            { !isActive ? (
               <button onClick={ startStopwatch }>
                  <i className="fas fa-play"></i> Start
               </button>
            ) : (
               <button onClick={ pauseStopwatch }>
                  <i className="fas fa-pause"></i> Pause
               </button>
            ) }
            <button onClick={ resetStopwatch } disabled={ time === 0 }>
               <i className="fas fa-redo"></i> Reset
            </button>
            <button onClick={ addLap } disabled={ !isActive }>
               <i className="fas fa-flag"></i> Lap
            </button>
         </div>
         <div className="laps">
            { laps.length > 0 && (
               <>
                  <h2>Lap Times</h2>
                  <ul>
                     { laps.map((lap, index) => (
                        <li key={ index } className={ getLapClass(lap) }>
                           { `Lap ${index + 1}: ${formatTime(lap)}` }
                        </li>
                     )) }
                  </ul>
               </>
            ) }
         </div>
      </div>
   );
};

export default Stopwatch;
