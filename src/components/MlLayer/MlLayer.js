import React, { useRef, useEffect, useContext } from "react";

import { v4 as uuidv4 } from "uuid";
import { MapContext } from "@mapcomponents/react-core";
import useMapState from "../../hooks/useMapState";

const MlLayer = (props) => {
  // Use a useRef hook to reference the layer object to be able to access it later inside useEffect hooks
  const mapContext = useContext(MapContext);

  const mapState = useMapState({
    mapId: props.mapId,
    watch: {
      viewport: false,
      layers: true,
      sources: false,
    },
  });
  const layerInitializedRef = useRef(false);
  const mapRef = useRef(null);
  const componentId = useRef((props.layerId ? props.layerId : "MlLayer-") + uuidv4());
  const layerId = useRef(props.layerId || componentId.current);
  const layerPaintConfRef = useRef(undefined);
  const layerLayoutConfRef = useRef(undefined);

  useEffect(() => {
    let _componentId = componentId.current;

    return () => {
      if (mapRef.current) {
        mapRef.current.cleanup(_componentId);
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (
      !mapContext.mapExists(props.mapId) ||
      !mapContext.getMap(props.mapId)?.getLayer?.(layerId) ||
      !layerInitializedRef.current ||
      !props.options
    )
      return;
    // the MapLibre-gl instance (mapContext.map) is accessible here
    // initialize the layer and add it to the MapLibre-gl instance or do something else with it
    var key;

    let layoutString = JSON.stringify(props.options.layout);
    if (props.options.layout && layoutString !== layerLayoutConfRef.current) {
      for (key in props.options.layout) {
        mapRef.current.setLayoutProperty(layerId, key, props.options.layout[key]);
      }
      layerLayoutConfRef.current = layoutString;
    }

    let paintString = JSON.stringify(props.options.paint);
    if (props.options.paint && paintString === layerPaintConfRef.current) {
      for (key in props.options.paint) {
        mapRef.current.setPaintProperty(layerId, key, props.options.paint[key]);
      }
    }
  }, [props.options, layerId, mapContext, props]);

  useEffect(() => {
    if (!mapContext.mapExists(props.mapId) || layerInitializedRef.current) return;
    // the MapLibre-gl instance (mapContext.map) is accessible here
    // initialize the layer and add it to the MapLibre-gl instance or do something else with it

    //check if insertBeforeLayer exists
    if (props.insertBeforeLayer) {
      let layerFound = false;

      mapState?.layers?.forEach((layer) => {
        if (layer.id === props.insertBeforeLayer) {
          layerFound = true;
        }
      });
      if (!layerFound) {
        return;
      }
    }

    mapRef.current = mapContext.getMap(props.mapId);
    if (mapRef.current) {
      layerInitializedRef.current = true;
      mapRef.current.addLayer(
        {
          id: layerId.current,
          type: "background",
          paint: {
            "background-color": "rgba(0,0,0,0)",
          },
          ...props.options,
        },
        props.insertBeforeLayer,
        componentId.current
      );
      layerPaintConfRef.current = JSON.stringify(props.options?.paint);
      layerLayoutConfRef.current = JSON.stringify(props.options?.layout);
    }
  }, [mapContext.mapIds, mapContext, props, mapState.layers]);

  return <></>;
};

export default MlLayer;
