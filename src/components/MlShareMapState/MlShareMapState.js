import React, { useRef, useEffect, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";

import { MapContext } from "@mapcomponents/react-core";
import { v4 as uuidv4 } from "uuid";
import useMapState from "../../hooks/useMapState";

/**
 * TODO: Add short & useful description
 *
 * @param {object} props
 * @param {string} props.mapId Id of the target MapLibre instance in mapContext
 *
 * @component
 */
const MlShareMapState = (props) => {
  // Use a useRef hook to reference the layer object to be able to access it later inside useEffect hooks
  const mapContext = useContext(MapContext);
  const initializedRef = useRef(false);
  const mapRef = useRef(undefined);
  const [map, setMap] = useState(undefined);
  const layersFromUrlParamsRef = useRef({});
  const componentId = useRef((props.idPrefix ? props.idPrefix : "MlShareMapState-") + uuidv4());
  const [isInitialState, setIsInitialState] = useState(true);
  const mapState = useMapState({
    watch: {
      viewport: false,
      layers: true,
      sources: false,
    },
    filter: {
      includeBaseLayers: false,
    },
  });

  const allStatesRestoredRef = useRef(false);
  const restoredStatesRef = useRef({
    viewport: {
      center: false,
      bearing: false,
      pitch: false,
      zoom: false,
    },
    layers: {
      ...layersFromUrlParamsRef,
    },
  });

  const mapStateRef = useRef({});

  const refreshUrlParameters = useCallback(() => {
    let mapLayers = [];
    for (let x in mapState.layers) {
      mapLayers.push({
        id: mapState.layers[x].id,
        type: mapState.layers[x].type,
        visible: mapState.layers[x].visible,
      });
    }
    console.log("beep");
    refreshMapState();
    let urlParams = new URLSearchParams({
      ...getCurrentUrlParameters(),
      ...mapStateRef.current,
      layers: JSON.stringify(mapLayers),
    });
    console.log(JSON.parse(Object.fromEntries(urlParams).layers));
    JSON.parse(Object.fromEntries(urlParams).layers).forEach((el, i, arr) => {
      layersFromUrlParamsRef.current[el.id] = false;
    });
    console.log(layersFromUrlParamsRef.current);

    let currentParams = new URLSearchParams(window.location.search);
    console.log(urlParams.toString());
    console.log(currentParams.toString());
    console.log(mapState);
    checkRestorationStates(mapState.layers);
    if (urlParams.toString() !== currentParams.toString()) {
      window.history.pushState(
        { ...mapStateRef.current },
        document.title,
        "?" + urlParams.toString()
      );
    }
  }, [mapState.layers]);

  useEffect(() => {
    let _componentId = componentId.current;

    return () => {
      // This is the cleanup function, it is called when this react component is removed from react-dom
      // try to remove anything this component has added to the MapLibre-gl instance
      // e.g.: remove the layer
      // mapContext.getMap(props.mapId).removeLayer(layerRef.current);
      // check for the existence of map.style before calling getLayer or getSource

      if (mapRef.current) {
        mapRef.current.cleanup(_componentId);
        mapRef.current = undefined;
      }
      initializedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    let _refreshUrlParameters = refreshUrlParameters;

    mapRef.current.on("moveend", _refreshUrlParameters, componentId.current);

    return () => {
      mapRef.current.off("moveend", _refreshUrlParameters);
    };
  }, [refreshUrlParameters, map, props.active]);

  useEffect(() => {
    if (!mapContext.mapExists(props.mapId) || initializedRef.current) return;
    // the MapLibre-gl instance (mapContext.getMap(props.mapId)) is accessible here
    // initialize the layer and add it to the MapLibre-gl instance or do something else with it
    initializedRef.current = true;
    mapRef.current = mapContext.getMap(props.mapId);
    setMap(mapRef.current);
    console.log("as");
    const currentUrlParams = getCurrentUrlParameters();
    console.log(currentUrlParams);
    if (currentUrlParams.lat && currentUrlParams.lng) {
      mapStateRef.current = currentUrlParams;
      restoreMapState();
    }
  }, [mapContext.mapIds, mapContext, props.mapId, props.active]);

  useEffect(() => {
    if (!mapState?.layers?.length) return;
    if (allStatesRestoredRef.current) return;

    const currentUrlParams = getCurrentUrlParameters();
    console.log(allStatesRestoredRef.current);

    if (currentUrlParams.layers) {
      for (let x in currentUrlParams.layers) {
        mapRef.current
          ?.getLayer(currentUrlParams.layers[x].id)
          ?.setLayoutProperty(
            "visibility",
            currentUrlParams.layers[x].visible ? "visible" : "none"
          );
      }
    }
  }, [mapState.layers, props.mapId, props.active]);

  useEffect(() => {
    if (!map) return;
    if (!mapState.layers) return;

    if (props.active) {
      setIsInitialState(false);
    } else {
      map.cleanup(componentId.current);
    }
  }, [props.active, map, mapState.layers]);

  const getCurrentUrlParameters = () => {
    let currentParams = Object.fromEntries(new URLSearchParams(window.location.search));
    currentParams.layers = JSON.parse(currentParams?.layers ? currentParams.layers : "[]");

    return currentParams;
  };

  const refreshMapState = () => {
    mapStateRef.current.lat = mapRef.current.getCenter().lat;
    mapStateRef.current.lng = mapRef.current.getCenter().lng;
    mapStateRef.current.zoom = mapRef.current.getZoom();
    mapStateRef.current.bearing = mapRef.current.getBearing();
    mapStateRef.current.pitch = mapRef.current.getPitch();
  };

  const checkRestorationStates = (stateArray) => {
    let tempArray = {};
    stateArray.forEach((el, i, arr) => {
      if (!arr[el.key]) tempArray[el.key] = true;
    });
  };

  const restoreMapState = () => {
    if (!restoredStatesRef.current.viewport.center) {
      restoredStatesRef.current.viewport.center = true;
      mapRef.current.setCenter([mapStateRef.current.lng, mapStateRef.current.lat]);
      mapRef.current.setZoom(mapStateRef.current.zoom);
      mapRef.current.setBearing(mapStateRef.current.bearing);
      mapRef.current.setPitch(mapStateRef.current.pitch);
    }

    allStatesRestoredRef.current = true;
  };

  window.onpopstate = (event) => {
    console.log(event.state);
    if (event.state && event.state.lng && event.state.lat && event.state.zoom) {
      mapRef.current.easeTo({ zoom: event.state.zoom, center: [event.state.lng, event.state.lat] });
    }
  };

  return <></>;
};

MlShareMapState.defaultProps = {
  mapId: undefined,
};

MlShareMapState.propTypes = {
  /**
   * Id of the target MapLibre instance in mapContext
   */
  mapId: PropTypes.string,
};
export default MlShareMapState;
