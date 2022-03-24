import React__default, { useRef, useContext, useEffect, useState, useCallback, useMemo, createElement } from 'react';
import PropTypes from 'prop-types';
import { MapContext } from '@mapcomponents/react-core';
import maplibregl from '!maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { v4 } from 'uuid';
import Button from '@mui/material/Button';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { point, circle, lineArc, bbox, lineOffset, distance, lineString as lineString$1, length, lineChunk, featureCollection } from '@turf/turf';
import maplibregl$1, { Popup } from 'maplibre-gl';
import jsPDF from 'jspdf';
import PrinterIcon from '@mui/icons-material/Print';
import ButtonGroup from '@mui/material/ButtonGroup';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import _styled from '@emotion/styled/base';
import { css } from '@emotion/css';
import useMediaQuery from '@mui/material/useMediaQuery';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Point from '@mapbox/point-geometry';
import extent from '@mapbox/geojson-extent';
import syncMove from '@mapbox/mapbox-gl-sync-move';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import FileCopy from '@mui/icons-material/FileCopy';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { lineString, polygon } from '@turf/helpers';
import Paper from '@mui/material/Paper';
import WMSCapabilities from 'wms-capabilities';

/* eslint:disable-next-line */
/**
 * Creates a MapLibre-gl-js instance and offers all of the native MapLibre functions and properties as well as additional functionality such as element registration & cleanup and more events.
 *
 * @param {object} props
 *
 * @class
 */

const MapLibreGlWrapper = function (props) {
  var _this = this;

  // closure variable to safely point to the object context of the current MapLibreGlWrapper instance
  let self = this; // element registration and cleanup on a component level is experimental

  this.registeredElements = {}; // array of base layer ids, all layers that have been added by the style passed to the MapLibreGl coonstructor

  this.baseLayers = []; // layer id of the first symbol layer

  this.firstSymbolLayer = undefined; // event handlers registered in MapLibreGlWrapper

  this.eventHandlers = {
    layerchange: [],
    viewportchange: []
  }; // functions and properties provided by the wrapper
  // Add new functions and properties introduced by the wrapper to this object to prevent collisions due to future MapLibre API changes

  this.wrapper = {
    /**
     * Subscribe the given event handler to an event
     *
     * @param {string} eventName
     * @param {function} handler
     * @param {object} options
     * @param {string} componentId
     * @returns {undefined}
     */
    on: (eventName, handler, options, componentId) => {
      if (!self.eventHandlers[eventName]) return;

      if (typeof options === "string") {
        componentId = options;
        options = {};
      }

      self.eventHandlers[eventName].push({
        handler,
        options
      });
      let _arguments = [eventName, handler];

      if (componentId && typeof componentId === "string") {
        self.initRegisteredElements(componentId);
        self.registeredElements[componentId].wrapperEvents.push(_arguments);
      }
    },

    /**
     * Unsubscribes the given event handler from an event
     *
     * @param {string} eventName
     * @param {function} handler
     * @returns {undefined}
     */
    off: (eventName, handler) => {
      if (!self.eventHandlers[eventName]) return;
      self.eventHandlers[eventName] = self.eventHandlers[eventName].filter(item => {
        if (!Object.is(item.handler, handler)) {
          return item;
        }

        return false;
      });
    },

    /**
     * Calls all event handlers that have been subscribed to the given eventName
     *
     * @param {string} eventName
     * @param {object} context
     * @returns {undefined}
     */
    fire: (eventName, context) => {
      if (!self.eventHandlers[eventName]) return;
      var scope = context || window;
      let event = new Event(eventName);
      event.data = self;
      self.eventHandlers[eventName].forEach(function (item) {
        item.handler.call(scope, event);
      });
    },

    /**
     * Array containing an object for each layer in the MapLibre instance providing information on visibility, loading state, order, paint & layout properties
     */
    layerState: [],

    /**
     * Maps layerIds to layerState in JSON string form for quick deep comparisons
     */
    layerStateString: "",

    /**
     * Previous Version of layerStateString
     */
    oldLayerStateStrings: {},

    /**
     * Builds the layer info object for a given layer id
     *
     * @param {string} layer
     * @returns object
     */
    buildLayerObject: layer => {
      //if (self.baseLayers.indexOf(layer.id) === -1) {
      //let paint = {};
      //let values = layer.paint?._values;
      //Object.keys(values || {}).map((propName) => {
      //  paint[propName] =
      //    typeof values[propName].value !== "undefined"
      //      ? values[propName].value.value
      //      : values[propName];
      //});
      //let layout = {};
      //values = layer.layout?._values;
      //Object.keys(values || {}).map((propName) => {
      //  layout[propName] =
      //    typeof values[propName].value !== "undefined"
      //      ? values[propName].value.value
      //      : values[propName];
      //});
      return {
        id: layer.id,
        type: layer.type,
        visible: layer.visibility === "none" ? false : true,
        baseLayer: self.baseLayers.indexOf(layer.id) !== -1 //paint,
        //layout,
        //filter: layers[layerId].filter,
        //layout: layers[layerId].layout,
        //maxzoom: layers[layerId].maxzoom,
        //metadata: layers[layerId].metadata,
        //minzoom: layers[layerId].minzoom,
        //paint: layers[layerId].paint.get(),
        //source: layers[layerId].source,
        //sourceLayer: layers[layerId].sourceLayer,

      }; //}
    },

    /**
     * Returns an array of layer state info objects for all layers in the MapLibre instance
     *
     * @returns array
     */
    buildLayerObjects: () => {
      return self.style._order.map(layerId => {
        return self.wrapper.buildLayerObject(self.map.style._layers[layerId]);
      }).filter(n => n);
    },

    /**
     * Updates layer state info objects
     */
    refreshLayerState: () => {
      self.wrapper.layerState = self.wrapper.buildLayerObjects();

      if (JSON.stringify(self.wrapper.layerState) !== self.wrapper.layerStateString) {
        self.wrapper.fire("layerchange");
        self.wrapper.layerStateString = JSON.stringify(self.wrapper.layerState);
      }
    },

    /**
     * Object containing information on the current viewport state
     */
    viewportState: {},

    /**
     * The same data as viewportState in JSON string form for quick deep comparisons
     */
    viewportStateString: "{}",

    /**
     * Previous version of viewportStateString
     */
    oldViewportStateString: "{}",
    getViewport: () => typeof self.map.getCenter === "function" ? {
      center: (_ref => {
        let {
          lng,
          lat,
          ...rest
        } = _ref;
        return {
          lng,
          lat
        };
      })(self.map.getCenter()),
      zoom: self.map.getZoom(),
      bearing: self.map.getBearing(),
      pitch: self.map.getPitch()
    } : {},
    refreshViewport: () => {
      self.wrapper.viewportState = self.wrapper.getViewport();
    }
  };
  /**
   * Initializes an empty registered elements object for the given componentId
   *
   * @param {string} componentId
   * @param {boolean} force
   */

  this.initRegisteredElements = (componentId, force) => {
    if (typeof self.registeredElements[componentId] === "undefined" || force !== "undefined" && force) {
      self.registeredElements[componentId] = {
        layers: [],
        sources: [],
        images: [],
        events: [],
        controls: [],
        wrapperEvents: []
      };
    }
  };
  /**
   * Overrides MapLibre-gl-js addLayer function providing an additional componentId parameter for the wrapper element registration.
   *
   * @param {object} layer
   * @param {string} beforeId
   * @param {string} componentId
   * @returns {undefined}
   */


  this.addLayer = (layer, beforeId, componentId) => {
    if (!self.map.style) {
      return;
    }

    if (componentId && typeof componentId === "string" && typeof layer.id !== "undefined") {
      self.initRegisteredElements(componentId);
      self.registeredElements[componentId].layers.push(layer.id);

      if (typeof layer.source === "object") {
        self.registeredElements[componentId].sources.push(layer.id);
      }
    }

    self.map.addLayer(layer, beforeId);
  };
  /**
   * Overrides MapLibre-gl-js addSource function providing an additional componentId parameter for the wrapper element registration.
   *
   * @param {string} sourceId
   * @param {object} source
   * @param {object} options
   * @param {string} componentId
   * @returns {undefined}
   */


  this.addSource = (sourceId, source, options, componentId) => {
    if (!self.map.style) {
      return;
    }

    if (typeof options === "string" && typeof componentId === "undefined") {
      return self.addSource.call(self, sourceId, source, undefined, options);
    }

    if (componentId && typeof componentId === "string" && typeof sourceId !== "undefined") {
      self.initRegisteredElements(componentId);
      self.registeredElements[componentId].sources.push(sourceId);
    }

    self.map.addSource(sourceId, source, options);
  };
  /**
   * Overrides MapLibre-gl-js addImage function providing an additional componentId parameter for the wrapper element registration.
   *
   * @param {string} id
   * @param {*} image
   * @param {*} ref
   * @param {string} componentId
   * @returns {undefined}
   */


  this.addImage = (id, image, ref, componentId) => {
    if (!self.map.style) {
      return;
    }

    if (typeof ref === "string" && typeof componentId === "undefined") {
      return self.addImage.call(self, id, image, undefined, ref);
    }

    if (componentId && typeof componentId === "string" && typeof id !== "undefined") {
      self.initRegisteredElements(componentId);
      self.registeredElements[componentId].images.push(id);
    }

    self.map.addImage(id, image, ref);
  };
  /**
   * Overrides MapLibre-gl-js on function providing an additional componentId parameter for the wrapper element registration.
   *
   * @param {string} type
   * @param {string} layerId
   * @param {function} listener
   * @param {string} componentId
   * @returns {undefined}
   */


  this.on = (type, layerId, listener, componentId) => {
    if (typeof listener === "string" && typeof layerId === "function") {
      return self.on.call(self, type, undefined, layerId, listener);
    }

    let _arguments = [type, layerId, listener];

    if (!layerId) {
      _arguments = [type, listener];
    }

    if (componentId && typeof componentId === "string") {
      self.initRegisteredElements(componentId);
      self.registeredElements[componentId].events.push(_arguments);
    }

    self.map.on(..._arguments);
  };
  /**
   * Overrides MapLibre-gl-js addControl function providing an additional componentId parameter for the wrapper element registration.
   *
   * @param {object} control
   * @param {string} position
   * @param {string} componentId
   */


  this.addControl = (control, position, componentId) => {
    if (componentId && typeof componentId === "string") {
      self.initRegisteredElements(componentId);
      self.registeredElements[componentId].controls.push(control);
    }

    self.map.addControl(control, position);
  };
  /**
   * Removes anything that has been added to the maplibre instance referenced with componentId
   *
   * @param {string} componentId
   */


  this.cleanup = componentId => {
    if (self.map.style && typeof self.registeredElements[componentId] !== "undefined") {
      // cleanup layers
      self.registeredElements[componentId].layers.forEach(item => {
        if (self.map.style.getLayer(item)) {
          self.map.style.removeLayer(item);
        }
      }); // cleanup sources

      self.registeredElements[componentId].sources.forEach(item => {
        if (self.map.style.getSource(item)) {
          self.map.style.removeSource(item);
        }
      }); // cleanup images

      self.registeredElements[componentId].images.forEach(item => {
        if (self.map.hasImage(item)) {
          self.map.style.removeImage(item);
        }
      }); // cleanup events

      self.registeredElements[componentId].events.forEach(item => {
        self.map.off(...item);
      }); // cleanup controls

      self.registeredElements[componentId].controls.forEach(item => {
        self.map.removeControl(item);
      }); // cleanup wrapper events

      self.registeredElements[componentId].wrapperEvents.forEach(item => {
        self.wrapper.off(...item);
      });
      self.initRegisteredElements(componentId, true);
    }
  }; // add style prop functions that require map._update to be called afterwards


  let updatingStyleFunctions = ["moveLayer", "removeLayer", "removeSource", "setPaintProperty", "setLayoutProperty"];
  updatingStyleFunctions.forEach(item => {
    this[item] = function () {
      if (self.map && _this.map.style && typeof self.map.style[item] === "function") {
        self.map.style[item](...arguments);
      }

      return self.map._update ? self.map._update(true) : undefined;
    };
  }); // add style prop functions

  let styleFunctions = ["getLayer", "getSource", "listImages", "getPaintProperty", "getLayoutProperty", "removeImage"];
  styleFunctions.forEach(item => {
    this[item] = function () {
      if (self.map && self.map.style) {
        return self.map.style[item](...arguments);
      }

      return false;
    };
  });

  this.addNativeMaplibreFunctionsAndProps = () => {
    //  add MapLibre-gl functions
    Object.getOwnPropertyNames(Object.getPrototypeOf(this.map)).forEach(item => {
      if (typeof this[item] === "undefined") {
        this[item] = function () {
          return self.map[item](...arguments);
        };
      }
    }); //  add MapLibre-gl properties

    Object.keys(this.map).forEach(item => {
      if (typeof this[item] === "undefined") {
        this[item] = self.map[item];
      }
    });
  }; // add functions that are missing on the MapLibre instances prototype


  let missingFunctions = ["getZoom", "setZoom", "getCenter", "setCenter", "getBearing", "setBearing", "getPitch", "setPitch", "jumpTo", "flyTo", "panTo", "panBy", "panBy", "zoomTo", "zoomIn", "zoomOut", "getPadding", "setPadding", "rotateTo", "resetNorth", "resetNorthPitch", "snapToNorth", "cameraForBounds", "fitBounds", "fitScreenCoordinates", "getFreeCameraOptions", "setFreeCameraOptions", "easeTo", "stop"];
  missingFunctions.forEach(item => {
    this[item] = function () {
      if (typeof self.map[item] === "function") {
        for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
          props[_key] = arguments[_key];
        }

        return self.map[item].call(self.map, ...props);
      }

      return undefined;
    };
  }); // initialize the MapLibre-gl instance

  let initializeMapLibre = async () => {
    // if mapOptions style URL is given and if it is not a mapbox URL fetch the json and initialize the mapbox object
    if (typeof props.mapOptions.style === "string" && props.mapOptions.style.indexOf("mapbox://") === -1) {
      await fetch(props.mapOptions.style).then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("error loading map style.json");
        }
      }).then(styleJson => {
        styleJson.layers.forEach(item => {
          self.baseLayers.push(item.id);

          if (!self.firstSymbolLayer && item.type === "symbol") {
            self.firstSymbolLayer = item.id;
          }
        });
        self.styleJson = styleJson;
        props.mapOptions.style = styleJson;
      }).catch(error => {
        console.log(error);
      });
    }

    self.map = new maplibregl.Map(props.mapOptions);
    self.addNativeMaplibreFunctionsAndProps();
    self.wrapper.refreshViewport();
    self.wrapper.fire("viewportchange");
    self.map.on("load", () => {
      self.addNativeMaplibreFunctionsAndProps();
    });
    self.map.on("move", () => {
      self.wrapper.viewportState = self.wrapper.getViewport();
      self.wrapper.fire("viewportchange");
    });
    self.map.on("idle", () => {
      self.wrapper.refreshLayerState();
    });
    self.map.on("data", () => {
      self.wrapper.refreshLayerState();
    });

    if (typeof props.onReady === "function") {
      props.onReady(self.map, self);
    }
  };

  initializeMapLibre();
};

/**
 * Creates a MapLibreGlWrapper instance and registers it in MapContext
 * after the MapLibre-gl load event has fired.
 *
 * MapLibreMap returns the html node that will be used by MapLibre-gl to render the map.
 * This Component must be kept unaware of any related components that interact with the MapLibre-gl
 * instance.
 *
 * @component
 */

const MapLibreMap = props => {
  const map = useRef(null);
  const mapContainer = useRef(null);
  const mapContext = useContext(MapContext);
  const mapContextRef = useRef(mapContext);
  const mapIdRef = useRef(props.mapId);
  const mapOptions = props.options;
  useEffect(() => {
    let mapId = mapIdRef.current;
    let _mapContext = mapContextRef.current;
    return () => {
      var _map$current, _map$current$remove;

      _mapContext.removeMap(mapId);

      (_map$current = map.current) === null || _map$current === void 0 ? void 0 : (_map$current$remove = _map$current.remove) === null || _map$current$remove === void 0 ? void 0 : _map$current$remove.call(_map$current);
      map.current = null;
    };
  }, []);
  useEffect(() => {
    if (mapContainer.current) {
      map.current = new MapLibreGlWrapper({
        mapOptions: {
          container: mapContainer.current,
          ...mapOptions
        },
        onReady: (map, wrapper) => {
          map.once("load", () => {
            if (props.mapId) {
              mapContext.registerMap(props.mapId, wrapper);
            } else {
              mapContext.setMap(wrapper);
            }
          }); // TODO: remove this line

          window.map = wrapper;
        }
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [mapContainer]);
  return /*#__PURE__*/React__default.createElement("div", {
    ref: mapContainer,
    className: "mapContainer"
  });
};

MapLibreMap.defaultProps = {
  mapId: undefined,
  options: {
    lng: 8.607,
    lat: 53.1409349,
    zoom: 10,
    accessToken: "pk.eyJ1IjoibWF4dG9iaSIsImEiOiJjaW1rcWQ5bWMwMDJvd2hrbWZ2ZTBhcnM5In0.NcGt5NmLP5Q1WC7P5u6qUA"
  }
};
MapLibreMap.propTypes = {
  /**
   * Id of the MapLibreGl(Wrapper) instance in mapContext
   */
  mapId: PropTypes.string,

  /**
   * Config object that is passed to the MapLibreGl constructor as first parameter.
   * See https://maplibre.org/maplibre-gl-js-docs/api/map/ for a formal documentation of al
   * available properties.
   */
  options: PropTypes.object
};

/**
 * React hook that allows subscribing to map state changes
 *
 * @component
 */

function useMapState(props) {
  // Use a useRef hook to reference the layer object to be able to access it later inside useEffect hooks
  const mapContext = useContext(MapContext);
  const initializedRef = useRef(false);
  const mapRef = useRef(undefined);
  const [viewport, setViewport] = useState(undefined);
  const viewportRef = useRef(undefined);
  const [layers, setLayers] = useState(undefined);
  const layersRef = useRef(undefined); //const mapRef = useRef(props.map);

  const componentId = useRef(v4());
  /**
   * returns the element if it matches the defined filter criteria
   * to be used as filter function on the layers array
   *
   * @param {object} layer
   */

  const layerIdFilter = useCallback(layer => {
    var _props$filter, _props$filter2;

    if (!(props !== null && props !== void 0 && (_props$filter = props.filter) !== null && _props$filter !== void 0 && _props$filter.includeBaseLayers) && layer.baseLayer) {
      return false;
    }

    if (typeof ((_props$filter2 = props.filter) === null || _props$filter2 === void 0 ? void 0 : _props$filter2.matchLayerIds) !== "undefined") {
      if (props.filter.matchLayerIds instanceof RegExp) {
        return props.filter.matchLayerIds.test(layer.id);
      } else {
        return layer.id.includes(props.filter.matchLayerIds);
      }
    }

    return true;
  }, [props.filter]);
  const refreshLayerState = useCallback(() => {
    let _layerState = mapRef.current.wrapper.layerState.filter(layerIdFilter);

    let _layerStateString = JSON.stringify(_layerState);

    if (layersRef.current !== _layerStateString) {
      layersRef.current = _layerStateString;
      setLayers(_layerState);
    }
  }, [layerIdFilter]);
  useEffect(() => {
    let _componentId = componentId.current;
    return () => {
      // cleanup all event listeners
      if (mapRef.current) {
        mapRef.current.cleanup(_componentId);
        mapRef.current = undefined;
      }

      initializedRef.current = false;
    };
  }, []);
  useEffect(() => {
    var _props$watch, _props$watch2;

    if (!mapContext.mapExists(props.mapId) || initializedRef.current) return; // the MapLibre-gl instance (mapContext.getMap(props.mapId)) is accessible here
    // initialize the layer and add it to the MapLibre-gl instance or do something else with it

    initializedRef.current = true;
    mapRef.current = mapContext.getMap(props.mapId);

    if (props !== null && props !== void 0 && (_props$watch = props.watch) !== null && _props$watch !== void 0 && _props$watch.viewport) {
      setViewport(mapRef.current.wrapper.viewportState); // register viewportchange event handler

      mapRef.current.wrapper.on("viewportchange", () => {
        var _mapRef$current;

        if (viewportRef.current !== ((_mapRef$current = mapRef.current) === null || _mapRef$current === void 0 ? void 0 : _mapRef$current.wrapper.viewportStateString)) {
          var _mapRef$current2;

          setViewport((_mapRef$current2 = mapRef.current) === null || _mapRef$current2 === void 0 ? void 0 : _mapRef$current2.wrapper.viewportState);
        }
      }, componentId.current);
    } // register layerchange event handler


    if (props !== null && props !== void 0 && (_props$watch2 = props.watch) !== null && _props$watch2 !== void 0 && _props$watch2.layers) {
      var _props$filter3, _props$filter4;

      refreshLayerState();
      mapRef.current.wrapper.on("layerchange", refreshLayerState, {
        includeBaseLayers: props === null || props === void 0 ? void 0 : (_props$filter3 = props.filter) === null || _props$filter3 === void 0 ? void 0 : _props$filter3.includeBaseLayers,
        matchLayerIds: props === null || props === void 0 ? void 0 : (_props$filter4 = props.filter) === null || _props$filter4 === void 0 ? void 0 : _props$filter4.matchLayerIds
      }, componentId.current);
    }
  }, [mapContext.mapIds, mapContext, props.mapId, refreshLayerState, props]);
  return {
    layers,
    viewport
  };
}

useMapState.defaultProps = {
  mapId: undefined,
  watch: {
    layers: true,
    sources: false,
    viewport: false
  },
  filter: {
    includeBaseLayers: false
  }
};
useMapState.propTypes = {
  /**
   * Id of the target MapLibre instance in mapContext
   */
  mapId: PropTypes.string,

  /**
   * Defines map Resources to watch
   */
  watch: PropTypes.shape({
    layers: PropTypes.bool,
    sources: PropTypes.bool,
    viewport: PropTypes.bool
  }),

  /**
   * Filter string or RegExp to more explicitly define the elements watched and increase performance
   * strings will be matched using layerId.includes(matchString)
   * RegExps will be matched using matchRegExp.test(layerId)
   */
  filter: PropTypes.shape({
    includeBaseLayers: PropTypes.bool,
    matchLayerIds: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)]),
    matchSourceIds: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)])
  })
};

function useMap(props) {
  // Use a useRef hook to reference the layer object to be able to access it later inside useEffect hooks
  const mapContext = useContext(MapContext);
  const mapState = useMapState({
    mapId: props.mapId,
    watch: {
      viewport: false,
      layers: props.waitForLayer ? true : false,
      sources: false
    },
    filter: {
      includeBaseLayers: true
    }
  });
  const initializedRef = useRef(false);
  const mapRef = useRef(undefined);
  const componentId = useRef(v4());
  const [mapIsReady, setMapIsReady] = useState(false);
  useEffect(() => {
    let _componentId = componentId.current;
    return () => {
      if (mapRef.current) {
        mapRef.current.cleanup(_componentId);
        mapRef.current = undefined;
      }

      initializedRef.current = false;
      setMapIsReady(false);
    };
  }, []);
  useEffect(() => {
    if (!mapContext.mapExists(props.mapId) || initializedRef.current) return; // check if waitForLayer (string, layer id of the layer this hook is supposed to wait for)
    // exists as layer in the MapLibre instance

    if (props.waitForLayer) {
      var _mapState$layers;

      let layerFound = false;
      mapState === null || mapState === void 0 ? void 0 : (_mapState$layers = mapState.layers) === null || _mapState$layers === void 0 ? void 0 : _mapState$layers.forEach(layer => {
        if (layer.id === props.waitForLayer) {
          layerFound = true;
        }
      });

      if (!layerFound) {
        return;
      }
    } // the MapLibre-gl instance (mapContext.getMap(props.mapId)) is accessible here
    // initialize the layer and add it to the MapLibre-gl instance or do something else with it


    initializedRef.current = true;
    mapRef.current = mapContext.getMap(props.mapId);
    setMapIsReady(true);
  }, [mapContext.mapIds, mapState.layers, mapContext, props.waitForLayer, props.mapId]);
  return {
    map: mapRef.current,
    mapIsReady,
    componentId: componentId.current,
    layers: mapState.layers
  };
}

/**
 * TODO: Add short & useful description
 *
 * @param {object} props
 * @param {string} props.mapId Id of the target MapLibre instance in mapContext
 *
 * @component
 */

const MlComponentTemplate = props => {
  const mapHook = useMap({
    mapId: props.mapId,
    waitForLayer: props.insertBeforeLayer
  });
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!mapHook.mapIsReady || initializedRef.current) return; // the MapLibre-gl instance (mapHook.map) is accessible here
    // initialize the layer and add it to the MapLibre-gl instance or do something else with it

    initializedRef.current = true;
    mapHook.map.setCenter([7.132122000552613, 50.716405378037706]);
  }, [mapHook.map, mapHook.mapIsReady, props.mapId]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
};

MlComponentTemplate.defaultProps = {
  mapId: undefined
};
MlComponentTemplate.propTypes = {
  /**
   * Id of the target MapLibre instance in mapContext
   */
  mapId: PropTypes.string
};

/**
 * Adds a fill extrusion layer to the MapLibre instance reference by props.mapId
 *
 * @Component
 */

const MlFillExtrusionLayer = props => {
  const mapContext = useContext(MapContext);
  const mapRef = useRef(null);
  const [showLayer, setShowLayer] = useState(true);
  const componentId = useRef((props.idPrefix ? props.idPrefix : "MlFillExtrusionLayer-") + v4());
  const initializedRef = useRef(false);
  const layerId = useRef(props.layerId || "MlFillExtrusionLayer-" + v4());
  useEffect(() => {
    let _componentId = componentId.current;
    return () => {
      if (mapRef.current) {
        mapRef.current.cleanup(_componentId);
        mapRef.current = undefined;
      }

      initializedRef.current = false;
    };
  }, []);
  useEffect(() => {
    if (!mapContext.mapExists(props.mapId) || initializedRef.current) return; // the MapLibre-gl instance (mapContext.getMap(props.mapId)) is accessible here
    // initialize the layer and add it to the MapLibre-gl instance or do something else with it

    initializedRef.current = true;
    mapRef.current = mapContext.getMap(props.mapId);
    let lastLabelLayerId = undefined;

    if (mapContext.map.getLayer("waterway-name")) {
      lastLabelLayerId = "waterway-name";
    }

    if (mapContext.map.getLayer("poi_label")) {
      lastLabelLayerId = "poi_label";
    }

    mapContext.map.addLayer({
      id: layerId.current,
      type: "fill-extrusion",
      source: props.sourceId || "openmaptiles",
      "source-layer": props.sourceLayer || "building",
      minzoom: props.minZoom || 14,
      paint: { ...props.paint
      }
    }, props.insertBeforeLayer || lastLabelLayerId, componentId.current);
  }, [mapContext, props.insertBeforeLayer, props.mapId, props.minZoom, props.paint, props.sourceId, props.sourceLayer]);
  useEffect(() => {
    if (!initializedRef.current) return; // toggle layer visibility by changing the layout object's visibility property

    mapRef.current.setLayoutProperty(layerId.current, "visibility", showLayer ? "visible" : "none");
  }, [showLayer, mapContext]);
  return /*#__PURE__*/React__default.createElement(Button, {
    color: "primary",
    variant: showLayer ? "contained" : "outlined",
    onClick: () => setShowLayer(!showLayer)
  }, "Composite");
};

MlFillExtrusionLayer.defaultProps = {
  mapId: undefined,
  paint: {
    "fill-extrusion-color": "hsl(196, 61%, 83%)",
    "fill-extrusion-height": {
      property: "render_height",
      type: "identity"
    },
    "fill-extrusion-base": {
      property: "render_min_height",
      type: "identity"
    },
    "fill-extrusion-opacity": 1
  }
};
MlFillExtrusionLayer.propTypes = {
  /**
   * Id of the target MapLibre instance in mapContext
   */
  mapId: PropTypes.string,

  /**
   * Id of the layer that will be added by this component
   */
  layerId: PropTypes.string,

  /**
   * Prefix of the component id this component uses when adding elements to the MapLibreGl-instance
   */
  idPrefix: PropTypes.string,

  /**
   * Paint properties of the config object that is passed to the MapLibreGl.addLayer call. All
   * available properties are documented in the MapLibreGl documentation
   * https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#fill-extrusion
   */
  paint: PropTypes.object,

  /**
   * Source id of a vector tile source containing the geometries to use for this fill-extrusion
   * layer.
   * https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#source-layer
   */
  sourceId: PropTypes.string,

  /**
   * Layer id from a vector tile source containing the geometries to use for this fill-extrusion
   * layer.
   * https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#source-layer
   */
  sourceLayer: PropTypes.string,

  /**
   * This layer will be hidde for zoom levels lower than defined on this property
   * https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#minzoom
   */
  minZoom: PropTypes.number,

  /**
   * The layerId of an existing layer this layer should be rendered visually beneath
   * https://maplibre.org/maplibre-gl-js-docs/api/map/#map#addlayer - see "beforeId" property
   */
  insertBeforeLayer: PropTypes.string
};

const getDefaultPaintPropsByType = (type, defaultPaintOverrides) => {
  switch (type) {
    case "fill":
      if (defaultPaintOverrides !== null && defaultPaintOverrides !== void 0 && defaultPaintOverrides.fill) {
        return defaultPaintOverrides.fill;
      }

      return {
        "fill-color": "rgba(10,240,256,0.6)"
      };

    case "line":
      if (defaultPaintOverrides !== null && defaultPaintOverrides !== void 0 && defaultPaintOverrides.line) {
        return defaultPaintOverrides.line;
      }

      return {
        "line-color": "rgb(203,211,2)",
        "line-width": 5
      };

    case "circle":
    default:
      if (defaultPaintOverrides !== null && defaultPaintOverrides !== void 0 && defaultPaintOverrides.circle) {
        return defaultPaintOverrides.circle;
      }

      return {
        "circle-color": "rgba(10,240,256)",
        "circle-stroke-color": "#fff",
        "circle-stroke-width": 2
      };
  }
};

const mapGeometryTypesToLayerTypes = {
  Position: "circle",
  Point: "circle",
  MultiPoint: "circle",
  LineString: "line",
  MultiLineString: "line",
  Polygon: "fill",
  MultiPolygon: "fill",
  GeometryCollection: "circle"
};

const getDefaulLayerTypeByGeometry = geojson => {
  if ((geojson === null || geojson === void 0 ? void 0 : geojson.type) === "Feature") {
    var _geojson$geometry;

    return mapGeometryTypesToLayerTypes !== null && mapGeometryTypesToLayerTypes !== void 0 && mapGeometryTypesToLayerTypes[geojson === null || geojson === void 0 ? void 0 : (_geojson$geometry = geojson.geometry) === null || _geojson$geometry === void 0 ? void 0 : _geojson$geometry.type] ? mapGeometryTypesToLayerTypes[geojson.geometry.type] : "circle";
  }

  if ((geojson === null || geojson === void 0 ? void 0 : geojson.type) === "FeatureCollection") {
    if (geojson.features.length) {
      return getDefaulLayerTypeByGeometry(geojson.features[0]);
    }

    return "circle";
  }
};

const legalLayerTypes = ["circle", "fill", "line"];
/**
 * Adds source and layer of types "line", "fill" or "circle" to display GeoJSON data on the map.
 *
 * @component
 */

