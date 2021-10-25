import { React, useEffect, useState } from "react";

import { Box } from "@mui/system";
import ImageLoader from "../../../ui_components/ImageLoader";
/**
 * @component
 *
 */
const LayerBox = ({
  id,
  activeLayers,
  label,
  handleLayerBoxClick,
  src,
  
}) => {
  
  const [activeClassName, setActiveClassName] = useState('');
  const [className, setClassName] = useState( "mllayerswitcher-layer-box "); 

  const width = "40px";
  
useEffect(()=>{
  console.log(activeLayers)
  
  const isActive = activeLayers?.indexOf(id) !== -1;
  
  if(isActive){
    setClassName("mllayerswitcher-layer-box active ")
  } else {
    setClassName("mllayerswitcher-layer-box ")
  }
  
  
},[activeLayers])

  const handleHover = (event) => {
    
    if (event.type === "mouseenter") {
      setActiveClassName(`activeHighlight`);
    }
    if (event.type === "mouseleave") {
      setActiveClassName(``);
    }
    
  };

  return (
    <>
      <Box
        key={id}
        className={activeClassName + ' '   + className}
        
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
