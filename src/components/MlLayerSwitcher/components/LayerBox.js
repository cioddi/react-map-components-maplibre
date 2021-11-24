import { React, useEffect, useState } from "react";
import { css, cx } from "@emotion/css";
import { Box } from "@mui/system";
import ImageLoader from "../../../ui_components/ImageLoader";
/**
 * @component
 *
 */
const LayerBox = ({ id, activeLayers, label, handleLayerBoxClick, src }) => {
  const [activeClassName, setActiveClassName] = useState("");
  const [className, setClassName] = useState("mllayerswitcher-layer-box ");
  const hoverBorderColor = "#1C62D7"; //Navy Blue
  const activeBorderColor = "";
  const width = "40px";

  const defaultClass = css`
    & img:hover {
      border-color: ${hoverBorderColor} !important;
      border-radius: 8px !important;
    }
  `;
  const activeClass =
    defaultClass +
    `& img {
        border-color:  rgb(196, 240, 0);
        border-radius: 8px;
      }
    
      `;
  const hoverClass = css``;

  useEffect(() => {
    const isActive = activeLayers?.indexOf(id) !== -1;

    if (isActive) {
      setClassName(activeClass);
    } else {
      setClassName(defaultClass);
    }
  }, [activeLayers]);

  return (
    <>
      <Box
        key={id}
        className={defaultClass}
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
      >
        <ImageLoader
          className={css`
            border-color: rgb(181, 215, 238);
            border-radius: 8px;
            height: "40px";
            width: "40px";
          `}
          src={src}
         
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