const MlGeoJsonLayer = props => {
  // Use a useRef hook to reference the layer object to be able to access it later inside useEffect hooks
  const mapHook = useMap({
    mapId: props.mapId,
    waitForLayer: props.insertBeforeLayer
  });
  const initializedRef = useRef(false);
  const layerId = useRef(props.layerId || "MlGeoJsonLayer-" + mapHook.componentId);
  const layerTypeRef = useRef(undefined);
  useEffect(() => {
    if (!mapHook.map || !initializedRef.current) return;

    for (var key in props.layout) {
      mapHook.map.setLayoutProperty(layerId.current, key, props.layout[key]);
    }
  }, [props.layout, mapHook.map, props.mapId]);
  useEffect(() => {
    if (!mapHook.map || !initializedRef.current) return;

    let _paint = props.paint || getDefaultPaintPropsByType(layerTypeRef.current, props.defaultPaintOverrides);

    for (var key in _paint) {
      mapHook.map.setPaintProperty(layerId.current, key, _paint[key]);
    }
  }, [props.paint, mapHook.map, props.mapId, props.defaultPaintOverrides]);
  useEffect(() => {
    var _mapHook$map;

    if (!(mapHook !== null && mapHook !== void 0 && (_mapHook$map = mapHook.map) !== null && _mapHook$map !== void 0 && _mapHook$map.getSource(layerId.current)) || !initializedRef.current) return;
    mapHook.map.getSource(layerId.current).setData(props.geojson);
  }, [props.geojson, mapHook.map, props.type]);
  const createLayer = useCallback(() => {
    let geojson = props.geojson;
    layerTypeRef.current = props.type || getDefaulLayerTypeByGeometry(props.geojson);
    mapHook.map.addLayer({
      id: layerId.current,
      source: {
        type: "geojson",
        data: geojson
      },
      type: layerTypeRef.current,
      paint: props.paint || getDefaultPaintPropsByType(layerTypeRef.current, props.defaultPaintOverrides),
      layout: props.layout || {},
      ...props.options
    }, props.insertBeforeLayer, mapHook.componentId);

    if (typeof props.onHover !== "undefined") {
      mapHook.map.on("mousemove", layerId.current, props.onHover, mapHook.componentId);
    }

    if (typeof props.onClick !== "undefined") {
      mapHook.map.on("click", layerId.current, props.onClick, mapHook.componentId);
    }

    if (typeof props.onLeave !== "undefined") {
      mapHook.map.on("mouseleave", layerId.current, props.onLeave, mapHook.componentId);
    }
  }, [mapHook, props]);
  useEffect(() => {
    if (!mapHook.map || !props.geojson) return;

    if (initializedRef.current && legalLayerTypes.indexOf(props.type) !== -1 && layerTypeRef.current && props.type !== layerTypeRef.current) {
      // remove (cleanup) & reinitialize the layer if type has changed
      mapHook.map.cleanup(mapHook.componentId);
    } else if (initializedRef.current && (legalLayerTypes.indexOf(props.type) === -1 || legalLayerTypes.indexOf(props.type) !== -1 && props.type === layerTypeRef.current)) {
      return;
    }

    initializedRef.current = true;
    createLayer();
  }, [mapHook, createLayer, props]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
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
   * Javascript object with optional properties "fill", "line", "circle" to override implicit layer type default paint properties.
   */
  defaultPaintOverrides: PropTypes.object,

  /**
   * Javascript object that is spread into the addLayer commands first parameter.
   */
  options: PropTypes.object,

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
  onLeave: PropTypes.func
};

/**
 * Adds a button that makes the map follow the users GPS position using
 * navigator.geolocation.watchPosition if activated
 *
 * @param {object} props
 * @param {string} props.mapId Id of the target MapLibre instance in mapContext
 *
 * @component
 */

const MlFollowGps = props => {
  const mapHook = useMap({
    mapId: props.mapId,
    waitForLayer: props.insertBeforeLayer
  });
  const [isFollowed, setIsFollowed] = useState(false);
  const [userLocationGeoJson, setUserLocationGeoJson] = useState(undefined);
  const [locationAccessDenied, setLocationAccessDenied] = useState(false);
  const [accuracyGeoJson, setAccuracyGeoJson] = useState();
  const [deviceOrientation, setDeviceOrientation] = useState(0);
  const getLocationSuccess = useCallback(pos => {
    if (!mapHook.map) return;
    mapHook.map.flyTo({
      center: [pos.coords.longitude, pos.coords.latitude],
      zoom: 18,
      speed: 1,
      curve: 1
    });
    if (!props.showUserLocation) return;
    const geoJsonPoint = point([pos.coords.longitude, pos.coords.latitude]);
    setUserLocationGeoJson(geoJsonPoint);
    setAccuracyGeoJson(circle(geoJsonPoint, pos.coords.accuracy / 1000));
  }, [mapHook.map, props]);

  const getLocationError = err => {
    console.log("Access of user location denied");
    setLocationAccessDenied(true);
  };

  const orientationCone = useMemo(() => {
    if (!userLocationGeoJson) {
      return undefined;
    }

    let radius = 0.02;
    let bearing1 = deviceOrientation - 15;
    let bearing2 = deviceOrientation + 15;
    const options = {
      steps: 65
    };
    let arc = lineArc(userLocationGeoJson, radius, bearing1, bearing2, options);
    let copy = arc;
    copy.geometry.coordinates.push(userLocationGeoJson.geometry.coordinates);
    copy.geometry.coordinates.slice(0, 0, userLocationGeoJson.geometry.coordinates);
    return copy;
  }, [deviceOrientation, userLocationGeoJson]);

  const handleOrientation = event => {
    setDeviceOrientation(-event.alpha);
  };

  useEffect(() => {
    if (isFollowed) {
      let _handleOrientation = handleOrientation;
      window.addEventListener('deviceorientation', _handleOrientation);
      return () => {
        window.removeEventListener('deviceorientation', _handleOrientation);
      };
    }
  }, [isFollowed]);
  useEffect(() => {
    if (!mapHook.map) return;

    if (isFollowed) {
      let _watchId = navigator.geolocation.watchPosition(getLocationSuccess, getLocationError);

      return () => {
        navigator.geolocation.clearWatch(_watchId);
      };
    }
  }, [mapHook.map, isFollowed, getLocationSuccess]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, isFollowed && userLocationGeoJson && /*#__PURE__*/React__default.createElement(MlGeoJsonLayer, {
    geojson: accuracyGeoJson,
    type: "fill",
    paint: {
      "fill-color": "#cbd300",
      "fill-opacity": 0.3,
      ...props.accuracyPaint
    },
    insertBeforeLayer: props.insertBeforeLayer
  }), isFollowed && orientationCone && /*#__PURE__*/React__default.createElement(MlGeoJsonLayer, {
    geojson: orientationCone,
    type: "fill",
    paint: {
      "fill-color": "#0000ff",
      "fill-antialias": false,
      "fill-opacity": 0.3
    },
    insertBeforeLayer: props.insertBeforeLayer
  }), isFollowed && userLocationGeoJson && /*#__PURE__*/React__default.createElement(MlGeoJsonLayer, {
    geojson: userLocationGeoJson,
    type: "circle",
    paint: {
      "circle-color": "#009ee0",
      "circle-radius": 5,
      "circle-stroke-color": "#fafaff",
      "circle-stroke-width": 1,
      ...props.circlePaint
    },
    insertBeforeLayer: props.insertBeforeLayer
  }), /*#__PURE__*/React__default.createElement(Button, {
    sx: {
      zIndex: 1002,
      color: isFollowed ? props.onColor : props.offColor,
      ...props.style
    },
    disabled: locationAccessDenied,
    onClick: () => {
      setIsFollowed(!isFollowed);
    }
  }, " ", /*#__PURE__*/React__default.createElement(GpsFixedIcon, {
    sx: {
      fontSize: props.style.fontSize
    }
  }), " "));
};

MlFollowGps.defaultProps = {
  mapId: undefined,
  style: {
    minWidth: "30px",
    minHeight: "30px",
    width: "30px",
    height: "30px",
    backgroundColor: "#414141",
    borderRadius: "23%",
    margin: 0.15,
    fontSize: "1.3em",
    ":hover": {
      backgroundColor: "#515151",
      color: "#ececec"
    }
  },
  onColor: "#ececec",
  offColor: "#666",
  showAccuracyCircle: true,
  showUserLocation: true,
  showOrientation: true
};
MlFollowGps.propTypes = {
  /**
   * Id of the target MapLibre instance in mapContext
   */
  mapId: PropTypes.string,

  /**
   * CSS style object that is applied to the button component
   */
  style: PropTypes.object,

  /**
   * Active button font color
   */
  onColor: PropTypes.string,

  /**
   * Inactive button font color
   */
  offColor: PropTypes.string,

  /**
   * Accuracy paint property object, that is passed to the MlGeoJsonLayer responsible for drawing the accuracy circle.
   * Use any available paint prop from layer type "fill".
   * https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#fill
   */
  accuracyPaint: PropTypes.object,

  /**
   * position circle paint property object, that is passed to the MlGeoJsonLayer responsible for drawing the accuracy circle.
   * Use any available paint prop from layer type "fill".
   * https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#fill
   */
  circlePaint: PropTypes.object,

  /**
   * By default, if showUserLocation is true, a transparent circle will be drawn around the user location 
   * indicating the accuracy (95% confidence level) of the user's location. Set to false to disable. 
   */
  showAccuracyCircle: PropTypes.bool,

  /**
   * By default a dot will be shown on the map at the user's location. Set to false to disable.
   */
  showUserLocation: PropTypes.bool,

  /**
   * By default a cone will be shown on the map at the user's location to indicate the device's orientation.
   * Set to false to disable.
   */
  showOrientation: PropTypes.bool
};

const nmMap = {
  street: ["footway", "street", "road", "street_name", "residential", "path", "pedestrian", "road_reference", "road_reference_intl", "square", "place"],
  number: ["house_number", "street_number"],
  place: ["city", "village", "hamlet", "locality", "croft", "neighbourhood", "suburb", "city_district", "district", "quarter", "borough", "city_block", "residential", "commercial", "industrial", "houses", "subdivision", "allotments", "postal_city", "town", "municipality", "local_administrative_area"],
  zip: ["postcode", "partial_postcode"],
  state: ["state", "province", "state_code"]
};

const nmConverter = nmAddress => {
  const addressArr = [];

  for (let key in nmMap) {
    nmMap[key].some(element => {
      if (nmAddress.hasOwnProperty(element)) {
        addressArr.push(nmAddress[element]);
        return true;
      }

      return false;
    });
  }

  return addressArr.join(", ");
};

const toPixels = length => {
  let conversionFactor = 96;
  conversionFactor /= 25.4;
  return conversionFactor * length + "px";
};

const createPdf = (map, locationValue, setLoading) => {
  setLoading(true);
  const width = 210;
  const height = 297; // Calculate pixel ratio

  const actualPixelRatio = window.devicePixelRatio; // Create map container

  const hidden = document.createElement("div");
  hidden.className = "hidden-map";
  document.body.appendChild(hidden);
  const container = document.createElement("div");
  container.style.width = toPixels(width);
  container.style.height = toPixels(height);
  hidden.appendChild(container); //Render map

  var renderMap = new maplibregl$1.Map({
    container: container,
    center: map.getCenter(),
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
    interactive: false,
    preserveDrawingBuffer: true,
    fadeDuration: 0,
    attributionControl: false
  });
  let style = map.getStyle();

  for (let name in style.sources) {
    let src = style.sources[name];
    Object.keys(src).forEach(key => {
      //delete properties if value is undefined.
      // for instance, raster-dem might has undefined value in "url" and "bounds"
      if (!src[key]) {
        delete src[key];
      }
    });
  }

  renderMap.setStyle(style);
  renderMap.once("idle", function () {
    var _hidden$parentNode;

    // TO DO: It is still under development
    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      compress: true
    });
    Object.defineProperty(window, "devicePixelRatio", {
      get: function () {
        return 300 / 96;
      }
    });
    const offsetX = 2.5;
    const offsetY = 2.5;
    const marginTop = 3;
    const marginBottom = 3;
    const innerMargin = 2;
    const logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACxCAMAAABnTAbVAAAC8VBMVEUAAAD/AACAAACqAFW/AECZMzOqK1W2JEm/IECqHDmzGk25F0aqFUCxJzu2JEmqIkSvIEC0HjyqHEeuG0OzGkC2GD2uI0axIUO1IECtHz2xHUWzHEKtG0CwGj6zIkS1IUKyHz60HkSvHUKxHECzHD6uG0OxIUGzIECuHz6wHkOyHkG0HUCwHD6xHEOzIUGvIECxHz6zH0KvHkGxHUCyHT+vHEKwHEGyIECzHz+wH0KxHkGzHkCwHT+xHUKyHEGvIECxHz+yH0KzHkGwHkCxHj+zHUKwHUGxHECyHz+wH0GxH0GyHkCwHj+xHUGyHUGzHUCwHz+xH0GyH0GwHkCxHj+yHkGwHUCxHUCyHT+wH0GxH0CxHkCyHj+wHkGxHkCyHUCwHT+xH0GyH0CwH0CxHj+yHkGwHkCxHUCxHT+yHUGwH0CxH0CyHj+wHkGxHkCyHkCwHT+xHUGxH0CyH0CxHz+xHkGyHkCwHkCxHj+yHUGwHUCxH0CwHkGxHkCxHkCyHj+xHUGxHUCyH0CwHz+xHkGyHkCwHkCxHj+xHkGwHUCxHUCxHz+yH0GxHkCyHj+wHkGxHUCxHUCwHz+xH0GxHkCyHkCxHj+xHkGyHkCxHUCxHT+yH0GwHkCxHkCxHj+wHkGxHkCxHkCyHT+xH0GxH0CyHkCxHj+xHkGxHkCwHkCxHT+xHUCwH0CxHkCxHj+yHkCxHkCxHkCyHj+xHUCxH0CxHkCwHj+xHkCxHkCwHkCxHj+xHkCyHUCxH0CxHj+xHkCxHkCxHkCxHj+wHkCxHUCxH0CyHj+xHkCxHkCyHkCxHj+xHkCxHUCxHz+xHkCwHkCxHkCxHj+yHkCxHkCxHkCxHkCxHkCxHkCxHj+xHkCwHkCxHT+xHkCxHkCxHkCxHj+xHkCxHkCxHkCxHj+xH0CxHkCxHkCyHj+xHkCxHkCxHkCxHj+xHkCxHkCxHkCxHj+xHkCxHkCxHkCxHj+xHkCxHkCxHkCxHj+xHkCxHkD///9g21WfAAAA+XRSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fn+AgYKDhIWGh4iJiouMjY6PkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc/Q0dLT1NXW19ja29zd3uDh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7v1AMKAAAAAWJLR0T61W0GSgAACWZJREFUGBnVwXlAVHUCB/DvmxkuD0QswFo3TcwzS0p01RVMpUytLKxMSVNpLUsLj7VDo7btsNTssrTMdAtWNjNbkyzF3EotwrXMI7XwAAxE5Jz5/rcaMMx782Z452/p84GV2na+ZmRqasrwxE4OtFRhI/+29SS9qn/86PGUKLQ4CW+X0p/n+xeTnGhB4v/NgIpXj3aihZhRyaCOPNYRwrW+KwkKmWxWTVYfiBRy49qzxW0hN5FaeLLiIUrv5UUkl0Au9iy1qXk1BgJIIzZ7eMG1kHuBmpVMkWCz0LQC1itzQkb6hTpsiYOdQmcfZ6M8yPWmLoWDYBsp9SCbZENuDPWpmgKbJO+mr9WQm0y95sEO8Zso9z7k7qJuj8JyzofPUeFjyA2nfvfDYl23089eyPWkfrXDYCXXI1X0Vy5BxllC/U50hHU676aqbpDLogEfoEFUR5g0qoTqJkJuAo0YjQZPpcIMab6bAayBXMgxGrDfiXrhBVnRMOyiTxhQkQtyGTTidjS4quZIEgzqfYRBjIFc2Pc0YCcaLWbdXyUY8acSBrMBCgPqqJ+nExpEniL/FQn9hpczKHdPKCyiAfeh0SMkf+wDvSbWsBlroCCtpX6volFkOcmzqdBntofN8QyGQkQudcuF12qe554DPWZRg70hUAjNoV6fwyuFv1nuhGYT3dRiDpRCVlCnHHiFlfM3m9tCo5trqUlFX/hJO0ddFqJJLut9HQ1NrquiRoc7wM/V31GPa9DkGTbIvwga9C+nZrlO+Al9opqabYWPqWy0NwbNuvQEdXgJKuI/oEaVfeFjFL32xaEZYV+yQeWBbVlZq15f9sp7W/YcrmYAS6AmOY9aeCbA13Vssv8SBPcazzuaPS/5Yvhy9bhtYfZxqlgiQU3SFg+bUzUJMtfTR0EUgpnK2s/n9oQ6qe+cT85R6SUnVPVYXsag9iVCLo2+dkQgsKv3zI9FUBGpuR7KbY6CulZ3bqplICfmhUHhWcpsdCGgi6FB16dOUeaHeATSbtyKI/Tn2TEtAn7yKLdSgkmt55ygr9M3I4ies9fkV7PJwXVTO0HFxbVUWAjTWj10kr7eikRQIb3vSJ8//5l5aSN7RyGAJ6nkuQXmRS1108eRZJgUeZp+yvvAAoP20od7VRxMeZEqDkXDAiFPuumjLCMExo3yUM2nLljhhhL6+iHVAYO6nqK6TFii05eU2ZfmhBHdf2YA7mRYIiybcnvTwqDbgJMM6Gh7WML5JhVOPvNH6CLNqmYQ62ENaSmVatbfFArNEvIoV7Phvmti2rXukrJgazXPmw6LLKa/4uUDHdAi/h8eylQtjoNX1H355JlOsIb0PtUUrhgTgeAcoza5KfddD8hIN37LjbBI+BdUV/HJI4NCEIBr2LKjVNrcFkquhypvh0UuOsCAzm5bktYnBHLRQx/d9Cv9veeCir550bBI3yoGVXv40xWZGdNT09LTH12yZmcR1X0VDlVtR8Aqc2mBXzrCdo7PaN44CHBZKc36CELMpUk1XSBE6EGa8xYEmUBT3L0giLSLZnwIYW6iGbdCGMdhGlcaAXHm07g3IVCHczRsHER6l0bVRkGk22jUTgjVpooGPQuxttCg8RDrARp0OcTqRWPKJYjlqqQh+RBtDw1ZD9FW0pDnIdqDNCQDoo2iIVMgWiINGQvRLqchwyBaFA35M0STamjEIAh3mkYMhnClNOJ6CHeGRqRCuCoakQ7RImhIJkSLoyFvQbSraMhWiDaWhhyFaDNpiKcdBFtOYwZCsG00ZjrEkoppzGsQqzsNyodY99CgukgI9TaNSoZIUiGNWgSREmjYfyDSszSsrj3EcRyjceMgTgpNWAlx1tGEYhdEiaygGddBlIdoyisQJKKQphx3QYxZNGk0hAj7mSblQIiZNKs2DgJEn6RpcyDACpr3kwu2S3TTAnfAbq58WmEP7PYYgzq1fdXf56anT5/ycOayNZ8WMaChsNeQWgZy4NXJie0hFzciY2MF1WyDrWJ/oaritfdchgAiRr18jP5ugI0cW6jCnZsWgaAcwzd6qPCdA/Z5mv4Ozr8EGvR4pZpyE2CbSR4qHU53QaP4LA99FbaDTW6po8L+iU7oMHg3fS2DPYZVUe50uhP6uBbWsom7P+xw7RnKrYuFfgMPsUl+KKw39FfKHEqBIW3Xs8lSWC61ijKrW8Egx1I2uQ0We8BNX1WzYMIsNxuVd4eVnIspc6gfTJnkZqP/RsM6l26nTG4UTHqAXl+1gVWGn6DMhnCYlkmvz8JhidDFHsqsdMICb9BrUxtY4M97KbdMghXCvqFXwWUwq+NaKjwHi3Qto1dhf5gSOruMCu9IsMqdbFI11wnDwmcepdLmEFhnHX18PQDGtM44Tj+72sBCl5yhD88/+0G/K18sor/CWFhqDuV2psfCq/UMNCdm9rdUU5cMa4V8TwVP/uszRicmJAyZ9m5ZJfCXpBAE4Lx2wWc1VLcQVhvHIN4DxrM0J2NwBBRikmdmlzCgrQ5YzbGfgaUA0k6eV1OQ8/y9qSMHJQy96e4HH389r5hBFcXBelMZ0DEngEQPdZsCG4T9zECewgUrqdcOCXZYyACqL8UFHYqoT21f2OJyD9WtQr1p1Oc52GQ3VXl6oZ6URz1OtYFNHqaqj9AovoI6LIBd/kBVQ+E1m9qVRMI2P1LFDjRx5FGzx2GfN+nPMxA+OpVQo7L2sM9k+suGzHhq9AJs1Jl+arpBbhW1uRJ2KqXSMii0LqAWu2Crb6hQGgOlrr9Sgxmw1ftUSIe/MR42q7I9bPU05bZLUPEEm5UDe02jTGU3qJHWsjn3wl7jKbMA6iK+YjO6wF430te3IQgg9hCDOgCbJdNH+RUIqMtxBvMybDaAPiYhiH5lDOJW2Kwfm7yBoJIqGFhX2CyJXgURCG74OQZS4YDNxrJR6RVozohKBrAHdpvEBjUj0LyUCqpbDbvdzwaTocWQUqqaB7stYr1MaJNQRDV3wG7v8DdrJGjU7SBVXA+7fcELPgyFZh2+oL/+sJmjjOd9HAYdWuXQzxWwWS+e92EodJEWeagQA5tNJ7khFHrdUk65cNgsh8wOhX4991GmFewVVs7nHTAiYil9tYO9Uuruh1F3n2GTONjr6dEwrnMevfrBXrEwwzGvig3GomXrvoP1HkQLJ6WV8II30OJ1XO0huQu/AwN3k5Vh+B1wpP3EIfhdCE2fhv+X/wF/AO+L9vuzfwAAAABJRU5ErkJggg==";
    const textBuffer = 1;
    const lineHeight = 3.25;
    const text = locationValue ? nmConverter(locationValue.address) : "";
    const textChunksSeperator = text.split(",");
    const textChunks = [];

    if (textChunks.length) {
      textChunksSeperator.forEach(chunk => {
        const limitChunks = chunk.match(/.{1,34}/g);
        textChunks.push(...limitChunks);
      });
    } //Render map image


    pdf.addImage(renderMap.getCanvas().toDataURL("image/png"), "png", 0, 0, 210, 297, null, "FAST"); //Render lower left Copyright box

    pdf.setFillColor("white");
    pdf.rect(138, 287, 297, 10, "F");
    pdf.setFontSize(10); // optional

    pdf.text("Datenquelle: © OpenStreetMap-Mitwirkende", 140, pdf.internal.pageSize.height - 3); //Render infobox

    pdf.setFillColor("white");
    const infoBoxSize = textChunks.length * lineHeight + marginTop + marginBottom + lineHeight * 2 + innerMargin * 2 + textBuffer;
    pdf.rect(offsetX, 2, 66.5, infoBoxSize, "F");
    pdf.setFontSize(10);
    pdf.text("Karten PDF:", 6, offsetY + marginTop); //Render inner infobox

    pdf.rect(6, 7, 60, textChunks.length * lineHeight + innerMargin * 2 + textBuffer);
    pdf.setFontSize(10); //Write out address

    textChunks.forEach((text, i) => {
      pdf.text(text.trim(), 8, 10 + i * 3.5 + innerMargin);
    }); //Add WG Logo

    pdf.addImage(logo, "png", 5, offsetY + marginTop + lineHeight * 2 + textChunks.length * 3 + innerMargin * 2, 3, 3, null, "FAST"); //Add WG Url

    pdf.setFontSize(10);
    pdf.text("wheregroup.com", 40, offsetY + marginTop + lineHeight * 2 + textChunks.length * lineHeight + innerMargin * 2 + textBuffer); //Set pdfs props

    pdf.setProperties({
      title: "Map export",
      subject: "Map export",
      creator: "WhereGroup GmbH",
      author: "(c)WhereGroup GmbH, (c)OpenStreetMap"
    });
    pdf.save("Map.pdf");
    renderMap.remove();
    (_hidden$parentNode = hidden.parentNode) === null || _hidden$parentNode === void 0 ? void 0 : _hidden$parentNode.removeChild(hidden);
    Object.defineProperty(window, "devicePixelRatio", {
      get: function () {
        return actualPixelRatio;
      }
    });
    setLoading(false);
  });
};

/**
 * Renders a button that will create a PDF version of the current map view (dimensions adjusted to fit Din A4 Paper).
 *
 * @component
 */

const MlCreatePdfButton = props => {
  const mapContext = useContext(MapContext);
  const initializedRef = useRef(false);
  const mapRef = useRef(undefined);
  useEffect(() => {
    if (!mapContext.mapExists(props.mapId) || initializedRef.current) return;
    initializedRef.current = true;
    mapRef.current = mapContext.getMap(props.mapId);
  }, [mapContext.mapIds, mapContext, props.mapId]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Button, {
    color: "primary",
    variant: "contained",
    onClick: () => {
      createPdf(mapRef.current, null, () => {});
    }
  }, /*#__PURE__*/React__default.createElement(PrinterIcon, null)));
};

MlCreatePdfButton.defaultProps = {
  mapId: undefined
};
MlCreatePdfButton.propTypes = {
  /**
   * Id of the target MapLibre instance in mapContext
   */
  mapId: PropTypes.string
};

const MlImageMarkerLayer = props => {
  const mapHook = useMap({
    mapId: props.mapId,
    waitForLayer: props.insertBeforeLayer
  });
  const layerInitializedRef = useRef(false);
  const imageIdRef = useRef(props.imageId || "img_" + new Date().getTime());
  const layerId = useRef(props.layerId || "MlImageMarkerLayer-" + mapHook.componentId);
  useEffect(() => {
    if (!mapHook.mapIsReady || mapHook.map && !mapHook.map.getLayer(layerId.current) || !props.options) return; // the MapLibre-gl instance (mapContext.map) is accessible here
    // initialize the layer and add it to the MapLibre-gl instance or do something else with it

    var key;

    if (props.options.layout) {
      for (key in props.options.layout) {
        mapHook.map.setLayoutProperty(layerId.current, key, props.options.layout[key]);
      }
    }

    if (props.options.paint) {
      for (key in props.options.paint) {
        mapHook.map.setPaintProperty(layerId.current, key, props.options.paint[key]);
      }
    }
  }, [props.options, layerId.current, props.mapId]);
  const addLayer = useCallback(() => {
    let tmpOptions = {
      id: layerId.current,
      layout: {},
      ...props.options
    };
    tmpOptions.layout["icon-image"] = imageIdRef.current;
    mapHook.map.addLayer(tmpOptions, props.insertBeforeLayer, mapHook.componentId);
  }, [props, mapHook.mapIsReady, mapHook.map]);
  useEffect(() => {
    if (!props.options || !mapHook.mapIsReady || layerInitializedRef.current) return;
    layerInitializedRef.current = true;

    if (props.imgSrc) {
      mapHook.map.loadImage(props.imgSrc, function (error, image) {
        if (error) throw error;
        mapHook.map.addImage(imageIdRef.current, image, mapHook.componentId);
      });
    }

    addLayer();
  }, [mapHook.mapIsReady, mapHook.map, addLayer, props]);
  useEffect(() => {
    if (!mapHook.mapIsReady || mapHook.map && !mapHook.map.getLayer(layerId.current) || !props.options) {
      return;
    }

    mapHook.map.getSource(layerId.current).setData(props.options.source.data);
  }, [props.options.source.data, props]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
};

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function SvgRotateRight(props) {
  return /*#__PURE__*/createElement("svg", _extends({
    width: "39.675098mm",
    height: "104.27064mm",
    viewBox: "0 0 39.675098 104.27064"
  }, props), /*#__PURE__*/createElement("g", {
    transform: "translate(-86.019554,-58.032633)"
  }, /*#__PURE__*/createElement("path", {
    style: {
      strokeWidth: 0.744756
    },
    d: "m 442.74023,219.33594 -117.62695,32.32422 54.71094,31.12304 c -21.99397,41.5931 -32.8507,84.88283 -38.33008,127.89649 -6.86182,50.94051 -5.95715,103.99765 20.23828,155.46484 5.97246,11.72776 13.65817,23.59773 24.38867,35.06641 2.6597,2.84073 5.65602,5.75455 9.12891,8.68164 0.87557,0.7378 1.85363,1.52609 2.95117,2.35547 0.29669,0.22563 0.63616,0.47742 1.02149,0.75586 l 0.58203,0.42578 34.57812,-15.12305 -0.33789,-0.2207 c -0.0265,-0.0151 -0.0842,-0.0587 -0.18359,-0.13086 -0.46723,-0.34885 -0.9819,-0.76796 -1.56055,-1.25 -2.29757,-1.91343 -4.46539,-4.04643 -6.64062,-6.33985 -8.80052,-9.27114 -15.30333,-19.4993 -20.83985,-30.13867 -24.42289,-46.90715 -24.77465,-97.03535 -18.58008,-146.68164 4.94388,-37.37493 13.65299,-74.4847 30.20508,-109.92969 l 58.6211,33.34766 z",
    transform: "scale(0.26458333)"
  })));
}

var _g;

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }

function SvgRotateLeft(props) {
  return /*#__PURE__*/createElement("svg", _extends$1({
    width: "39.675098mm",
    height: "104.27064mm",
    viewBox: "0 0 39.675098 104.27064"
  }, props), _g || (_g = /*#__PURE__*/createElement("g", {
    transform: "translate(-86.019554,-58.032633)"
  }, /*#__PURE__*/createElement("path", {
    d: "m 94.572523,58.032633 31.122127,8.55245 -14.4756,8.234638 c 5.81924,11.004841 8.69175,22.458582 10.1415,33.839279 1.81552,13.47801 1.57616,27.51604 -5.35471,41.13341 -1.58021,3.10296 -3.61373,6.24356 -6.45284,9.27798 -0.70371,0.75161 -1.49649,1.52256 -2.41535,2.29702 -0.23167,0.19521 -0.49044,0.40378 -0.78083,0.62322 -0.0785,0.0597 -0.16832,0.12632 -0.27027,0.19999 l -0.154,0.11265 -9.148793,-4.00131 0.0894,-0.0584 c 0.007,-0.004 0.02228,-0.0155 0.04857,-0.0346 0.123621,-0.0923 0.259794,-0.20319 0.412895,-0.33073 0.607899,-0.50626 1.181468,-1.07062 1.756997,-1.67742 2.328481,-2.45299 4.049011,-5.15919 5.513881,-7.97419 6.46189,-12.41085 6.55496,-25.67394 4.91598,-38.80952 -1.30807,-9.888781 -3.61235,-19.707408 -7.99176,-29.085561 l -15.510171,8.823235 z"
  }))));
}

var _g$1;

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }

function SvgNeedle(props) {
  return /*#__PURE__*/createElement("svg", _extends$2({
    width: "75.967445mm",
    height: "234.71339mm",
    viewBox: "0 0 75.967445 234.71339"
  }, props), _g$1 || (_g$1 = /*#__PURE__*/createElement("g", {
    transform: "translate(-76.705281,-29.77268)"
  }, /*#__PURE__*/createElement("path", {
    d: "m 114.68901,29.77268 37.98372,117.3567 H 76.705281 Z"
  }), /*#__PURE__*/createElement("path", {
    d: "m 114.68901,264.48608 37.98372,-117.3567 H 76.705281 Z"
  }))));
}

function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }

const NeedleButton = _styled("div", process.env.NODE_ENV === "production" ? {
  target: "e12lzm5x2"
} : {
  target: "e12lzm5x2",
  label: "NeedleButton"
})(process.env.NODE_ENV === "production" ? {
  name: "1204o9",
  styles: "width:40%;display:flex;align-items:center;&:hover{cursor:pointer;}path{filter:drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.2));}&:hover path{filter:drop-shadow(0px 0px 13px rgba(255, 255, 255, 0.1));}path:nth-of-type(2){fill:#343434;}&:hover path:nth-of-type(2){fill:#434343;}path:nth-of-type(1){fill:#e90318;}&:hover path:nth-of-type(1){fill:#fb4052;}"
} : {
  name: "1204o9",
  styles: "width:40%;display:flex;align-items:center;&:hover{cursor:pointer;}path{filter:drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.2));}&:hover path{filter:drop-shadow(0px 0px 13px rgba(255, 255, 255, 0.1));}path:nth-of-type(2){fill:#343434;}&:hover path:nth-of-type(2){fill:#434343;}path:nth-of-type(1){fill:#e90318;}&:hover path:nth-of-type(1){fill:#fb4052;}",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1sTmF2aWdhdGlvbkNvbXBhc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVytCIiwiZmlsZSI6Ik1sTmF2aWdhdGlvbkNvbXBhc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tIFwicHJvcC10eXBlc1wiO1xuXG5pbXBvcnQgeyBSZWFjdENvbXBvbmVudCBhcyBSb3RhdGVSaWdodEljb24gfSBmcm9tIFwiLi9hc3NldHMvcm90YXRlX3JpZ2h0LnN2Z1wiO1xuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgUm90YXRlTGVmdEljb24gfSBmcm9tIFwiLi9hc3NldHMvcm90YXRlX2xlZnQuc3ZnXCI7XG5pbXBvcnQgeyBSZWFjdENvbXBvbmVudCBhcyBOZWVkbGVJY29uIH0gZnJvbSBcIi4vYXNzZXRzL25lZWRsZS5zdmdcIjtcblxuaW1wb3J0IHN0eWxlZCBmcm9tIFwiQGVtb3Rpb24vc3R5bGVkXCI7XG5pbXBvcnQgeyBjc3MgfSBmcm9tIFwiQGVtb3Rpb24vY3NzXCI7XG5pbXBvcnQgdXNlTWFwIGZyb20gXCIuLi8uLi9ob29rcy91c2VNYXBcIjtcblxuY29uc3QgTmVlZGxlQnV0dG9uID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDQwJTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAmOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbiAgcGF0aCB7XG4gICAgZmlsdGVyOiBkcm9wLXNoYWRvdygwcHggMHB4IDE1cHggcmdiYSgwLCAwLCAwLCAwLjIpKTtcbiAgfVxuICAmOmhvdmVyIHBhdGgge1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCAxM3B4IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKSk7XG4gIH1cbiAgcGF0aDpudGgtb2YtdHlwZSgyKSB7XG4gICAgZmlsbDogIzM0MzQzNDtcbiAgfVxuICAmOmhvdmVyIHBhdGg6bnRoLW9mLXR5cGUoMikge1xuICAgIGZpbGw6ICM0MzQzNDM7XG4gIH1cbiAgcGF0aDpudGgtb2YtdHlwZSgxKSB7XG4gICAgZmlsbDogI2U5MDMxODtcbiAgfVxuICAmOmhvdmVyIHBhdGg6bnRoLW9mLXR5cGUoMSkge1xuICAgIGZpbGw6ICNmYjQwNTI7XG4gIH1cbmA7XG5jb25zdCBOZWVkbGVDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgZGlzcGxheTogZmxleDtcbiAgei1pbmRleDogMTAwMjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gIG1hcmdpbi1sZWZ0OiAtMzAlO1xuICBwYXRoOm50aC1vZi10eXBlKDIpIHtcbiAgfVxuICBzdmcgZyB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTc2LjcwNTMsIC0yOS43NzI3KSBzY2FsZSgyLCAxKTtcbiAgfVxuICBzdmcge1xuICAgIHotaW5kZXg6IDk5OTA7XG4gICAgaGVpZ2h0OiAxNTBweDtcbiAgICB3aWR0aDogMjAwcHg7XG4gIH1cbmA7XG5jb25zdCBSb3RhdGVCdXR0b24gPSBzdHlsZWQuZGl2YFxuICB3aWR0aDogMzAlO1xuICBtYXJnaW4tdG9wOiAxNHB4O1xuICB6LWluZGV4OiA5OTk7XG4gIGRpc3BsYXk6IGZsZXg7XG5cbiAgc3ZnOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbiAgc3ZnOmhvdmVyIHBhdGgge1xuICAgIGZpbGw6ICNlY2VjZWM7XG4gICAgZmlsdGVyOiBkcm9wLXNoYWRvdygwcHggMHB4IDVweCByZ2JhKDAsIDAsIDAsIDAuMSkpO1xuICB9XG4gIHBhdGgge1xuICAgIGZpbGw6ICNiYmI7XG4gIH1cbiAgc3ZnIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNik7XG4gICAgei1pbmRleDogOTk5MDtcbiAgICBoZWlnaHQ6IDE3MnB4O1xuICB9XG5gO1xuXG4vKipcbiAqIE5hdmlnYXRpb24gY29tcG9uZW50IHRoYXQgZGlzcGxheXMgYSBjb21wYXNzIGNvbXBvbmVudCB3aGljaCBpbmRpY2F0ZXMgdGhlIGN1cnJlbnQgb3JpYW50YXRpb24gb2YgdGhlIG1hcCBpdCBpcyByZWdpc3RlcmVkIGZvciBhbmQgb2ZmZXJzIGNvbnRyb2xzIHRvIHR1cm4gdGhlIGJlYXJpbmcgOTDCsCBsZWZ0L3JpZ2h0IG9yIHJlc2V0IG5vcnRoIHRvIHBvaW50IHVwLlxuICpcbiAqIEFsbCBzdHlsZSBwcm9wcyBhcmUgYXBwbGllZCB1c2luZyBAZW1vdGlvbi9jc3MgdG8gYWxsb3cgbW9yZSBjb21wbGV4IGNzcyBzZWxlY3RvcnMuXG4gKlxuICogQGNvbXBvbmVudFxuICovXG5jb25zdCBNbE5hdmlnYXRpb25Db21wYXNzID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IG1hcEhvb2sgPSB1c2VNYXAoeyBtYXBJZDogcHJvcHMubWFwSWQsIHdhaXRGb3JMYXllcjogcHJvcHMuaW5zZXJ0QmVmb3JlTGF5ZXIgfSk7XG4gIGNvbnN0IFtiZWFyaW5nLCBzZXRCZWFyaW5nXSA9IHVzZVN0YXRlKDApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFtYXBIb29rLm1hcCkgcmV0dXJuO1xuXG4gICAgbGV0IF91cGRhdGVCZWFyaW5nID0gKCkgPT4ge1xuICAgICAgc2V0QmVhcmluZyhNYXRoLnJvdW5kKG1hcEhvb2subWFwLmdldEJlYXJpbmcoKSkpO1xuICAgIH07XG5cbiAgICBtYXBIb29rLm1hcC5vbihcInJvdGF0ZVwiLCBfdXBkYXRlQmVhcmluZywgbWFwSG9vay5jb21wb25lbnRJZCk7XG4gICAgX3VwZGF0ZUJlYXJpbmcoKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBtYXBIb29rLm1hcC5vZmYoXCJyb3RhdGVcIiwgX3VwZGF0ZUJlYXJpbmcpO1xuICAgIH07XG4gIH0sIFttYXBIb29rLm1hcCwgcHJvcHMubWFwSWRdKTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT17Y3NzKHtcbiAgICAgICAgICB6SW5kZXg6IDEwMDAsXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgLi4ucHJvcHMuc3R5bGUsXG4gICAgICAgIH0pfVxuICAgICAgPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPXtjc3Moe1xuICAgICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgICAgICAgIGJvcmRlcjogXCIxMHB4IHNvbGlkICNiY2JjYmNcIixcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjNzE3MTcxXCIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInJhZGlhbC1ncmFkaWVudCgjNzE3MTcxLCAjNDE0MTQxKVwiLFxuICAgICAgICAgICAgaGVpZ2h0OiBcIjIwMHB4XCIsXG4gICAgICAgICAgICB3aWR0aDogXCIyMDBweFwiLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjUwJVwiLFxuICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcbiAgICAgICAgICAgIHRyYW5zZm9ybTogXCJzY2FsZSgwLjIpIHRyYW5zbGF0ZVgoLTQ0OHB4KSB0cmFuc2xhdGVZKC00NDhweClcIixcbiAgICAgICAgICAgIC4uLnByb3BzLmJhY2tncm91bmRTdHlsZSxcbiAgICAgICAgICB9KX1cbiAgICAgICAgPlxuICAgICAgICAgIDxSb3RhdGVCdXR0b24gY2xhc3NOYW1lPXtjc3MoeyAuLi5wcm9wcy5yb3RhdGVSaWdodFN0eWxlIH0pfT5cbiAgICAgICAgICAgIDxSb3RhdGVSaWdodEljb25cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBiZWFyaW5nID0gTWF0aC5yb3VuZChtYXBIb29rLm1hcD8uZ2V0QmVhcmluZygpKTtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdCA9IE1hdGgucm91bmQoYmVhcmluZyAlIDkwKTtcbiAgICAgICAgICAgICAgICBpZiAoYmVhcmluZyA+IDApIHtcbiAgICAgICAgICAgICAgICAgIHJlc3QgPSA5MCAtIHJlc3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1hcEhvb2subWFwPy5zZXRCZWFyaW5nKE1hdGgucm91bmQoYmVhcmluZyArIE1hdGguYWJzKHJlc3QpKSk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+PC9Sb3RhdGVSaWdodEljb24+XG4gICAgICAgICAgPC9Sb3RhdGVCdXR0b24+XG4gICAgICAgICAgPE5lZWRsZUJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjc3MoeyAuLi5wcm9wcy5uZWVkbGVTdHlsZSB9KX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgbWFwSG9vay5tYXA/LnNldEJlYXJpbmcoMCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxOZWVkbGVDb250YWluZXJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IFwicm90YXRlKFwiICsgYmVhcmluZyArIFwiZGVnKVwiLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8TmVlZGxlSWNvbiAvPlxuICAgICAgICAgICAgPC9OZWVkbGVDb250YWluZXI+XG4gICAgICAgICAgPC9OZWVkbGVCdXR0b24+XG4gICAgICAgICAgPFJvdGF0ZUJ1dHRvbiBjbGFzc05hbWU9e2Nzcyh7IC4uLnByb3BzLnJvdGF0ZUxlZnRTdHlsZSB9KX0+XG4gICAgICAgICAgICA8Um90YXRlTGVmdEljb25cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBiZWFyaW5nID0gTWF0aC5yb3VuZChtYXBIb29rLm1hcD8uZ2V0QmVhcmluZygpKTtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdCA9IE1hdGgucm91bmQoYmVhcmluZyAlIDkwKTtcbiAgICAgICAgICAgICAgICBpZiAoYmVhcmluZyA8IDApIHtcbiAgICAgICAgICAgICAgICAgIHJlc3QgPSA5MCArIHJlc3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1hcEhvb2subWFwPy5zZXRCZWFyaW5nKE1hdGgucm91bmQoYmVhcmluZyAtIE1hdGguYWJzKHJlc3QpKSk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+PC9Sb3RhdGVMZWZ0SWNvbj5cbiAgICAgICAgICA8L1JvdGF0ZUJ1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8Lz5cbiAgKTtcbn07XG5cbk1sTmF2aWdhdGlvbkNvbXBhc3MucHJvcFR5cGVzID0ge1xuICAvKipcbiAgICogQ29tcG9uZW50IGlkIHByZWZpeFxuICAgKi9cbiAgaWRQcmVmaXg6IFByb3BUeXBlcy5zdHJpbmcsXG4gIC8qKlxuICAgKiBTdHlsZSBvYmplY3QgdG8gYWRqdXN0IGNzcyBkZWZpbml0aW9ucyBvZiB0aGUgY29tcG9uZW50LlxuICAgKi9cbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIC8qKlxuICAgKiBTdHlsZSBvYmplY3QgdG8gYWRqdXN0IGNzcyBkZWZpbml0aW9ucyBvZiB0aGUgYmFja2dyb3VuZC5cbiAgICovXG4gIGJhY2tncm91bmRTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSBjb21wYXNzIG5lZWRsZS5cbiAgICovXG4gIG5lZWRsZVN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIHJvdGF0ZSByaWdodCBidXR0b24uXG4gICAqL1xuICByb3RhdGVSaWdodFN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIHJvdGF0ZSBsZWZ0IGJ1dHRvbi5cbiAgICovXG4gIHJvdGF0ZUxlZnRTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE1sTmF2aWdhdGlvbkNvbXBhc3M7XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
});

