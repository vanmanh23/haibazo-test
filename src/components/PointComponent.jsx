const PointComponent = ({ point, handlePointClick, isCurrent }) => {
  return (
    <div
      style={{
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid black",
        backgroundColor: isCurrent ? "red" : "white",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      }}
      onClick={handlePointClick}
    >
      {point}
    </div>
  );
};

export default PointComponent;
