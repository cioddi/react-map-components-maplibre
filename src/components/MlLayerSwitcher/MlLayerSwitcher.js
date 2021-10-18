//CSS
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "./MlLayerSwitcher.css";
//External
import React, { useEffect, useContext, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { CardMedia, Card, CardContent, Typography, Fab, Box, Fade, Popper } from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
//Internal
import { MapContext } from "react-map-components-core";
import ImageLoader from "../../ui_components/ImageLoader";
import LayerBox from "./components/LayerBox";
import Divider from "@mui/material/Divider";
import useMap from "../../hooks/useMap";
/**
 * @component
 *
 *
 */
const MlLayerSwitcher = (props) => {
  // Use a useRef hook to reference the layer object to be able to access it later inside useEffect hooks
  const mapContext = useContext(MapContext);
  const showBaseSources = !!props?.baseSourceConfig?.active;
  const showDetailLayer = !!props?.detaiLayerConfig?.active;

  const baseSourceLayers = props?.baseSourceConfig?.layers || [];
  const detaiLayers = props?.detaiLayerConfig?.layers || [];
  const [showElement, setShowElement] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [activeLayers, setActiveLayers] = useState([]);

  const opener = useRef(null);

  let className = "mllayerswitcher-layer-box";

  const handleClick = ({ currentTarget }) => {
    setShowElement((previousOpen) => !previousOpen);
  };

  useEffect(() => {
    //Set base state to activate only first layer
    mapContext.map &&
      baseSourceLayers.forEach((config, i) => {
        const layers = getLayerListFromId(config.layerId);
        const visible = i === 0 ? "visible" : "none";
        layers.forEach((layer) => {
          if (layer) {
            changeLayerState(layer, visible);
          }
        });
      });
    return () => {
      // This is the cleanup function, it is called when this react component is removed from react-dom
      // try to remove anything this component has added to the MapLibre-gl instance
      // e.g.: remove the layer
      // mapContext.getMap(props.mapId).removeLayer(layerRef.current);
      // check for the existence of map.style before calling getLayer or getSource
    };
  }, []);

  useEffect(() => {
    if (!mapContext.mapExists(props.mapId) || !baseSourceLayers) return;
    baseSourceLayers.forEach((config, i) => {
      const layers = getLayerListFromId(config.layerId);
      const visible = i === 0 ? "visible" : "none";
      layers.forEach((layer) => {
        if (layer) {
          changeLayerState(layer, visible);
        }
      });
    });
  }, [mapContext.mapIds, mapContext, props.mapId, baseSourceLayers]);

  useMap(() => {
    console.count(1);
    if (mapContext.map?.style?._layers) {
      setActiveLayers([]);
      let newactiveLayers = [];
      baseSourceLayers.forEach((layerConfig) => {
        const layers = getLayerListFromId(layerConfig.layerId);

        layers.forEach((layer) => {
          const visibilty = mapContext.map?.getLayoutProperty(layer, "visibility");
          if (layer.indexOf(mapContext.map?.baseLayers) !== -1) {
            layer = "styleBase";
          }

          if (layer.indexOf(newactiveLayers) !== -1 && visibilty === "visible") {
            newactiveLayers.push(layer);
          }
        });
      });
      newactiveLayers = Array.from(new Set(newactiveLayers));
      console.log(newactiveLayers);
      setActiveLayers(newactiveLayers);
    }
  }, []);

  const getLayerListFromId = (id) => {
    return id === "styleBase" ? mapContext?.map.baseLayers : [id];
  };

  const handleLayerBoxClick = (id) => {
    let layers = getLayerListFromId(id);
    const nextVisiblityClickedLayer =
      mapContext?.map.getLayer(layers[0])?.getLayoutProperty("visibility") === "visible"
        ? "none"
        : "visible";

    baseSourceLayers.forEach((config, i) => {
      let layers = getLayerListFromId(config.layerId);
      let visible = "none";
      if (config.layerId === id) {
        visible = nextVisiblityClickedLayer;
      }

      //To avoid disabling all base layers we activate the first one
      if (nextVisiblityClickedLayer === "none" && i === 0) {
        visible = "visible";
      }
      layers.forEach((layer) => {
        if (layer) {
          changeLayerState(layer, visible);
        }
      });
    });
  };

  const changeLayerState = (layer, visible = "none") => {
    mapContext.map?.setLayoutProperty(layer, "visibility", visible);
  };

  return (
    <>
      <Fab
        onClick={handleClick}
        ref={opener}
        variant="extended"
        size="small"
        color="primary"
        aria-label="add"
        sx={{ zIndex: 101, margin: "2rem" }}
      >
        <LayersIcon sx={{ mr: 1 }} />
        Ebenen
      </Fab>

      <Popper
        id={"layerSwitcher"}
        open={showElement}
        container={() => document.querySelector(".fullscreen_map")}
        anchorEl={opener.current}
        transition
        style={{ zIndex: 101 }}
        placement="right"
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Card sx={{ zIndex: 101, position: "absolute", minWidth: "200px" }}>
              {" "}
              <CardContent>
                {showBaseSources && (
                  <Box sx={{ minHeight: "150px" }}>
                    <Typography variant="h6">Map Type</Typography>
                    <Divider />
                    <Box sx={{ display: "flex", paddingTop: "1rem" }}>
                      {baseSourceLayers.map(({ src, label, layerId }) => {
                        const isActive = layerId.indexOf(activeLayers) !== -1;
                        return (
                          <LayerBox
                            key={layerId}
                            activeHighlight={activeHighlight}
                            active={isActive}
                            activeLayers={activeLayers}
                            label={label}
                            id={layerId}
                            src={src}
                            className={className}
                            handleLayerBoxClick={() => {
                              handleLayerBoxClick(layerId);
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                )}
                {!!detaiLayers?.length && (
                  <Box sx={{ minHeight: "150px" }}>
                    <Typography variant="h6">Map details</Typography>
                    <Divider />
                    <Box sx={{ display: "flex", paddingTop: "1rem" }}>
                      {detaiLayers.map(({ src, label, layerId, active }) => {
                        return (
                          <LayerBox
                            actve={active}
                            label={label}
                            id={layerId}
                            key={layerId}
                            src={src}
                            className={className}
                            handleLayerBoxClick={() => {
                              handleLayerBoxClick(layerId);
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Fade>
        )}
      </Popper>
    </>
  );
};

MlLayerSwitcher.propTypes = {
  baseSourceConfig: PropTypes.object,
};

export default MlLayerSwitcher;
