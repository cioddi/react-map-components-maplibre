import React, { useRef, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import useMap from "../../hooks/useMap";

/**
 * Adds a standard OSM tile layer to the maplibre-gl instancereference by
 * props.mapId
 *
 * @component
 */
const MlOsmLayer = (props) => {
  const mapHook = useMap({ mapId: props.mapId, waitForLayer: props.insertBeforeLayer });

  const [showLayer, setShowLayer] = useState(true);
  const sourceIdRef = useRef((props.idPrefix ? props.idPrefix : "MlOsmLayer-source-") + uuidv4());
  const layerIdRef = useRef((props.idPrefix ? props.idPrefix : "MlOsmLayer-layer-") + uuidv4());

  useEffect(() => {
    if (!mapHook.map) return;

    mapHook.map.addSource(
      sourceIdRef.current,
      {
        type: "raster",
        tileSize: 256,
        ...props.sourceOptions,
      },
    );
    mapHook.map.addLayer(
      {
        id: layerIdRef.current,
        type: "raster",
        source: sourceIdRef.current,
        minzoom: 0,
        maxzoom: 22,
        ...props.layerOptions,
      },
      props.insertBeforeLayer,
    );
  }, [mapHook.mapIds, props, mapHook.map]);

  useEffect(() => {
    if (!mapHook.map) return;
    
    // toggle layer visibility by changing the layout object's visibility property
    if (showLayer) {
      mapHook.map.setLayoutProperty(layerIdRef.current, "visibility", "visible");
    } else {
      mapHook.map.setLayoutProperty(layerIdRef.current, "visibility", "none");
    }
  }, [showLayer]);

  return (
    <Button
      color="primary"
      variant={showLayer ? "contained" : "outlined"}
      onClick={() => setShowLayer(!showLayer)}
    >
      OSM
    </Button>
  );
};

MlOsmLayer.propTypes = {
  /**
   * Id of the target MapLibre instance in mapHook
   */
  mapId: PropTypes.string,
  /**
   * Prefix of the component id this component uses when adding elements to the MapLibreGl-instance
   */
  idPrefix: PropTypes.string,
  /**
   * Options object that will be used as first parameter on the MapLibreGl.addSource call see MapLibre source options documentation.
   */
  sourceOptions: PropTypes.object,
  /**
   * Options object that will be used as first parameter on the MapLibreGl.addLayer call see MapLibre layer options documentation.
   *
   */
  layerOptions: PropTypes.object,
  /**
   * The layerId of an existing layer this layer should be rendered visually beneath
   * https://maplibre.org/maplibre-gl-js-docs/api/map/#map#addlayer - see "beforeId" property
   */
  insertBeforeLayer: PropTypes.string,
};

export default MlOsmLayer;