const NeedleContainer = _styled("div", process.env.NODE_ENV === "production" ? {
  target: "e12lzm5x1"
} : {
  target: "e12lzm5x1",
  label: "NeedleContainer"
})(process.env.NODE_ENV === "production" ? {
  name: "1m8y6tb",
  styles: "pointer-events:none;display:flex;z-index:1002;position:absolute;align-items:center;margin-left:-30%;path:nth-of-type(2){}svg g{transform:translate(-76.7053, -29.7727) scale(2, 1);}svg{z-index:9990;height:150px;width:200px;}"
} : {
  name: "1m8y6tb",
  styles: "pointer-events:none;display:flex;z-index:1002;position:absolute;align-items:center;margin-left:-30%;path:nth-of-type(2){}svg g{transform:translate(-76.7053, -29.7727) scale(2, 1);}svg{z-index:9990;height:150px;width:200px;}",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1sTmF2aWdhdGlvbkNvbXBhc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBc0NrQyIsImZpbGUiOiJNbE5hdmlnYXRpb25Db21wYXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcblxuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgUm90YXRlUmlnaHRJY29uIH0gZnJvbSBcIi4vYXNzZXRzL3JvdGF0ZV9yaWdodC5zdmdcIjtcbmltcG9ydCB7IFJlYWN0Q29tcG9uZW50IGFzIFJvdGF0ZUxlZnRJY29uIH0gZnJvbSBcIi4vYXNzZXRzL3JvdGF0ZV9sZWZ0LnN2Z1wiO1xuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgTmVlZGxlSWNvbiB9IGZyb20gXCIuL2Fzc2V0cy9uZWVkbGUuc3ZnXCI7XG5cbmltcG9ydCBzdHlsZWQgZnJvbSBcIkBlbW90aW9uL3N0eWxlZFwiO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSBcIkBlbW90aW9uL2Nzc1wiO1xuaW1wb3J0IHVzZU1hcCBmcm9tIFwiLi4vLi4vaG9va3MvdXNlTWFwXCI7XG5cbmNvbnN0IE5lZWRsZUJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiA0MCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgJjpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIHBhdGgge1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCAxNXB4IHJnYmEoMCwgMCwgMCwgMC4yKSk7XG4gIH1cbiAgJjpob3ZlciBwYXRoIHtcbiAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDBweCAwcHggMTNweCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkpO1xuICB9XG4gIHBhdGg6bnRoLW9mLXR5cGUoMikge1xuICAgIGZpbGw6ICMzNDM0MzQ7XG4gIH1cbiAgJjpob3ZlciBwYXRoOm50aC1vZi10eXBlKDIpIHtcbiAgICBmaWxsOiAjNDM0MzQzO1xuICB9XG4gIHBhdGg6bnRoLW9mLXR5cGUoMSkge1xuICAgIGZpbGw6ICNlOTAzMTg7XG4gIH1cbiAgJjpob3ZlciBwYXRoOm50aC1vZi10eXBlKDEpIHtcbiAgICBmaWxsOiAjZmI0MDUyO1xuICB9XG5gO1xuY29uc3QgTmVlZGxlQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHotaW5kZXg6IDEwMDI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICBtYXJnaW4tbGVmdDogLTMwJTtcbiAgcGF0aDpudGgtb2YtdHlwZSgyKSB7XG4gIH1cbiAgc3ZnIGcge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC03Ni43MDUzLCAtMjkuNzcyNykgc2NhbGUoMiwgMSk7XG4gIH1cbiAgc3ZnIHtcbiAgICB6LWluZGV4OiA5OTkwO1xuICAgIGhlaWdodDogMTUwcHg7XG4gICAgd2lkdGg6IDIwMHB4O1xuICB9XG5gO1xuY29uc3QgUm90YXRlQnV0dG9uID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDMwJTtcbiAgbWFyZ2luLXRvcDogMTRweDtcbiAgei1pbmRleDogOTk5O1xuICBkaXNwbGF5OiBmbGV4O1xuXG4gIHN2Zzpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIHN2Zzpob3ZlciBwYXRoIHtcbiAgICBmaWxsOiAjZWNlY2VjO1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCA1cHggcmdiYSgwLCAwLCAwLCAwLjEpKTtcbiAgfVxuICBwYXRoIHtcbiAgICBmaWxsOiAjYmJiO1xuICB9XG4gIHN2ZyB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpO1xuICAgIHotaW5kZXg6IDk5OTA7XG4gICAgaGVpZ2h0OiAxNzJweDtcbiAgfVxuYDtcblxuLyoqXG4gKiBOYXZpZ2F0aW9uIGNvbXBvbmVudCB0aGF0IGRpc3BsYXlzIGEgY29tcGFzcyBjb21wb25lbnQgd2hpY2ggaW5kaWNhdGVzIHRoZSBjdXJyZW50IG9yaWFudGF0aW9uIG9mIHRoZSBtYXAgaXQgaXMgcmVnaXN0ZXJlZCBmb3IgYW5kIG9mZmVycyBjb250cm9scyB0byB0dXJuIHRoZSBiZWFyaW5nIDkwwrAgbGVmdC9yaWdodCBvciByZXNldCBub3J0aCB0byBwb2ludCB1cC5cbiAqXG4gKiBBbGwgc3R5bGUgcHJvcHMgYXJlIGFwcGxpZWQgdXNpbmcgQGVtb3Rpb24vY3NzIHRvIGFsbG93IG1vcmUgY29tcGxleCBjc3Mgc2VsZWN0b3JzLlxuICpcbiAqIEBjb21wb25lbnRcbiAqL1xuY29uc3QgTWxOYXZpZ2F0aW9uQ29tcGFzcyA9IChwcm9wcykgPT4ge1xuICBjb25zdCBtYXBIb29rID0gdXNlTWFwKHsgbWFwSWQ6IHByb3BzLm1hcElkLCB3YWl0Rm9yTGF5ZXI6IHByb3BzLmluc2VydEJlZm9yZUxheWVyIH0pO1xuICBjb25zdCBbYmVhcmluZywgc2V0QmVhcmluZ10gPSB1c2VTdGF0ZSgwKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbWFwSG9vay5tYXApIHJldHVybjtcblxuICAgIGxldCBfdXBkYXRlQmVhcmluZyA9ICgpID0+IHtcbiAgICAgIHNldEJlYXJpbmcoTWF0aC5yb3VuZChtYXBIb29rLm1hcC5nZXRCZWFyaW5nKCkpKTtcbiAgICB9O1xuXG4gICAgbWFwSG9vay5tYXAub24oXCJyb3RhdGVcIiwgX3VwZGF0ZUJlYXJpbmcsIG1hcEhvb2suY29tcG9uZW50SWQpO1xuICAgIF91cGRhdGVCZWFyaW5nKCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgbWFwSG9vay5tYXAub2ZmKFwicm90YXRlXCIsIF91cGRhdGVCZWFyaW5nKTtcbiAgICB9O1xuICB9LCBbbWFwSG9vay5tYXAsIHByb3BzLm1hcElkXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2Nzcyh7XG4gICAgICAgICAgekluZGV4OiAxMDAwLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuICAgICAgICAgIC4uLnByb3BzLnN0eWxlLFxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y3NzKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMTBweCBzb2xpZCAjYmNiY2JjXCIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzcxNzE3MVwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJyYWRpYWwtZ3JhZGllbnQoIzcxNzE3MSwgIzQxNDE0MSlcIixcbiAgICAgICAgICAgIGhlaWdodDogXCIyMDBweFwiLFxuICAgICAgICAgICAgd2lkdGg6IFwiMjAwcHhcIixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCI1MCVcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMC4yKSB0cmFuc2xhdGVYKC00NDhweCkgdHJhbnNsYXRlWSgtNDQ4cHgpXCIsXG4gICAgICAgICAgICAuLi5wcm9wcy5iYWNrZ3JvdW5kU3R5bGUsXG4gICAgICAgICAgfSl9XG4gICAgICAgID5cbiAgICAgICAgICA8Um90YXRlQnV0dG9uIGNsYXNzTmFtZT17Y3NzKHsgLi4ucHJvcHMucm90YXRlUmlnaHRTdHlsZSB9KX0+XG4gICAgICAgICAgICA8Um90YXRlUmlnaHRJY29uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmVhcmluZyA9IE1hdGgucm91bmQobWFwSG9vay5tYXA/LmdldEJlYXJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3QgPSBNYXRoLnJvdW5kKGJlYXJpbmcgJSA5MCk7XG4gICAgICAgICAgICAgICAgaWYgKGJlYXJpbmcgPiAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTAgLSByZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmVzdCA9IDkwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBIb29rLm1hcD8uc2V0QmVhcmluZyhNYXRoLnJvdW5kKGJlYXJpbmcgKyBNYXRoLmFicyhyZXN0KSkpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPjwvUm90YXRlUmlnaHRJY29uPlxuICAgICAgICAgIDwvUm90YXRlQnV0dG9uPlxuICAgICAgICAgIDxOZWVkbGVCdXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y3NzKHsgLi4ucHJvcHMubmVlZGxlU3R5bGUgfSl9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIG1hcEhvb2subWFwPy5zZXRCZWFyaW5nKDApO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8TmVlZGxlQ29udGFpbmVyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBcInJvdGF0ZShcIiArIGJlYXJpbmcgKyBcImRlZylcIixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5lZWRsZUljb24gLz5cbiAgICAgICAgICAgIDwvTmVlZGxlQ29udGFpbmVyPlxuICAgICAgICAgIDwvTmVlZGxlQnV0dG9uPlxuICAgICAgICAgIDxSb3RhdGVCdXR0b24gY2xhc3NOYW1lPXtjc3MoeyAuLi5wcm9wcy5yb3RhdGVMZWZ0U3R5bGUgfSl9PlxuICAgICAgICAgICAgPFJvdGF0ZUxlZnRJY29uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmVhcmluZyA9IE1hdGgucm91bmQobWFwSG9vay5tYXA/LmdldEJlYXJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3QgPSBNYXRoLnJvdW5kKGJlYXJpbmcgJSA5MCk7XG4gICAgICAgICAgICAgICAgaWYgKGJlYXJpbmcgPCAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTAgKyByZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmVzdCA9IDkwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBIb29rLm1hcD8uc2V0QmVhcmluZyhNYXRoLnJvdW5kKGJlYXJpbmcgLSBNYXRoLmFicyhyZXN0KSkpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPjwvUm90YXRlTGVmdEljb24+XG4gICAgICAgICAgPC9Sb3RhdGVCdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC8+XG4gICk7XG59O1xuXG5NbE5hdmlnYXRpb25Db21wYXNzLnByb3BUeXBlcyA9IHtcbiAgLyoqXG4gICAqIENvbXBvbmVudCBpZCBwcmVmaXhcbiAgICovXG4gIGlkUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIGJhY2tncm91bmQuXG4gICAqL1xuICBiYWNrZ3JvdW5kU3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIC8qKlxuICAgKiBTdHlsZSBvYmplY3QgdG8gYWRqdXN0IGNzcyBkZWZpbml0aW9ucyBvZiB0aGUgY29tcGFzcyBuZWVkbGUuXG4gICAqL1xuICBuZWVkbGVTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSByb3RhdGUgcmlnaHQgYnV0dG9uLlxuICAgKi9cbiAgcm90YXRlUmlnaHRTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSByb3RhdGUgbGVmdCBidXR0b24uXG4gICAqL1xuICByb3RhdGVMZWZ0U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBNbE5hdmlnYXRpb25Db21wYXNzO1xuIl19 */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
});

const RotateButton = _styled("div", process.env.NODE_ENV === "production" ? {
  target: "e12lzm5x0"
} : {
  target: "e12lzm5x0",
  label: "RotateButton"
})(process.env.NODE_ENV === "production" ? {
  name: "1j4uu1m",
  styles: "width:30%;margin-top:14px;z-index:999;display:flex;svg:hover{cursor:pointer;}svg:hover path{fill:#ececec;filter:drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.1));}path{fill:#bbb;}svg{transform:scale(0.6);z-index:9990;height:172px;}"
} : {
  name: "1j4uu1m",
  styles: "width:30%;margin-top:14px;z-index:999;display:flex;svg:hover{cursor:pointer;}svg:hover path{fill:#ececec;filter:drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.1));}path{fill:#bbb;}svg{transform:scale(0.6);z-index:9990;height:172px;}",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1sTmF2aWdhdGlvbkNvbXBhc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBeUQrQiIsImZpbGUiOiJNbE5hdmlnYXRpb25Db21wYXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcblxuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgUm90YXRlUmlnaHRJY29uIH0gZnJvbSBcIi4vYXNzZXRzL3JvdGF0ZV9yaWdodC5zdmdcIjtcbmltcG9ydCB7IFJlYWN0Q29tcG9uZW50IGFzIFJvdGF0ZUxlZnRJY29uIH0gZnJvbSBcIi4vYXNzZXRzL3JvdGF0ZV9sZWZ0LnN2Z1wiO1xuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgTmVlZGxlSWNvbiB9IGZyb20gXCIuL2Fzc2V0cy9uZWVkbGUuc3ZnXCI7XG5cbmltcG9ydCBzdHlsZWQgZnJvbSBcIkBlbW90aW9uL3N0eWxlZFwiO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSBcIkBlbW90aW9uL2Nzc1wiO1xuaW1wb3J0IHVzZU1hcCBmcm9tIFwiLi4vLi4vaG9va3MvdXNlTWFwXCI7XG5cbmNvbnN0IE5lZWRsZUJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiA0MCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgJjpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIHBhdGgge1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCAxNXB4IHJnYmEoMCwgMCwgMCwgMC4yKSk7XG4gIH1cbiAgJjpob3ZlciBwYXRoIHtcbiAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDBweCAwcHggMTNweCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkpO1xuICB9XG4gIHBhdGg6bnRoLW9mLXR5cGUoMikge1xuICAgIGZpbGw6ICMzNDM0MzQ7XG4gIH1cbiAgJjpob3ZlciBwYXRoOm50aC1vZi10eXBlKDIpIHtcbiAgICBmaWxsOiAjNDM0MzQzO1xuICB9XG4gIHBhdGg6bnRoLW9mLXR5cGUoMSkge1xuICAgIGZpbGw6ICNlOTAzMTg7XG4gIH1cbiAgJjpob3ZlciBwYXRoOm50aC1vZi10eXBlKDEpIHtcbiAgICBmaWxsOiAjZmI0MDUyO1xuICB9XG5gO1xuY29uc3QgTmVlZGxlQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHotaW5kZXg6IDEwMDI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICBtYXJnaW4tbGVmdDogLTMwJTtcbiAgcGF0aDpudGgtb2YtdHlwZSgyKSB7XG4gIH1cbiAgc3ZnIGcge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC03Ni43MDUzLCAtMjkuNzcyNykgc2NhbGUoMiwgMSk7XG4gIH1cbiAgc3ZnIHtcbiAgICB6LWluZGV4OiA5OTkwO1xuICAgIGhlaWdodDogMTUwcHg7XG4gICAgd2lkdGg6IDIwMHB4O1xuICB9XG5gO1xuY29uc3QgUm90YXRlQnV0dG9uID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDMwJTtcbiAgbWFyZ2luLXRvcDogMTRweDtcbiAgei1pbmRleDogOTk5O1xuICBkaXNwbGF5OiBmbGV4O1xuXG4gIHN2Zzpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIHN2Zzpob3ZlciBwYXRoIHtcbiAgICBmaWxsOiAjZWNlY2VjO1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCA1cHggcmdiYSgwLCAwLCAwLCAwLjEpKTtcbiAgfVxuICBwYXRoIHtcbiAgICBmaWxsOiAjYmJiO1xuICB9XG4gIHN2ZyB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpO1xuICAgIHotaW5kZXg6IDk5OTA7XG4gICAgaGVpZ2h0OiAxNzJweDtcbiAgfVxuYDtcblxuLyoqXG4gKiBOYXZpZ2F0aW9uIGNvbXBvbmVudCB0aGF0IGRpc3BsYXlzIGEgY29tcGFzcyBjb21wb25lbnQgd2hpY2ggaW5kaWNhdGVzIHRoZSBjdXJyZW50IG9yaWFudGF0aW9uIG9mIHRoZSBtYXAgaXQgaXMgcmVnaXN0ZXJlZCBmb3IgYW5kIG9mZmVycyBjb250cm9scyB0byB0dXJuIHRoZSBiZWFyaW5nIDkwwrAgbGVmdC9yaWdodCBvciByZXNldCBub3J0aCB0byBwb2ludCB1cC5cbiAqXG4gKiBBbGwgc3R5bGUgcHJvcHMgYXJlIGFwcGxpZWQgdXNpbmcgQGVtb3Rpb24vY3NzIHRvIGFsbG93IG1vcmUgY29tcGxleCBjc3Mgc2VsZWN0b3JzLlxuICpcbiAqIEBjb21wb25lbnRcbiAqL1xuY29uc3QgTWxOYXZpZ2F0aW9uQ29tcGFzcyA9IChwcm9wcykgPT4ge1xuICBjb25zdCBtYXBIb29rID0gdXNlTWFwKHsgbWFwSWQ6IHByb3BzLm1hcElkLCB3YWl0Rm9yTGF5ZXI6IHByb3BzLmluc2VydEJlZm9yZUxheWVyIH0pO1xuICBjb25zdCBbYmVhcmluZywgc2V0QmVhcmluZ10gPSB1c2VTdGF0ZSgwKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbWFwSG9vay5tYXApIHJldHVybjtcblxuICAgIGxldCBfdXBkYXRlQmVhcmluZyA9ICgpID0+IHtcbiAgICAgIHNldEJlYXJpbmcoTWF0aC5yb3VuZChtYXBIb29rLm1hcC5nZXRCZWFyaW5nKCkpKTtcbiAgICB9O1xuXG4gICAgbWFwSG9vay5tYXAub24oXCJyb3RhdGVcIiwgX3VwZGF0ZUJlYXJpbmcsIG1hcEhvb2suY29tcG9uZW50SWQpO1xuICAgIF91cGRhdGVCZWFyaW5nKCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgbWFwSG9vay5tYXAub2ZmKFwicm90YXRlXCIsIF91cGRhdGVCZWFyaW5nKTtcbiAgICB9O1xuICB9LCBbbWFwSG9vay5tYXAsIHByb3BzLm1hcElkXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2Nzcyh7XG4gICAgICAgICAgekluZGV4OiAxMDAwLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuICAgICAgICAgIC4uLnByb3BzLnN0eWxlLFxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y3NzKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMTBweCBzb2xpZCAjYmNiY2JjXCIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzcxNzE3MVwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJyYWRpYWwtZ3JhZGllbnQoIzcxNzE3MSwgIzQxNDE0MSlcIixcbiAgICAgICAgICAgIGhlaWdodDogXCIyMDBweFwiLFxuICAgICAgICAgICAgd2lkdGg6IFwiMjAwcHhcIixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCI1MCVcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMC4yKSB0cmFuc2xhdGVYKC00NDhweCkgdHJhbnNsYXRlWSgtNDQ4cHgpXCIsXG4gICAgICAgICAgICAuLi5wcm9wcy5iYWNrZ3JvdW5kU3R5bGUsXG4gICAgICAgICAgfSl9XG4gICAgICAgID5cbiAgICAgICAgICA8Um90YXRlQnV0dG9uIGNsYXNzTmFtZT17Y3NzKHsgLi4ucHJvcHMucm90YXRlUmlnaHRTdHlsZSB9KX0+XG4gICAgICAgICAgICA8Um90YXRlUmlnaHRJY29uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmVhcmluZyA9IE1hdGgucm91bmQobWFwSG9vay5tYXA/LmdldEJlYXJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3QgPSBNYXRoLnJvdW5kKGJlYXJpbmcgJSA5MCk7XG4gICAgICAgICAgICAgICAgaWYgKGJlYXJpbmcgPiAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTAgLSByZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmVzdCA9IDkwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBIb29rLm1hcD8uc2V0QmVhcmluZyhNYXRoLnJvdW5kKGJlYXJpbmcgKyBNYXRoLmFicyhyZXN0KSkpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPjwvUm90YXRlUmlnaHRJY29uPlxuICAgICAgICAgIDwvUm90YXRlQnV0dG9uPlxuICAgICAgICAgIDxOZWVkbGVCdXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y3NzKHsgLi4ucHJvcHMubmVlZGxlU3R5bGUgfSl9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIG1hcEhvb2subWFwPy5zZXRCZWFyaW5nKDApO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8TmVlZGxlQ29udGFpbmVyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBcInJvdGF0ZShcIiArIGJlYXJpbmcgKyBcImRlZylcIixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5lZWRsZUljb24gLz5cbiAgICAgICAgICAgIDwvTmVlZGxlQ29udGFpbmVyPlxuICAgICAgICAgIDwvTmVlZGxlQnV0dG9uPlxuICAgICAgICAgIDxSb3RhdGVCdXR0b24gY2xhc3NOYW1lPXtjc3MoeyAuLi5wcm9wcy5yb3RhdGVMZWZ0U3R5bGUgfSl9PlxuICAgICAgICAgICAgPFJvdGF0ZUxlZnRJY29uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmVhcmluZyA9IE1hdGgucm91bmQobWFwSG9vay5tYXA/LmdldEJlYXJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3QgPSBNYXRoLnJvdW5kKGJlYXJpbmcgJSA5MCk7XG4gICAgICAgICAgICAgICAgaWYgKGJlYXJpbmcgPCAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTAgKyByZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmVzdCA9IDkwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBIb29rLm1hcD8uc2V0QmVhcmluZyhNYXRoLnJvdW5kKGJlYXJpbmcgLSBNYXRoLmFicyhyZXN0KSkpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPjwvUm90YXRlTGVmdEljb24+XG4gICAgICAgICAgPC9Sb3RhdGVCdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC8+XG4gICk7XG59O1xuXG5NbE5hdmlnYXRpb25Db21wYXNzLnByb3BUeXBlcyA9IHtcbiAgLyoqXG4gICAqIENvbXBvbmVudCBpZCBwcmVmaXhcbiAgICovXG4gIGlkUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIGJhY2tncm91bmQuXG4gICAqL1xuICBiYWNrZ3JvdW5kU3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIC8qKlxuICAgKiBTdHlsZSBvYmplY3QgdG8gYWRqdXN0IGNzcyBkZWZpbml0aW9ucyBvZiB0aGUgY29tcGFzcyBuZWVkbGUuXG4gICAqL1xuICBuZWVkbGVTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSByb3RhdGUgcmlnaHQgYnV0dG9uLlxuICAgKi9cbiAgcm90YXRlUmlnaHRTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSByb3RhdGUgbGVmdCBidXR0b24uXG4gICAqL1xuICByb3RhdGVMZWZ0U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBNbE5hdmlnYXRpb25Db21wYXNzO1xuIl19 */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
});
/**
 * Navigation component that displays a compass component which indicates the current oriantation of the map it is registered for and offers controls to turn the bearing 90° left/right or reset north to point up.
 *
 * All style props are applied using @emotion/css to allow more complex css selectors.
 *
 * @component
 */


