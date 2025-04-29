import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../App";

const PointComponent = ({ point, handlePointClick, isCurrent, isAutoPlay }) => {
  const [timeDown, setTimeDown] = useState(0.0);
  const [opacity, setOpacity] = useState(1.0);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const { isGameOver } = useContext(MyContext);
  const handleClick = () => {
    setTimeDown(0.0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    intervalRef.current = setInterval(() => {
      setTimeDown((prev) => parseFloat((prev + 0.1).toFixed(1)));
    }, 100);

    // if (!isAutoPlay) {
    handlePointClick();
    // }

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      setTimeDown(0.0);
    }, 3000);
  };
  useEffect(() => {
    if (isGameOver) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      setTimeDown(0.0);
    }
  }, [isGameOver]);

  useEffect(() => {
    if (isAutoPlay && isCurrent) {
      setTimeDown(0.0);

      setOpacity(1.0);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      intervalRef.current = setInterval(() => {
        setTimeDown((prev) => parseFloat((prev + 0.1).toFixed(1)));
      }, 100);

      timeoutRef.current = setTimeout(() => {
        clearInterval(intervalRef.current);
        setTimeDown(0.0);
      }, 3000);
    }
  }, [isAutoPlay, isCurrent]);
  //
  useEffect(() => {
    setOpacity(3 - timeDown);
  }, [timeDown]);
  return (
    <div
      style={{
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid black",
        backgroundColor: isCurrent ? "orange" : "white",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        fontSize: "12px",
        opacity: opacity,
      }}
      onClick={handleClick}
    >
      {point}
      {timeDown > 0 && <p className="text-white">{timeDown}</p>}
    </div>
  );
};

export default PointComponent;
