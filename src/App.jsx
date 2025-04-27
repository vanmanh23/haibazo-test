import { useState, useEffect, useRef } from "react";
import PointComponent from "./components/PointComponent";

function App() {
  const [pendingPoint, setPendingPoint] = useState("");
  const [pointsPosition, setPointsPosition] = useState([]);
  const [time, setTime] = useState(0.0);
  const [currentClickIndex, setCurrentClickIndex] = useState(1);
  const [gameStatus, setGameStatus] = useState("");
  const [clickedPoints, setClickedPoints] = useState([]);
  const [titleButton, setTitleButton] = useState('Play');
  const timerRef = useRef(null);

  const handlePointChange = (e) => {
    setPendingPoint(e.target.value);
  };

  const handleRestart = () => {
    setTitleButton('Restart');
    const parsed = parseInt(pendingPoint);
    if (!isNaN(parsed)) {
      const positions = Array.from({ length: parsed }, (_, index) => ({
        top: Math.random() * 92,
        left: Math.random() * 92,
        value: index + 1,
        clicked: false,
      }));

      setPointsPosition(positions);
    } else {
      setPointsPosition([]);
    }
    setCurrentClickIndex(1);
    setTime(0.0);
    setGameStatus("");
    setClickedPoints([]);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTime((prev) => parseFloat((prev + 0.1).toFixed(1)));
    }, 100);
  };

  const handlePointClick = (value) => {
    if (gameStatus) return; 

    if (value === currentClickIndex) {
      setClickedPoints((prev) => [...prev, value]);
      
      setTimeout(() => {
        setPointsPosition((prevPositions) =>
          prevPositions.map((pos) =>
            pos.value === value ? { ...pos, clicked: true } : pos
          )
        );
      }, 1000); 

      if (value === pointsPosition.length) {
        setGameStatus("win");
        clearInterval(timerRef.current);
      } else {
        setCurrentClickIndex((prev) => prev + 1);
      }
    } else {
      setGameStatus("gameover");
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="mx-auto p-4 border border-gray-300 rounded-lg shadow-lg bg-white">
        <h1 className={`text-xl font-bold mb-2 ${gameStatus === 'win' ? "text-green-600": ''} ${gameStatus === 'gameover' ? "text-red-500" : ''}`}>
          {gameStatus === "" && "LET'S PLAY"}
          {gameStatus === "win" && "ALL CLEARED"}
          {gameStatus === "gameover" && "GAME OVER"}
        </h1>
        <div className="flex flex-row items-center gap-6">
          <div className="flex flex-col">
            <label className="mr-2">Points:</label>
            <p>Time: </p>
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              value={pendingPoint}
              onChange={handlePointChange}
              placeholder="0"
              className="pl-1 border border-gray-300 rounded-md w-32"
            />
            <p>{time.toFixed(1)}s</p>
          </div>
        </div>
        <button
          className="bg-gray-100 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded cursor-pointer"
          onClick={handleRestart}
        >
          {titleButton}
        </button>

        <div
          className="border border-gray-800 mt-4 relative p-1"
          style={{ width: "400px", height: "400px" }}
        >
          {pointsPosition.map((pos, index) => (
            <div
              key={index}
              className="absolute transition-all duration-1000 ease-in-out"
              style={{
                top: `${pos.top}%`,
                left: `${pos.left}%`,
                zIndex: pointsPosition.length - index,
                opacity: pos.clicked ? 0 : 1,
                transform: pos.clicked ? 'scale(0.8)' : 'scale(1)',
              }}
            >
              <PointComponent
                point={pos.value}
                handlePointClick={() => handlePointClick(pos.value)}
                isCurrent={clickedPoints.includes(pos.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