const MlNavigationCompass = props => {
  const mapHook = useMap({
    mapId: props.mapId,
    waitForLayer: props.insertBeforeLayer
  });
  const [bearing, setBearing] = useState(0);
  useEffect(() => {
    if (!mapHook.map) return;

    let _updateBearing = () => {
      setBearing(Math.round(mapHook.map.getBearing()));
    };

    mapHook.map.on("rotate", _updateBearing, mapHook.componentId);

    _updateBearing();

    return () => {
      mapHook.map.off("rotate", _updateBearing);
    };
  }, [mapHook.map, props.mapId]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: /*#__PURE__*/css({
      zIndex: 1000,
      top: 0,
      position: "absolute",
      ...props.style
    }, process.env.NODE_ENV === "production" ? "" : ";label:MlNavigationCompass;", process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1sTmF2aWdhdGlvbkNvbXBhc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBNkdtQiIsImZpbGUiOiJNbE5hdmlnYXRpb25Db21wYXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcblxuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgUm90YXRlUmlnaHRJY29uIH0gZnJvbSBcIi4vYXNzZXRzL3JvdGF0ZV9yaWdodC5zdmdcIjtcbmltcG9ydCB7IFJlYWN0Q29tcG9uZW50IGFzIFJvdGF0ZUxlZnRJY29uIH0gZnJvbSBcIi4vYXNzZXRzL3JvdGF0ZV9sZWZ0LnN2Z1wiO1xuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgTmVlZGxlSWNvbiB9IGZyb20gXCIuL2Fzc2V0cy9uZWVkbGUuc3ZnXCI7XG5cbmltcG9ydCBzdHlsZWQgZnJvbSBcIkBlbW90aW9uL3N0eWxlZFwiO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSBcIkBlbW90aW9uL2Nzc1wiO1xuaW1wb3J0IHVzZU1hcCBmcm9tIFwiLi4vLi4vaG9va3MvdXNlTWFwXCI7XG5cbmNvbnN0IE5lZWRsZUJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiA0MCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgJjpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIHBhdGgge1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCAxNXB4IHJnYmEoMCwgMCwgMCwgMC4yKSk7XG4gIH1cbiAgJjpob3ZlciBwYXRoIHtcbiAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDBweCAwcHggMTNweCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkpO1xuICB9XG4gIHBhdGg6bnRoLW9mLXR5cGUoMikge1xuICAgIGZpbGw6ICMzNDM0MzQ7XG4gIH1cbiAgJjpob3ZlciBwYXRoOm50aC1vZi10eXBlKDIpIHtcbiAgICBmaWxsOiAjNDM0MzQzO1xuICB9XG4gIHBhdGg6bnRoLW9mLXR5cGUoMSkge1xuICAgIGZpbGw6ICNlOTAzMTg7XG4gIH1cbiAgJjpob3ZlciBwYXRoOm50aC1vZi10eXBlKDEpIHtcbiAgICBmaWxsOiAjZmI0MDUyO1xuICB9XG5gO1xuY29uc3QgTmVlZGxlQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHotaW5kZXg6IDEwMDI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICBtYXJnaW4tbGVmdDogLTMwJTtcbiAgcGF0aDpudGgtb2YtdHlwZSgyKSB7XG4gIH1cbiAgc3ZnIGcge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC03Ni43MDUzLCAtMjkuNzcyNykgc2NhbGUoMiwgMSk7XG4gIH1cbiAgc3ZnIHtcbiAgICB6LWluZGV4OiA5OTkwO1xuICAgIGhlaWdodDogMTUwcHg7XG4gICAgd2lkdGg6IDIwMHB4O1xuICB9XG5gO1xuY29uc3QgUm90YXRlQnV0dG9uID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDMwJTtcbiAgbWFyZ2luLXRvcDogMTRweDtcbiAgei1pbmRleDogOTk5O1xuICBkaXNwbGF5OiBmbGV4O1xuXG4gIHN2Zzpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIHN2Zzpob3ZlciBwYXRoIHtcbiAgICBmaWxsOiAjZWNlY2VjO1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCA1cHggcmdiYSgwLCAwLCAwLCAwLjEpKTtcbiAgfVxuICBwYXRoIHtcbiAgICBmaWxsOiAjYmJiO1xuICB9XG4gIHN2ZyB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpO1xuICAgIHotaW5kZXg6IDk5OTA7XG4gICAgaGVpZ2h0OiAxNzJweDtcbiAgfVxuYDtcblxuLyoqXG4gKiBOYXZpZ2F0aW9uIGNvbXBvbmVudCB0aGF0IGRpc3BsYXlzIGEgY29tcGFzcyBjb21wb25lbnQgd2hpY2ggaW5kaWNhdGVzIHRoZSBjdXJyZW50IG9yaWFudGF0aW9uIG9mIHRoZSBtYXAgaXQgaXMgcmVnaXN0ZXJlZCBmb3IgYW5kIG9mZmVycyBjb250cm9scyB0byB0dXJuIHRoZSBiZWFyaW5nIDkwwrAgbGVmdC9yaWdodCBvciByZXNldCBub3J0aCB0byBwb2ludCB1cC5cbiAqXG4gKiBBbGwgc3R5bGUgcHJvcHMgYXJlIGFwcGxpZWQgdXNpbmcgQGVtb3Rpb24vY3NzIHRvIGFsbG93IG1vcmUgY29tcGxleCBjc3Mgc2VsZWN0b3JzLlxuICpcbiAqIEBjb21wb25lbnRcbiAqL1xuY29uc3QgTWxOYXZpZ2F0aW9uQ29tcGFzcyA9IChwcm9wcykgPT4ge1xuICBjb25zdCBtYXBIb29rID0gdXNlTWFwKHsgbWFwSWQ6IHByb3BzLm1hcElkLCB3YWl0Rm9yTGF5ZXI6IHByb3BzLmluc2VydEJlZm9yZUxheWVyIH0pO1xuICBjb25zdCBbYmVhcmluZywgc2V0QmVhcmluZ10gPSB1c2VTdGF0ZSgwKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbWFwSG9vay5tYXApIHJldHVybjtcblxuICAgIGxldCBfdXBkYXRlQmVhcmluZyA9ICgpID0+IHtcbiAgICAgIHNldEJlYXJpbmcoTWF0aC5yb3VuZChtYXBIb29rLm1hcC5nZXRCZWFyaW5nKCkpKTtcbiAgICB9O1xuXG4gICAgbWFwSG9vay5tYXAub24oXCJyb3RhdGVcIiwgX3VwZGF0ZUJlYXJpbmcsIG1hcEhvb2suY29tcG9uZW50SWQpO1xuICAgIF91cGRhdGVCZWFyaW5nKCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgbWFwSG9vay5tYXAub2ZmKFwicm90YXRlXCIsIF91cGRhdGVCZWFyaW5nKTtcbiAgICB9O1xuICB9LCBbbWFwSG9vay5tYXAsIHByb3BzLm1hcElkXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2Nzcyh7XG4gICAgICAgICAgekluZGV4OiAxMDAwLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuICAgICAgICAgIC4uLnByb3BzLnN0eWxlLFxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y3NzKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMTBweCBzb2xpZCAjYmNiY2JjXCIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzcxNzE3MVwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJyYWRpYWwtZ3JhZGllbnQoIzcxNzE3MSwgIzQxNDE0MSlcIixcbiAgICAgICAgICAgIGhlaWdodDogXCIyMDBweFwiLFxuICAgICAgICAgICAgd2lkdGg6IFwiMjAwcHhcIixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCI1MCVcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMC4yKSB0cmFuc2xhdGVYKC00NDhweCkgdHJhbnNsYXRlWSgtNDQ4cHgpXCIsXG4gICAgICAgICAgICAuLi5wcm9wcy5iYWNrZ3JvdW5kU3R5bGUsXG4gICAgICAgICAgfSl9XG4gICAgICAgID5cbiAgICAgICAgICA8Um90YXRlQnV0dG9uIGNsYXNzTmFtZT17Y3NzKHsgLi4ucHJvcHMucm90YXRlUmlnaHRTdHlsZSB9KX0+XG4gICAgICAgICAgICA8Um90YXRlUmlnaHRJY29uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmVhcmluZyA9IE1hdGgucm91bmQobWFwSG9vay5tYXA/LmdldEJlYXJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3QgPSBNYXRoLnJvdW5kKGJlYXJpbmcgJSA5MCk7XG4gICAgICAgICAgICAgICAgaWYgKGJlYXJpbmcgPiAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTAgLSByZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmVzdCA9IDkwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBIb29rLm1hcD8uc2V0QmVhcmluZyhNYXRoLnJvdW5kKGJlYXJpbmcgKyBNYXRoLmFicyhyZXN0KSkpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPjwvUm90YXRlUmlnaHRJY29uPlxuICAgICAgICAgIDwvUm90YXRlQnV0dG9uPlxuICAgICAgICAgIDxOZWVkbGVCdXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y3NzKHsgLi4ucHJvcHMubmVlZGxlU3R5bGUgfSl9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIG1hcEhvb2subWFwPy5zZXRCZWFyaW5nKDApO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8TmVlZGxlQ29udGFpbmVyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBcInJvdGF0ZShcIiArIGJlYXJpbmcgKyBcImRlZylcIixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5lZWRsZUljb24gLz5cbiAgICAgICAgICAgIDwvTmVlZGxlQ29udGFpbmVyPlxuICAgICAgICAgIDwvTmVlZGxlQnV0dG9uPlxuICAgICAgICAgIDxSb3RhdGVCdXR0b24gY2xhc3NOYW1lPXtjc3MoeyAuLi5wcm9wcy5yb3RhdGVMZWZ0U3R5bGUgfSl9PlxuICAgICAgICAgICAgPFJvdGF0ZUxlZnRJY29uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmVhcmluZyA9IE1hdGgucm91bmQobWFwSG9vay5tYXA/LmdldEJlYXJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3QgPSBNYXRoLnJvdW5kKGJlYXJpbmcgJSA5MCk7XG4gICAgICAgICAgICAgICAgaWYgKGJlYXJpbmcgPCAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTAgKyByZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmVzdCA9IDkwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBIb29rLm1hcD8uc2V0QmVhcmluZyhNYXRoLnJvdW5kKGJlYXJpbmcgLSBNYXRoLmFicyhyZXN0KSkpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPjwvUm90YXRlTGVmdEljb24+XG4gICAgICAgICAgPC9Sb3RhdGVCdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC8+XG4gICk7XG59O1xuXG5NbE5hdmlnYXRpb25Db21wYXNzLnByb3BUeXBlcyA9IHtcbiAgLyoqXG4gICAqIENvbXBvbmVudCBpZCBwcmVmaXhcbiAgICovXG4gIGlkUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIGJhY2tncm91bmQuXG4gICAqL1xuICBiYWNrZ3JvdW5kU3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIC8qKlxuICAgKiBTdHlsZSBvYmplY3QgdG8gYWRqdXN0IGNzcyBkZWZpbml0aW9ucyBvZiB0aGUgY29tcGFzcyBuZWVkbGUuXG4gICAqL1xuICBuZWVkbGVTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSByb3RhdGUgcmlnaHQgYnV0dG9uLlxuICAgKi9cbiAgcm90YXRlUmlnaHRTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSByb3RhdGUgbGVmdCBidXR0b24uXG4gICAqL1xuICByb3RhdGVMZWZ0U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBNbE5hdmlnYXRpb25Db21wYXNzO1xuIl19 */")
  }, /*#__PURE__*/React__default.createElement("div", {
    className: /*#__PURE__*/css({
      position: "absolute",
      border: "10px solid #bcbcbc",
      backgroundColor: "#717171",
      background: "radial-gradient(#717171, #414141)",
      height: "200px",
      width: "200px",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      transform: "scale(0.2) translateX(-448px) translateY(-448px)",
      ...props.backgroundStyle
    }, process.env.NODE_ENV === "production" ? "" : ";label:MlNavigationCompass;", process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1sTmF2aWdhdGlvbkNvbXBhc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBcUhxQiIsImZpbGUiOiJNbE5hdmlnYXRpb25Db21wYXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcblxuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgUm90YXRlUmlnaHRJY29uIH0gZnJvbSBcIi4vYXNzZXRzL3JvdGF0ZV9yaWdodC5zdmdcIjtcbmltcG9ydCB7IFJlYWN0Q29tcG9uZW50IGFzIFJvdGF0ZUxlZnRJY29uIH0gZnJvbSBcIi4vYXNzZXRzL3JvdGF0ZV9sZWZ0LnN2Z1wiO1xuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgTmVlZGxlSWNvbiB9IGZyb20gXCIuL2Fzc2V0cy9uZWVkbGUuc3ZnXCI7XG5cbmltcG9ydCBzdHlsZWQgZnJvbSBcIkBlbW90aW9uL3N0eWxlZFwiO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSBcIkBlbW90aW9uL2Nzc1wiO1xuaW1wb3J0IHVzZU1hcCBmcm9tIFwiLi4vLi4vaG9va3MvdXNlTWFwXCI7XG5cbmNvbnN0IE5lZWRsZUJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiA0MCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgJjpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIHBhdGgge1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCAxNXB4IHJnYmEoMCwgMCwgMCwgMC4yKSk7XG4gIH1cbiAgJjpob3ZlciBwYXRoIHtcbiAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDBweCAwcHggMTNweCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkpO1xuICB9XG4gIHBhdGg6bnRoLW9mLXR5cGUoMikge1xuICAgIGZpbGw6ICMzNDM0MzQ7XG4gIH1cbiAgJjpob3ZlciBwYXRoOm50aC1vZi10eXBlKDIpIHtcbiAgICBmaWxsOiAjNDM0MzQzO1xuICB9XG4gIHBhdGg6bnRoLW9mLXR5cGUoMSkge1xuICAgIGZpbGw6ICNlOTAzMTg7XG4gIH1cbiAgJjpob3ZlciBwYXRoOm50aC1vZi10eXBlKDEpIHtcbiAgICBmaWxsOiAjZmI0MDUyO1xuICB9XG5gO1xuY29uc3QgTmVlZGxlQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHotaW5kZXg6IDEwMDI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICBtYXJnaW4tbGVmdDogLTMwJTtcbiAgcGF0aDpudGgtb2YtdHlwZSgyKSB7XG4gIH1cbiAgc3ZnIGcge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC03Ni43MDUzLCAtMjkuNzcyNykgc2NhbGUoMiwgMSk7XG4gIH1cbiAgc3ZnIHtcbiAgICB6LWluZGV4OiA5OTkwO1xuICAgIGhlaWdodDogMTUwcHg7XG4gICAgd2lkdGg6IDIwMHB4O1xuICB9XG5gO1xuY29uc3QgUm90YXRlQnV0dG9uID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDMwJTtcbiAgbWFyZ2luLXRvcDogMTRweDtcbiAgei1pbmRleDogOTk5O1xuICBkaXNwbGF5OiBmbGV4O1xuXG4gIHN2Zzpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIHN2Zzpob3ZlciBwYXRoIHtcbiAgICBmaWxsOiAjZWNlY2VjO1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCA1cHggcmdiYSgwLCAwLCAwLCAwLjEpKTtcbiAgfVxuICBwYXRoIHtcbiAgICBmaWxsOiAjYmJiO1xuICB9XG4gIHN2ZyB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpO1xuICAgIHotaW5kZXg6IDk5OTA7XG4gICAgaGVpZ2h0OiAxNzJweDtcbiAgfVxuYDtcblxuLyoqXG4gKiBOYXZpZ2F0aW9uIGNvbXBvbmVudCB0aGF0IGRpc3BsYXlzIGEgY29tcGFzcyBjb21wb25lbnQgd2hpY2ggaW5kaWNhdGVzIHRoZSBjdXJyZW50IG9yaWFudGF0aW9uIG9mIHRoZSBtYXAgaXQgaXMgcmVnaXN0ZXJlZCBmb3IgYW5kIG9mZmVycyBjb250cm9scyB0byB0dXJuIHRoZSBiZWFyaW5nIDkwwrAgbGVmdC9yaWdodCBvciByZXNldCBub3J0aCB0byBwb2ludCB1cC5cbiAqXG4gKiBBbGwgc3R5bGUgcHJvcHMgYXJlIGFwcGxpZWQgdXNpbmcgQGVtb3Rpb24vY3NzIHRvIGFsbG93IG1vcmUgY29tcGxleCBjc3Mgc2VsZWN0b3JzLlxuICpcbiAqIEBjb21wb25lbnRcbiAqL1xuY29uc3QgTWxOYXZpZ2F0aW9uQ29tcGFzcyA9IChwcm9wcykgPT4ge1xuICBjb25zdCBtYXBIb29rID0gdXNlTWFwKHsgbWFwSWQ6IHByb3BzLm1hcElkLCB3YWl0Rm9yTGF5ZXI6IHByb3BzLmluc2VydEJlZm9yZUxheWVyIH0pO1xuICBjb25zdCBbYmVhcmluZywgc2V0QmVhcmluZ10gPSB1c2VTdGF0ZSgwKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbWFwSG9vay5tYXApIHJldHVybjtcblxuICAgIGxldCBfdXBkYXRlQmVhcmluZyA9ICgpID0+IHtcbiAgICAgIHNldEJlYXJpbmcoTWF0aC5yb3VuZChtYXBIb29rLm1hcC5nZXRCZWFyaW5nKCkpKTtcbiAgICB9O1xuXG4gICAgbWFwSG9vay5tYXAub24oXCJyb3RhdGVcIiwgX3VwZGF0ZUJlYXJpbmcsIG1hcEhvb2suY29tcG9uZW50SWQpO1xuICAgIF91cGRhdGVCZWFyaW5nKCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgbWFwSG9vay5tYXAub2ZmKFwicm90YXRlXCIsIF91cGRhdGVCZWFyaW5nKTtcbiAgICB9O1xuICB9LCBbbWFwSG9vay5tYXAsIHByb3BzLm1hcElkXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2Nzcyh7XG4gICAgICAgICAgekluZGV4OiAxMDAwLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuICAgICAgICAgIC4uLnByb3BzLnN0eWxlLFxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y3NzKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMTBweCBzb2xpZCAjYmNiY2JjXCIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzcxNzE3MVwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJyYWRpYWwtZ3JhZGllbnQoIzcxNzE3MSwgIzQxNDE0MSlcIixcbiAgICAgICAgICAgIGhlaWdodDogXCIyMDBweFwiLFxuICAgICAgICAgICAgd2lkdGg6IFwiMjAwcHhcIixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCI1MCVcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMC4yKSB0cmFuc2xhdGVYKC00NDhweCkgdHJhbnNsYXRlWSgtNDQ4cHgpXCIsXG4gICAgICAgICAgICAuLi5wcm9wcy5iYWNrZ3JvdW5kU3R5bGUsXG4gICAgICAgICAgfSl9XG4gICAgICAgID5cbiAgICAgICAgICA8Um90YXRlQnV0dG9uIGNsYXNzTmFtZT17Y3NzKHsgLi4ucHJvcHMucm90YXRlUmlnaHRTdHlsZSB9KX0+XG4gICAgICAgICAgICA8Um90YXRlUmlnaHRJY29uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmVhcmluZyA9IE1hdGgucm91bmQobWFwSG9vay5tYXA/LmdldEJlYXJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3QgPSBNYXRoLnJvdW5kKGJlYXJpbmcgJSA5MCk7XG4gICAgICAgICAgICAgICAgaWYgKGJlYXJpbmcgPiAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTAgLSByZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmVzdCA9IDkwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBIb29rLm1hcD8uc2V0QmVhcmluZyhNYXRoLnJvdW5kKGJlYXJpbmcgKyBNYXRoLmFicyhyZXN0KSkpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPjwvUm90YXRlUmlnaHRJY29uPlxuICAgICAgICAgIDwvUm90YXRlQnV0dG9uPlxuICAgICAgICAgIDxOZWVkbGVCdXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y3NzKHsgLi4ucHJvcHMubmVlZGxlU3R5bGUgfSl9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIG1hcEhvb2subWFwPy5zZXRCZWFyaW5nKDApO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8TmVlZGxlQ29udGFpbmVyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBcInJvdGF0ZShcIiArIGJlYXJpbmcgKyBcImRlZylcIixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5lZWRsZUljb24gLz5cbiAgICAgICAgICAgIDwvTmVlZGxlQ29udGFpbmVyPlxuICAgICAgICAgIDwvTmVlZGxlQnV0dG9uPlxuICAgICAgICAgIDxSb3RhdGVCdXR0b24gY2xhc3NOYW1lPXtjc3MoeyAuLi5wcm9wcy5yb3RhdGVMZWZ0U3R5bGUgfSl9PlxuICAgICAgICAgICAgPFJvdGF0ZUxlZnRJY29uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmVhcmluZyA9IE1hdGgucm91bmQobWFwSG9vay5tYXA/LmdldEJlYXJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3QgPSBNYXRoLnJvdW5kKGJlYXJpbmcgJSA5MCk7XG4gICAgICAgICAgICAgICAgaWYgKGJlYXJpbmcgPCAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTAgKyByZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmVzdCA9IDkwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBIb29rLm1hcD8uc2V0QmVhcmluZyhNYXRoLnJvdW5kKGJlYXJpbmcgLSBNYXRoLmFicyhyZXN0KSkpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPjwvUm90YXRlTGVmdEljb24+XG4gICAgICAgICAgPC9Sb3RhdGVCdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC8+XG4gICk7XG59O1xuXG5NbE5hdmlnYXRpb25Db21wYXNzLnByb3BUeXBlcyA9IHtcbiAgLyoqXG4gICAqIENvbXBvbmVudCBpZCBwcmVmaXhcbiAgICovXG4gIGlkUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIGJhY2tncm91bmQuXG4gICAqL1xuICBiYWNrZ3JvdW5kU3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIC8qKlxuICAgKiBTdHlsZSBvYmplY3QgdG8gYWRqdXN0IGNzcyBkZWZpbml0aW9ucyBvZiB0aGUgY29tcGFzcyBuZWVkbGUuXG4gICAqL1xuICBuZWVkbGVTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSByb3RhdGUgcmlnaHQgYnV0dG9uLlxuICAgKi9cbiAgcm90YXRlUmlnaHRTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSByb3RhdGUgbGVmdCBidXR0b24uXG4gICAqL1xuICByb3RhdGVMZWZ0U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBNbE5hdmlnYXRpb25Db21wYXNzO1xuIl19 */")
  }, /*#__PURE__*/React__default.createElement(RotateButton, {
    className: /*#__PURE__*/css({ ...props.rotateRightStyle
    }, process.env.NODE_ENV === "production" ? "" : ";label:MlNavigationCompass;", process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1sTmF2aWdhdGlvbkNvbXBhc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBbUltQyIsImZpbGUiOiJNbE5hdmlnYXRpb25Db21wYXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcblxuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgUm90YXRlUmlnaHRJY29uIH0gZnJvbSBcIi4vYXNzZXRzL3JvdGF0ZV9yaWdodC5zdmdcIjtcbmltcG9ydCB7IFJlYWN0Q29tcG9uZW50IGFzIFJvdGF0ZUxlZnRJY29uIH0gZnJvbSBcIi4vYXNzZXRzL3JvdGF0ZV9sZWZ0LnN2Z1wiO1xuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgTmVlZGxlSWNvbiB9IGZyb20gXCIuL2Fzc2V0cy9uZWVkbGUuc3ZnXCI7XG5cbmltcG9ydCBzdHlsZWQgZnJvbSBcIkBlbW90aW9uL3N0eWxlZFwiO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSBcIkBlbW90aW9uL2Nzc1wiO1xuaW1wb3J0IHVzZU1hcCBmcm9tIFwiLi4vLi4vaG9va3MvdXNlTWFwXCI7XG5cbmNvbnN0IE5lZWRsZUJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiA0MCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgJjpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIHBhdGgge1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCAxNXB4IHJnYmEoMCwgMCwgMCwgMC4yKSk7XG4gIH1cbiAgJjpob3ZlciBwYXRoIHtcbiAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDBweCAwcHggMTNweCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkpO1xuICB9XG4gIHBhdGg6bnRoLW9mLXR5cGUoMikge1xuICAgIGZpbGw6ICMzNDM0MzQ7XG4gIH1cbiAgJjpob3ZlciBwYXRoOm50aC1vZi10eXBlKDIpIHtcbiAgICBmaWxsOiAjNDM0MzQzO1xuICB9XG4gIHBhdGg6bnRoLW9mLXR5cGUoMSkge1xuICAgIGZpbGw6ICNlOTAzMTg7XG4gIH1cbiAgJjpob3ZlciBwYXRoOm50aC1vZi10eXBlKDEpIHtcbiAgICBmaWxsOiAjZmI0MDUyO1xuICB9XG5gO1xuY29uc3QgTmVlZGxlQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHotaW5kZXg6IDEwMDI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICBtYXJnaW4tbGVmdDogLTMwJTtcbiAgcGF0aDpudGgtb2YtdHlwZSgyKSB7XG4gIH1cbiAgc3ZnIGcge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC03Ni43MDUzLCAtMjkuNzcyNykgc2NhbGUoMiwgMSk7XG4gIH1cbiAgc3ZnIHtcbiAgICB6LWluZGV4OiA5OTkwO1xuICAgIGhlaWdodDogMTUwcHg7XG4gICAgd2lkdGg6IDIwMHB4O1xuICB9XG5gO1xuY29uc3QgUm90YXRlQnV0dG9uID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDMwJTtcbiAgbWFyZ2luLXRvcDogMTRweDtcbiAgei1pbmRleDogOTk5O1xuICBkaXNwbGF5OiBmbGV4O1xuXG4gIHN2Zzpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIHN2Zzpob3ZlciBwYXRoIHtcbiAgICBmaWxsOiAjZWNlY2VjO1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCA1cHggcmdiYSgwLCAwLCAwLCAwLjEpKTtcbiAgfVxuICBwYXRoIHtcbiAgICBmaWxsOiAjYmJiO1xuICB9XG4gIHN2ZyB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpO1xuICAgIHotaW5kZXg6IDk5OTA7XG4gICAgaGVpZ2h0OiAxNzJweDtcbiAgfVxuYDtcblxuLyoqXG4gKiBOYXZpZ2F0aW9uIGNvbXBvbmVudCB0aGF0IGRpc3BsYXlzIGEgY29tcGFzcyBjb21wb25lbnQgd2hpY2ggaW5kaWNhdGVzIHRoZSBjdXJyZW50IG9yaWFudGF0aW9uIG9mIHRoZSBtYXAgaXQgaXMgcmVnaXN0ZXJlZCBmb3IgYW5kIG9mZmVycyBjb250cm9scyB0byB0dXJuIHRoZSBiZWFyaW5nIDkwwrAgbGVmdC9yaWdodCBvciByZXNldCBub3J0aCB0byBwb2ludCB1cC5cbiAqXG4gKiBBbGwgc3R5bGUgcHJvcHMgYXJlIGFwcGxpZWQgdXNpbmcgQGVtb3Rpb24vY3NzIHRvIGFsbG93IG1vcmUgY29tcGxleCBjc3Mgc2VsZWN0b3JzLlxuICpcbiAqIEBjb21wb25lbnRcbiAqL1xuY29uc3QgTWxOYXZpZ2F0aW9uQ29tcGFzcyA9IChwcm9wcykgPT4ge1xuICBjb25zdCBtYXBIb29rID0gdXNlTWFwKHsgbWFwSWQ6IHByb3BzLm1hcElkLCB3YWl0Rm9yTGF5ZXI6IHByb3BzLmluc2VydEJlZm9yZUxheWVyIH0pO1xuICBjb25zdCBbYmVhcmluZywgc2V0QmVhcmluZ10gPSB1c2VTdGF0ZSgwKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbWFwSG9vay5tYXApIHJldHVybjtcblxuICAgIGxldCBfdXBkYXRlQmVhcmluZyA9ICgpID0+IHtcbiAgICAgIHNldEJlYXJpbmcoTWF0aC5yb3VuZChtYXBIb29rLm1hcC5nZXRCZWFyaW5nKCkpKTtcbiAgICB9O1xuXG4gICAgbWFwSG9vay5tYXAub24oXCJyb3RhdGVcIiwgX3VwZGF0ZUJlYXJpbmcsIG1hcEhvb2suY29tcG9uZW50SWQpO1xuICAgIF91cGRhdGVCZWFyaW5nKCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgbWFwSG9vay5tYXAub2ZmKFwicm90YXRlXCIsIF91cGRhdGVCZWFyaW5nKTtcbiAgICB9O1xuICB9LCBbbWFwSG9vay5tYXAsIHByb3BzLm1hcElkXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2Nzcyh7XG4gICAgICAgICAgekluZGV4OiAxMDAwLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuICAgICAgICAgIC4uLnByb3BzLnN0eWxlLFxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y3NzKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMTBweCBzb2xpZCAjYmNiY2JjXCIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzcxNzE3MVwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJyYWRpYWwtZ3JhZGllbnQoIzcxNzE3MSwgIzQxNDE0MSlcIixcbiAgICAgICAgICAgIGhlaWdodDogXCIyMDBweFwiLFxuICAgICAgICAgICAgd2lkdGg6IFwiMjAwcHhcIixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCI1MCVcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMC4yKSB0cmFuc2xhdGVYKC00NDhweCkgdHJhbnNsYXRlWSgtNDQ4cHgpXCIsXG4gICAgICAgICAgICAuLi5wcm9wcy5iYWNrZ3JvdW5kU3R5bGUsXG4gICAgICAgICAgfSl9XG4gICAgICAgID5cbiAgICAgICAgICA8Um90YXRlQnV0dG9uIGNsYXNzTmFtZT17Y3NzKHsgLi4ucHJvcHMucm90YXRlUmlnaHRTdHlsZSB9KX0+XG4gICAgICAgICAgICA8Um90YXRlUmlnaHRJY29uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmVhcmluZyA9IE1hdGgucm91bmQobWFwSG9vay5tYXA/LmdldEJlYXJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3QgPSBNYXRoLnJvdW5kKGJlYXJpbmcgJSA5MCk7XG4gICAgICAgICAgICAgICAgaWYgKGJlYXJpbmcgPiAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTAgLSByZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmVzdCA9IDkwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBIb29rLm1hcD8uc2V0QmVhcmluZyhNYXRoLnJvdW5kKGJlYXJpbmcgKyBNYXRoLmFicyhyZXN0KSkpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPjwvUm90YXRlUmlnaHRJY29uPlxuICAgICAgICAgIDwvUm90YXRlQnV0dG9uPlxuICAgICAgICAgIDxOZWVkbGVCdXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y3NzKHsgLi4ucHJvcHMubmVlZGxlU3R5bGUgfSl9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIG1hcEhvb2subWFwPy5zZXRCZWFyaW5nKDApO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8TmVlZGxlQ29udGFpbmVyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBcInJvdGF0ZShcIiArIGJlYXJpbmcgKyBcImRlZylcIixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5lZWRsZUljb24gLz5cbiAgICAgICAgICAgIDwvTmVlZGxlQ29udGFpbmVyPlxuICAgICAgICAgIDwvTmVlZGxlQnV0dG9uPlxuICAgICAgICAgIDxSb3RhdGVCdXR0b24gY2xhc3NOYW1lPXtjc3MoeyAuLi5wcm9wcy5yb3RhdGVMZWZ0U3R5bGUgfSl9PlxuICAgICAgICAgICAgPFJvdGF0ZUxlZnRJY29uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmVhcmluZyA9IE1hdGgucm91bmQobWFwSG9vay5tYXA/LmdldEJlYXJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3QgPSBNYXRoLnJvdW5kKGJlYXJpbmcgJSA5MCk7XG4gICAgICAgICAgICAgICAgaWYgKGJlYXJpbmcgPCAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTAgKyByZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmVzdCA9IDkwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBIb29rLm1hcD8uc2V0QmVhcmluZyhNYXRoLnJvdW5kKGJlYXJpbmcgLSBNYXRoLmFicyhyZXN0KSkpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPjwvUm90YXRlTGVmdEljb24+XG4gICAgICAgICAgPC9Sb3RhdGVCdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC8+XG4gICk7XG59O1xuXG5NbE5hdmlnYXRpb25Db21wYXNzLnByb3BUeXBlcyA9IHtcbiAgLyoqXG4gICAqIENvbXBvbmVudCBpZCBwcmVmaXhcbiAgICovXG4gIGlkUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIGJhY2tncm91bmQuXG4gICAqL1xuICBiYWNrZ3JvdW5kU3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIC8qKlxuICAgKiBTdHlsZSBvYmplY3QgdG8gYWRqdXN0IGNzcyBkZWZpbml0aW9ucyBvZiB0aGUgY29tcGFzcyBuZWVkbGUuXG4gICAqL1xuICBuZWVkbGVTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSByb3RhdGUgcmlnaHQgYnV0dG9uLlxuICAgKi9cbiAgcm90YXRlUmlnaHRTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSByb3RhdGUgbGVmdCBidXR0b24uXG4gICAqL1xuICByb3RhdGVMZWZ0U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBNbE5hdmlnYXRpb25Db21wYXNzO1xuIl19 */")
  }, /*#__PURE__*/React__default.createElement(SvgRotateRight, {
    onClick: () => {
      var _mapHook$map, _mapHook$map2;

      let bearing = Math.round((_mapHook$map = mapHook.map) === null || _mapHook$map === void 0 ? void 0 : _mapHook$map.getBearing());
      let rest = Math.round(bearing % 90);

      if (bearing > 0) {
        rest = 90 - rest;
      }

      if (rest === 0) {
        rest = 90;
      }

      (_mapHook$map2 = mapHook.map) === null || _mapHook$map2 === void 0 ? void 0 : _mapHook$map2.setBearing(Math.round(bearing + Math.abs(rest)));
    }
  })), /*#__PURE__*/React__default.createElement(NeedleButton, {
    className: /*#__PURE__*/css({ ...props.needleStyle
    }, process.env.NODE_ENV === "production" ? "" : ";label:MlNavigationCompass;", process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1sTmF2aWdhdGlvbkNvbXBhc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBbUp1QiIsImZpbGUiOiJNbE5hdmlnYXRpb25Db21wYXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcblxuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgUm90YXRlUmlnaHRJY29uIH0gZnJvbSBcIi4vYXNzZXRzL3JvdGF0ZV9yaWdodC5zdmdcIjtcbmltcG9ydCB7IFJlYWN0Q29tcG9uZW50IGFzIFJvdGF0ZUxlZnRJY29uIH0gZnJvbSBcIi4vYXNzZXRzL3JvdGF0ZV9sZWZ0LnN2Z1wiO1xuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgTmVlZGxlSWNvbiB9IGZyb20gXCIuL2Fzc2V0cy9uZWVkbGUuc3ZnXCI7XG5cbmltcG9ydCBzdHlsZWQgZnJvbSBcIkBlbW90aW9uL3N0eWxlZFwiO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSBcIkBlbW90aW9uL2Nzc1wiO1xuaW1wb3J0IHVzZU1hcCBmcm9tIFwiLi4vLi4vaG9va3MvdXNlTWFwXCI7XG5cbmNvbnN0IE5lZWRsZUJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiA0MCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgJjpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIHBhdGgge1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCAxNXB4IHJnYmEoMCwgMCwgMCwgMC4yKSk7XG4gIH1cbiAgJjpob3ZlciBwYXRoIHtcbiAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDBweCAwcHggMTNweCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkpO1xuICB9XG4gIHBhdGg6bnRoLW9mLXR5cGUoMikge1xuICAgIGZpbGw6ICMzNDM0MzQ7XG4gIH1cbiAgJjpob3ZlciBwYXRoOm50aC1vZi10eXBlKDIpIHtcbiAgICBmaWxsOiAjNDM0MzQzO1xuICB9XG4gIHBhdGg6bnRoLW9mLXR5cGUoMSkge1xuICAgIGZpbGw6ICNlOTAzMTg7XG4gIH1cbiAgJjpob3ZlciBwYXRoOm50aC1vZi10eXBlKDEpIHtcbiAgICBmaWxsOiAjZmI0MDUyO1xuICB9XG5gO1xuY29uc3QgTmVlZGxlQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHotaW5kZXg6IDEwMDI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICBtYXJnaW4tbGVmdDogLTMwJTtcbiAgcGF0aDpudGgtb2YtdHlwZSgyKSB7XG4gIH1cbiAgc3ZnIGcge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC03Ni43MDUzLCAtMjkuNzcyNykgc2NhbGUoMiwgMSk7XG4gIH1cbiAgc3ZnIHtcbiAgICB6LWluZGV4OiA5OTkwO1xuICAgIGhlaWdodDogMTUwcHg7XG4gICAgd2lkdGg6IDIwMHB4O1xuICB9XG5gO1xuY29uc3QgUm90YXRlQnV0dG9uID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDMwJTtcbiAgbWFyZ2luLXRvcDogMTRweDtcbiAgei1pbmRleDogOTk5O1xuICBkaXNwbGF5OiBmbGV4O1xuXG4gIHN2Zzpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIHN2Zzpob3ZlciBwYXRoIHtcbiAgICBmaWxsOiAjZWNlY2VjO1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCA1cHggcmdiYSgwLCAwLCAwLCAwLjEpKTtcbiAgfVxuICBwYXRoIHtcbiAgICBmaWxsOiAjYmJiO1xuICB9XG4gIHN2ZyB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpO1xuICAgIHotaW5kZXg6IDk5OTA7XG4gICAgaGVpZ2h0OiAxNzJweDtcbiAgfVxuYDtcblxuLyoqXG4gKiBOYXZpZ2F0aW9uIGNvbXBvbmVudCB0aGF0IGRpc3BsYXlzIGEgY29tcGFzcyBjb21wb25lbnQgd2hpY2ggaW5kaWNhdGVzIHRoZSBjdXJyZW50IG9yaWFudGF0aW9uIG9mIHRoZSBtYXAgaXQgaXMgcmVnaXN0ZXJlZCBmb3IgYW5kIG9mZmVycyBjb250cm9scyB0byB0dXJuIHRoZSBiZWFyaW5nIDkwwrAgbGVmdC9yaWdodCBvciByZXNldCBub3J0aCB0byBwb2ludCB1cC5cbiAqXG4gKiBBbGwgc3R5bGUgcHJvcHMgYXJlIGFwcGxpZWQgdXNpbmcgQGVtb3Rpb24vY3NzIHRvIGFsbG93IG1vcmUgY29tcGxleCBjc3Mgc2VsZWN0b3JzLlxuICpcbiAqIEBjb21wb25lbnRcbiAqL1xuY29uc3QgTWxOYXZpZ2F0aW9uQ29tcGFzcyA9IChwcm9wcykgPT4ge1xuICBjb25zdCBtYXBIb29rID0gdXNlTWFwKHsgbWFwSWQ6IHByb3BzLm1hcElkLCB3YWl0Rm9yTGF5ZXI6IHByb3BzLmluc2VydEJlZm9yZUxheWVyIH0pO1xuICBjb25zdCBbYmVhcmluZywgc2V0QmVhcmluZ10gPSB1c2VTdGF0ZSgwKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbWFwSG9vay5tYXApIHJldHVybjtcblxuICAgIGxldCBfdXBkYXRlQmVhcmluZyA9ICgpID0+IHtcbiAgICAgIHNldEJlYXJpbmcoTWF0aC5yb3VuZChtYXBIb29rLm1hcC5nZXRCZWFyaW5nKCkpKTtcbiAgICB9O1xuXG4gICAgbWFwSG9vay5tYXAub24oXCJyb3RhdGVcIiwgX3VwZGF0ZUJlYXJpbmcsIG1hcEhvb2suY29tcG9uZW50SWQpO1xuICAgIF91cGRhdGVCZWFyaW5nKCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgbWFwSG9vay5tYXAub2ZmKFwicm90YXRlXCIsIF91cGRhdGVCZWFyaW5nKTtcbiAgICB9O1xuICB9LCBbbWFwSG9vay5tYXAsIHByb3BzLm1hcElkXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2Nzcyh7XG4gICAgICAgICAgekluZGV4OiAxMDAwLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuICAgICAgICAgIC4uLnByb3BzLnN0eWxlLFxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y3NzKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMTBweCBzb2xpZCAjYmNiY2JjXCIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzcxNzE3MVwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJyYWRpYWwtZ3JhZGllbnQoIzcxNzE3MSwgIzQxNDE0MSlcIixcbiAgICAgICAgICAgIGhlaWdodDogXCIyMDBweFwiLFxuICAgICAgICAgICAgd2lkdGg6IFwiMjAwcHhcIixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCI1MCVcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMC4yKSB0cmFuc2xhdGVYKC00NDhweCkgdHJhbnNsYXRlWSgtNDQ4cHgpXCIsXG4gICAgICAgICAgICAuLi5wcm9wcy5iYWNrZ3JvdW5kU3R5bGUsXG4gICAgICAgICAgfSl9XG4gICAgICAgID5cbiAgICAgICAgICA8Um90YXRlQnV0dG9uIGNsYXNzTmFtZT17Y3NzKHsgLi4ucHJvcHMucm90YXRlUmlnaHRTdHlsZSB9KX0+XG4gICAgICAgICAgICA8Um90YXRlUmlnaHRJY29uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmVhcmluZyA9IE1hdGgucm91bmQobWFwSG9vay5tYXA/LmdldEJlYXJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3QgPSBNYXRoLnJvdW5kKGJlYXJpbmcgJSA5MCk7XG4gICAgICAgICAgICAgICAgaWYgKGJlYXJpbmcgPiAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTAgLSByZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmVzdCA9IDkwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBIb29rLm1hcD8uc2V0QmVhcmluZyhNYXRoLnJvdW5kKGJlYXJpbmcgKyBNYXRoLmFicyhyZXN0KSkpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPjwvUm90YXRlUmlnaHRJY29uPlxuICAgICAgICAgIDwvUm90YXRlQnV0dG9uPlxuICAgICAgICAgIDxOZWVkbGVCdXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y3NzKHsgLi4ucHJvcHMubmVlZGxlU3R5bGUgfSl9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIG1hcEhvb2subWFwPy5zZXRCZWFyaW5nKDApO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8TmVlZGxlQ29udGFpbmVyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBcInJvdGF0ZShcIiArIGJlYXJpbmcgKyBcImRlZylcIixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5lZWRsZUljb24gLz5cbiAgICAgICAgICAgIDwvTmVlZGxlQ29udGFpbmVyPlxuICAgICAgICAgIDwvTmVlZGxlQnV0dG9uPlxuICAgICAgICAgIDxSb3RhdGVCdXR0b24gY2xhc3NOYW1lPXtjc3MoeyAuLi5wcm9wcy5yb3RhdGVMZWZ0U3R5bGUgfSl9PlxuICAgICAgICAgICAgPFJvdGF0ZUxlZnRJY29uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmVhcmluZyA9IE1hdGgucm91bmQobWFwSG9vay5tYXA/LmdldEJlYXJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3QgPSBNYXRoLnJvdW5kKGJlYXJpbmcgJSA5MCk7XG4gICAgICAgICAgICAgICAgaWYgKGJlYXJpbmcgPCAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTAgKyByZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmVzdCA9IDkwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBIb29rLm1hcD8uc2V0QmVhcmluZyhNYXRoLnJvdW5kKGJlYXJpbmcgLSBNYXRoLmFicyhyZXN0KSkpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPjwvUm90YXRlTGVmdEljb24+XG4gICAgICAgICAgPC9Sb3RhdGVCdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC8+XG4gICk7XG59O1xuXG5NbE5hdmlnYXRpb25Db21wYXNzLnByb3BUeXBlcyA9IHtcbiAgLyoqXG4gICAqIENvbXBvbmVudCBpZCBwcmVmaXhcbiAgICovXG4gIGlkUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIGJhY2tncm91bmQuXG4gICAqL1xuICBiYWNrZ3JvdW5kU3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIC8qKlxuICAgKiBTdHlsZSBvYmplY3QgdG8gYWRqdXN0IGNzcyBkZWZpbml0aW9ucyBvZiB0aGUgY29tcGFzcyBuZWVkbGUuXG4gICAqL1xuICBuZWVkbGVTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSByb3RhdGUgcmlnaHQgYnV0dG9uLlxuICAgKi9cbiAgcm90YXRlUmlnaHRTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSByb3RhdGUgbGVmdCBidXR0b24uXG4gICAqL1xuICByb3RhdGVMZWZ0U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBNbE5hdmlnYXRpb25Db21wYXNzO1xuIl19 */"),
    onClick: () => {
      var _mapHook$map3;

      (_mapHook$map3 = mapHook.map) === null || _mapHook$map3 === void 0 ? void 0 : _mapHook$map3.setBearing(0);
    }
  }, /*#__PURE__*/React__default.createElement(NeedleContainer, {
    style: {
      transform: "rotate(" + bearing + "deg)"
    }
  }, /*#__PURE__*/React__default.createElement(SvgNeedle, null))), /*#__PURE__*/React__default.createElement(RotateButton, {
    className: /*#__PURE__*/css({ ...props.rotateLeftStyle
    }, process.env.NODE_ENV === "production" ? "" : ";label:MlNavigationCompass;", process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1sTmF2aWdhdGlvbkNvbXBhc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBZ0ttQyIsImZpbGUiOiJNbE5hdmlnYXRpb25Db21wYXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcblxuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgUm90YXRlUmlnaHRJY29uIH0gZnJvbSBcIi4vYXNzZXRzL3JvdGF0ZV9yaWdodC5zdmdcIjtcbmltcG9ydCB7IFJlYWN0Q29tcG9uZW50IGFzIFJvdGF0ZUxlZnRJY29uIH0gZnJvbSBcIi4vYXNzZXRzL3JvdGF0ZV9sZWZ0LnN2Z1wiO1xuaW1wb3J0IHsgUmVhY3RDb21wb25lbnQgYXMgTmVlZGxlSWNvbiB9IGZyb20gXCIuL2Fzc2V0cy9uZWVkbGUuc3ZnXCI7XG5cbmltcG9ydCBzdHlsZWQgZnJvbSBcIkBlbW90aW9uL3N0eWxlZFwiO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSBcIkBlbW90aW9uL2Nzc1wiO1xuaW1wb3J0IHVzZU1hcCBmcm9tIFwiLi4vLi4vaG9va3MvdXNlTWFwXCI7XG5cbmNvbnN0IE5lZWRsZUJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIHdpZHRoOiA0MCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgJjpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIHBhdGgge1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCAxNXB4IHJnYmEoMCwgMCwgMCwgMC4yKSk7XG4gIH1cbiAgJjpob3ZlciBwYXRoIHtcbiAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDBweCAwcHggMTNweCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkpO1xuICB9XG4gIHBhdGg6bnRoLW9mLXR5cGUoMikge1xuICAgIGZpbGw6ICMzNDM0MzQ7XG4gIH1cbiAgJjpob3ZlciBwYXRoOm50aC1vZi10eXBlKDIpIHtcbiAgICBmaWxsOiAjNDM0MzQzO1xuICB9XG4gIHBhdGg6bnRoLW9mLXR5cGUoMSkge1xuICAgIGZpbGw6ICNlOTAzMTg7XG4gIH1cbiAgJjpob3ZlciBwYXRoOm50aC1vZi10eXBlKDEpIHtcbiAgICBmaWxsOiAjZmI0MDUyO1xuICB9XG5gO1xuY29uc3QgTmVlZGxlQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHotaW5kZXg6IDEwMDI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICBtYXJnaW4tbGVmdDogLTMwJTtcbiAgcGF0aDpudGgtb2YtdHlwZSgyKSB7XG4gIH1cbiAgc3ZnIGcge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC03Ni43MDUzLCAtMjkuNzcyNykgc2NhbGUoMiwgMSk7XG4gIH1cbiAgc3ZnIHtcbiAgICB6LWluZGV4OiA5OTkwO1xuICAgIGhlaWdodDogMTUwcHg7XG4gICAgd2lkdGg6IDIwMHB4O1xuICB9XG5gO1xuY29uc3QgUm90YXRlQnV0dG9uID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDMwJTtcbiAgbWFyZ2luLXRvcDogMTRweDtcbiAgei1pbmRleDogOTk5O1xuICBkaXNwbGF5OiBmbGV4O1xuXG4gIHN2Zzpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIHN2Zzpob3ZlciBwYXRoIHtcbiAgICBmaWxsOiAjZWNlY2VjO1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCA1cHggcmdiYSgwLCAwLCAwLCAwLjEpKTtcbiAgfVxuICBwYXRoIHtcbiAgICBmaWxsOiAjYmJiO1xuICB9XG4gIHN2ZyB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpO1xuICAgIHotaW5kZXg6IDk5OTA7XG4gICAgaGVpZ2h0OiAxNzJweDtcbiAgfVxuYDtcblxuLyoqXG4gKiBOYXZpZ2F0aW9uIGNvbXBvbmVudCB0aGF0IGRpc3BsYXlzIGEgY29tcGFzcyBjb21wb25lbnQgd2hpY2ggaW5kaWNhdGVzIHRoZSBjdXJyZW50IG9yaWFudGF0aW9uIG9mIHRoZSBtYXAgaXQgaXMgcmVnaXN0ZXJlZCBmb3IgYW5kIG9mZmVycyBjb250cm9scyB0byB0dXJuIHRoZSBiZWFyaW5nIDkwwrAgbGVmdC9yaWdodCBvciByZXNldCBub3J0aCB0byBwb2ludCB1cC5cbiAqXG4gKiBBbGwgc3R5bGUgcHJvcHMgYXJlIGFwcGxpZWQgdXNpbmcgQGVtb3Rpb24vY3NzIHRvIGFsbG93IG1vcmUgY29tcGxleCBjc3Mgc2VsZWN0b3JzLlxuICpcbiAqIEBjb21wb25lbnRcbiAqL1xuY29uc3QgTWxOYXZpZ2F0aW9uQ29tcGFzcyA9IChwcm9wcykgPT4ge1xuICBjb25zdCBtYXBIb29rID0gdXNlTWFwKHsgbWFwSWQ6IHByb3BzLm1hcElkLCB3YWl0Rm9yTGF5ZXI6IHByb3BzLmluc2VydEJlZm9yZUxheWVyIH0pO1xuICBjb25zdCBbYmVhcmluZywgc2V0QmVhcmluZ10gPSB1c2VTdGF0ZSgwKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbWFwSG9vay5tYXApIHJldHVybjtcblxuICAgIGxldCBfdXBkYXRlQmVhcmluZyA9ICgpID0+IHtcbiAgICAgIHNldEJlYXJpbmcoTWF0aC5yb3VuZChtYXBIb29rLm1hcC5nZXRCZWFyaW5nKCkpKTtcbiAgICB9O1xuXG4gICAgbWFwSG9vay5tYXAub24oXCJyb3RhdGVcIiwgX3VwZGF0ZUJlYXJpbmcsIG1hcEhvb2suY29tcG9uZW50SWQpO1xuICAgIF91cGRhdGVCZWFyaW5nKCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgbWFwSG9vay5tYXAub2ZmKFwicm90YXRlXCIsIF91cGRhdGVCZWFyaW5nKTtcbiAgICB9O1xuICB9LCBbbWFwSG9vay5tYXAsIHByb3BzLm1hcElkXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2Nzcyh7XG4gICAgICAgICAgekluZGV4OiAxMDAwLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuICAgICAgICAgIC4uLnByb3BzLnN0eWxlLFxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y3NzKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMTBweCBzb2xpZCAjYmNiY2JjXCIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzcxNzE3MVwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJyYWRpYWwtZ3JhZGllbnQoIzcxNzE3MSwgIzQxNDE0MSlcIixcbiAgICAgICAgICAgIGhlaWdodDogXCIyMDBweFwiLFxuICAgICAgICAgICAgd2lkdGg6IFwiMjAwcHhcIixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCI1MCVcIixcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMC4yKSB0cmFuc2xhdGVYKC00NDhweCkgdHJhbnNsYXRlWSgtNDQ4cHgpXCIsXG4gICAgICAgICAgICAuLi5wcm9wcy5iYWNrZ3JvdW5kU3R5bGUsXG4gICAgICAgICAgfSl9XG4gICAgICAgID5cbiAgICAgICAgICA8Um90YXRlQnV0dG9uIGNsYXNzTmFtZT17Y3NzKHsgLi4ucHJvcHMucm90YXRlUmlnaHRTdHlsZSB9KX0+XG4gICAgICAgICAgICA8Um90YXRlUmlnaHRJY29uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmVhcmluZyA9IE1hdGgucm91bmQobWFwSG9vay5tYXA/LmdldEJlYXJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3QgPSBNYXRoLnJvdW5kKGJlYXJpbmcgJSA5MCk7XG4gICAgICAgICAgICAgICAgaWYgKGJlYXJpbmcgPiAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTAgLSByZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmVzdCA9IDkwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBIb29rLm1hcD8uc2V0QmVhcmluZyhNYXRoLnJvdW5kKGJlYXJpbmcgKyBNYXRoLmFicyhyZXN0KSkpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPjwvUm90YXRlUmlnaHRJY29uPlxuICAgICAgICAgIDwvUm90YXRlQnV0dG9uPlxuICAgICAgICAgIDxOZWVkbGVCdXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y3NzKHsgLi4ucHJvcHMubmVlZGxlU3R5bGUgfSl9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIG1hcEhvb2subWFwPy5zZXRCZWFyaW5nKDApO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8TmVlZGxlQ29udGFpbmVyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBcInJvdGF0ZShcIiArIGJlYXJpbmcgKyBcImRlZylcIixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE5lZWRsZUljb24gLz5cbiAgICAgICAgICAgIDwvTmVlZGxlQ29udGFpbmVyPlxuICAgICAgICAgIDwvTmVlZGxlQnV0dG9uPlxuICAgICAgICAgIDxSb3RhdGVCdXR0b24gY2xhc3NOYW1lPXtjc3MoeyAuLi5wcm9wcy5yb3RhdGVMZWZ0U3R5bGUgfSl9PlxuICAgICAgICAgICAgPFJvdGF0ZUxlZnRJY29uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmVhcmluZyA9IE1hdGgucm91bmQobWFwSG9vay5tYXA/LmdldEJlYXJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3QgPSBNYXRoLnJvdW5kKGJlYXJpbmcgJSA5MCk7XG4gICAgICAgICAgICAgICAgaWYgKGJlYXJpbmcgPCAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN0ID0gOTAgKyByZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgcmVzdCA9IDkwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXBIb29rLm1hcD8uc2V0QmVhcmluZyhNYXRoLnJvdW5kKGJlYXJpbmcgLSBNYXRoLmFicyhyZXN0KSkpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPjwvUm90YXRlTGVmdEljb24+XG4gICAgICAgICAgPC9Sb3RhdGVCdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC8+XG4gICk7XG59O1xuXG5NbE5hdmlnYXRpb25Db21wYXNzLnByb3BUeXBlcyA9IHtcbiAgLyoqXG4gICAqIENvbXBvbmVudCBpZCBwcmVmaXhcbiAgICovXG4gIGlkUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAvKipcbiAgICogU3R5bGUgb2JqZWN0IHRvIGFkanVzdCBjc3MgZGVmaW5pdGlvbnMgb2YgdGhlIGJhY2tncm91bmQuXG4gICAqL1xuICBiYWNrZ3JvdW5kU3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIC8qKlxuICAgKiBTdHlsZSBvYmplY3QgdG8gYWRqdXN0IGNzcyBkZWZpbml0aW9ucyBvZiB0aGUgY29tcGFzcyBuZWVkbGUuXG4gICAqL1xuICBuZWVkbGVTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSByb3RhdGUgcmlnaHQgYnV0dG9uLlxuICAgKi9cbiAgcm90YXRlUmlnaHRTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgLyoqXG4gICAqIFN0eWxlIG9iamVjdCB0byBhZGp1c3QgY3NzIGRlZmluaXRpb25zIG9mIHRoZSByb3RhdGUgbGVmdCBidXR0b24uXG4gICAqL1xuICByb3RhdGVMZWZ0U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBNbE5hdmlnYXRpb25Db21wYXNzO1xuIl19 */")
  }, /*#__PURE__*/React__default.createElement(SvgRotateLeft, {
    onClick: () => {
      var _mapHook$map4, _mapHook$map5;

      let bearing = Math.round((_mapHook$map4 = mapHook.map) === null || _mapHook$map4 === void 0 ? void 0 : _mapHook$map4.getBearing());
      let rest = Math.round(bearing % 90);

      if (bearing < 0) {
        rest = 90 + rest;
      }

      if (rest === 0) {
        rest = 90;
      }

      (_mapHook$map5 = mapHook.map) === null || _mapHook$map5 === void 0 ? void 0 : _mapHook$map5.setBearing(Math.round(bearing - Math.abs(rest)));
    }
  })))));
};

MlNavigationCompass.propTypes = {
  /**
   * Component id prefix
   */
  idPrefix: PropTypes.string,

  /**
   * Style object to adjust css definitions of the component.
   */
  style: PropTypes.object,

  /**
   * Style object to adjust css definitions of the background.
   */
  backgroundStyle: PropTypes.object,

  /**
   * Style object to adjust css definitions of the compass needle.
   */
  needleStyle: PropTypes.object,

  /**
   * Style object to adjust css definitions of the rotate right button.
   */
  rotateRightStyle: PropTypes.object,

  /**
   * Style object to adjust css definitions of the rotate left button.
   */
  rotateLeftStyle: PropTypes.object
};

const MlNavigationTools = props => {
  const mapHook = useMap({
    mapId: props.mapId,
    waitForLayer: props.insertBeforeLayer
  });
  const [pitch, setPitch] = useState(0);
  const [locationAccessDenied, setLocationAccessDenied] = useState(false);
  const mediaIsMobile = useMediaQuery("(max-width:900px)");
  const buttonStyle = {
    minWidth: "20px",
    minHeight: "20px",
    width: mediaIsMobile ? "50px" : "30px",
    height: mediaIsMobile ? "50px" : "30px",
    backgroundColor: "#414141",
    borderRadius: "23%",
    //border: "1px solid #bbb",
    //boxShadow: "0px 0px 4px rgba(0,0,0,.5)",
    margin: 0.15,
    fontSize: mediaIsMobile ? "1.5em" : "1.2em",
    ":hover": {
      backgroundColor: "#515151"
    },
    color: "#ececec"
  };
  useEffect(() => {
    if (!mapHook.map) return;
    mapHook.map.on("pitchend", () => {
      setPitch(mapHook.map.getPitch());
    });
    setPitch(mapHook.map.getPitch());
  }, [mapHook.map, props.mapId]);

  const zoomIn = () => {
    if (!mapHook.map) return;

    if (mapHook.map.transform._zoom + 0.5 <= mapHook.map.transform._maxZoom) {
      mapHook.map.easeTo({
        zoom: mapHook.map.transform._zoom + 0.5
      });
    }
  };

  const zoomOut = () => {
    if (!mapHook.map) return;

    if (mapHook.map.transform._zoom - 0.5 >= mapHook.map.transform._minZoom) {
      mapHook.map.easeTo({
        zoom: mapHook.map.transform._zoom - 0.5
      });
    }
  };

  const adjustPitch = () => {
    if (!mapHook.map) return;
    let targetPitch = 60;

    if (mapHook.map.getPitch() !== 0) {
      targetPitch = 0;
    }

    mapHook.map.easeTo({
      pitch: targetPitch
    });
  };

  const moveToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(getLocationSuccess, getLocationError);
  };

  const getLocationSuccess = location => {
    mapHook.map.setCenter([location.coords.longitude, location.coords.latitude]);
  };

  const getLocationError = () => {
    console.log("Access of user location denied");
    setLocationAccessDenied(true);
  };

  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      zIndex: 501,
      position: "absolute",
      right: mediaIsMobile ? "15px" : "5px",
      bottom: mediaIsMobile ? "40px" : "20px",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React__default.createElement(MlNavigationCompass, {
    style: {
      width: "31px",
      position: "relative",
      height: mediaIsMobile ? "55px" : "45px",
      marginLeft: mediaIsMobile ? "3px" : "-5px",
      transform: mediaIsMobile ? "scale(1.6)" : "scale(1)"
    },
    backgroundStyle: {
      boxShadow: "0px 0px 18px rgba(0,0,0,.5)"
    }
  }), /*#__PURE__*/React__default.createElement(Button, {
    sx: { ...buttonStyle,
      fontWeight: 600
    },
    onClick: adjustPitch
  }, pitch ? "2D" : "3D"), /*#__PURE__*/React__default.createElement(Button, {
    sx: buttonStyle,
    onClick: moveToCurrentLocation,
    disabled: locationAccessDenied
  }, /*#__PURE__*/React__default.createElement(GpsFixedIcon, {
    sx: {
      fontSize: mediaIsMobile ? "1.5em" : "1.2em"
    }
  })), /*#__PURE__*/React__default.createElement(MlFollowGps, {
    style: { ...(_ref => {
        let {
          color,
          ...rest
        } = _ref;
        return rest;
      })(buttonStyle)
    }
  }), /*#__PURE__*/React__default.createElement(ButtonGroup, {
    orientation: "vertical",
    sx: {
      width: "50px",
      border: "none",
      Button: {
        minWidth: "20px !important",
        border: "none",
        padding: 0
      },
      "Button:hover": {
        border: "none"
      }
    }
  }, /*#__PURE__*/React__default.createElement(Button, {
    sx: { ...buttonStyle,
      color: "#ececec"
    },
    onClick: zoomIn
  }, /*#__PURE__*/React__default.createElement(ControlPointIcon, {
    sx: {
      fontSize: mediaIsMobile ? "1.5em" : "1.2em"
    }
  })), /*#__PURE__*/React__default.createElement(Button, {
    sx: { ...buttonStyle,
      color: "#ececec"
    },
    onClick: zoomOut
  }, /*#__PURE__*/React__default.createElement(RemoveCircleOutlineIcon, {
    sx: {
      fontSize: mediaIsMobile ? "1.5em" : "1.2em"
    }
  }))));
};

const MlLayer = props => {
  // Use a useRef hook to reference the layer object to be able to access it later inside useEffect hooks
  const mapContext = useContext(MapContext);
  const mapState = useMapState({
    mapId: props.mapId,
    watch: {
      viewport: false,
      layers: true,
      sources: false
    }
  });
  const layerInitializedRef = useRef(false);
  const mapRef = useRef(null);
  const componentId = useRef((props.layerId ? props.layerId : "MlLayer-") + v4());
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
    var _mapContext$getMap, _mapContext$getMap$ge;

    if (!mapContext.mapExists(props.mapId) || !((_mapContext$getMap = mapContext.getMap(props.mapId)) !== null && _mapContext$getMap !== void 0 && (_mapContext$getMap$ge = _mapContext$getMap.getLayer) !== null && _mapContext$getMap$ge !== void 0 && _mapContext$getMap$ge.call(_mapContext$getMap, layerId)) || !layerInitializedRef.current || !props.options) return; // the MapLibre-gl instance (mapContext.map) is accessible here
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
    if (!mapContext.mapExists(props.mapId) || layerInitializedRef.current) return; // the MapLibre-gl instance (mapContext.map) is accessible here
    // initialize the layer and add it to the MapLibre-gl instance or do something else with it
    //check if insertBeforeLayer exists

    if (props.insertBeforeLayer) {
      var _mapState$layers;

      let layerFound = false;
      mapState === null || mapState === void 0 ? void 0 : (_mapState$layers = mapState.layers) === null || _mapState$layers === void 0 ? void 0 : _mapState$layers.forEach(layer => {
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
      var _props$options, _props$options2;

      layerInitializedRef.current = true;
      mapRef.current.addLayer({
        id: layerId.current,
        type: "background",
        paint: {
          "background-color": "rgba(0,0,0,0)"
        },
        ...props.options
      }, props.insertBeforeLayer, componentId.current);
      layerPaintConfRef.current = JSON.stringify((_props$options = props.options) === null || _props$options === void 0 ? void 0 : _props$options.paint);
      layerLayoutConfRef.current = JSON.stringify((_props$options2 = props.options) === null || _props$options2 === void 0 ? void 0 : _props$options2.layout);
    }
  }, [mapContext.mapIds, mapContext, props, mapState.layers]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
};

/**
 * Adds a standard OSM tile layer to the maplibre-gl instancereference by
 * props.mapId
 *
 * @component
 */

const MlOsmLayer = props => {
  const mapHook = useMap({
    mapId: props.mapId,
    waitForLayer: props.insertBeforeLayer
  });
  const layerId = useRef(props.layerId || "MlOsmLayer-" + mapHook.componentId);
  useEffect(() => {
    if (!mapHook.map) return;
    mapHook.map.addSource(layerId.current, {
      type: "raster",
      tileSize: 256,
      ...props.sourceOptions
    }, mapHook.componentId);
    mapHook.map.addLayer({
      id: layerId.current,
      type: "raster",
      source: layerId.current,
      minzoom: 0,
      maxzoom: 22,
      ...props.layerOptions
    }, props.insertBeforeLayer, mapHook.componentId);
  }, [props, mapHook.map]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
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
  insertBeforeLayer: PropTypes.string
};

/**
 * Adds a vector-tile source and 0...n vector-tile-layers to the MapLibre instance referenced by
 * props.mapId
 *
 * @component
 */

const MlVectorTileLayer = props => {
  const mapHook = useMap({
    mapId: props.mapId,
    waitForLayer: props.insertBeforeLayer
  });
  const layerIdsRef = useRef({});
  const layerId = useRef(props.layerId || "MlVectorTileLayer-" + mapHook.componentId);
  const layerPaintConfsRef = useRef({});
  const layerLayoutConfsRef = useRef({});
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!mapHook.map || initializedRef.current) return;
    initializedRef.current = true; // Add the new layer to the openlayers instance once it is available

    mapHook.map.addSource(layerId.current, {
      type: "vector",
      tiles: [props.url],
      tileSize: 512,
      attribution: "",
      ...props.sourceOptions
    }, mapHook.componentId);

    for (let key in props.layers) {
      let _layerId = layerId.current + "_" + key;

      layerIdsRef.current[key] = _layerId;
      mapHook.map.addLayer({
        id: _layerId,
        source: layerId.current,
        type: "line",
        minzoom: 0,
        maxzoom: 22,
        layout: {},
        paint: {
          "line-opacity": 0.5,
          "line-color": "rgb(80, 80, 80)",
          "line-width": 2
        },
        ...props.layers[key]
      }, props.insertBeforeLayer, mapHook.componentId);
      layerPaintConfsRef.current[key] = JSON.stringify(props.layers[key].paint);
      layerLayoutConfsRef.current[key] = JSON.stringify(props.layers[key].layout);
    }
  }, [mapHook.map, props]);
  useEffect(() => {
    if (!mapHook.map || !initializedRef.current) return; // initialize the layer and add it to the MapLibre-gl instance or do something else with it

    for (var key in props.layers) {
      if (mapHook.map.getLayer(layerIdsRef.current[key])) {
        // update changed paint property
        let layerPaintConfString = JSON.stringify(props.layers[key].paint);

        if (layerPaintConfString !== layerPaintConfsRef.current[key]) {
          for (let paintKey in props.layers[key].paint) {
            mapHook.map.setPaintProperty(layerIdsRef.current[key], paintKey, props.layers[key].paint[paintKey]);
          }
        }

        layerPaintConfsRef.current[key] = layerPaintConfString; // update changed layout property

        let layerLayoutConfString = JSON.stringify(props.layers[key].layout);

        if (layerLayoutConfString !== layerLayoutConfsRef.current[key]) {
          for (let layoutKey in props.layers[key].layout) {
            mapHook.map.setLayoutProperty(layerIdsRef.current[key], layoutKey, props.layers[key].layout[layoutKey]);
          }
        }

        layerLayoutConfsRef.current[key] = layerLayoutConfString;
      }
    }
  }, [props.layers, mapHook.map]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
};

MlVectorTileLayer.propTypes = {
  /**
   * Id of the target MapLibre instance in mapContext
   */
  mapId: PropTypes.string,

  /**
   * Options object that will be used as first parameter on the MapLibreGl.addSource call see MapLibre source options documentation.
   */
  sourceOptions: PropTypes.object,

  /**
   * Object that hold layers
   */
  layers: PropTypes.object,

  /**
   * String of the URL of a wms layer
   */
  url: PropTypes.string
};

const defaultProps = {
  visible: true,
  urlParameters: {
    bbox: "{bbox-epsg-3857}",
    format: "image/png",
    service: "WMS",
    version: "1.1.1",
    request: "GetMap",
    srs: "EPSG:3857",
    width: 256,
    height: 256,
    styles: ""
  },
  attribution: "",
  sourceOptions: {
    minZoom: 0,
    maxZoom: 20
  },
  layerOptions: {
    minZoom: 0,
    maxZoom: 20
  }
};
/**
 * Adds a WMS raster source & layer to the maplibre-gl instance
 *
 * @param {object} props
 * @param {object} props.urlParameters URL query parameters that will be added to the WMS URL. A layers property (string) is mandatory. Any value defined on this attribute will extend the default object
 * @param {string} props.url WMS URL
 * @param {bool} props.visible Sets layer "visibility" property to "visible" if true or "none" if false
 * @param {string} props.attribution MapLibre attribution shown in the bottom right of the map, if this layer is visible
 * @param {string} props.mapId Id of the target MapLibre instance in mapContext
 * @param {object} props.sourceOptions Object that is passed to the MapLibre.addSource call as config option parameter
 * @param {object} props.layerOptions Object that is passed to the MapLibre.addLayer call as config option parameter
 * @param {string} props.insertBeforeLayer Id of an existing layer in the mapLibre instance to help specify the layer order
                                           This layer will be visually beneath the layer with the "insertBeforeLayer" id
 *
 * @component
 */

const MlWmsLayer = props => {
  const mapHook = useMap({
    mapId: props.mapId,
    waitForLayer: props.insertBeforeLayer
  });
  const initializedRef = useRef(false);
  const layerId = useRef(props.layerId || "MlWmsLayer-" + mapHook.componentId);
  useEffect(() => {
    var _propsUrlParams2;

    if (!mapHook.map || initializedRef.current) return;
    initializedRef.current = true;

    let _propsUrlParams;

    let _wmsUrl = props.url;

    if (props.url.indexOf("?") !== -1) {
      _propsUrlParams = props.url.split("?");
      _wmsUrl = _propsUrlParams[0];
    }

    let _urlParamsFromUrl = new URLSearchParams((_propsUrlParams2 = _propsUrlParams) === null || _propsUrlParams2 === void 0 ? void 0 : _propsUrlParams2[1]); // first spread in default props manually to enable overriding a single parameter without replacing the whole default urlParameters object


    let urlParamsObj = { ...defaultProps.urlParameters,
      ...Object.fromEntries(_urlParamsFromUrl),
      ...props.urlParameters
    };
    let urlParams = new URLSearchParams(urlParamsObj);
    let urlParamsStr = decodeURIComponent(urlParams.toString()) + "".replace(/%2F/g, "/").replace(/%3A/g, ":");
    mapHook.map.addSource(layerId.current, {
      type: "raster",
      tiles: [_wmsUrl + "?" + urlParamsStr],
      tileSize: urlParamsObj.width,
      attribution: props.attribution,
      ...props.sourceOptions
    }, mapHook.componentId);
    mapHook.map.addLayer({
      id: layerId.current,
      type: "raster",
      source: layerId.current,
      ...props.layerOptions
    }, props.insertBeforeLayer, mapHook.componentId);

    if (!props.visible) {
      mapHook.map.setLayoutProperty(layerId.current, "visibility", "none");
    }
  }, [mapHook, props]);
  useEffect(() => {
    if (!mapHook.map || !initializedRef.current) return; // toggle layer visibility by changing the layout object's visibility property

    if (props.visible) {
      mapHook.map.setLayoutProperty(layerId.current, "visibility", "visible");
    } else {
      mapHook.map.setLayoutProperty(layerId.current, "visibility", "none");
    }
  }, [props.visible, mapHook.map]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
};

MlWmsLayer.defaultProps = { ...defaultProps
};
MlWmsLayer.propTypes = {
  /**
   * WMS URL
   */
  url: PropTypes.string.isRequired,

  /**
   * URL query parameters that will be added to the WMS URL. A layers property (string) is mandatory. Any value defined on this attribute will extend the default object.
   */
  urlParameters: PropTypes.shape({
    layers: PropTypes.string.isRequired,
    bbox: PropTypes.string,
    format: PropTypes.string,
    service: PropTypes.string,
    version: PropTypes.string,
    request: PropTypes.string,
    srs: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number
  }),

  /**
   * Id of the target MapLibre instance in mapContext
   */
  mapId: PropTypes.string,

  /**
   * MapLibre attribution shown in the bottom right of the map, if this layer is visible
   */
  attribution: PropTypes.string,

  /**
   * Object that is passed to the MapLibre.addLayer call as config option parameter
   */
  layerOptions: PropTypes.object,

  /**
   * Object that is passed to the MapLibre.addSource call as config option parameter
   */
  sourceOptions: PropTypes.object,

  /**
   * Id of an existing layer in the mapLibre instance to help specify the layer order
   * This layer will be visually beneath the layer with the "insertBeforeLayer" id.
   */
  insertBeforeLayer: PropTypes.string,

  /**
   * Sets layer "visibility" property to "visible" if true or "none" if false
   */
  visible: PropTypes.bool
};

const classes = {
  CONTROL_BASE: 'mapboxgl-ctrl',
  CONTROL_PREFIX: 'mapboxgl-ctrl-',
  CONTROL_BUTTON: 'mapbox-gl-draw_ctrl-draw-btn',
  CONTROL_BUTTON_LINE: 'mapbox-gl-draw_line',
  CONTROL_BUTTON_POLYGON: 'mapbox-gl-draw_polygon',
  CONTROL_BUTTON_POINT: 'mapbox-gl-draw_point',
  CONTROL_BUTTON_TRASH: 'mapbox-gl-draw_trash',
  CONTROL_BUTTON_COMBINE_FEATURES: 'mapbox-gl-draw_combine',
  CONTROL_BUTTON_UNCOMBINE_FEATURES: 'mapbox-gl-draw_uncombine',
  CONTROL_GROUP: 'mapboxgl-ctrl-group',
  ATTRIBUTION: 'mapboxgl-ctrl-attrib',
  ACTIVE_BUTTON: 'active',
  BOX_SELECT: 'mapbox-gl-draw_boxselect'
};
const sources = {
  HOT: 'mapbox-gl-draw-hot',
  COLD: 'mapbox-gl-draw-cold'
};
const cursors = {
  ADD: 'add',
  MOVE: 'move',
  DRAG: 'drag',
  POINTER: 'pointer',
  NONE: 'none'
};
const types = {
  POLYGON: 'polygon',
  LINE: 'line_string',
  POINT: 'point'
};
const geojsonTypes = {
  FEATURE: 'Feature',
  POLYGON: 'Polygon',
  LINE_STRING: 'LineString',
  POINT: 'Point',
  FEATURE_COLLECTION: 'FeatureCollection',
  MULTI_PREFIX: 'Multi',
  MULTI_POINT: 'MultiPoint',
  MULTI_LINE_STRING: 'MultiLineString',
  MULTI_POLYGON: 'MultiPolygon'
};
const modes = {
  DRAW_LINE_STRING: 'draw_line_string',
  DRAW_POLYGON: 'draw_polygon',
  DRAW_POINT: 'draw_point',
  SIMPLE_SELECT: 'simple_select',
  DIRECT_SELECT: 'direct_select',
  STATIC: 'static'
};
const events = {
  CREATE: 'draw.create',
  DELETE: 'draw.delete',
  UPDATE: 'draw.update',
  SELECTION_CHANGE: 'draw.selectionchange',
  MODE_CHANGE: 'draw.modechange',
  ACTIONABLE: 'draw.actionable',
  RENDER: 'draw.render',
  COMBINE_FEATURES: 'draw.combine',
  UNCOMBINE_FEATURES: 'draw.uncombine'
};
const updateActions = {
  MOVE: 'move',
  CHANGE_COORDINATES: 'change_coordinates'
};
const meta = {
  FEATURE: 'feature',
  MIDPOINT: 'midpoint',
  VERTEX: 'vertex'
};
const activeStates = {
  ACTIVE: 'true',
  INACTIVE: 'false'
};
const interactions = ['scrollZoom', 'boxZoom', 'dragRotate', 'dragPan', 'keyboard', 'doubleClickZoom', 'touchZoomRotate'];
const LAT_MIN = -90;
const LAT_RENDERED_MIN = -85;
const LAT_MAX = 90;
const LAT_RENDERED_MAX = 85;
const LNG_MIN = -270;
const LNG_MAX = 270;

var Constants = /*#__PURE__*/Object.freeze({
  __proto__: null,
  classes: classes,
  sources: sources,
  cursors: cursors,
  types: types,
  geojsonTypes: geojsonTypes,
  modes: modes,
  events: events,
  updateActions: updateActions,
  meta: meta,
  activeStates: activeStates,
  interactions: interactions,
  LAT_MIN: LAT_MIN,
  LAT_RENDERED_MIN: LAT_RENDERED_MIN,
  LAT_MAX: LAT_MAX,
  LAT_RENDERED_MAX: LAT_RENDERED_MAX,
  LNG_MIN: LNG_MIN,
  LNG_MAX: LNG_MAX
});

function isOfMetaType(type) {
  return function (e) {
    const featureTarget = e.featureTarget;
    if (!featureTarget) return false;
    if (!featureTarget.properties) return false;
    return featureTarget.properties.meta === type;
  };
}
function isShiftMousedown(e) {
  if (!e.originalEvent) return false;
  if (!e.originalEvent.shiftKey) return false;
  return e.originalEvent.button === 0;
}
function isActiveFeature(e) {
  if (!e.featureTarget) return false;
  if (!e.featureTarget.properties) return false;
  return e.featureTarget.properties.active === activeStates.ACTIVE && e.featureTarget.properties.meta === meta.FEATURE;
}
function isInactiveFeature(e) {
  if (!e.featureTarget) return false;
  if (!e.featureTarget.properties) return false;
  return e.featureTarget.properties.active === activeStates.INACTIVE && e.featureTarget.properties.meta === meta.FEATURE;
}
function noTarget(e) {
  return e.featureTarget === undefined;
}
function isFeature(e) {
  if (!e.featureTarget) return false;
  if (!e.featureTarget.properties) return false;
  return e.featureTarget.properties.meta === meta.FEATURE;
}
function isVertex(e) {
  const featureTarget = e.featureTarget;
  if (!featureTarget) return false;
  if (!featureTarget.properties) return false;
  return featureTarget.properties.meta === meta.VERTEX;
}
function isShiftDown(e) {
  if (!e.originalEvent) return false;
  return e.originalEvent.shiftKey === true;
}
function isEscapeKey(e) {
  return e.keyCode === 27;
}
function isEnterKey(e) {
  return e.keyCode === 13;
}

const doubleClickZoom = {
  enable(ctx) {
    setTimeout(() => {
      // First check we've got a map and some context.
      if (!ctx.map || !ctx.map.doubleClickZoom || !ctx._ctx || !ctx._ctx.store || !ctx._ctx.store.getInitialConfigValue) return; // Now check initial state wasn't false (we leave it disabled if so)

      if (!ctx._ctx.store.getInitialConfigValue("doubleClickZoom")) return;
      ctx.map.doubleClickZoom.enable();
    }, 0);
  },

  disable(ctx) {
    setTimeout(() => {
      if (!ctx.map || !ctx.map.doubleClickZoom) return; // Always disable here, as it's necessary in some cases.

      ctx.map.doubleClickZoom.disable();
    }, 0);
  }

};

function isEventAtCoordinates(event, coordinates) {
  if (!event.lngLat) return false;
  return event.lngLat.lng === coordinates[0] && event.lngLat.lat === coordinates[1];
}

/**
 * Returns GeoJSON for a Point representing the
 * vertex of another feature.
 *
 * @param {string} parentId
 * @param {Array<number>} coordinates
 * @param {string} path - Dot-separated numbers indicating exactly
 *   where the point exists within its parent feature's coordinates.
 * @param {boolean} selected
 * @return {GeoJSON} Point
 */

const create_vertex = function (parentId, coordinates, path, selected) {
  return {
    type: geojsonTypes.FEATURE,
    properties: {
      meta: meta.VERTEX,
      parent: parentId,
      coord_path: path,
      active: selected ? activeStates.ACTIVE : activeStates.INACTIVE
    },
    geometry: {
      type: geojsonTypes.POINT,
      coordinates
    }
  };
};

const CustomPolygonMode = {};

CustomPolygonMode.onSetup = function () {
  console.log("Change mode: custom polygon");
  const polygon = this.newFeature({
    type: geojsonTypes.FEATURE,
    properties: {},
    geometry: {
      type: geojsonTypes.POLYGON,
      coordinates: [[]]
    }
  });
  this.addFeature(polygon);
  this.clearSelectedFeatures();
  doubleClickZoom.disable(this);
  this.updateUIClasses({
    mouse: cursors.ADD
  });
  this.activateUIButton(types.POLYGON);
  this.setActionableState({
    trash: true
  });
  return {
    polygon,
    currentVertexPosition: 0
  };
};

CustomPolygonMode.clickAnywhere = function (state, e) {
  if (state.currentVertexPosition > 0 && isEventAtCoordinates(e, state.polygon.coordinates[0][state.currentVertexPosition - 1])) {
    return this.changeMode("custom_select", {
      featureIds: [state.polygon.id]
    });
  }

  this.updateUIClasses({
    mouse: cursors.ADD
  });
  state.polygon.updateCoordinate("0.".concat(state.currentVertexPosition), e.lngLat.lng, e.lngLat.lat);
  state.currentVertexPosition++;
  state.polygon.updateCoordinate("0.".concat(state.currentVertexPosition), e.lngLat.lng, e.lngLat.lat);
  this.map.fire(events.CREATE, {
    features: [state.polygon.toGeoJSON()]
  });
};

CustomPolygonMode.clickOnVertex = function (state) {
  return this.changeMode("custom_select", {
    featureIds: [state.polygon.id]
  });
};

CustomPolygonMode.onMouseMove = function (state, e) {
  state.polygon.updateCoordinate("0.".concat(state.currentVertexPosition), e.lngLat.lng, e.lngLat.lat);

  if (isVertex(e)) {
    this.updateUIClasses({
      mouse: cursors.POINTER
    });
  }
};

CustomPolygonMode.onTap = CustomPolygonMode.onClick = function (state, e) {
  if (isVertex(e)) return this.clickOnVertex(state, e);
  return this.clickAnywhere(state, e);
};

CustomPolygonMode.onKeyUp = function (state, e) {
  if (isEscapeKey(e)) {
    this.deleteFeature([state.polygon.id], {
      silent: true
    });
    this.changeMode("custom_select");
  } else if (isEnterKey(e)) {
    this.changeMode("custom_select", {
      featureIds: [state.polygon.id]
    });
  }
};

CustomPolygonMode.onStop = function (state) {
  this.updateUIClasses({
    mouse: cursors.NONE
  });
  doubleClickZoom.enable(this);
  this.activateUIButton(); // check to see if we've deleted this feature

  if (this.getFeature(state.polygon.id) === undefined) return; //remove last added coordinate

  state.polygon.removeCoordinate("0.".concat(state.currentVertexPosition));

  if (state.polygon.isValid()) {
    this.map.fire(events.CREATE, {
      features: [state.polygon.toGeoJSON()]
    });
  } else {
    this.deleteFeature([state.polygon.id], {
      silent: true
    });
    this.changeMode("custom_select", {}, {
      silent: true
    });
  }
};

CustomPolygonMode.toDisplayFeatures = function (state, geojson, display) {
  const isActivePolygon = geojson.properties.id === state.polygon.id;
  geojson.properties.active = isActivePolygon ? activeStates.ACTIVE : activeStates.INACTIVE;
  if (!isActivePolygon) return display(geojson); // Don't render a polygon until it has two positions
  // (and a 3rd which is just the first repeated)

  if (geojson.geometry.coordinates.length === 0) return;
  const coordinateCount = geojson.geometry.coordinates[0].length; // 2 coordinates after selecting a draw type
  // 3 after creating the first point

  if (coordinateCount < 3) {
    return;
  }

  geojson.properties.meta = meta.FEATURE;
  display(create_vertex(state.polygon.id, geojson.geometry.coordinates[0][0], "0.0", false));

  if (coordinateCount > 3) {
    // Add a start position marker to the map, clicking on this will finish the feature
    // This should only be shown when we're in a valid spot
    const endPos = geojson.geometry.coordinates[0].length - 3;
    display(create_vertex(state.polygon.id, geojson.geometry.coordinates[0][endPos], "0.".concat(endPos), false));
  }

  if (coordinateCount <= 4) {
    // If we've only drawn two positions (plus the closer),
    // make a LineString instead of a Polygon
    const lineCoordinates = [[geojson.geometry.coordinates[0][0][0], geojson.geometry.coordinates[0][0][1]], [geojson.geometry.coordinates[0][1][0], geojson.geometry.coordinates[0][1][1]]]; // create an initial vertex so that we can track the first point on mobile devices

    display({
      type: geojsonTypes.FEATURE,
      properties: geojson.properties,
      geometry: {
        coordinates: lineCoordinates,
        type: geojsonTypes.LINE_STRING
      }
    });

    if (coordinateCount === 3) {
      return;
    }
  } // render the Polygon


  return display(geojson);
};

CustomPolygonMode.onTrash = function (state) {
  this.deleteFeature([state.polygon.id], {
    silent: true
  });
  this.changeMode("custom_select");
};

/**
 * Returns a Point representing a mouse event's position
 * relative to a containing element.
 *
 * @param {MouseEvent} mouseEvent
 * @param {Node} container
 * @returns {Point}
 */

function mouseEventPoint(mouseEvent, container) {
  const rect = container.getBoundingClientRect();
  return new Point(mouseEvent.clientX - rect.left - (container.clientLeft || 0), mouseEvent.clientY - rect.top - (container.clientTop || 0));
}

const create_midpoint = function (parent, startVertex, endVertex) {
  const startCoord = startVertex.geometry.coordinates;
  const endCoord = endVertex.geometry.coordinates; // If a coordinate exceeds the projection, we can't calculate a midpoint,
  // so run away

  if (startCoord[1] > LAT_RENDERED_MAX || startCoord[1] < LAT_RENDERED_MIN || endCoord[1] > LAT_RENDERED_MAX || endCoord[1] < LAT_RENDERED_MIN) {
    return null;
  }

  const mid = {
    lng: (startCoord[0] + endCoord[0]) / 2,
    lat: (startCoord[1] + endCoord[1]) / 2
  };
  return {
    type: geojsonTypes.FEATURE,
    properties: {
      meta: meta.MIDPOINT,
      parent,
      lng: mid.lng,
      lat: mid.lat,
      coord_path: endVertex.properties.coord_path
    },
    geometry: {
      type: geojsonTypes.POINT,
      coordinates: [mid.lng, mid.lat]
    }
  };
};

function createSupplementaryPoints(geojson) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let basePath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  const {
    type,
    coordinates
  } = geojson.geometry;
  const featureId = geojson.properties && geojson.properties.id;
  let supplementaryPoints = [];

  if (type === geojsonTypes.POINT) {
    // For points, just create a vertex
    supplementaryPoints.push(create_vertex(featureId, coordinates, basePath, isSelectedPath(basePath)));
  } else if (type === geojsonTypes.POLYGON) {
    // Cycle through a Polygon's rings and
    // process each line
    coordinates.forEach((line, lineIndex) => {
      processLine(line, basePath !== null ? "".concat(basePath, ".").concat(lineIndex) : String(lineIndex));
    });
  } else if (type === geojsonTypes.LINE_STRING) {
    processLine(coordinates, basePath);
  } else if (type.indexOf(geojsonTypes.MULTI_PREFIX) === 0) {
    processMultiGeometry();
  }

  function processLine(line, lineBasePath) {
    let firstPointString = "";
    let lastVertex = null;
    line.forEach((point, pointIndex) => {
      const pointPath = lineBasePath !== undefined && lineBasePath !== null ? "".concat(lineBasePath, ".").concat(pointIndex) : String(pointIndex);
      const vertex = create_vertex(featureId, point, pointPath, isSelectedPath(pointPath)); // If we're creating midpoints, check if there was a
      // vertex before this one. If so, add a midpoint
      // between that vertex and this one.

      if (options.midpoints && lastVertex) {
        const midpoint = create_midpoint(featureId, lastVertex, vertex);

        if (midpoint) {
          supplementaryPoints.push(midpoint);
        }
      }

      lastVertex = vertex; // A Polygon line's last point is the same as the first point. If we're on the last
      // point, we want to draw a midpoint before it but not another vertex on it
      // (since we already a vertex there, from the first point).

      const stringifiedPoint = JSON.stringify(point);

      if (firstPointString !== stringifiedPoint) {
        supplementaryPoints.push(vertex);
      }

      if (pointIndex === 0) {
        firstPointString = stringifiedPoint;
      }
    });
  }

  function isSelectedPath(path) {
    if (!options.selectedPaths) return false;
    return options.selectedPaths.indexOf(path) !== -1;
  } // Split a multi-geometry into constituent
  // geometries, and accumulate the supplementary points
  // for each of those constituents


  function processMultiGeometry() {
    const subType = type.replace(geojsonTypes.MULTI_PREFIX, "");
    coordinates.forEach((subCoordinates, index) => {
      const subFeature = {
        type: geojsonTypes.FEATURE,
        properties: geojson.properties,
        geometry: {
          type: subType,
          coordinates: subCoordinates
        }
      };
      supplementaryPoints = supplementaryPoints.concat(createSupplementaryPoints(subFeature, options, index));
    });
  }

  return supplementaryPoints;
}

function StringSet(items) {
  this._items = {};
  this._nums = {};
  this._length = items ? items.length : 0;
  if (!items) return;

  for (let i = 0, l = items.length; i < l; i++) {
    this.add(items[i]);
    if (items[i] === undefined) continue;
    if (typeof items[i] === 'string') this._items[items[i]] = i;else this._nums[items[i]] = i;
  }
}

StringSet.prototype.add = function (x) {
  if (this.has(x)) return this;
  this._length++;
  if (typeof x === 'string') this._items[x] = this._length;else this._nums[x] = this._length;
  return this;
};

StringSet.prototype.delete = function (x) {
  if (this.has(x) === false) return this;
  this._length--;
  delete this._items[x];
  delete this._nums[x];
  return this;
};

StringSet.prototype.has = function (x) {
  if (typeof x !== 'string' && typeof x !== 'number') return false;
  return this._items[x] !== undefined || this._nums[x] !== undefined;
};

StringSet.prototype.values = function () {
  const values = [];
  Object.keys(this._items).forEach(k => {
    values.push({
      k,
      v: this._items[k]
    });
  });
  Object.keys(this._nums).forEach(k => {
    values.push({
      k: JSON.parse(k),
      v: this._nums[k]
    });
  });
  return values.sort((a, b) => a.v - b.v).map(a => a.k);
};

StringSet.prototype.clear = function () {
  this._length = 0;
  this._items = {};
  this._nums = {};
  return this;
};

const {
  LAT_MIN: LAT_MIN$1,
  LAT_MAX: LAT_MAX$1,
  LAT_RENDERED_MIN: LAT_RENDERED_MIN$1,
  LAT_RENDERED_MAX: LAT_RENDERED_MAX$1,
  LNG_MIN: LNG_MIN$1,
  LNG_MAX: LNG_MAX$1
} = Constants; // Ensure that we do not drag north-south far enough for
// - any part of any feature to exceed the poles
// - any feature to be completely lost in the space between the projection's
//   edge and the poles, such that it couldn't be re-selected and moved back

const constrain_feature_movement = function (geojsonFeatures, delta) {
  // "inner edge" = a feature's latitude closest to the equator
  let northInnerEdge = LAT_MIN$1;
  let southInnerEdge = LAT_MAX$1; // "outer edge" = a feature's latitude furthest from the equator

  let northOuterEdge = LAT_MIN$1;
  let southOuterEdge = LAT_MAX$1;
  let westEdge = LNG_MAX$1;
  let eastEdge = LNG_MIN$1;
  geojsonFeatures.forEach(feature => {
    const bounds = extent(feature);
    const featureSouthEdge = bounds[1];
    const featureNorthEdge = bounds[3];
    const featureWestEdge = bounds[0];
    const featureEastEdge = bounds[2];
    if (featureSouthEdge > northInnerEdge) northInnerEdge = featureSouthEdge;
    if (featureNorthEdge < southInnerEdge) southInnerEdge = featureNorthEdge;
    if (featureNorthEdge > northOuterEdge) northOuterEdge = featureNorthEdge;
    if (featureSouthEdge < southOuterEdge) southOuterEdge = featureSouthEdge;
    if (featureWestEdge < westEdge) westEdge = featureWestEdge;
    if (featureEastEdge > eastEdge) eastEdge = featureEastEdge;
  }); // These changes are not mutually exclusive: we might hit the inner
  // edge but also have hit the outer edge and therefore need
  // another readjustment

  const constrainedDelta = delta;

  if (northInnerEdge + constrainedDelta.lat > LAT_RENDERED_MAX$1) {
    constrainedDelta.lat = LAT_RENDERED_MAX$1 - northInnerEdge;
  }

  if (northOuterEdge + constrainedDelta.lat > LAT_MAX$1) {
    constrainedDelta.lat = LAT_MAX$1 - northOuterEdge;
  }

  if (southInnerEdge + constrainedDelta.lat < LAT_RENDERED_MIN$1) {
    constrainedDelta.lat = LAT_RENDERED_MIN$1 - southInnerEdge;
  }

  if (southOuterEdge + constrainedDelta.lat < LAT_MIN$1) {
    constrainedDelta.lat = LAT_MIN$1 - southOuterEdge;
  }

  if (westEdge + constrainedDelta.lng <= LNG_MIN$1) {
    constrainedDelta.lng += Math.ceil(Math.abs(constrainedDelta.lng) / 360) * 360;
  }

  if (eastEdge + constrainedDelta.lng >= LNG_MAX$1) {
    constrainedDelta.lng -= Math.ceil(Math.abs(constrainedDelta.lng) / 360) * 360;
  }

  return constrainedDelta;
};

var move_features = function (features, delta) {
  const constrainedDelta = constrain_feature_movement(features.map(feature => feature.toGeoJSON()), delta);
  features.forEach(feature => {
    const currentCoordinates = feature.getCoordinates();

    const moveCoordinate = coord => {
      const point = {
        lng: coord[0] + constrainedDelta.lng,
        lat: coord[1] + constrainedDelta.lat
      };
      return [point.lng, point.lat];
    };

    const moveRing = ring => ring.map(coord => moveCoordinate(coord));

    const moveMultiPolygon = multi => multi.map(ring => moveRing(ring));

    let nextCoordinates;

    if (feature.type === geojsonTypes.POINT) {
      nextCoordinates = moveCoordinate(currentCoordinates);
    } else if (feature.type === geojsonTypes.LINE_STRING || feature.type === geojsonTypes.MULTI_POINT) {
      nextCoordinates = currentCoordinates.map(moveCoordinate);
    } else if (feature.type === geojsonTypes.POLYGON || feature.type === geojsonTypes.MULTI_LINE_STRING) {
      nextCoordinates = currentCoordinates.map(moveRing);
    } else if (feature.type === geojsonTypes.MULTI_POLYGON) {
      nextCoordinates = currentCoordinates.map(moveMultiPolygon);
    }

    feature.incomingCoords(nextCoordinates);
  });
};

const CustomSelectMode = {};

CustomSelectMode.onSetup = function (opts) {
  console.log("Change mode: custom select"); // turn the opts into state.

  const state = {
    dragMoveLocation: null,
    boxSelectStartLocation: null,
    boxSelectElement: undefined,
    boxSelecting: false,
    canBoxSelect: false,
    dragMoving: false,
    canDragMove: false,
    initiallySelectedFeatureIds: opts.featureIds || []
  };
  this.setSelected(state.initiallySelectedFeatureIds.filter(id => this.getFeature(id) !== undefined));
  this.fireActionable();
  this.setActionableState({
    combineFeatures: true,
    uncombineFeatures: true,
    trash: true
  });
  return state;
};

CustomSelectMode.fireUpdate = function () {
  this.map.fire(events.UPDATE, {
    action: updateActions.MOVE,
    features: this.getSelected().map(f => f.toGeoJSON())
  });
};

CustomSelectMode.fireActionable = function () {
  const selectedFeatures = this.getSelected();
  const multiFeatures = selectedFeatures.filter(feature => this.isInstanceOf("MultiFeature", feature));
  let combineFeatures = false;

  if (selectedFeatures.length > 1) {
    combineFeatures = true;
    const featureType = selectedFeatures[0].type.replace("Multi", "");
    selectedFeatures.forEach(feature => {
      if (feature.type.replace("Multi", "") !== featureType) {
        combineFeatures = false;
      }
    });
  }

  const uncombineFeatures = multiFeatures.length > 0;
  const trash = selectedFeatures.length > 0;
  this.setActionableState({
    combineFeatures,
    uncombineFeatures,
    trash
  });
};

CustomSelectMode.getUniqueIds = function (allFeatures) {
  if (!allFeatures.length) return [];
  const ids = allFeatures.map(s => s.properties.id).filter(id => id !== undefined).reduce((memo, id) => {
    memo.add(id);
    return memo;
  }, new StringSet());
  return ids.values();
};

CustomSelectMode.stopExtendedInteractions = function (state) {
  if (state.boxSelectElement) {
    if (state.boxSelectElement.parentNode) state.boxSelectElement.parentNode.removeChild(state.boxSelectElement);
    state.boxSelectElement = null;
  }

  this.map.dragPan.enable();
  state.boxSelecting = false;
  state.canBoxSelect = false;
  state.dragMoving = false;
  state.canDragMove = false;
};

CustomSelectMode.onStop = function () {
  doubleClickZoom.enable(this);
};

CustomSelectMode.onMouseMove = function (state) {
  // On mousemove that is not a drag, stop extended interactions.
  // This is useful if you drag off the canvas, release the button,
  // then move the mouse back over the canvas --- we don't allow the
  // interaction to continue then, but we do let it continue if you held
  // the mouse button that whole time
  return this.stopExtendedInteractions(state);
};

CustomSelectMode.onMouseOut = function (state) {
  // As soon as you mouse leaves the canvas, update the feature
  if (state.dragMoving) return this.fireUpdate();
};

CustomSelectMode.onTap = CustomSelectMode.onClick = function (state, e) {
  // Click (with or without shift) on no feature
  if (noTarget(e)) return this.clickAnywhere(state, e); // also tap

  if (isOfMetaType(meta.VERTEX)(e)) return this.clickOnVertex(state, e); //tap

  if (isFeature(e)) return this.clickOnFeature(state, e);
};

CustomSelectMode.clickAnywhere = function (state) {
  // Clear the re-render selection
  const wasSelected = this.getSelectedIds();

  if (wasSelected.length) {
    this.clearSelectedFeatures();
    wasSelected.forEach(id => this.doRender(id));
  }

  doubleClickZoom.enable(this);
  this.stopExtendedInteractions(state);
};

CustomSelectMode.clickOnVertex = function (state, e) {
  // Enter direct select mode
  this.changeMode("custom_direct_select", {
    featureId: e.featureTarget.properties.parent,
    coordPath: e.featureTarget.properties.coord_path,
    startPos: e.lngLat //    groupMove_vertices: matchingVertices,

  });
  this.updateUIClasses({
    mouse: cursors.MOVE
  });
};

CustomSelectMode.startOnActiveFeature = function (state, e) {
  // Stop any already-underway extended interactions
  this.stopExtendedInteractions(state); // Disable map.dragPan immediately so it can't start

  this.map.dragPan.disable(); // Re-render it and enable drag move

  this.doRender(e.featureTarget.properties.id); // Set up the state for drag moving

  state.canDragMove = true;
  state.dragMoveLocation = e.lngLat;
};

CustomSelectMode.clickOnFeature = function (state, e) {
  // Stop everything
  doubleClickZoom.disable(this);
  this.stopExtendedInteractions(state);
  const isShiftClick = isShiftDown(e);
  const selectedFeatureIds = this.getSelectedIds();
  const featureId = e.featureTarget.properties.id;
  const isFeatureSelected = this.isSelected(featureId); // Click (without shift) on any selected feature but a point

  if (!isShiftClick && isFeatureSelected && this.getFeature(featureId).type !== geojsonTypes.POINT) {
    // Enter direct select mode
    return this.changeMode("custom_direct_select", {
      featureId
    });
  } // Shift-click on a selected feature


  if (isFeatureSelected && isShiftClick) {
    // Deselect it
    this.deselect(featureId);
    this.updateUIClasses({
      mouse: cursors.POINTER
    });

    if (selectedFeatureIds.length === 1) {
      doubleClickZoom.enable(this);
    } // Shift-click on an unselected feature

  } else if (!isFeatureSelected && isShiftClick) {
    // Add it to the selection
    this.select(featureId);
    this.updateUIClasses({
      mouse: cursors.MOVE
    }); // Click (without shift) on an unselected feature
  } else if (!isFeatureSelected && !isShiftClick) {
    // Make it the only selected feature
    selectedFeatureIds.forEach(id => this.doRender(id));
    this.setSelected(featureId);
    this.updateUIClasses({
      mouse: cursors.MOVE
    });
  } // No matter what, re-render the clicked feature


  this.doRender(featureId);
};

CustomSelectMode.onMouseDown = function (state, e) {
  if (isActiveFeature(e)) return this.startOnActiveFeature(state, e);
  if (this.drawConfig.boxSelect && isShiftMousedown(e)) return this.startBoxSelect(state, e);
};

CustomSelectMode.startBoxSelect = function (state, e) {
  this.stopExtendedInteractions(state);
  this.map.dragPan.disable(); // Enable box select

  state.boxSelectStartLocation = mouseEventPoint(e.originalEvent, this.map.getContainer());
  state.canBoxSelect = true;
};

CustomSelectMode.onTouchStart = function (state, e) {
  if (isActiveFeature(e)) return this.startOnActiveFeature(state, e);
};

CustomSelectMode.onDrag = function (state, e) {
  if (state.canDragMove) return this.dragMove(state, e);
  if (this.drawConfig.boxSelect && state.canBoxSelect) return this.whileBoxSelect(state, e);
};

CustomSelectMode.whileBoxSelect = function (state, e) {
  state.boxSelecting = true;
  this.updateUIClasses({
    mouse: cursors.ADD
  }); // Create the box node if it doesn't exist

  if (!state.boxSelectElement) {
    state.boxSelectElement = document.createElement("div");
    state.boxSelectElement.classList.add(classes.BOX_SELECT);
    this.map.getContainer().appendChild(state.boxSelectElement);
  } // Adjust the box node's width and xy position


  const current = mouseEventPoint(e.originalEvent, this.map.getContainer());
  const minX = Math.min(state.boxSelectStartLocation.x, current.x);
  const maxX = Math.max(state.boxSelectStartLocation.x, current.x);
  const minY = Math.min(state.boxSelectStartLocation.y, current.y);
  const maxY = Math.max(state.boxSelectStartLocation.y, current.y);
  const translateValue = "translate(".concat(minX, "px, ").concat(minY, "px)");
  state.boxSelectElement.style.transform = translateValue;
  state.boxSelectElement.style.WebkitTransform = translateValue;
  state.boxSelectElement.style.width = "".concat(maxX - minX, "px");
  state.boxSelectElement.style.height = "".concat(maxY - minY, "px");
};

CustomSelectMode.dragMove = function (state, e) {
  // Dragging when drag move is enabled
  state.dragMoving = true;
  e.originalEvent.stopPropagation();
  const delta = {
    lng: e.lngLat.lng - state.dragMoveLocation.lng,
    lat: e.lngLat.lat - state.dragMoveLocation.lat
  };
  move_features(this.getSelected(), delta);
  state.dragMoveLocation = e.lngLat;
};

CustomSelectMode.onMouseUp = function (state, e) {
  // End any extended interactions
  if (state.dragMoving) {
    this.fireUpdate();
  } else if (state.boxSelecting) {
    const bbox = [state.boxSelectStartLocation, mouseEventPoint(e.originalEvent, this.map.getContainer())];
    const featuresInBox = this.featuresAt(null, bbox, "click");
    const idsToSelect = this.getUniqueIds(featuresInBox).filter(id => !this.isSelected(id));

    if (idsToSelect.length) {
      this.select(idsToSelect);
      idsToSelect.forEach(id => this.doRender(id));
      this.updateUIClasses({
        mouse: cursors.MOVE
      });
    }
  }

  this.stopExtendedInteractions(state);
};

CustomSelectMode.toDisplayFeatures = function (state, geojson, display) {
  geojson.properties.active = this.isSelected(geojson.properties.id) ? activeStates.ACTIVE : activeStates.INACTIVE;
  display(geojson);
  this.fireActionable();
  if (geojson.properties.active !== activeStates.ACTIVE || geojson.geometry.type === geojsonTypes.POINT) return;
  createSupplementaryPoints(geojson).forEach(display);
};

CustomSelectMode.onTrash = function () {
  this.deleteFeature(this.getSelectedIds());
  this.fireActionable();
};

CustomSelectMode.onCombineFeatures = function () {
  const selectedFeatures = this.getSelected();
  if (selectedFeatures.length === 0 || selectedFeatures.length < 2) return;
  const coordinates = [],
        featuresCombined = [];
  const featureType = selectedFeatures[0].type.replace("Multi", "");

  for (let i = 0; i < selectedFeatures.length; i++) {
    const feature = selectedFeatures[i];

    if (feature.type.replace("Multi", "") !== featureType) {
      return;
    }

    if (feature.type.includes("Multi")) {
      feature.getCoordinates().forEach(subcoords => {
        coordinates.push(subcoords);
      });
    } else {
      coordinates.push(feature.getCoordinates());
    }

    featuresCombined.push(feature.toGeoJSON());
  }

  if (featuresCombined.length > 1) {
    const multiFeature = this.newFeature({
      type: geojsonTypes.FEATURE,
      properties: featuresCombined[0].properties,
      geometry: {
        type: "Multi".concat(featureType),
        coordinates
      }
    });
    this.addFeature(multiFeature);
    this.deleteFeature(this.getSelectedIds(), {
      silent: true
    });
    this.setSelected([multiFeature.id]);
    this.map.fire(events.COMBINE_FEATURES, {
      createdFeatures: [multiFeature.toGeoJSON()],
      deletedFeatures: featuresCombined
    });
  }

  this.fireActionable();
};

CustomSelectMode.onUncombineFeatures = function () {
  const selectedFeatures = this.getSelected();
  if (selectedFeatures.length === 0) return;
  const createdFeatures = [];
  const featuresUncombined = [];

  for (let i = 0; i < selectedFeatures.length; i++) {
    const feature = selectedFeatures[i];

    if (this.isInstanceOf("MultiFeature", feature)) {
      feature.getFeatures().forEach(subFeature => {
        this.addFeature(subFeature);
        subFeature.properties = feature.properties;
        createdFeatures.push(subFeature.toGeoJSON());
        this.select([subFeature.id]);
      });
      this.deleteFeature(feature.id, {
        silent: true
      });
      featuresUncombined.push(feature.toGeoJSON());
    }
  }

  if (createdFeatures.length > 1) {
    this.map.fire(events.UNCOMBINE_FEATURES, {
      createdFeatures,
      deletedFeatures: featuresUncombined
    });
  }

  this.fireActionable();
};

const drawUtils = {
  getMatchingVertices: (vertex, featureId, allFeatures, map) => {
    // number of decimals should probably be dynamic depending on zoom level
    let decimals = 5;
    let matchingVertices = [];
    let v_lng = vertex[0].toFixed(decimals);
    let v_lat = vertex[1].toFixed(decimals);

    for (var i = 0; i < allFeatures.length; i++) {
      if (allFeatures[i].id !== featureId) {
        for (var k = 0; k < allFeatures[i].geometry.coordinates.length; k++) {
          for (var m = 0; m < allFeatures[i].geometry.coordinates[k].length; m++) {
            if (v_lng === allFeatures[i].geometry.coordinates[k][m][0].toFixed(decimals) && v_lat === allFeatures[i].geometry.coordinates[k][m][1].toFixed(decimals)) {
              matchingVertices.push({
                featureId: allFeatures[i].id,
                coord_path: k + "." + m,
                //feature: map.getFeature(allFeatures[i].id),
                lng: allFeatures[i].geometry.coordinates[k][m][0],
                lat: allFeatures[i].geometry.coordinates[k][m][1]
              });
            }
          }
        }
      }
    }

    return matchingVertices;
  },
  getDrawInstance: map => {
    for (var i = map._controls.length - 1; i >= 0; i--) {
      if (map._controls[i].options && map._controls[i].options.defaultMode === "custom_select") {
        return map._controls[i];
      }
    }

    return null;
  }
};

const isVertex$1 = isOfMetaType(meta.VERTEX);
const isMidpoint = isOfMetaType(meta.MIDPOINT);
const DirectSelect = {}; // INTERNAL FUCNTIONS

DirectSelect.fireUpdate = function () {
  this.map.fire(events.UPDATE, {
    action: updateActions.CHANGE_COORDINATES,
    features: this.getSelected().map(f => f.toGeoJSON())
  });
};

DirectSelect.fireActionable = function (state) {
  this.setActionableState({
    combineFeatures: false,
    uncombineFeatures: false,
    trash: state.selectedCoordPaths.length > 0
  });
};

DirectSelect.startDragging = function (state, e) {
  this.map.dragPan.disable();
  state.canDragMove = true;
  state.dragMoveLocation = e.lngLat;
};

DirectSelect.stopDragging = function (state) {
  this.map.dragPan.enable();
  state.dragMoving = false;
  state.canDragMove = false;
  state.dragMoveLocation = null;
};

DirectSelect.onVertex = function (state, e) {
  this.startDragging(state, e);
  const about = e.featureTarget.properties;
  const selectedIndex = state.selectedCoordPaths.indexOf(about.coord_path);

  if (!isShiftDown(e) && selectedIndex === -1) {
    state.selectedCoordPaths = [about.coord_path];
  } else if (isShiftDown(e) && selectedIndex === -1) {
    state.selectedCoordPaths.push(about.coord_path);
  } // currently this work with single selected vertices only


  let allFeatures = drawUtils.getDrawInstance(this.map).getAll();
  let matchingVertices = drawUtils.getMatchingVertices(e.featureTarget._geometry.coordinates, e.featureTarget.properties.parent, allFeatures.features, this.map);
  state.groupMove_vertices = matchingVertices;

  for (let i = 0; i < state.groupMove_vertices.length; i++) {
    state.groupMove_vertices[i].feature = this.getFeature(state.groupMove_vertices[i].featureId);
  }

  const selectedCoordinates = this.pathsToCoordinates(state.featureId, state.selectedCoordPaths);
  this.setSelectedCoordinates(selectedCoordinates);
};

DirectSelect.onMidpoint = function (state, e) {
  this.startDragging(state, e);
  const about = e.featureTarget.properties;
  state.feature.addCoordinate(about.coord_path, about.lng, about.lat);
  this.fireUpdate();
  state.selectedCoordPaths = [about.coord_path];
};

DirectSelect.pathsToCoordinates = function (featureId, paths) {
  return paths.map(coord_path => ({
    feature_id: featureId,
    coord_path
  }));
};

DirectSelect.onFeature = function (state, e) {
  if (state.selectedCoordPaths.length === 0) this.startDragging(state, e);else this.stopDragging(state);
};

DirectSelect.dragFeature = function (state, e, delta) {
  move_features(this.getSelected(), delta);
  state.dragMoveLocation = e.lngLat;
};

DirectSelect.dragVertex = function (state, e, delta) {
  const selectedCoords = state.selectedCoordPaths.map(coord_path => state.feature.getCoordinate(coord_path));
  const selectedCoordPoints = selectedCoords.map(coords => ({
    type: geojsonTypes.FEATURE,
    properties: {},
    geometry: {
      type: geojsonTypes.POINT,
      coordinates: coords
    }
  }));
  const constrainedDelta = constrain_feature_movement(selectedCoordPoints, delta);

  for (let i = 0; i < selectedCoords.length; i++) {
    const coord = selectedCoords[i];
    state.feature.updateCoordinate(state.selectedCoordPaths[i], coord[0] + constrainedDelta.lng, coord[1] + constrainedDelta.lat);

    for (let k = 0; k < state.groupMove_vertices.length; k++) {
      let coord_path_m = state.groupMove_vertices[k].coord_path.split(".");

      if (typeof coord_path_m[0] !== "undefined" && typeof coord_path_m[1] !== "undefined" && typeof state.groupMove_vertices[k].feature.coordinates[coord_path_m[0]] !== "undefined" && typeof state.groupMove_vertices[k].feature.coordinates[coord_path_m[0]][coord_path_m[1]] !== "undefined") {
        let coord_m = state.groupMove_vertices[k].feature.coordinates[coord_path_m[0]][coord_path_m[1]];
        state.groupMove_vertices[k].feature.updateCoordinate(state.groupMove_vertices[k].coord_path, coord_m[0] + constrainedDelta.lng, coord_m[1] + constrainedDelta.lat);
      }
    }
  }
};

DirectSelect.clickNoTarget = function () {
  this.changeMode("custom_select");
};

DirectSelect.clickInactive = function () {
  this.changeMode("custom_select");
};

DirectSelect.clickActiveFeature = function (state) {
  state.selectedCoordPaths = [];
  this.clearSelectedCoordinates();
  state.feature.changed();
}; // EXTERNAL FUNCTIONS


DirectSelect.onSetup = function (opts) {
  const featureId = opts.featureId;
  const feature = this.getFeature(featureId);

  if (!feature) {
    throw new Error("You must provide a featureId to enter direct_select mode");
  }

  if (feature.type === geojsonTypes.POINT) {
    throw new TypeError("direct_select mode doesn't handle point features");
  }

  const state = {
    featureId,
    feature,
    dragMoveLocation: opts.startPos || null,
    dragMoving: false,
    canDragMove: false,
    selectedCoordPaths: opts.coordPath ? [opts.coordPath] : [],
    groupMove_vertices: opts.groupMove_vertices ? opts.groupMove_vertices : []
  };
  this.setSelectedCoordinates(this.pathsToCoordinates(featureId, state.selectedCoordPaths));
  this.setSelected(featureId);
  doubleClickZoom.disable(this);
  this.setActionableState({
    trash: true
  });
  return state;
};

DirectSelect.onStop = function () {
  doubleClickZoom.enable(this);
  this.clearSelectedCoordinates();
};

DirectSelect.toDisplayFeatures = function (state, geojson, push) {
  if (state.featureId === geojson.properties.id) {
    geojson.properties.active = activeStates.ACTIVE;
    push(geojson);
    createSupplementaryPoints(geojson, {
      map: this.map,
      midpoints: true,
      selectedPaths: state.selectedCoordPaths
    }).forEach(push);
  } else {
    geojson.properties.active = activeStates.INACTIVE;
    push(geojson);
  }

  this.fireActionable(state);
};

DirectSelect.onTrash = function (state) {
  // Uses number-aware sorting to make sure '9' < '10'. Comparison is reversed because we want them
  // in reverse order so that we can remove by index safely.
  state.selectedCoordPaths.sort((a, b) => b.localeCompare(a, "en", {
    numeric: true
  })).forEach(id => state.feature.removeCoordinate(id));
  this.fireUpdate();
  state.selectedCoordPaths = [];
  this.clearSelectedCoordinates();
  this.fireActionable(state);

  if (state.feature.isValid() === false) {
    this.deleteFeature([state.featureId]);
    this.changeMode("custom_select", {});
  }
};

DirectSelect.onMouseMove = function (state, e) {
  // On mousemove that is not a drag, stop vertex movement.
  const isFeature = isActiveFeature(e);
  const onVertex = isVertex$1(e);
  const noCoords = state.selectedCoordPaths.length === 0;
  if (isFeature && noCoords) this.updateUIClasses({
    mouse: cursors.MOVE
  });else if (onVertex && !noCoords) this.updateUIClasses({
    mouse: cursors.MOVE
  });else this.updateUIClasses({
    mouse: cursors.NONE
  });
  this.stopDragging(state);
};

DirectSelect.onMouseOut = function (state) {
  // As soon as you mouse leaves the canvas, update the feature
  if (state.dragMoving) this.fireUpdate();
};

DirectSelect.onTouchStart = DirectSelect.onMouseDown = function (state, e) {
  if (isVertex$1(e)) return this.onVertex(state, e);
  if (isActiveFeature(e)) return this.onFeature(state, e);
  if (isMidpoint(e)) return this.onMidpoint(state, e);
};

DirectSelect.onDrag = function (state, e) {
  if (state.canDragMove !== true) return;
  state.dragMoving = true;
  e.originalEvent.stopPropagation();
  const delta = {
    lng: e.lngLat.lng - state.dragMoveLocation.lng,
    lat: e.lngLat.lat - state.dragMoveLocation.lat
  };
  if (state.selectedCoordPaths.length > 0) this.dragVertex(state, e, delta);else this.dragFeature(state, e, delta);
  state.dragMoveLocation = e.lngLat;
};

DirectSelect.onClick = function (state, e) {
  if (noTarget(e)) return this.clickNoTarget(state, e);
  if (isActiveFeature(e)) return this.clickActiveFeature(state, e);
  if (isInactiveFeature(e)) return this.clickInactive(state, e);
  this.stopDragging(state);
};

DirectSelect.onTap = function (state, e) {
  if (noTarget(e)) return this.clickNoTarget(state, e);
  if (isActiveFeature(e)) return this.clickActiveFeature(state, e);
  if (isInactiveFeature(e)) return this.clickInactive(state, e);
};

DirectSelect.onTouchEnd = DirectSelect.onMouseUp = function (state) {
  if (state.dragMoving) {
    this.fireUpdate();
  }

  this.stopDragging(state);
};

function MlFeatureEditor(props) {
  const mapRef = useRef(null);
  const draw = useRef(null);
  const mapContext = useContext(MapContext);
  const componentId = useRef((props.idPrefix ? props.idPrefix : "MlFeatureEditor-") + v4());
  const onChangeRef = useRef(props.onChange);
  const [drawToolsInitialized, setDrawToolsInitialized] = useState(false);
  const [drawToolsReady, setDrawToolsReady] = useState(false);
  const [mouseUpTrigger, setMouseUpTrigger] = useState(false);

  const modeChangeHandler = e => {
    console.log("MlFeatureEditor mode change to " + e.mode); //setDrawMode(e.mode);
  };

  const mouseUpHandler = () => {
    setMouseUpTrigger(Math.random());
  };

  useEffect(() => {
    let _componentId = componentId.current;
    return () => {
      if (mapRef.current) {
        mapRef.current.cleanup(_componentId); //mapRef.current.removeControl(draw.current, "top-left");

        mapRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (mapContext.mapExists(props.mapId) && mapContext.getMap(props.mapId).style && !drawToolsInitialized) {
      mapRef.current = mapContext.getMap(props.mapId);
      setDrawToolsInitialized(true);

      if (mapRef.current && mapRef.current.style && mapRef.current.getSource("mapbox-gl-draw-cold") && draw.current && typeof draw.current.remove !== "undefined") {
        // remove old Mapbox-gl-Draw from Mapbox instance when hot-reloading this component during development
        draw.current.remove();
      }

      draw.current = new MapboxDraw({
        displayControlsDefault: false,
        defaultMode: props.mode || "custom_select",
        modes: Object.assign({
          custom_polygon: CustomPolygonMode,
          custom_select: CustomSelectMode,
          custom_direct_select: DirectSelect
        }, MapboxDraw.modes)
      });
      mapRef.current.on("draw.modechange", modeChangeHandler, componentId.current);
      mapRef.current.addControl(draw.current, "top-left", componentId.current);
      mapRef.current.on("mouseup", mouseUpHandler, componentId.current);
      setDrawToolsReady(true);
    }
  }, [mapContext.map, mapContext, props, drawToolsInitialized]);
  useEffect(() => {
    if (draw.current && props.geojson && props.geojson.geometry && props.geojson.geometry.coordinates) {
      draw.current.set({
        type: "FeatureCollection",
        features: [props.geojson]
      });
    }
  }, [props.geojson, drawToolsReady]);
  useEffect(() => {
    if (draw.current && mouseUpTrigger) {
      // update drawnFeatures state object
      let currentFeatureCollection = draw.current.getAll();

      if (typeof onChangeRef.current === "function") {
        onChangeRef.current(currentFeatureCollection.features);
      }
    }
  }, [mouseUpTrigger]);
  useEffect(() => {
    if (props.mode && draw.current) {
      draw.current.changeMode(props.mode);
    }
  }, [props.mode]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
}

const MlBasicComponent = props => {
  // Use a useRef hook to reference the layer object to be able to access it later inside useEffect hooks
  // without the requirement of adding it to the dependency list (ignore the false eslint exhaustive deps warning)
  // const layerRef = useRef(null);
  const mapContext = useContext(MapContext);
  useEffect(() => {
    if (!mapContext.mapExists()) return;
    return () => {
      // This is the cleanup function, it is called when this react component is removed from react-dom
      // try to remove anything this component has added to the MapLibre-gl instance
      // e.g.: remove the layer
      // mapContext.map.removeLayer(layerRef.current);
      if (typeof props.cleanup === "function") {
        props.cleanup(mapContext.getMap(props.mapId));
      }
    };
  });
  useEffect(() => {
    if (!mapContext.mapExists(props.mapId)) return; // the MapLibre-gl instance (mapContext.map) is accessible here
    // initialize the layer and add it to the MapLibre-gl instance

    if (typeof props.mapIsReady === "function") {
      props.mapIsReady(mapContext.getMap(props.mapId));
    }
  }, [mapContext.mapIds, mapContext, props]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
};

/**
 *
 * Hides the MapLibreMap referenced by props.map2Id except for the "magnifier"-circle that reveals
 * the map and can be dragged around on top of the MapLibreMap referenced by props.map1Id
 *
 * @component
 */

const MlLayerMagnify = props => {
  const mapContext = useContext(MapContext);
  const syncMoveInitializedRef = useRef(false);
  const syncCleanupFunctionRef = useRef(null);
  const [swipeX, setSwipeX] = useState(50);
  const swipeXRef = useRef(50);
  const [swipeY, setSwipeY] = useState(50);
  const swipeYRef = useRef(50);
  const magnifierRadiusRef = useRef(props.magnifierRadius);
  const [magnifierRadius, setMagnifierRadius] = useState(magnifierRadiusRef.current);
  const mapExists = useCallback(() => {
    if (!props.map1Id || !props.map2Id) {
      return false;
    }

    if (!mapContext.getMap(props.map1Id) || !mapContext.getMap(props.map2Id)) {
      return false;
    }

    return true;
  }, [props, mapContext]);
  const onResize = useRef(() => {
    if (!mapExists()) return;
    onMove({
      clientX: swipeXRef.current,
      clientY: swipeYRef.current
    });
  });
  useEffect(() => {
    window.addEventListener("resize", onResize.current);
    let _onResize = onResize.current;
    return () => {
      window.removeEventListener("resize", _onResize);

      if (syncCleanupFunctionRef.current) {
        syncCleanupFunctionRef.current();
      }
    };
  }, []);
  const onMove = useCallback(e => {
    if (!mapExists()) return;
    let bounds = mapContext.maps[props.map1Id].getCanvas().getBoundingClientRect();
    let clientX = e.clientX || (typeof e.touches !== "undefined" && typeof e.touches[0] !== "undefined" ? e.touches[0].clientX : 0);
    let clientY = e.clientY || (typeof e.touches !== "undefined" && typeof e.touches[0] !== "undefined" ? e.touches[0].clientY : 0);
    clientX -= bounds.x;
    clientY -= bounds.y;
    let swipeX_tmp = (clientX / bounds.width * 100).toFixed(2);
    let swipeY_tmp = (clientY / bounds.height * 100).toFixed(2);

    if (swipeXRef.current !== swipeX_tmp || swipeYRef.current !== swipeY_tmp) {
      setSwipeX(swipeX_tmp);
      swipeXRef.current = swipeX_tmp;
      setSwipeY(swipeY_tmp);
      swipeYRef.current = swipeY_tmp;
      mapContext.maps[props.map2Id].getContainer().style.clipPath = "circle(".concat(magnifierRadiusRef.current, "px at ") + swipeXRef.current * bounds.width / 100 + "px " + swipeYRef.current * bounds.height / 100 + "px)";
    }
  }, [mapContext, mapExists, props]);
  useEffect(() => {
    if (!mapExists() || syncMoveInitializedRef.current) return;
    syncMoveInitializedRef.current = true;
    syncCleanupFunctionRef.current = syncMove(mapContext.getMap(props.map1Id).map, mapContext.getMap(props.map2Id).map);

    if (mapContext.maps[props.map1Id].getCanvas().clientWidth > mapContext.maps[props.map1Id].getCanvas().clientHeight && magnifierRadiusRef.current * 2 > mapContext.maps[props.map1Id].getCanvas().clientHeight) {
      magnifierRadiusRef.current = Math.floor(mapContext.maps[props.map1Id].getCanvas().clientHeight / 2);
      setMagnifierRadius(magnifierRadiusRef.current);
    }

    if (mapContext.maps[props.map1Id].getCanvas().clientHeight > mapContext.maps[props.map1Id].getCanvas().clientWidth && magnifierRadiusRef.current * 2 > mapContext.maps[props.map1Id].getCanvas().clientWidth) {
      magnifierRadiusRef.current = Math.floor(mapContext.maps[props.map1Id].getCanvas().clientWidth / 2);
      setMagnifierRadius(magnifierRadiusRef.current);
    }

    onMove({
      clientX: mapContext.maps[props.map1Id].getCanvas().clientWidth / 2,
      clientY: mapContext.maps[props.map1Id].getCanvas().clientHeight / 2
    });
  }, [mapContext.mapIds, mapContext, mapExists, props, onMove]);

  const onDown = e => {
    if (e.touches) {
      document.addEventListener("touchmove", onMove);
      document.addEventListener("touchend", onTouchEnd);
    } else {
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  };

  const onTouchEnd = () => {
    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onTouchEnd);
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const onWheel = e => {
    let evCopy = new WheelEvent(e.type, e);
    mapContext.map.getCanvas().dispatchEvent(evCopy);
  };

  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      position: "absolute",
      left: swipeX + "%",
      top: swipeY + "%",
      borderRadius: "50%",
      width: magnifierRadius * 2 + 1 + "px",
      height: magnifierRadius * 2 + 1 + "px",
      background: "rgba(0,0,0,0)",
      border: "2px solid #fafafa",
      boxShadow: "1px 2px 2px rgba(19, 19, 19, .5), inset 1px 1px 1px rgba(19, 19, 19, .2)",
      cursor: "pointer",
      zIndex: "110",
      marginLeft: magnifierRadius * -1 - 1 + "px",
      marginTop: magnifierRadius * -1 - 1 + "px",
      textAlign: "center",
      lineHeight: "91px",
      fontSize: "2em",
      color: "#fafafa",
      userSelect: "none"
    },
    onTouchStart: onDown,
    onMouseDown: onDown,
    onWheel: onWheel
  });
};

MlLayerMagnify.defaultProps = {
  magnifierRadius: 200
};
MlLayerMagnify.propTypes = {
  /**
   * Id of the first MapLibre instance
   */
  map1Id: PropTypes.string,

  /**
   * Id of the second MapLibre instance
   */
  map2Id: PropTypes.string,

  /**
   * Size of the "magnifier"-circle
   */
  magnifierRadius: PropTypes.number
};

/**
 *  MlLayerSwipe returns a Button that will add a standard OSM tile layer to the maplibre-gl instance, that you can move like a curtain.
 *
 * @component
 */

const MlLayerSwipe = props => {
  const mapContext = useContext(MapContext);
  const initializedRef = useRef(false);
  const [swipeX, setSwipeX] = useState(50);
  const swipeXRef = useRef(50);
  const syncCleanupFunctionRef = useRef(null);
  const mapExists = useCallback(() => {
    if (!props.map1Id || !props.map2Id) {
      return false;
    }

    if (!mapContext.getMap(props.map1Id) || !mapContext.getMap(props.map2Id)) {
      return false;
    }

    return true;
  }, [mapContext, props.map1Id, props.map2Id]);

  const cleanup = () => {
    if (syncCleanupFunctionRef.current) {
      syncCleanupFunctionRef.current();
    }
  };

  const onMove = useCallback(e => {
    if (!mapExists()) return;
    let bounds = mapContext.maps[props.map1Id].getCanvas().getBoundingClientRect();
    let clientX = e.clientX || (typeof e.touches !== "undefined" && typeof e.touches[0] !== "undefined" ? e.touches[0].clientX : 0);
    clientX -= bounds.x;
    let swipeX_tmp = (clientX / bounds.width * 100).toFixed(2);

    if (swipeXRef.current !== swipeX_tmp) {
      setSwipeX(swipeX_tmp);
      swipeXRef.current = swipeX_tmp;
      var clipA = "rect(0, " + swipeXRef.current * bounds.width / 100 + "px, 999em, 0)";
      mapContext.maps[props.map2Id].getContainer().style.clip = clipA;
    }
  }, [mapContext, mapExists, props.map1Id, props.map2Id]);
  useEffect(() => {
    return cleanup;
  }, []);
  useEffect(() => {
    if (!mapExists() || initializedRef.current) return;
    initializedRef.current = true;
    syncCleanupFunctionRef.current = syncMove(mapContext.getMap(props.map1Id).map, mapContext.getMap(props.map2Id).map);
    onMove({
      clientX: mapContext.maps[props.map1Id].getCanvas().clientWidth / 2
    });
  }, [mapContext.mapIds, mapContext, props, onMove, mapExists]);

  const onDown = e => {
    if (e.touches) {
      document.addEventListener("touchmove", onMove);
      document.addEventListener("touchend", onTouchEnd);
    } else {
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  };

  const onTouchEnd = () => {
    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onTouchEnd);
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      position: "absolute",
      left: swipeX + "%",
      top: "50%",
      borderRadius: "50%",
      width: "100px",
      height: "100px",
      background: "#0066ff",
      border: "3px solid #eaebf1",
      cursor: "pointer",
      zIndex: "110",
      marginLeft: "-50px",
      marginTop: "-50px",
      textAlign: "center",
      lineHeight: "91px",
      fontSize: "2em",
      color: "#fafafa",
      userSelect: "none"
    },
    onTouchStart: onDown,
    onMouseDown: onDown
  });
};

MlLayerSwipe.propTypes = {
  /**
   * Id of the first MapLibre instance.
   */
  map1Id: PropTypes.string,

  /**
   * Id of the second MapLibre instance.
   */
  map2Id: PropTypes.string
};

const GeoJsonContext = /*#__PURE__*/React__default.createContext({});
const GeoJsonContextProvider = GeoJsonContext.Provider;

/**
 * https://github.com/mapbox/togeojson
 *
 * Copyright (c) 2016 Mapbox All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var toGeoJSON = function () {
  var removeSpace = /\s*/g,
      trimSpace = /^\s*|\s*$/g,
      splitSpace = /\s+/; // generate a short, numeric hash of a string

  function okhash(x) {
    if (!x || !x.length) return 0;

    for (var i = 0, h = 0; i < x.length; i++) {
      h = (h << 5) - h + x.charCodeAt(i) | 0;
    }

    return h;
  } // all Y children of X


  function get(x, y) {
    return x.getElementsByTagName(y);
  }

  function attr(x, y) {
    return x.getAttribute(y);
  }

  function attrf(x, y) {
    return parseFloat(attr(x, y));
  } // one Y child of X, if any, otherwise null


  function get1(x, y) {
    var n = get(x, y);
    return n.length ? n[0] : null;
  } // https://developer.mozilla.org/en-US/docs/Web/API/Node.normalize


  function norm(el) {
    if (el.normalize) {
      el.normalize();
    }

    return el;
  } // cast array x into numbers


  function numarray(x) {
    for (var j = 0, o = []; j < x.length; j++) {
      o[j] = parseFloat(x[j]);
    }

    return o;
  } // get the content of a text node, if any


  function nodeVal(x) {
    if (x) {
      norm(x);
    }

    return x && x.textContent || "";
  } // get the contents of multiple text nodes, if present


  function getMulti(x, ys) {
    var o = {},
        n,
        k;

    for (k = 0; k < ys.length; k++) {
      n = get1(x, ys[k]);
      if (n) o[ys[k]] = nodeVal(n);
    }

    return o;
  } // add properties of Y to X, overwriting if present in both


  function extend(x, y) {
    for (var k in y) x[k] = y[k];
  } // get one coordinate from a coordinate array, if any


  function coord1(v) {
    return numarray(v.replace(removeSpace, "").split(","));
  } // get all coordinates from a coordinate array as [[],[]]


  function coord(v) {
    var coords = v.replace(trimSpace, "").split(splitSpace),
        o = [];

    for (var i = 0; i < coords.length; i++) {
      o.push(coord1(coords[i]));
    }

    return o;
  }

  function coordPair(x) {
    var ll = [attrf(x, "lon"), attrf(x, "lat")],
        ele = get1(x, "ele"),
        // handle namespaced attribute in browser
    heartRate = get1(x, "gpxtpx:hr") || get1(x, "hr"),
        time = get1(x, "time"),
        e;

    if (ele) {
      e = parseFloat(nodeVal(ele));

      if (!isNaN(e)) {
        ll.push(e);
      }
    }

    return {
      coordinates: ll,
      time: time ? nodeVal(time) : null,
      heartRate: heartRate ? parseFloat(nodeVal(heartRate)) : null
    };
  } // create a new feature collection parent object


  function fc() {
    return {
      type: "FeatureCollection",
      features: []
    };
  }

  var serializer;

  if (typeof XMLSerializer !== "undefined") {
    /* istanbul ignore next */
    serializer = new XMLSerializer();
  } else {
    var isNodeEnv = typeof process === "object" && !process.browser;
    var isTitaniumEnv = typeof Titanium === "object";

    if (typeof exports === "object" && (isNodeEnv || isTitaniumEnv)) {
      serializer = new (require("xmldom").XMLSerializer)();
    } else {
      throw new Error("Unable to initialize serializer");
    }
  }

  function xml2str(str) {
    // IE9 will create a new XMLSerializer but it'll crash immediately.
    // This line is ignored because we don't run coverage tests in IE9

    /* istanbul ignore next */
    if (str.xml !== undefined) return str.xml;
    return serializer.serializeToString(str);
  }

  var t = {
    kml: function (doc) {
      var gj = fc(),
          // styleindex keeps track of hashed styles in order to match features
      styleIndex = {},
          styleByHash = {},
          // stylemapindex keeps track of style maps to expose in properties
      styleMapIndex = {},
          // atomic geospatial types supported by KML - MultiGeometry is
      // handled separately
      geotypes = ["Polygon", "LineString", "Point", "Track", "gx:Track"],
          // all root placemarks in the file
      placemarks = get(doc, "Placemark"),
          styles = get(doc, "Style"),
          styleMaps = get(doc, "StyleMap");

      for (var k = 0; k < styles.length; k++) {
        var hash = okhash(xml2str(styles[k])).toString(16);
        styleIndex["#" + attr(styles[k], "id")] = hash;
        styleByHash[hash] = styles[k];
      }

      for (var l = 0; l < styleMaps.length; l++) {
        styleIndex["#" + attr(styleMaps[l], "id")] = okhash(xml2str(styleMaps[l])).toString(16);
        var pairs = get(styleMaps[l], "Pair");
        var pairsMap = {};

        for (var m = 0; m < pairs.length; m++) {
          pairsMap[nodeVal(get1(pairs[m], "key"))] = nodeVal(get1(pairs[m], "styleUrl"));
        }

        styleMapIndex["#" + attr(styleMaps[l], "id")] = pairsMap;
      }

      for (var j = 0; j < placemarks.length; j++) {
        gj.features = gj.features.concat(getPlacemark(placemarks[j]));
      }

      function kmlColor(v) {
        var color, opacity;
        v = v || "";

        if (v.substr(0, 1) === "#") {
          v = v.substr(1);
        }

        if (v.length === 6 || v.length === 3) {
          color = v;
        }

        if (v.length === 8) {
          opacity = parseInt(v.substr(0, 2), 16) / 255;
          color = "#" + v.substr(6, 2) + v.substr(4, 2) + v.substr(2, 2);
        }

        return [color, isNaN(opacity) ? undefined : opacity];
      }

      function gxCoord(v) {
        return numarray(v.split(" "));
      }

      function gxCoords(root) {
        var elems = get(root, "coord"),
            coords = [],
            times = [];
        if (elems.length === 0) elems = get(root, "gx:coord");

        for (var i = 0; i < elems.length; i++) coords.push(gxCoord(nodeVal(elems[i])));

        var timeElems = get(root, "when");

        for (var j = 0; j < timeElems.length; j++) times.push(nodeVal(timeElems[j]));

        return {
          coords: coords,
          times: times
        };
      }

      function getGeometry(root) {
        var geomNode,
            geomNodes,
            i,
            j,
            k,
            geoms = [],
            coordTimes = [];

        if (get1(root, "MultiGeometry")) {
          return getGeometry(get1(root, "MultiGeometry"));
        }

        if (get1(root, "MultiTrack")) {
          return getGeometry(get1(root, "MultiTrack"));
        }

        if (get1(root, "gx:MultiTrack")) {
          return getGeometry(get1(root, "gx:MultiTrack"));
        }

        for (i = 0; i < geotypes.length; i++) {
          geomNodes = get(root, geotypes[i]);

          if (geomNodes) {
            for (j = 0; j < geomNodes.length; j++) {
              geomNode = geomNodes[j];

              if (geotypes[i] === "Point") {
                geoms.push({
                  type: "Point",
                  coordinates: coord1(nodeVal(get1(geomNode, "coordinates")))
                });
              } else if (geotypes[i] === "LineString") {
                geoms.push({
                  type: "LineString",
                  coordinates: coord(nodeVal(get1(geomNode, "coordinates")))
                });
              } else if (geotypes[i] === "Polygon") {
                var rings = get(geomNode, "LinearRing"),
                    coords = [];

                for (k = 0; k < rings.length; k++) {
                  coords.push(coord(nodeVal(get1(rings[k], "coordinates"))));
                }

                geoms.push({
                  type: "Polygon",
                  coordinates: coords
                });
              } else if (geotypes[i] === "Track" || geotypes[i] === "gx:Track") {
                var track = gxCoords(geomNode);
                geoms.push({
                  type: "LineString",
                  coordinates: track.coords
                });
                if (track.times.length) coordTimes.push(track.times);
              }
            }
          }
        }

        return {
          geoms: geoms,
          coordTimes: coordTimes
        };
      }

      function getPlacemark(root) {
        var geomsAndTimes = getGeometry(root),
            i,
            properties = {},
            name = nodeVal(get1(root, "name")),
            address = nodeVal(get1(root, "address")),
            styleUrl = nodeVal(get1(root, "styleUrl")),
            description = nodeVal(get1(root, "description")),
            timeSpan = get1(root, "TimeSpan"),
            timeStamp = get1(root, "TimeStamp"),
            extendedData = get1(root, "ExtendedData"),
            lineStyle = get1(root, "LineStyle"),
            polyStyle = get1(root, "PolyStyle"),
            visibility = get1(root, "visibility");
        if (!geomsAndTimes.geoms.length) return [];
        if (name) properties.name = name;
        if (address) properties.address = address;

        if (styleUrl) {
          if (styleUrl[0] !== "#") {
            styleUrl = "#" + styleUrl;
          }

          properties.styleUrl = styleUrl;

          if (styleIndex[styleUrl]) {
            properties.styleHash = styleIndex[styleUrl];
          }

          if (styleMapIndex[styleUrl]) {
            properties.styleMapHash = styleMapIndex[styleUrl];
            properties.styleHash = styleIndex[styleMapIndex[styleUrl].normal];
          } // Try to populate the lineStyle or polyStyle since we got the style hash


          var style = styleByHash[properties.styleHash];

          if (style) {
            if (!lineStyle) lineStyle = get1(style, "LineStyle");
            if (!polyStyle) polyStyle = get1(style, "PolyStyle");
            var iconStyle = get1(style, "IconStyle");

            if (iconStyle) {
              var icon = get1(iconStyle, "Icon");

              if (icon) {
                var href = nodeVal(get1(icon, "href"));
                if (href) properties.icon = href;
              }
            }
          }
        }

        if (description) properties.description = description;

        if (timeSpan) {
          var begin = nodeVal(get1(timeSpan, "begin"));
          var end = nodeVal(get1(timeSpan, "end"));
          properties.timespan = {
            begin: begin,
            end: end
          };
        }

        if (timeStamp) {
          properties.timestamp = nodeVal(get1(timeStamp, "when"));
        }

        if (lineStyle) {
          var linestyles = kmlColor(nodeVal(get1(lineStyle, "color"))),
              color = linestyles[0],
              opacity = linestyles[1],
              width = parseFloat(nodeVal(get1(lineStyle, "width")));
          if (color) properties.stroke = color;
          if (!isNaN(opacity)) properties["stroke-opacity"] = opacity;
          if (!isNaN(width)) properties["stroke-width"] = width;
        }

        if (polyStyle) {
          var polystyles = kmlColor(nodeVal(get1(polyStyle, "color"))),
              pcolor = polystyles[0],
              popacity = polystyles[1],
              fill = nodeVal(get1(polyStyle, "fill")),
              outline = nodeVal(get1(polyStyle, "outline"));
          if (pcolor) properties.fill = pcolor;
          if (!isNaN(popacity)) properties["fill-opacity"] = popacity;
          if (fill) properties["fill-opacity"] = fill === "1" ? properties["fill-opacity"] || 1 : 0;
          if (outline) properties["stroke-opacity"] = outline === "1" ? properties["stroke-opacity"] || 1 : 0;
        }

        if (extendedData) {
          var datas = get(extendedData, "Data"),
              simpleDatas = get(extendedData, "SimpleData");

          for (i = 0; i < datas.length; i++) {
            properties[datas[i].getAttribute("name")] = nodeVal(get1(datas[i], "value"));
          }

          for (i = 0; i < simpleDatas.length; i++) {
            properties[simpleDatas[i].getAttribute("name")] = nodeVal(simpleDatas[i]);
          }
        }

        if (visibility) {
          properties.visibility = nodeVal(visibility);
        }

        if (geomsAndTimes.coordTimes.length) {
          properties.coordTimes = geomsAndTimes.coordTimes.length === 1 ? geomsAndTimes.coordTimes[0] : geomsAndTimes.coordTimes;
        }

        var feature = {
          type: "Feature",
          geometry: geomsAndTimes.geoms.length === 1 ? geomsAndTimes.geoms[0] : {
            type: "GeometryCollection",
            geometries: geomsAndTimes.geoms
          },
          properties: properties
        };
        if (attr(root, "id")) feature.id = attr(root, "id");
        return [feature];
      }

      return gj;
    },
    gpx: function (doc) {
      var i,
          tracks = get(doc, "trk"),
          routes = get(doc, "rte"),
          waypoints = get(doc, "wpt"),
          // a feature collection
      gj = fc(),
          feature;

      for (i = 0; i < tracks.length; i++) {
        feature = getTrack(tracks[i]);
        if (feature) gj.features.push(feature);
      }

      for (i = 0; i < routes.length; i++) {
        feature = getRoute(routes[i]);
        if (feature) gj.features.push(feature);
      }

      for (i = 0; i < waypoints.length; i++) {
        gj.features.push(getPoint(waypoints[i]));
      }

      function initializeArray(arr, size) {
        for (var h = 0; h < size; h++) {
          arr.push(null);
        }

        return arr;
      }

      function getPoints(node, pointname) {
        var pts = get(node, pointname),
            line = [],
            times = [],
            heartRates = [],
            l = pts.length;
        if (l < 2) return {}; // Invalid line in GeoJSON

        for (var i = 0; i < l; i++) {
          var c = coordPair(pts[i]);
          line.push(c.coordinates);
          if (c.time) times.push(c.time);

          if (c.heartRate || heartRates.length) {
            if (!heartRates.length) initializeArray(heartRates, i);
            heartRates.push(c.heartRate || null);
          }
        }

        return {
          line: line,
          times: times,
          heartRates: heartRates
        };
      }

      function getTrack(node) {
        var segments = get(node, "trkseg"),
            track = [],
            times = [],
            heartRates = [],
            line;

        for (var i = 0; i < segments.length; i++) {
          line = getPoints(segments[i], "trkpt");

          if (line) {
            if (line.line) track.push(line.line);
            if (line.times && line.times.length) times.push(line.times);

            if (heartRates.length || line.heartRates && line.heartRates.length) {
              if (!heartRates.length) {
                for (var s = 0; s < i; s++) {
                  heartRates.push(initializeArray([], track[s].length));
                }
              }

              if (line.heartRates && line.heartRates.length) {
                heartRates.push(line.heartRates);
              } else {
                heartRates.push(initializeArray([], line.line.length || 0));
              }
            }
          }
        }

        if (track.length === 0) return;
        var properties = getProperties(node);
        extend(properties, getLineStyle(get1(node, "extensions")));
        if (times.length) properties.coordTimes = track.length === 1 ? times[0] : times;
        if (heartRates.length) properties.heartRates = track.length === 1 ? heartRates[0] : heartRates;
        return {
          type: "Feature",
          properties: properties,
          geometry: {
            type: track.length === 1 ? "LineString" : "MultiLineString",
            coordinates: track.length === 1 ? track[0] : track
          }
        };
      }

      function getRoute(node) {
        var line = getPoints(node, "rtept");
        if (!line.line) return;
        var prop = getProperties(node);
        extend(prop, getLineStyle(get1(node, "extensions")));
        var routeObj = {
          type: "Feature",
          properties: prop,
          geometry: {
            type: "LineString",
            coordinates: line.line
          }
        };
        return routeObj;
      }

      function getPoint(node) {
        var prop = getProperties(node);
        extend(prop, getMulti(node, ["sym"]));
        return {
          type: "Feature",
          properties: prop,
          geometry: {
            type: "Point",
            coordinates: coordPair(node).coordinates
          }
        };
      }

      function getLineStyle(extensions) {
        var style = {};

        if (extensions) {
          var lineStyle = get1(extensions, "line");

          if (lineStyle) {
            var color = nodeVal(get1(lineStyle, "color")),
                opacity = parseFloat(nodeVal(get1(lineStyle, "opacity"))),
                width = parseFloat(nodeVal(get1(lineStyle, "width")));
            if (color) style.stroke = color;
            if (!isNaN(opacity)) style["stroke-opacity"] = opacity; // GPX width is in mm, convert to px with 96 px per inch

            if (!isNaN(width)) style["stroke-width"] = width * 96 / 25.4;
          }
        }

        return style;
      }

      function getProperties(node) {
        var prop = getMulti(node, ["name", "cmt", "desc", "type", "time", "keywords"]),
            links = get(node, "link");
        if (links.length) prop.links = [];

        for (var i = 0, link; i < links.length; i++) {
          link = {
            href: attr(links[i], "href")
          };
          extend(link, getMulti(links[i], ["text", "type"]));
          prop.links.push(link);
        }

        return prop;
      }

      return gj;
    }
  };
  return t;
}();

