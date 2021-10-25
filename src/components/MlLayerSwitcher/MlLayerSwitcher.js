//CSS
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "./MlLayerSwitcher.css";
//External
import { useEffect, useContext, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Card, CardContent, Typography,  Box } from "@mui/material";
//Internal
import { MapContext } from "react-map-components-core";
import LayerBox from "./components/LayerBox";
import Divider from "@mui/material/Divider";
import useMapState from "../../hooks/useMapState";

/**
 * @component
 *
 *
 */
const MlLayerSwitcher = ({ baseSourceConfig, detaiLayerConfig, mapId = "map_1"} ) => {
  
  
  const mapContext = useContext(MapContext);
  const showBaseSources = !!baseSourceConfig?.layers?.length;
  const showDetailLayer = !!detaiLayerConfig?.layers?.length;
  const { layers } = useMapState({ mapId })
  const [activeLayers, setActiveLayers] = useState([]);
  const [activeDetailLayers, setActiveDetailLayers] = useState([]);
  const { t } = useTranslation();








  useEffect(() => {
    //Set base state to activate only first layer
    mapContext.map &&
      baseSourceConfig.layers.forEach((config, i) => {
        const layers = getLayerListFromId(config.layerId);
        const visible = i === 0 ? "visible" : "none";
        console.log(visible)
        console.log(config.layerId)

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
  }, [mapContext.map]);



  useEffect(() => {
    console.log('123')
    if (mapContext.map?.style?._layers) {

      let newactiveLayers = [];
      let newactiveDetailLayers = [];
      baseSourceConfig.layers.forEach((layerConfig) => {
        const layers = getLayerListFromId(layerConfig.layerId);

        layers.forEach((layer) => {
          const visibilty = mapContext.map?.getLayoutProperty(layer, "visibility");
          if (mapContext.map.baseLayers.indexOf(layer) !== -1) {
            layer = "styleBase";
          }

          if (newactiveLayers.indexOf(layer) === -1 && visibilty === "visible") {
            newactiveLayers.push(layer);
          }
        });
      });
      detaiLayerConfig.layers.forEach(({ layerId }) => {

        const visibilty = mapContext.map?.getLayoutProperty(layerId, "visibility");
        if (newactiveDetailLayers.indexOf(layerId) === -1 && visibilty === "visible") {
          newactiveDetailLayers.push(layerId);
        }
      });
      setActiveLayers(newactiveLayers);

      setActiveDetailLayers(newactiveDetailLayers);
    }
  }, [layers]);

  const getLayerListFromId = (id) => {
    return id === "styleBase" ? mapContext?.map.baseLayers : [id];
  };

  const handleDetailLayerBoxClick = (layerId) => {
    const cfg = detaiLayerConfig.layers.find((e) => e.layerId === layerId);
    if (cfg.linkedTo) {
      handleLayerBoxClick(cfg.linkedTo)
    }
    const nextVisiblityClickedLayer = mapContext?.map.getLayer(layerId)?.getLayoutProperty("visibility") === "visible"
      ? "none"
      : "visible";
    changeLayerState(layerId, nextVisiblityClickedLayer);
  }

  const handleLayerBoxClick = (id) => {
    let layers = getLayerListFromId(id);
    const nextVisiblityClickedLayer =
      mapContext?.map.getLayer(layers[0])?.getLayoutProperty("visibility") === "visible"
        ? "none"
        : "visible";

    baseSourceConfig.layers.forEach((config, i) => {
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

      <Card sx={{ zIndex: 101, position: "absolute", minWidth: "200px" }}>

        <CardContent>
          {showBaseSources && (
            <Box sx={{ minHeight: "150px" }}>
              <Typography variant="h6">{t(baseSourceConfig.label || "Map type")}</Typography>
              <Divider />
              <Box sx={{ display: "flex", paddingTop: "1rem" }}>
                {baseSourceConfig.layers.map(({ src, label, layerId }) => {

                  return (
                    <LayerBox
                      key={layerId}
                      activeLayers={activeLayers}
                      label={t(label)}
                      id={layerId}
                      src={src}
                      handleLayerBoxClick={() => {
                        handleLayerBoxClick(layerId);
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}
          {showDetailLayer && (
            <Box sx={{ minHeight: "150px" }}>
              <Typography variant="h6">{t("Map details")}</Typography>
              <Divider />
              <Box sx={{ display: "flex", paddingTop: "1rem" }}>
                {detaiLayerConfig.layers.map(({ src, label, layerId }) => {
                  return (
                    <LayerBox
                      activeLayers={activeDetailLayers}
                      label={t(label)}
                      id={layerId}
                      key={layerId}
                      src={src}
                      handleLayerBoxClick={() => {
                        handleDetailLayerBoxClick(layerId);
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
};

MlLayerSwitcher.propTypes = {
  baseSourceConfig: PropTypes.shape({
    label: PropTypes.string,
    layers: PropTypes.arrayOf(PropTypes.shape({
      layerId: PropTypes.string.isRequired,
      src: PropTypes.string,
      label : PropTypes.string.isRequired
    }))
  }),
  detaiLayerConfig: PropTypes.shape({
    label: PropTypes.string,
    layers: PropTypes.arrayOf(PropTypes.shape({
      layerId: PropTypes.string.isRequired,
      src: PropTypes.string,
      label : PropTypes.string.isRequired,
      linkedTo: PropTypes.string
    }))
  }),
  mapId: PropTypes.string
};

export default MlLayerSwitcher;
