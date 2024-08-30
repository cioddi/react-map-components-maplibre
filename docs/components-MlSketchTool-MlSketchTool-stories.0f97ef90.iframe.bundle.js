"use strict";(self.webpackChunk_mapcomponents_react_maplibre=self.webpackChunk_mapcomponents_react_maplibre||[]).push([[7723],{17097:(e,t,n)=>{n.r(t),n.d(t,{CatalogueDemo:()=>b,ExampleConfig:()=>h,__namedExportsOrder:()=>g,default:()=>f});var a=n(96540),i=n(61692),o=n(77477),r=n(77070),l=n(61102),s=n(61224),u=n(71335),d=n(28161),c=n(74848);function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,i,o,r,l=[],s=!0,u=!1;try{if(o=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(a=o.call(n)).done)&&(l.push(a.value),l.length!==t);s=!0);}catch(e){u=!0,i=e}finally{try{if(!s&&null!=n.return&&(r=n.return(),Object(r)!==r))return}finally{if(u)throw i}}return l}}(e,t)||function(e,t){if(e){if("string"==typeof e)return m(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?m(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}const f={title:"MapComponents/MlSketchTool",component:i.A,argTypes:{},decorators:o.A};var h=function(){var e=p((0,a.useState)(!0),2),t=e[0],n=e[1];return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(l.A,{buttons:(0,c.jsx)(c.Fragment,{children:(0,c.jsx)(s.A,{variant:t?"contained":"outlined",onClick:function(){return n(!t)},sx:{marginRight:{xs:"0px",sm:"10px"}},children:"Sketch Tool"})})}),(0,c.jsx)(r.A,{open:t,setOpen:n,name:"Sketch Tool",children:(0,c.jsx)(i.A,{onChange:function(e){return console.log(e)}})})]})}.bind({});h.parameters={},h.args={};var b=function(){var e=(0,u.A)((function(e){return e.breakpoints.down("lg")})),t=p((0,a.useState)(!0),2),n=t[0],o=t[1];return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(d.A,{sx:{position:"fixed",width:{xs:"100%",sm:"auto"},top:{xs:"62px",sm:"22px"},right:{xs:"0px",sm:"180px"},paddingRight:{xs:"20px",sm:"0px"},color:"#009ee0",backgroundColor:"#fff",textAlign:"right",fontSize:"16px",fontFamily:"sans-serif",display:"flex",flexDirection:"column",gap:"5px",zIndex:5e3},children:e?"Zum Beenden erneut auf denselben Punkt klicken.":"Die Zeichnung kann beendet werden, indem erneut auf den zuletzt gezeichneten Punkt geklickt wird."}),(0,c.jsx)(l.A,{buttons:(0,c.jsx)(c.Fragment,{children:(0,c.jsx)(s.A,{variant:n?"contained":"outlined",onClick:function(){return o(!n)},sx:{marginRight:{xs:"0px",sm:"10px"}},children:"Sketch Tool"})})}),(0,c.jsx)(r.A,{open:n,setOpen:o,name:"Sketch Tool",children:(0,c.jsx)(i.A,{onChange:function(e){return console.log(e)}})})]})}.bind({});b.args={},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:"() => {\n  const [openSidebar, setOpenSidebar] = useState(true);\n  return <>\n            <TopToolbar buttons={<>\n                        <Button variant={openSidebar ? 'contained' : 'outlined'} onClick={() => setOpenSidebar(!openSidebar)} sx={{\n        marginRight: {\n          xs: '0px',\n          sm: '10px'\n        }\n      }}>\n                            Sketch Tool\n                        </Button>\n                    </>} />\n            <Sidebar open={openSidebar} setOpen={setOpenSidebar} name={'Sketch Tool'}>\n                <MlSketchTool onChange={state => console.log(state)} />\n            </Sidebar>\n        </>;\n}",...h.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:"() => {\n  const mediaIsMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));\n  const [openSidebar, setOpenSidebar] = useState(true);\n  return <>\n            <Box sx={{\n      position: 'fixed',\n      width: {\n        xs: '100%',\n        sm: 'auto'\n      },\n      top: {\n        xs: '62px',\n        sm: '22px'\n      },\n      right: {\n        xs: '0px',\n        sm: '180px'\n      },\n      paddingRight: {\n        xs: '20px',\n        sm: '0px'\n      },\n      color: '#009ee0',\n      backgroundColor: '#fff',\n      textAlign: 'right',\n      fontSize: '16px',\n      fontFamily: 'sans-serif',\n      display: 'flex',\n      flexDirection: 'column',\n      gap: '5px',\n      zIndex: 5000\n    }}>\n                {mediaIsMobile ? 'Zum Beenden erneut auf denselben Punkt klicken.' : 'Die Zeichnung kann beendet werden, indem erneut auf den zuletzt gezeichneten Punkt geklickt wird.'}\n            </Box>\n            <TopToolbar buttons={<>\n                        <Button variant={openSidebar ? 'contained' : 'outlined'} onClick={() => setOpenSidebar(!openSidebar)} sx={{\n        marginRight: {\n          xs: '0px',\n          sm: '10px'\n        }\n      }}>\n                            Sketch Tool\n                        </Button>\n                    </>} />\n            <Sidebar open={openSidebar} setOpen={setOpenSidebar} name={'Sketch Tool'}>\n                <MlSketchTool onChange={state => console.log(state)} />\n            </Sidebar>\n        </>;\n}",...b.parameters?.docs?.source}}};const g=["ExampleConfig","CatalogueDemo"]},77477:(e,t,n)=>{n.d(t,{A:()=>f,Y:()=>m});var a=n(96540),i=n(95532),o=n(32348),r=(n(18582),n(68704)),l=n(65793),s=n(30901),u=n(74848);function d(e){return d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},d(e)}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){var a,i,o,r;a=e,i=t,o=n[t],r=function(e,t){if("object"!=d(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,"string");if("object"!=d(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(i),(i="symbol"==d(r)?r:String(r))in a?Object.defineProperty(a,i,{value:o,enumerable:!0,configurable:!0,writable:!0}):a[i]=o})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var m=function(e){return[function(t,n){var d,c=(0,a.useMemo)((function(){var e;return(0,s.A)(null==n||null===(e=n.globals)||void 0===e?void 0:e.theme)}),[null==n||null===(d=n.globals)||void 0===d?void 0:d.theme]);return(0,u.jsx)("div",{className:"fullscreen_map",children:(0,u.jsx)(i.mO,{children:(0,u.jsxs)(l.A,{theme:c,children:[(0,u.jsx)(t,{}),(0,u.jsx)(o.A,{options:p({zoom:14.5,style:"https://wms.wheregroup.com/tileserver/style/osm-bright.json",center:[7.0851268,50.73884]},e?p({},e):{}),mapId:"map_1"}),(0,u.jsx)(r.A,{showZoomButtons:!1,mapId:"map_1"})]})})})}]};const f=m({});try{m.displayName="makeMapContextDecorators",m.__docgenInfo={description:"",displayName:"makeMapContextDecorators",props:{hash:{defaultValue:null,description:"If `true`, the map's position (zoom, center latitude, center longitude, bearing, and pitch) will be synced with the hash fragment of the page's URL.\nFor example, `http://path/to/my/page.html#2.59/39.26/53.07/-24.1/60`.\nAn additional string may optionally be provided to indicate a parameter-styled hash,\ne.g. http://path/to/my/page.html#map=2.59/39.26/53.07/-24.1/60&foo=bar, where foo\nis a custom parameter and bar is an arbitrary hash distinct from the map hash.\n@defaultValue false",name:"hash",required:!1,type:{name:"string | boolean | undefined"}},interactive:{defaultValue:null,description:"If `false`, no mouse, touch, or keyboard listeners will be attached to the map, so it will not respond to interaction.\n@defaultValue true",name:"interactive",required:!1,type:{name:"boolean | undefined"}},container:{defaultValue:null,description:"The HTML element in which MapLibre GL JS will render the map, or the element's string `id`. The specified element must have no children.",name:"container",required:!1,type:{name:"string | HTMLElement | undefined"}},bearingSnap:{defaultValue:null,description:"The threshold, measured in degrees, that determines when the map's\nbearing will snap to north. For example, with a `bearingSnap` of 7, if the user rotates\nthe map within 7 degrees of north, the map will automatically snap to exact north.\n@defaultValue 7",name:"bearingSnap",required:!1,type:{name:"number | undefined"}},attributionControl:{defaultValue:null,description:'If set, an {@link AttributionControl} will be added to the map with the provided options.\nTo disable the attribution control, pass `false`.\nNote: showing the logo of MapLibre is not required for using MapLibre.\n@defaultValue compact: true, customAttribution: "MapLibre ...".',name:"attributionControl",required:!1,type:{name:"false | AttributionControlOptions | undefined"}},maplibreLogo:{defaultValue:null,description:"If `true`, the MapLibre logo will be shown.",name:"maplibreLogo",required:!1,type:{name:"boolean | undefined"}},logoPosition:{defaultValue:null,description:"A string representing the position of the MapLibre wordmark on the map. Valid options are `top-left`,`top-right`, `bottom-left`, or `bottom-right`.\n@defaultValue 'bottom-left'",name:"logoPosition",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"top-left"'},{value:'"top-right"'},{value:'"bottom-left"'},{value:'"bottom-right"'}]}},failIfMajorPerformanceCaveat:{defaultValue:null,description:"If `true`, map creation will fail if the performance of MapLibre GL JS would be dramatically worse than expected\n(i.e. a software renderer would be used).\n@defaultValue false",name:"failIfMajorPerformanceCaveat",required:!1,type:{name:"boolean | undefined"}},preserveDrawingBuffer:{defaultValue:null,description:"If `true`, the map's canvas can be exported to a PNG using `map.getCanvas().toDataURL()`. This is `false` by default as a performance optimization.\n@defaultValue false",name:"preserveDrawingBuffer",required:!1,type:{name:"boolean | undefined"}},antialias:{defaultValue:null,description:"If `true`, the gl context will be created with MSAA antialiasing, which can be useful for antialiasing custom layers.\nDisabled by default as a performance optimization.",name:"antialias",required:!1,type:{name:"boolean | undefined"}},refreshExpiredTiles:{defaultValue:null,description:"If `false`, the map won't attempt to re-request tiles once they expire per their HTTP `cacheControl`/`expires` headers.\n@defaultValue true",name:"refreshExpiredTiles",required:!1,type:{name:"boolean | undefined"}},maxBounds:{defaultValue:null,description:"If set, the map will be constrained to the given bounds.",name:"maxBounds",required:!1,type:{name:"LngLatBoundsLike | undefined"}},scrollZoom:{defaultValue:null,description:'If `true`, the "scroll to zoom" interaction is enabled. {@link AroundCenterOptions} are passed as options to {@link ScrollZoomHandler#enable }.\n@defaultValue true',name:"scrollZoom",required:!1,type:{name:"boolean | AroundCenterOptions | undefined"}},minZoom:{defaultValue:null,description:"The minimum zoom level of the map (0-24).\n@defaultValue 0",name:"minZoom",required:!1,type:{name:"number | null | undefined"}},maxZoom:{defaultValue:null,description:"The maximum zoom level of the map (0-24).\n@defaultValue 22",name:"maxZoom",required:!1,type:{name:"number | null | undefined"}},minPitch:{defaultValue:null,description:"The minimum pitch of the map (0-85). Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.\n@defaultValue 0",name:"minPitch",required:!1,type:{name:"number | null | undefined"}},maxPitch:{defaultValue:null,description:"The maximum pitch of the map (0-85). Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.\n@defaultValue 60",name:"maxPitch",required:!1,type:{name:"number | null | undefined"}},boxZoom:{defaultValue:null,description:'If `true`, the "box zoom" interaction is enabled (see {@link BoxZoomHandler}).\n@defaultValue true',name:"boxZoom",required:!1,type:{name:"boolean | undefined"}},dragRotate:{defaultValue:null,description:'If `true`, the "drag to rotate" interaction is enabled (see {@link DragRotateHandler}).\n@defaultValue true',name:"dragRotate",required:!1,type:{name:"boolean | undefined"}},dragPan:{defaultValue:null,description:'If `true`, the "drag to pan" interaction is enabled. An `Object` value is passed as options to {@link DragPanHandler#enable }.\n@defaultValue true',name:"dragPan",required:!1,type:{name:"boolean | DragPanOptions | undefined"}},keyboard:{defaultValue:null,description:"If `true`, keyboard shortcuts are enabled (see {@link KeyboardHandler}).\n@defaultValue true",name:"keyboard",required:!1,type:{name:"boolean | undefined"}},doubleClickZoom:{defaultValue:null,description:'If `true`, the "double click to zoom" interaction is enabled (see {@link DoubleClickZoomHandler}).\n@defaultValue true',name:"doubleClickZoom",required:!1,type:{name:"boolean | undefined"}},touchZoomRotate:{defaultValue:null,description:'If `true`, the "pinch to rotate and zoom" interaction is enabled. An `Object` value is passed as options to {@link TwoFingersTouchZoomRotateHandler#enable }.\n@defaultValue true',name:"touchZoomRotate",required:!1,type:{name:"boolean | AroundCenterOptions | undefined"}},touchPitch:{defaultValue:null,description:'If `true`, the "drag to pitch" interaction is enabled. An `Object` value is passed as options to {@link TwoFingersTouchPitchHandler#enable }.\n@defaultValue true',name:"touchPitch",required:!1,type:{name:"boolean | AroundCenterOptions | undefined"}},cooperativeGestures:{defaultValue:null,description:'If `true` or set to an options object, the map is only accessible on desktop while holding Command/Ctrl and only accessible on mobile with two fingers. Interacting with the map using normal gestures will trigger an informational screen. With this option enabled, "drag to pitch" requires a three-finger gesture. Cooperative gestures are disabled when a map enters fullscreen using {@link FullscreenControl}.\n@defaultValue false',name:"cooperativeGestures",required:!1,type:{name:"boolean | undefined"}},trackResize:{defaultValue:null,description:"If `true`, the map will automatically resize when the browser window resizes.\n@defaultValue true",name:"trackResize",required:!1,type:{name:"boolean | undefined"}},center:{defaultValue:null,description:"The initial geographical centerpoint of the map. If `center` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `[0, 0]` Note: MapLibre GL JS uses longitude, latitude coordinate order (as opposed to latitude, longitude) to match GeoJSON.\n@defaultValue [0, 0]",name:"center",required:!1,type:{name:"LngLatLike | undefined"}},zoom:{defaultValue:null,description:"The initial zoom level of the map. If `zoom` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`.\n@defaultValue 0",name:"zoom",required:!1,type:{name:"number | undefined"}},bearing:{defaultValue:null,description:"The initial bearing (rotation) of the map, measured in degrees counter-clockwise from north. If `bearing` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`.\n@defaultValue 0",name:"bearing",required:!1,type:{name:"number | undefined"}},pitch:{defaultValue:null,description:"The initial pitch (tilt) of the map, measured in degrees away from the plane of the screen (0-85). If `pitch` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`. Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.\n@defaultValue 0",name:"pitch",required:!1,type:{name:"number | undefined"}},renderWorldCopies:{defaultValue:null,description:"If `true`, multiple copies of the world will be rendered side by side beyond -180 and 180 degrees longitude. If set to `false`:\n\n- When the map is zoomed out far enough that a single representation of the world does not fill the map's entire\ncontainer, there will be blank space beyond 180 and -180 degrees longitude.\n- Features that cross 180 and -180 degrees longitude will be cut in two (with one portion on the right edge of the\nmap and the other on the left edge of the map) at every zoom level.\n@defaultValue true",name:"renderWorldCopies",required:!1,type:{name:"boolean | undefined"}},maxTileCacheSize:{defaultValue:null,description:"The maximum number of tiles stored in the tile cache for a given source. If omitted, the cache will be dynamically sized based on the current viewport which can be set using `maxTileCacheZoomLevels` constructor options.\n@defaultValue null",name:"maxTileCacheSize",required:!1,type:{name:"number | null | undefined"}},maxTileCacheZoomLevels:{defaultValue:null,description:"The maximum number of zoom levels for which to store tiles for a given source. Tile cache dynamic size is calculated by multiplying `maxTileCacheZoomLevels` with the approximate number of tiles in the viewport for a given source.\n@defaultValue 5",name:"maxTileCacheZoomLevels",required:!1,type:{name:"number | undefined"}},transformRequest:{defaultValue:null,description:"A callback run before the Map makes a request for an external URL. The callback can be used to modify the url, set headers, or set the credentials property for cross-origin requests.\nExpected to return an object with a `url` property and optionally `headers` and `credentials` properties.\n@defaultValue null",name:"transformRequest",required:!1,type:{name:"RequestTransformFunction | null | undefined"}},transformCameraUpdate:{defaultValue:null,description:"A callback run before the map's camera is moved due to user input or animation. The callback can be used to modify the new center, zoom, pitch and bearing.\nExpected to return an object containing center, zoom, pitch or bearing values to overwrite.\n@defaultValue null",name:"transformCameraUpdate",required:!1,type:{name:"CameraUpdateTransformFunction | null | undefined"}},locale:{defaultValue:null,description:"A patch to apply to the default localization table for UI strings, e.g. control tooltips. The `locale` object maps namespaced UI string IDs to translated strings in the target language; see `src/ui/default_locale.js` for an example with all supported string IDs. The object may specify all UI strings (thereby adding support for a new translation) or only a subset of strings (thereby patching the default translation table).\n@defaultValue null",name:"locale",required:!1,type:{name:"any"}},fadeDuration:{defaultValue:null,description:"Controls the duration of the fade-in/fade-out animation for label collisions after initial map load, in milliseconds. This setting affects all symbol layers. This setting does not affect the duration of runtime styling transitions or raster tile cross-fading.\n@defaultValue 300",name:"fadeDuration",required:!1,type:{name:"number | undefined"}},crossSourceCollisions:{defaultValue:null,description:"If `true`, symbols from multiple sources can collide with each other during collision detection. If `false`, collision detection is run separately for the symbols in each source.\n@defaultValue true",name:"crossSourceCollisions",required:!1,type:{name:"boolean | undefined"}},collectResourceTiming:{defaultValue:null,description:"If `true`, Resource Timing API information will be collected for requests made by GeoJSON and Vector Tile web workers (this information is normally inaccessible from the main Javascript thread). Information will be returned in a `resourceTiming` property of relevant `data` events.\n@defaultValue false",name:"collectResourceTiming",required:!1,type:{name:"boolean | undefined"}},clickTolerance:{defaultValue:null,description:"The max number of pixels a user can shift the mouse pointer during a click for it to be considered a valid click (as opposed to a mouse drag).\n@defaultValue 3",name:"clickTolerance",required:!1,type:{name:"number | undefined"}},bounds:{defaultValue:null,description:"The initial bounds of the map. If `bounds` is specified, it overrides `center` and `zoom` constructor options.",name:"bounds",required:!1,type:{name:"LngLatBoundsLike | undefined"}},fitBoundsOptions:{defaultValue:null,description:"A {@link FitBoundsOptions} options object to use _only_ when fitting the initial `bounds` provided above.",name:"fitBoundsOptions",required:!1,type:{name:"FitBoundsOptions | undefined"}},localIdeographFontFamily:{defaultValue:null,description:"Defines a CSS\nfont-family for locally overriding generation of glyphs in the 'CJK Unified Ideographs', 'Hiragana', 'Katakana' and 'Hangul Syllables' ranges.\nIn these ranges, font settings from the map's style will be ignored, except for font-weight keywords (light/regular/medium/bold).\nSet to `false`, to enable font settings from the map's style for these glyph ranges.\nThe purpose of this option is to avoid bandwidth-intensive glyph server requests. (See [Use locally generated ideographs](https://maplibre.org/maplibre-gl-js/docs/examples/local-ideographs).)\n@defaultValue 'sans-serif'",name:"localIdeographFontFamily",required:!1,type:{name:"string | false | undefined"}},style:{defaultValue:null,description:"The map's MapLibre style. This must be a JSON object conforming to\nthe schema described in the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/),\nor a URL to such JSON.\nWhen the style is not specified, calling {@link Map#setStyle } is required to render the map.",name:"style",required:!1,type:{name:"string | StyleSpecification | undefined"}},pitchWithRotate:{defaultValue:null,description:'If `false`, the map\'s pitch (tilt) control with "drag to rotate" interaction will be disabled.\n@defaultValue true',name:"pitchWithRotate",required:!1,type:{name:"boolean | undefined"}},pixelRatio:{defaultValue:null,description:"The pixel ratio.\nThe canvas' `width` attribute will be `container.clientWidth * pixelRatio` and its `height` attribute will be `container.clientHeight * pixelRatio`. Defaults to `devicePixelRatio` if not specified.",name:"pixelRatio",required:!1,type:{name:"number | undefined"}},validateStyle:{defaultValue:null,description:"If false, style validation will be skipped. Useful in production environment.\n@defaultValue true",name:"validateStyle",required:!1,type:{name:"boolean | undefined"}},maxCanvasSize:{defaultValue:null,description:"The canvas' `width` and `height` max size. The values are passed as an array where the first element is max width and the second element is max height.\nYou shouldn't set this above WebGl `MAX_TEXTURE_SIZE`.\n@defaultValue [4096, 4096].",name:"maxCanvasSize",required:!1,type:{name:"[number, number] | undefined"}},cancelPendingTileRequestsWhileZooming:{defaultValue:null,description:"Determines whether to cancel, or retain, tiles from the current viewport which are still loading but which belong to a farther (smaller) zoom level than the current one.\n* If `true`, when zooming in, tiles which didn't manage to load for previous zoom levels will become canceled. This might save some computing resources for slower devices, but the map details might appear more abruptly at the end of the zoom.\n* If `false`, when zooming in, the previous zoom level(s) tiles will progressively appear, giving a smoother map details experience. However, more tiles will be rendered in a short period of time.\n@defaultValue true",name:"cancelPendingTileRequestsWhileZooming",required:!1,type:{name:"boolean | undefined"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/decorators/MapContextDecorator.tsx#makeMapContextDecorators"]={docgenInfo:m.__docgenInfo,name:"makeMapContextDecorators",path:"src/decorators/MapContextDecorator.tsx#makeMapContextDecorators"})}catch(e){}}}]);