/**
 * MlGPXViewer returns a dropzone and a button to load a GPX Track into the map.
 *
 * @component
 */

const MlGPXViewer = props => {
  const dataSource = useContext(GeoJsonContext);
  const initializedRef = useRef(false);
  const mapHook = useMap({
    mapId: props.mapId,
    waitForLayer: props.insertBeforeLayer
  });
  const sourceName = "import-source";
  const layerNameLines = "importer-layer-lines";
  const layerNamePoints = "importer-layer-points";
  const [open, setIsOpen] = useState(false);
  const dropZone = useRef(null);
  const [zIndex, setZIndex] = useState(0);
  const [metaData, setMetaData] = useState([]);
  const fileupload = useRef(null);
  const mediaIsMobile = useMediaQuery("(max-width:900px)");
  const popup = useRef(new Popup({
    closeButton: false,
    closeOnClick: true
  }));
  useEffect(() => {
    if (!mapHook.map || initializedRef.current) return;
    initializedRef.current = true;
    mapHook.map.addSource(sourceName, {
      type: "geojson",
      data: dataSource.data
    }, mapHook.componentId);
    mapHook.map.addLayer({
      id: layerNameLines,
      source: sourceName,
      type: "line",
      paint: {
        "line-width": 4,
        "line-color": "rgba(212, 55, 23,0.5)"
      }
    }, props.insertBeforeLayer, mapHook.componentId);
    mapHook.map.addLayer({
      id: layerNamePoints,
      source: sourceName,
      type: "circle",
      paint: {
        "circle-color": "rgba(72, 77, 99,0.5)",
        "circle-radius": 7
      },
      filter: ["==", "$type", "Point"]
    }, props.insertBeforeLayer, mapHook.componentId);
    [layerNameLines, layerNamePoints].forEach(layerName => {
      mapHook.map.setLayoutProperty(layerName, "visibility", "visible");
    });
    mapHook.map.on("mouseenter", layerNamePoints, e => {
      // Change the cursor style as a UI indicator.
      const coordinates = e.features[0].geometry.coordinates.slice(); //const description = e.features[0].properties.desc;

      const name = e.features[0].properties.name; // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      } // Populate the popup and set its coordinates
      // based on the feature found.


      popup.current.setLngLat(coordinates).setHTML(name).addTo(mapHook.map);
    }, mapHook.componentId);
    mapHook.map.on("mouseleave", "places", function () {
      mapHook.map.getCanvas().style.cursor = "";
      popup.current.remove();
    }, mapHook.componentId);
    mapHook.map.setZoom(10);
  }, [mapHook.map]);
  useEffect(() => {
    const dropZoneCurrent = dropZone.current;

    const raiseDropZoneAndStopDefault = event => {
      setZIndex(1000);
      stopDefault(event);
    };

    const lowerDropZone = () => {
      setZIndex(0);
    };

    const lowerDropZoneAndStopDefault = event => {
      setZIndex(0);
      stopDefault(event);
    };

    window.addEventListener("dragenter", raiseDropZoneAndStopDefault);
    window.addEventListener("dragover", stopDefault);
    dropZoneCurrent.addEventListener("dragleave", lowerDropZone);
    window.addEventListener("drop", lowerDropZoneAndStopDefault);
    return () => {
      window.removeEventListener("dragenter", raiseDropZoneAndStopDefault);
      window.removeEventListener("dragover", stopDefault);
      dropZoneCurrent.removeEventListener("dragleave", lowerDropZone);
      window.removeEventListener("drop", lowerDropZoneAndStopDefault);
    };
  });

  const stopDefault = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  useEffect(() => {
    if (!mapHook.map) return;
    const visibility = props.visible ? "visible" : "none";
    [layerNameLines, layerNamePoints].forEach(layerName => {
      mapHook.map.setLayoutProperty(layerName, "visibility", visibility);
    });
  }, [props.visible]);

  const dropHandler = event => {
    event.preventDefault();

    if (event.dataTransfer.items) {
      if (event.dataTransfer.items.length > 1) {
        return false;
      } // If dropped items aren't files, reject them


      if (event.dataTransfer.items[0].kind === "file") {
        const reader = new FileReader();

        reader.onload = payload => {
          addGPXToMap(payload.currentTarget.result);
        };

        const file = event.dataTransfer.items[0].getAsFile();
        reader.readAsText(file);
      }
    }
  };

  const addGPXToMap = gpxAsString => {
    if (!mapHook.map) return;

    try {
      setMetaData([]);
      const domParser = new DOMParser();
      const gpxDoc = domParser.parseFromString(gpxAsString, "application/xml");
      const metadata = gpxDoc.querySelector("metadata");
      metadata.childNodes.forEach(node => {
        let value = node.textContent;
        const title = node.nodeName;

        if (node.nodeName === "link") {
          value = node.getAttribute("href");
        }

        if (!!value.trim().length) {
          const metaDatEntry = {
            title: title,
            value: value,
            id: new Date().getTime()
          };
          setMetaData(prevState => [...prevState, metaDatEntry]);
        }
      });
      const data = toGeoJSON.gpx(gpxDoc);
      dataSource.setData(data);
      mapHook.map.getSource(sourceName).setData(data);
      const bounds = bbox(data);
      mapHook.map.fitBounds(bounds);
    } catch (e) {
      console.log(e);
    }
  };

  const toogleDrawer = () => {
    setIsOpen(prevState => !prevState);
  };

  const fileUploadOnChange = () => {
    const file = fileupload.current.files[0];
    if (!file) return false;
    const reader = new FileReader();

    reader.onload = payload => {
      addGPXToMap(payload.currentTarget.result);
    };

    reader.readAsText(file);
  };

  const manualUpload = () => {
    fileupload.current.click();
  };

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    style: {
      position: "fixed",
      right: "5px",
      bottom: mediaIsMobile ? "40px" : "25px",
      display: "flex",
      flexDirection: "column",
      gap: "5px",
      zIndex: 1000
    }
  }, /*#__PURE__*/React__default.createElement(IconButton, {
    onClick: manualUpload,
    style: {
      backgroundColor: "rgba(255,255,255,1)"
    },
    size: "large"
  }, /*#__PURE__*/React__default.createElement("input", {
    ref: fileupload,
    onChange: fileUploadOnChange,
    type: "file",
    id: "input",
    multiple: true,
    style: {
      display: "none"
    }
  }), /*#__PURE__*/React__default.createElement(FileCopy, null)), /*#__PURE__*/React__default.createElement(IconButton, {
    onClick: toogleDrawer,
    style: {
      backgroundColor: "rgba(255,255,255,1)"
    },
    size: "large"
  }, /*#__PURE__*/React__default.createElement(InfoIcon, null))), /*#__PURE__*/React__default.createElement(Drawer, {
    variant: "persistent",
    anchor: "left",
    open: open
  }, /*#__PURE__*/React__default.createElement(Typography, {
    variant: "h6",
    style: {
      textAlign: "center",
      padding: "1em"
    },
    noWrap: true
  }, "Informationen zur Route"), /*#__PURE__*/React__default.createElement(Divider, null), /*#__PURE__*/React__default.createElement(List, null, metaData.map(item => /*#__PURE__*/React__default.createElement(ListItem, {
    key: "item--".concat(item.id)
  }, /*#__PURE__*/React__default.createElement(ListItemText, {
    primary: item.value
  }))))), /*#__PURE__*/React__default.createElement("div", {
    onDrop: dropHandler,
    ref: dropZone,
    style: {
      position: "absolute",
      left: "0",
      top: "0",
      backgroundColor: "rgba(255,255,255,0.5)",
      width: "100%",
      height: "100%",
      zIndex: zIndex
    }
  }, /*#__PURE__*/React__default.createElement(Typography, {
    variant: "h6",
    style: {
      top: "50%",
      position: "absolute",
      left: "50%",
      msTransform: "translate(-50%, -50%)",
      transform: " translate(-50%, -50%)"
    },
    noWrap: true
  }, "Gpx-Datei ablegen")));
};

