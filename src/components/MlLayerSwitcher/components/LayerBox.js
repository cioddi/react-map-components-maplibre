import { React, useState } from "react";

import { Box } from "@mui/system";
import ImageLoader from "../../../ui_components/ImageLoader";
/**
 * @component
 *
 */
const LayerBox = ({
  id,
  activeHighlight,
  active,
  activeLayers,
  label,
  handleLayerBoxClick,
  src,
  className,
}) => {
  className = (() => {
    if (active) {
      return `${className} active`;
    }
    return className;
  })();
  const [activeClassName, setActiveClassName] = useState();
  const width = "40px";
  console.log(activeLayers)
  const handleHover = (event) => {
    
    if (event.type === "mouseenter") {
      setActiveClassName(`${className} activeHighlight`);
    }
    if (event.type === "mouseleave") {
      setActiveClassName(`${className}`);
    }
  };

  return (
    <>
      <Box
        key={id}
        className={activeClassName}
        sx={{
          width,
          height: "53px",
          justifyContent: "center",
          py: 0.25,
          px: "1rem",
        }}
        onClick={() => {
          handleLayerBoxClick(id);
        }}
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
      >
        <ImageLoader
          className="mllayerswitcher-layer-image"
          src={src}
          style={{ borderRadius: "8px", width, height: "40px" }}
        />

        <div
          className="mllayerswitcher-layer-text"
          style={{
            textAlign: "center",
            color: "rgb(112, 117, 122)",
            fontFamily: "Roboto, Arial",
            width,
            fontSize: "0.60rem",
          }}
        >
          {label}
        </div>
      </Box>
    </>
  );
};

export default LayerBox;
