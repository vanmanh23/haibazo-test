import { useState, useEffect, useRef, createContext } from "react";
import PointComponent from "./components/PointComponent";

export const MyContext = createContext();

function App() {
  const [pendingPoint, setPendingPoint] = useState("");
  const [pointsPosition, setPointsPosition] = useState([]);
  const [time, setTime] = useState(0.0);
  const [currentClickIndex, setCurrentClickIndex] = useState(1);
  const [gameStatus, setGameStatus] = useState("");
  const [clickedPoints, setClickedPoints] = useState([]);
  const [titleButton, setTitleButton] = useState("Play");
  const [isGameOver, setisGameOver] = useState(false);
  const timerRef = useRef(null);
  const timerIdRef = useRef(null);
  const autoPlayRef = useRef(null);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const handlePointChange = (e) => {
    setPendingPoint(e.target.value);
  };

  const handleRestart = () => {
    setIsAutoPlay(false);
    setisGameOver(false);
    setTitleButton("Restart");
    const parsed = parseInt(pendingPoint);
    if (!isNaN(parsed)) {
      const positions = Array.from({ length: parsed }, (_, index) => ({
        top: Math.random() * 90,
        left: Math.random() * 90,
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
    setisGameOver(false);
    if (gameStatus) return;

    if (value === currentClickIndex) {
      setClickedPoints((prev) => [...prev, value]);

      timerIdRef.current = setTimeout(() => {
        setPointsPosition((prevPositions) =>
          prevPositions.map((pos) =>
            pos.value === value ? { ...pos, clicked: true } : pos
          )
        );
      }, 3000);

      if (value === pointsPosition.length) {
        setTimeout(() => {
          setGameStatus("win");
          clearInterval(timerRef.current);
        }, 600);
      } else {
        setCurrentClickIndex((prev) => prev + 1);
      }
    } else {
      setGameStatus("gameover");
      clearInterval(timerRef.current);
    }
  };

  const handleAutoPlay = () => {
    if (autoPlayRef.current) {
      setIsAutoPlay(false);
    }

    if (isAutoPlay) {
      // Tắt AutoPlay nếu đang bật
      setIsAutoPlay(false);
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      console.log("currenidex: ", currentClickIndex);
    } else {
      // Bật AutoPlay
      if (currentClickIndex > 1) {
        setIsAutoPlay(true);
      }
      if (pointsPosition.length > 0) {
        setIsAutoPlay(true);
      } else {
        handleRestart();
        setIsAutoPlay(true);
      }
    }
  };

  useEffect(() => {
    if (!isAutoPlay) {
      clearInterval(autoPlayRef.current);
    }
    if (isAutoPlay && pointsPosition.length > 0) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }

      autoPlayRef.current = setInterval(() => {
        if (gameStatus === "win" || gameStatus === "gameover") {
          clearInterval(autoPlayRef.current);
          setCurrentClickIndex(1);
          setIsAutoPlay(false);
          return;
        }
        if (currentClickIndex <= pointsPosition.length) {
          handlePointClick(currentClickIndex);
        }
      }, 1200);
      if (gameStatus === "win") {
        clearInterval(autoPlayRef.current);
        setCurrentClickIndex(1);
        setIsAutoPlay(false);
      }
      if (gameStatus === "gameover") {
        clearInterval(autoPlayRef.current);
        setCurrentClickIndex(1);
        setIsAutoPlay(false);
      }
    }
  }, [isAutoPlay, pointsPosition, currentClickIndex, gameStatus]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (gameStatus === "gameover") {
      clearTimeout(timerIdRef.current);
      clearInterval(timerRef.current);
      setisGameOver(true);
    }
  }, [gameStatus]);
  //

  return (
    <MyContext.Provider value={{ isGameOver, setisGameOver }}>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="mx-auto p-4 border border-gray-300 rounded-lg shadow-lg bg-white">
          <h1
            className={`text-xl font-bold mb-2 ${
              gameStatus === "win" ? "text-green-600" : ""
            } ${gameStatus === "gameover" ? "text-red-500" : ""}`}
          >
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
          <div className="flex flex-row gap-3">
            <button
              className="bg-gray-100 hover:bg-gray-300 text-gray-800 font-bold px-5 rounded cursor-pointer border"
              onClick={handleRestart}
            >
              {titleButton}
            </button>
            {titleButton === "Restart" && (
              <button
                className="bg-gray-100 hover:bg-gray-300 text-gray-800 font-bold px-5 rounded cursor-pointer border"
                onClick={handleAutoPlay}
              >
                {isAutoPlay ? "Auto Play On " : "Auto Play Off"}
              </button>
            )}
          </div>
          <div
            className="border border-gray-800 mt-4 relative p-1 md:w-[400px] sm:w-[400px] xl:w-[400px] h-[400px] w-[300px]"
            // style={{ width: "400px", height: "400px" }}
          >
            {pointsPosition.map((pos, index) => (
              <div
                key={index}
                className="absolute "
                style={{
                  top: `${pos.top}%`,
                  left: `${pos.left}%`,
                  zIndex: pointsPosition.length - index,
                  opacity: pos.clicked ? 0 : 1,
                  transform: pos.clicked ? "scale(0.8)" : "scale(1)",
                }}
              >
                <PointComponent
                  point={pos.value}
                  handlePointClick={() => handlePointClick(pos.value)}
                  isCurrent={clickedPoints.includes(pos.value)}
                  isAutoPlay={isAutoPlay}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MyContext.Provider>
  );
}

export default App;