MlGPXViewer.defaultProps = {
  visible: true
};
MlGPXViewer.propTypes = {
  /**
   * Id of the target MapLibre instance in mapHook
   */
  mapId: PropTypes.string,

  /**
   * Prefix of the component id this component uses when adding elements to the MapLibreGl-instance
   */
  idPrefix: PropTypes.string,

  /**
   * Sets the layers layout-property "visibility" to "none" if false or "visible" if true
   */
  visible: PropTypes.bool,

  /**
   * The layerId of an existing layer this layer should be rendered visually beneath
   * https://maplibre.org/maplibre-gl-js-docs/api/map/#map#addlayer - see "beforeId" property
   */
  insertBeforeLayer: PropTypes.string
};

const GeoJsonProvider = _ref => {
  let {
    children
  } = _ref;
  const [data, setData] = useState({
    type: "FeatureCollection",
    features: []
  });

  const getEmptyFeatureCollection = () => {
    return {
      type: "FeatureCollection",
      features: []
    };
  };

  const value = {
    data,
    setData,
    getEmptyFeatureCollection
  };
  return /*#__PURE__*/React__default.createElement(GeoJsonContextProvider, {
    value: value
  }, children);
};

GeoJsonProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * MlSpatialElevationProfile returns a Button that will add a standard OSM tile layer to the maplibre-gl instance.
 *
 * @component
 */

