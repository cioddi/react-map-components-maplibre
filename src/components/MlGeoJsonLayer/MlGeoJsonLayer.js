import React, { useRef, useEffect, useContext, useCallback } from "react";
import PropTypes from "prop-types";

import * as turf from "@turf/turf";
import { MapContext } from "@mapcomponents/react-core";

import useMap from "../../hooks/useMap";
import useMapState from "../../hooks/useMapState";

import { _transitionToGeojson } from "./util/transitionFunctions";

const msPerStep = 50;

/**
 * Adds source and layer of types "line", "fill" or "circle" to display GeoJSON data on the map.
 *
 * @component
 */
const MlGeoJsonLayer = (props) => {
  // Use a useRef hook to reference the layer object to be able to access it later inside useEffect hooks
  const mapContext = useContext(MapContext);
  const mapHook = useMap({ mapId: props.mapId, waitForLayer: props.insertBeforeLayer });

  const oldGeojsonRef = useRef(null);
  const mapRef = useRef(null);
  const initializedRef = useRef(false);
  const transitionInProgressRef = useRef(false);
  const transitionTimeoutRef = useRef(undefined);
  const currentTransitionStepRef = useRef(false);
  const transitionGeojsonDataRef = useRef([]);
  const transitionGeojsonCommonDataRef = useRef([]);
  const layerId = useRef(props.layerId || "MlGeoJsonLayer-" + mapHook.componentId);

  useEffect(() => {
    return () => {
      // This is the cleanup function, it is called when this react component is removed from react-dom
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapHook.map || !initializedRef.current) return;

    for (var key in props.layout) {
      mapHook.map.setLayoutProperty(layerId.current, key, props.layout[key]);
    }
  }, [props.layout, mapHook.map, props.mapId]);

  useEffect(() => {
    if (!mapHook.map || !initializedRef.current) return;

    for (var key in props.paint) {
      mapHook.map.setPaintProperty(layerId.current, key, props.paint[key]);
    }
  }, [props.paint, mapHook.map, props.mapId]);

  const transitionToGeojson = useCallback(
    (newGeojson) => {
      _transitionToGeojson(
        newGeojson,
        props,
        transitionGeojsonCommonDataRef,
        transitionGeojsonDataRef,
        transitionInProgressRef,
        oldGeojsonRef,
        msPerStep,
        currentTransitionStepRef,
        mapHook.map,
        layerId.current,
        transitionTimeoutRef
      );
    },
    [props, mapHook.map]
  );

  useEffect(() => {
    if (!mapHook?.map?.getSource(layerId.current) || !initializedRef.current) return;

    if (
      typeof props.transitionTime !== "undefined" &&
      props.type === "line" &&
      oldGeojsonRef.current
    ) {
      transitionInProgressRef.current = false;
      currentTransitionStepRef.current = false;
      transitionGeojsonDataRef.current = [];
      transitionGeojsonCommonDataRef.current = [];
      transitionToGeojson(props.geojson);
    } else {
      mapRef.current.getSource(layerId.current).setData(props.geojson);
    }
    oldGeojsonRef.current = props.geojson;
  }, [
    props.geojson,
    props.mapId,
    mapContext,
    props.type,
    transitionToGeojson,
    props.transitionTime,
  ]);

  const createLayer = useCallback(() => {
    let geojson = props.geojson;

    if (
      props.type === "line" &&
      typeof props.transitionTime !== "undefined" &&
      props.transitionTime &&
      typeof props.geojson.geometry !== "undefined"
    ) {
      var tmpChunks = turf.lineChunk(props.geojson, 0.01);
      geojson = tmpChunks.features[0];
    }

    mapHook.map.addLayer(
      {
        id: layerId.current,
        source: {
          type: "geojson",
          data: geojson,
        },
        type: props.type || "line",
        paint: props.paint || {
          "line-color": "rgb(100,200,100)",
          "line-width": 10,
        },
        layout: props.layout || {},
      },
      props.insertBeforeLayer,
      mapHook.componentId
    );

    if (typeof props.onHover !== "undefined") {
      mapHook.map.on("mousemove", mapHook.componentId, props.onHover, mapHook.componentId);
    }

    if (typeof props.onClick !== "undefined") {
      mapHook.map.on("click", mapHook.componentId, props.onClick, mapHook.componentId);
    }

    if (typeof props.onLeave !== "undefined") {
      mapHook.map.on("mouseleave", mapHook.componentId, props.onLeave, mapHook.componentId);
    }

    if (
      props.type === "line" &&
      typeof props.transitionTime !== "undefined" &&
      typeof props.geojson.geometry !== "undefined"
    ) {
      transitionToGeojson(props.geojson);
      oldGeojsonRef.current = props.geojson;
    }
  }, [mapHook.map, props, transitionToGeojson]);

  useEffect(() => {
    if (!mapHook.map || !props.geojson || initializedRef.current) return;
    // initialize the layer and add it to the MapLibre-gl instance or do something else with it

    initializedRef.current = true;

    createLayer();
  }, [mapHook.mapIsReady, mapHook.map, createLayer, props]);

  return <></>;
};

MlGeoJsonLayer.propTypes = {
  /**
   * Id of the target MapLibre instance in mapContext
   */
  mapId: PropTypes.string,
  /**
   * Type of the layer that will be added to the MapLibre instance.
   * Possible values: "line", "circle", "fill"
   */
  type: PropTypes.string,
  /**
   * Layout property object, that is passed to the addLayer call.
   * Possible props depend on the layer type.
   * https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#line
   * https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#circle
   * https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#fill
   */
  layout: PropTypes.object,
  /**
   * Paint property object, that is passed to the addLayer call.
   * Possible props depend on the layer type.
   * https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#line
   * https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#circle
   * https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#fill
   */
  paint: PropTypes.object,
  /**
   * GeoJSON data that is supposed to be rendered by this component.
   */
  geojson: PropTypes.object,
  /**
   * Id of an existing layer in the mapLibre instance to help specify the layer order
   * This layer will be visually beneath the layer with the "insertBeforeLayer" id.
   */
  insertBeforeLayer: PropTypes.string,
  /**
   * Id of the new layer and source that are added to the MapLibre instance
   */
  layerId: PropTypes.string,
  /**
   * Click event handler that is executed whenever a geometry rendered by this component is clicked.
   */
  onClick: PropTypes.func,
  /**
   * Hover event handler that is executed whenever a geometry rendered by this component is hovered.
   */
  onHover: PropTypes.func,
  /**
   * Leave event handler that is executed whenever a geometry rendered by this component is
   * left/unhovered.
   */
  onLeave: PropTypes.func,
  /**
   * Creates transition animation whenever the geojson prop changes.
   * Only works with layer type "line" and LineString GeoJSON data.
   */
  transitionTime: PropTypes.number,
};

export default MlGeoJsonLayer;