const MlSpatialElevationProfile = props => {
  const mapContext = useContext(MapContext);
  const componentId = useRef((props.idPrefix ? props.idPrefix : "MlSpatialElevationProfile-") + v4());
  const mapRef = useRef(null);
  const initializedRef = useRef(false);
  const dataSource = useContext(GeoJsonContext);
  const sourceName = useRef("elevationprofile-" + v4());
  const layerName = useRef("elevationprofile-layer-" + v4());
  const createStep = useCallback((x, y, z, x2, y2) => {
    //const summand = 0.0002;
    const line = lineString([[x, y], [x2, y2]]);
    const offsetLine = lineOffset(line, 5, {
      units: "meters"
    });
    const x3 = offsetLine.geometry.coordinates[0][0];
    const y3 = offsetLine.geometry.coordinates[0][1];
    const x4 = offsetLine.geometry.coordinates[1][0];
    const y4 = offsetLine.geometry.coordinates[1][1];
    return polygon([[[x, y], [x2, y2], [x4, y4], [x3, y3], [x, y]]], {
      height: z * props.elevationFactor
    });
  }, [props.elevationFactor]);
  useEffect(() => {
    let _componentId = componentId.current;
    return () => {
      // This is the cleanup function, it is called when this react component is removed from react-dom
      if (mapRef.current) {
        mapRef.current.cleanup(_componentId);
        mapRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (!mapContext.mapExists(props.mapId) || initializedRef.current) return;
    initializedRef.current = true;
    mapRef.current = mapContext.getMap(props.mapId);
    mapRef.current.addSource(sourceName.current, {
      type: "geojson",
      data: dataSource.data
    }, componentId.current);
    mapRef.current.addLayer({
      id: layerName.current,
      source: sourceName.current,
      type: "fill-extrusion",
      paint: {
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-opacity": 0.9,
        "fill-extrusion-color": ["interpolate", ["linear"], ["get", "height"], 0, "rgba(0, 0, 255, 0)", 0.1, "royalblue", 0.3, "cyan", 0.5, "lime", 0.7, "yellow", 1, "yellow"]
      }
    }, props.insertBeforeLayer, componentId.current);
  }, [mapContext.mapIds, props.insertBeforeLayer, props.mapId, dataSource, mapContext]);
  useEffect(() => {
    var _mapRef$current$getSo;

    if (!mapRef.current || !mapRef.current.getLayer(layerName.current)) return;
    const {
      data
    } = dataSource;
    if (!data || !data.features) return;
    const line = data.features.find(element => {
      return element.geometry.type === "LineString";
    });
    if (!line || !line.geometry) return;
    const heights = line.geometry.coordinates.map((coordinate, index) => {
      return coordinate[2];
    });
    const min = Math.min(...heights);
    let max = Math.max(...heights) - min;
    max = max === 0 ? 1 : max;
    mapRef.current.setPaintProperty(layerName.current, "fill-extrusion-color", ["interpolate", ["linear"], ["get", "height"], 0, "rgb(0,255,55)", max * props.elevationFactor, "rgb(255,0,0)"]);

    const lerp = (x, y, a) => x * (1 - a) + y * a;

    const points = [];
    line.geometry.coordinates.forEach((coordinate, index) => {
      //const point = createPoint(coordinate[0],coordinate[1],coordinate[2]-min);
      //points.push(point);
      if (line.geometry.coordinates[index + 1]) {
        const wayLength = distance([coordinate[0], coordinate[1]], [line.geometry.coordinates[index + 1][0], line.geometry.coordinates[index + 1][1]], {
          units: "kilometers"
        });
        let listLength = ~~(wayLength * 1000 / 10);
        listLength = listLength < 1 ? 1 : listLength;

        for (let i = 0; i < listLength; i++) {
          const x = lerp(line.geometry.coordinates[index][0], line.geometry.coordinates[index + 1][0], i / listLength);
          const y = lerp(line.geometry.coordinates[index][1], line.geometry.coordinates[index + 1][1], i / listLength);
          const z = lerp(line.geometry.coordinates[index][2] - min, line.geometry.coordinates[index + 1][2] - min, i / listLength);
          const x2 = lerp(line.geometry.coordinates[index][0], line.geometry.coordinates[index + 1][0], (i + 1) / listLength);
          const y2 = lerp(line.geometry.coordinates[index][1], line.geometry.coordinates[index + 1][1], (i + 1) / listLength);
          const point = createStep(x, y, z, x2, y2);
          points.push(point);
        }
      }
    });
    const newData = dataSource.getEmptyFeatureCollection();
    newData.features = points;
    (_mapRef$current$getSo = mapRef.current.getSource(sourceName.current)) === null || _mapRef$current$getSo === void 0 ? void 0 : _mapRef$current$getSo.setData(newData);
  }, [dataSource.data, createStep, dataSource, props.elevationFactor, mapContext]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
};

MlSpatialElevationProfile.defaultProps = {
  elevationFactor: 1
};
MlSpatialElevationProfile.propTypes = {
  /**
   * Id of the target MapLibre instance in mapContext
   */
  mapId: PropTypes.string,

  /**
   * Prefix of the component id this component uses when adding elements to the MapLibreGl-instance
   */
  idPrefix: PropTypes.string,

  /**
   * Number describes the factor of the height of the elevation
   */
  elevationFactor: PropTypes.number,

  /**
   * The layerId of an existing layer this layer should be rendered visually beneath
   * https://maplibre.org/maplibre-gl-js-docs/api/map/#map#addlayer - see "beforeId" property
   */
  insertBeforeLayer: PropTypes.string
};

function _extends$3() {
  _extends$3 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$3.apply(this, arguments);
}

const _showNextTransitionSegment = function (props, map, transitionInProgressRef, transitionGeojsonDataRef, transitionGeojsonCommonDataRef, currentTransitionStepRef, msPerStep, transitionTimeoutRef, setDisplayGeojson) {
  if (typeof transitionGeojsonDataRef.current[currentTransitionStepRef.current] !== "undefined") {
    // if at last transition step set to target geojson
    // else to an assembled LineString from common geometry and the current transition step geometry
    let newData = currentTransitionStepRef.current + 1 === transitionGeojsonDataRef.current.length ? props.geojson : lineString$1([...transitionGeojsonCommonDataRef.current, ...transitionGeojsonDataRef.current[currentTransitionStepRef.current].geometry.coordinates]);
    setDisplayGeojson(newData);

    if (typeof props.onTransitionFrame === "function") {
      props.onTransitionFrame(newData);
    }

    currentTransitionStepRef.current++;

    if (transitionInProgressRef.current && currentTransitionStepRef.current < transitionGeojsonDataRef.current.length) {
      transitionTimeoutRef.current = setTimeout(() => _showNextTransitionSegment(...arguments), msPerStep);
    } else {
      if (typeof props.onTransitionEnd === "function") {
        props.onTransitionEnd(props.geojson);
      }

      transitionInProgressRef.current = false;
    }
  }
};

const _transitionToGeojson = (props, transitionGeojsonCommonDataRef, transitionGeojsonDataRef, transitionInProgressRef, oldGeojsonRef, msPerStep, currentTransitionStepRef, map, transitionTimeoutRef, setDisplayGeojson) => {
  // create the transition geojson between oldGeojsonRef.current and props.geojson
  // create a geojson that contains no common point between the two line features
  let transitionCoordinatesShort = [];
  let transitionCoordinatesLong = [];
  let targetCoordinates = [];
  let srcCoordinates = [];
  transitionGeojsonCommonDataRef.current = [];
  let sourceGeojson = oldGeojsonRef.current || {
    geometry: {
      type: "LineString",
      coordinates: []
    },
    properties: {},
    type: "Feature"
  };
  let targetGeojson = props.geojson;
  let longerGeojson = targetGeojson;
  let shorterGeojson = sourceGeojson;
  let reverseOrder = false; // In case one geojson is missing completely use the first two coordinates of the other geojson

  if (typeof longerGeojson.geometry === "undefined" && typeof shorterGeojson.geometry !== "undefined" && shorterGeojson.geometry.coordinates.length > 1) {
    longerGeojson = lineString$1(shorterGeojson.geometry.coordinates.slice(0, 2));
  } else if (typeof shorterGeojson.geometry === "undefined" && typeof longerGeojson.geometry !== "undefined" && longerGeojson.geometry.coordinates.length > 1) {
    shorterGeojson = lineString$1(longerGeojson.geometry.coordinates.slice(0, 2));
  } else if (typeof shorterGeojson.geometry === "undefined" && typeof longerGeojson.geometry === "undefined") {
    return;
  }

  if (longerGeojson.geometry.coordinates.length < shorterGeojson.geometry.coordinates.length) {
    longerGeojson = sourceGeojson;
    shorterGeojson = targetGeojson;
    reverseOrder = true;
  }

  if (longerGeojson && shorterGeojson) {
    for (var i = 0, len = longerGeojson.geometry.coordinates.length; i < len; i++) {
      if (typeof shorterGeojson.geometry.coordinates[i] !== "undefined" && longerGeojson.geometry.coordinates[i][0] === shorterGeojson.geometry.coordinates[i][0] && longerGeojson.geometry.coordinates[i][1] === shorterGeojson.geometry.coordinates[i][1]) {
        // if coordinates are equal
        transitionGeojsonCommonDataRef.current.push(longerGeojson.geometry.coordinates[i]);
      } else {
        if (typeof longerGeojson.geometry.coordinates[i] !== "undefined") {
          transitionCoordinatesLong.push(longerGeojson.geometry.coordinates[i]);
        }

        if (typeof shorterGeojson.geometry.coordinates[i] !== "undefined") {
          transitionCoordinatesShort.push(shorterGeojson.geometry.coordinates[i]);
        }
      }
    }
  }

  if (reverseOrder) {
    targetCoordinates = transitionCoordinatesShort;
    srcCoordinates = transitionCoordinatesLong;
  } else {
    targetCoordinates = transitionCoordinatesLong;
    srcCoordinates = transitionCoordinatesShort;
  }

  if (targetCoordinates.length < 2 && srcCoordinates < 2) return; // create props.transitionTime / msPerStep (=: transitionSteps) Versions of transitionGeojsonCommonDataRef.current + transitionCoordinates making the transitionCoordinates transitionCoordinatesDistance / transitionSteps longer on each step

  let transitionSteps = props.transitionTime / msPerStep;
  let srcCoordinatesDistance = srcCoordinates.length > 1 ? Math.round(length(lineString$1(srcCoordinates))) : 0;
  let targetCoordinatesDistance = targetCoordinates.length > 1 ? Math.round(length(lineString$1(targetCoordinates))) : 0;
  let transitionDistance = targetCoordinatesDistance + srcCoordinatesDistance;
  let srcCoordinatesShare = srcCoordinatesDistance / transitionDistance;
  let srcTransitionSteps = Math.round(transitionSteps * srcCoordinatesShare);
  let srcPerStepDistance = Math.round(srcCoordinatesDistance / srcTransitionSteps * 100) / 100;
  let targetCoordinatesShare = targetCoordinatesDistance / transitionDistance;
  let targetTransitionSteps = Math.round(transitionSteps * targetCoordinatesShare);
  let targetPerStepDistance = Math.round(targetCoordinatesDistance / targetTransitionSteps * 100) / 100; // use srcPerStepDistance as src coordinates are always animated backwards


  let transitionStepData;
  transitionStepData = [...createTransitionSteps(srcCoordinates, srcPerStepDistance, srcTransitionSteps)];
  transitionStepData.reverse();
  transitionStepData = [...transitionStepData, ...createTransitionSteps(targetCoordinates, targetPerStepDistance, targetTransitionSteps)];
  transitionStepData.push(targetGeojson);
  transitionGeojsonDataRef.current = transitionStepData;
  currentTransitionStepRef.current = 1;
  transitionInProgressRef.current = true;
  transitionTimeoutRef.current = setTimeout(() => _showNextTransitionSegment(props, map, transitionInProgressRef, transitionGeojsonDataRef, transitionGeojsonCommonDataRef, currentTransitionStepRef, msPerStep, transitionTimeoutRef, setDisplayGeojson), msPerStep);
};

let createTransitionSteps = (linestringCoordinates, perStepDistance, stepCnt) => {
  let transitionSteps = [];

  if (linestringCoordinates.length > 1) {
    let tmpChunks = lineChunk(lineString$1(linestringCoordinates), perStepDistance); // tmpLineString contains all coordinates of all previous plus current loop iteration

    let tmpLinestring = tmpChunks.features[0];

    for (let i = 0; i < stepCnt; i++) {
      transitionSteps.push(tmpLinestring);

      if (typeof tmpChunks.features[i] !== "undefined") {
        tmpLinestring = lineString$1([...tmpLinestring.geometry.coordinates, ...tmpChunks.features[i].geometry.coordinates]);
      } else {
        break;
      }
    }
  }

  return transitionSteps;
};

const msPerStep = 50;
/**
 * Adds source and layer of types "line", "fill" or "circle" to display GeoJSON data on the map.
 *
 * @component
 */

const MlTransitionGeoJsonLayer = props => {
  const {
    geojson,
    ...restProps
  } = props; // Use a useRef hook to reference the layer object to be able to access it later inside useEffect hooks

  const mapHook = useMap({
    mapId: props.mapId,
    waitForLayer: props.insertBeforeLayer
  });
  const initializedRef = useRef(false); // transition effect variables

  const oldGeojsonRef = useRef(null);
  const transitionInProgressRef = useRef(false);
  const transitionTimeoutRef = useRef(undefined);
  const currentTransitionStepRef = useRef(false);
  const transitionGeojsonDataRef = useRef([]);
  const transitionGeojsonCommonDataRef = useRef([]);
  const [displayGeojson, setDisplayGeojson] = useState(featureCollection([]));
  useEffect(() => {
    return () => {
      // This is the cleanup function, it is called when this react component is removed from react-dom
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);
  const transitionToGeojson = useCallback(() => {
    _transitionToGeojson(props, transitionGeojsonCommonDataRef, transitionGeojsonDataRef, transitionInProgressRef, oldGeojsonRef, msPerStep, currentTransitionStepRef, mapHook.map, transitionTimeoutRef, setDisplayGeojson);
  }, [props, mapHook.map]);
  useEffect(() => {
    if (!mapHook.map || !initializedRef.current) return;

    if (typeof props.transitionTime !== "undefined" && props.type === "line" && oldGeojsonRef.current) {
      transitionInProgressRef.current = false;
      currentTransitionStepRef.current = false;
      transitionGeojsonDataRef.current = [];
      transitionGeojsonCommonDataRef.current = [];
      transitionToGeojson();
    }

    oldGeojsonRef.current = props.geojson;
  }, [mapHook.map, transitionToGeojson, props]);
  const startTransition = useCallback(() => {
    if (props.type === "line" && typeof props.transitionTime !== "undefined" && props.transitionTime && typeof props.geojson.geometry !== "undefined" && JSON.stringify(oldGeojsonRef.current) !== JSON.stringify(props.geojson)) {
      transitionToGeojson(props.geojson);
      oldGeojsonRef.current = props.geojson;
    }
  }, [props, transitionToGeojson]);
  useEffect(() => {
    if (!mapHook.mapIsReady || !props.geojson) return;
    initializedRef.current = true;
    startTransition();
  }, [mapHook.mapIsReady, startTransition, props]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(MlGeoJsonLayer, _extends$3({}, restProps, {
    geojson: displayGeojson
  })));
};

MlTransitionGeoJsonLayer.propTypes = {
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
   * Javascript object with optional properties "fill", "line", "circle" to override implicit layer type default paint properties.
   */
  defaultPaintOverrides: PropTypes.object,

  /**
   * Javascript object that is spread into the addLayer commands first parameter.
   */
  options: PropTypes.object,

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
  transitionTime: PropTypes.number
};

/**
 * Adds a marker to the map and displays a marker description next to it
 *
 * @param {object} props
 * @param {string} props.mapId Id of the target MapLibre instance in mapContext
 * @param {number} props.lng
 * @param {number} props.lat
 * @param {string} props.content
 *
 * @component
 */

const MlMarker = props => {
  const mapContext = useContext(MapContext);
  const mapState = useMapState({
    mapId: props.mapId,
    watch: {
      viewport: true
    }
  });
  const iframe = useRef(undefined);
  const initializedRef = useRef(false);
  const mapRef = useRef(undefined);
  const componentId = useRef((props.idPrefix ? props.idPrefix : "MlMarker-") + v4());
  const [iframeDimensions, setIframeDimensions] = useState({
    width: "400px",
    height: "500px"
  });
  const [markerPixelPos, setMarkerPixelPos] = useState(undefined);
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
    if (!mapContext.mapExists(props.mapId) || initializedRef.current) return; // the MapLibre-gl instance (mapContext.getMap(props.mapId)) is accessible here
    // initialize the layer and add it to the MapLibre-gl instance or do something else with it

    initializedRef.current = true;
    mapRef.current = mapContext.getMap(props.mapId);
  }, [mapContext.mapIds, mapContext, props.mapId]);
  useEffect(() => {
    var _mapRef$current;

    if (!((_mapRef$current = mapRef.current) !== null && _mapRef$current !== void 0 && _mapRef$current.project)) return;

    const _pixelPos = mapRef.current.project([props.lng, props.lat]);

    setMarkerPixelPos(_pixelPos);
  }, [props.lng, props.lat, mapState.viewport]);
  useEffect(() => {
    var _iframe$current, _iframe$current$conte, _iframe$current$conte2, _iframe$current$conte3;

    if (mapRef.current && (_iframe$current = iframe.current) !== null && _iframe$current !== void 0 && (_iframe$current$conte = _iframe$current.contentWindow) !== null && _iframe$current$conte !== void 0 && (_iframe$current$conte2 = _iframe$current$conte.document) !== null && _iframe$current$conte2 !== void 0 && (_iframe$current$conte3 = _iframe$current$conte2.body) !== null && _iframe$current$conte3 !== void 0 && _iframe$current$conte3.scrollHeight) {
      setTimeout(() => {
        var _iframe$current2, _iframe$current2$cont, _iframe$current2$cont2, _iframe$current2$cont3, _iframe$current3, _iframe$current3$cont, _iframe$current3$cont2, _iframe$current3$cont3;

        let mapHeight = mapRef.current._container.clientHeight;

        const _pixelPos = mapRef.current.project([props.lng, props.lat]);

        let pixelToBottom = mapHeight - _pixelPos.y;
        let iframeHeight = (_iframe$current2 = iframe.current) === null || _iframe$current2 === void 0 ? void 0 : (_iframe$current2$cont = _iframe$current2.contentWindow) === null || _iframe$current2$cont === void 0 ? void 0 : (_iframe$current2$cont2 = _iframe$current2$cont.document) === null || _iframe$current2$cont2 === void 0 ? void 0 : (_iframe$current2$cont3 = _iframe$current2$cont2.body) === null || _iframe$current2$cont3 === void 0 ? void 0 : _iframe$current2$cont3.scrollHeight;
        let iframeWidth = (_iframe$current3 = iframe.current) === null || _iframe$current3 === void 0 ? void 0 : (_iframe$current3$cont = _iframe$current3.contentWindow) === null || _iframe$current3$cont === void 0 ? void 0 : (_iframe$current3$cont2 = _iframe$current3$cont.document) === null || _iframe$current3$cont2 === void 0 ? void 0 : (_iframe$current3$cont3 = _iframe$current3$cont2.body) === null || _iframe$current3$cont3 === void 0 ? void 0 : _iframe$current3$cont3.scrollWidth;
        setIframeDimensions({
          width: iframeWidth,
          height: pixelToBottom < iframeHeight ? pixelToBottom : iframeHeight
        });
      }, 100);
    }
  }, [props.lng, props.lat, props.content]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(MlGeoJsonLayer, {
    geojson: {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [props.lng, props.lat]
      },
      properties: {}
    },
    paint: {
      "circle-radius": 14,
      "circle-color": "rgba(40,200,20,0.5)"
    },
    type: "circle",
    mapId: props.mapId
  }), markerPixelPos && /*#__PURE__*/React__default.createElement(Paper, {
    sx: {
      opacity: 0.7,
      position: "fixed",
      display: "flex",

      /** TODO: fix positioning delay when moving the map */
      left: markerPixelPos.x,
      top: markerPixelPos.y,
      width: iframeDimensions.width,
      height: iframeDimensions.height,
      "&:hover": {
        opacity: 1
      },
      zIndex: -1
    }
  }, /*#__PURE__*/React__default.createElement("iframe", {
    style: {
      width: "100%"
    },
    srcDoc: props.content,
    ref: iframe,
    sandbox: "allow-same-origin allow-popups-to-escape-sandbox",
    frameBorder: "0",
    title: componentId.current
  })));
};

MlMarker.defaultProps = {
  mapId: undefined
};
MlMarker.propTypes = {
  /**
   * Id of the target MapLibre instance in mapContext
   */
  mapId: PropTypes.string,

  /**
   * Longitude of the marker position
   */
  lng: PropTypes.number,

  /**
   * Latitude of the marker position
   */
  lat: PropTypes.number,

  /**
   * Content of the description popup
   */
  content: PropTypes.string
};

function useWms(props) {
  // Use a useRef hook to reference the layer object to be able to access it later inside useEffect hooks
  const [getFeatureInfoUrl, setGetFeatureInfoUrl] = useState(undefined);
  const [url, setUrl] = useState(props.url);
  const [wmsUrl, setWmsUrl] = useState("");
  const [capabilities, setCapabilities] = useState(undefined);
  const [error, setError] = useState(undefined);

  const clearState = () => {
    setGetFeatureInfoUrl(undefined);
    setCapabilities(undefined); //setLayers([]);

    setWmsUrl("");
  };

  useEffect(() => {
    var _propsUrlParams2;

    // extract URL parameters from the given URL
    clearState();
    setError(undefined);
    if (!url) return;

    let _propsUrlParams;

    let _wmsUrl = url;

    if (url.indexOf("?") !== -1) {
      _propsUrlParams = url.split("?");
      _wmsUrl = _propsUrlParams[0];
    }

    let _urlParamsFromUrl = new URLSearchParams((_propsUrlParams2 = _propsUrlParams) === null || _propsUrlParams2 === void 0 ? void 0 : _propsUrlParams2[1]);

    let urlParamsObj = { ...Object.fromEntries(_urlParamsFromUrl),
      ...props.urlParameters
    }; // create URLSearchParams object to assemble the URL Parameters

    let urlParams = new URLSearchParams(urlParamsObj);
    let urlParamsStr = decodeURIComponent(urlParams.toString()) + "".replace(/%2F/g, "/").replace(/%3A/g, ":");
    fetch(_wmsUrl + "?" + urlParamsStr).then(res => {
      if (!res.ok) {
        throw Error(res.statusText + " (" + res.status + " - " + res.type + ")");
      } else {
        return res.text();
      }
    }).then(data => {
      setCapabilities(new WMSCapabilities(data).toJSON());
    }).catch(error => {
      //reset local state
      clearState();
      console.log(error);
      setError(error.message);
    });
  }, [url, props.urlParameters]);
  useEffect(() => {
    var _capabilities$Capabil, _capabilities$Capabil2, _capabilities$Capabil3, _capabilities$Capabil4, _capabilities$Capabil5, _capabilities$Capabil6, _capabilities$Capabil7, _capabilities$Capabil8, _capabilities$Capabil9, _capabilities$Capabil10, _capabilities$Capabil11, _capabilities$Capabil12, _capabilities$Capabil13, _capabilities$Capabil14;

    if (!(capabilities !== null && capabilities !== void 0 && capabilities.Service)) return;
    setWmsUrl((_capabilities$Capabil = capabilities.Capability) === null || _capabilities$Capabil === void 0 ? void 0 : (_capabilities$Capabil2 = _capabilities$Capabil.Request) === null || _capabilities$Capabil2 === void 0 ? void 0 : (_capabilities$Capabil3 = _capabilities$Capabil2.GetMap) === null || _capabilities$Capabil3 === void 0 ? void 0 : (_capabilities$Capabil4 = _capabilities$Capabil3.DCPType) === null || _capabilities$Capabil4 === void 0 ? void 0 : (_capabilities$Capabil5 = _capabilities$Capabil4[0]) === null || _capabilities$Capabil5 === void 0 ? void 0 : (_capabilities$Capabil6 = _capabilities$Capabil5.HTTP) === null || _capabilities$Capabil6 === void 0 ? void 0 : (_capabilities$Capabil7 = _capabilities$Capabil6.Get) === null || _capabilities$Capabil7 === void 0 ? void 0 : _capabilities$Capabil7.OnlineResource); // set getFeatureInfo url

    setGetFeatureInfoUrl((_capabilities$Capabil8 = capabilities.Capability) === null || _capabilities$Capabil8 === void 0 ? void 0 : (_capabilities$Capabil9 = _capabilities$Capabil8.Request) === null || _capabilities$Capabil9 === void 0 ? void 0 : (_capabilities$Capabil10 = _capabilities$Capabil9.GetFeatureInfo) === null || _capabilities$Capabil10 === void 0 ? void 0 : (_capabilities$Capabil11 = _capabilities$Capabil10.DCPType) === null || _capabilities$Capabil11 === void 0 ? void 0 : (_capabilities$Capabil12 = _capabilities$Capabil11[0]) === null || _capabilities$Capabil12 === void 0 ? void 0 : (_capabilities$Capabil13 = _capabilities$Capabil12.HTTP) === null || _capabilities$Capabil13 === void 0 ? void 0 : (_capabilities$Capabil14 = _capabilities$Capabil13.Get) === null || _capabilities$Capabil14 === void 0 ? void 0 : _capabilities$Capabil14.OnlineResource);
  }, [capabilities]);
  return {
    capabilities,
    getFeatureInfoUrl,
    wmsUrl,
    error,
    setUrl
  };
}

useWms.defaultProps = {
  url: "",
  urlParameters: {
    SERVICE: "WMS",
    VERSION: "1.3.0",
    REQUEST: "getCapabilities"
  }
};

export { GeoJsonContext, GeoJsonProvider, MapLibreMap, MlBasicComponent, MlComponentTemplate, MlCreatePdfButton, MlFeatureEditor, MlFillExtrusionLayer, MlFollowGps, MlGPXViewer, MlGeoJsonLayer, MlImageMarkerLayer, MlLayer, MlLayerMagnify, MlLayerSwipe, MlMarker, MlNavigationCompass, MlNavigationTools, MlOsmLayer, MlSpatialElevationProfile, MlTransitionGeoJsonLayer, MlVectorTileLayer, MlWmsLayer, useMap, useMapState, useWms };
//# sourceMappingURL=index.esm.js.map
