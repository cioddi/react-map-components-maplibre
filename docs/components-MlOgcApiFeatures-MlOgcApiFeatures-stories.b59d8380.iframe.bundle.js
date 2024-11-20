"use strict";(self.webpackChunk_mapcomponents_react_maplibre=self.webpackChunk_mapcomponents_react_maplibre||[]).push([[4119],{81969:(e,n,t)=>{t.r(n),t.d(n,{OgcApiLoader:()=>A,Point:()=>x,__namedExportsOrder:()=>T,default:()=>w});var a=t(96540),i=t(77477),r=t(49220),o=t(40554),l=t(61102),s=t(61224),u=t(77070),d=t(50779),p=t(42471),c=t(33551),m=t(2071),f=t(73896),h=t(6108),b=t(88809),g=t(74848);function y(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var a,i,r,o,l=[],s=!0,u=!1;try{if(r=(t=t.call(e)).next,0===n){if(Object(t)!==t)return;s=!1}else for(;!(s=(a=r.call(t)).done)&&(l.push(a.value),l.length!==n);s=!0);}catch(e){u=!0,i=e}finally{try{if(!s&&null!=t.return&&(o=t.return(),Object(o)!==o))return}finally{if(u)throw i}}return l}}(e,n)||function(e,n){if(e){if("string"==typeof e)return v(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?v(e,n):void 0}}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function v(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,a=new Array(n);t<n;t++)a[t]=e[t];return a}const w={title:"MapComponents/MlOgcApiFeatures",component:r.A,argTypes:{},decorators:i.A};var x=function(e){var n=y((0,a.useState)(!0),2),t=n[0],i=n[1],u=(0,o.A)({mapId:e.mapId}),d=(0,a.useRef)(!1);return(0,a.useEffect)((function(){u.map&&!d.current&&(d.current=!0,u.map.map.jumpTo({center:[7.100175528281227,50.73487992742369],zoom:8}))}),[u.map]),(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(l.A,{unmovableButtons:(0,g.jsx)(s.A,{color:"primary",variant:t?"contained":"outlined",onClick:function(){return i(!t)},children:"OGC API Feature Points"})}),(0,g.jsx)(r.A,{visible:t,ogcApiUrl:e.ogcApiUrl,mapId:e.mapId,ogcApiFeatureParams:e.ogcApiFeatureParams,reloadFeaturesOnMapMove:!0})]})}.bind({});x.parameters={},x.args={ogcApiUrl:"https://geo.kreis-viersen.de/ows/osm-daten/wfs3/collections/hoflaeden_nrw/items.json",mapId:"map_1",ogcApiFeatureParams:{limit:100}};var A=function(e){var n=y((0,a.useState)(!0),2),t=n[0],i=n[1],v=y((0,a.useState)("#0E8A0E"),2),w=v[0],x=v[1],A=y((0,a.useState)(.8),2),T=A[0],V=A[1],I=y((0,a.useState)("fill"),2),S=I[0],k=I[1],C=y((0,a.useState)(6),2),O=C[0],j=C[1],L=y((0,a.useState)("https://demo.ldproxy.net/vineyards/collections/vineyards/items?f=json&limit=100&region=Rheinhessen"),2),q=L[0],M=L[1],P=(0,o.A)({mapId:e.mapId}),R=(0,a.useRef)(!1);return(0,a.useEffect)((function(){P.map&&!R.current&&(R.current=!0,P.map.map.jumpTo({center:[8.1186,49.8487],zoom:10}))}),[P.map]),(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(l.A,{unmovableButtons:(0,g.jsx)(s.A,{color:"primary",variant:t?"contained":"outlined",onClick:function(){return i(!t)},children:"OGC API Feature Loader"})}),(0,g.jsxs)(u.A,{open:t,setOpen:i,name:"OGC API Feature Loader",children:[(0,g.jsx)(d.A,{fullWidth:!0,sx:{marginTop:"10px"},children:(0,g.jsx)(p.A,{label:"OGC API Features URL",variant:"standard",value:q,onChange:function(e){return M(e.target.value)},sx:{marginBottom:"10px"}})}),(0,g.jsx)(c.A,{variant:"h5",children:"Style Feature"}),(0,g.jsxs)(d.A,{children:[(0,g.jsx)(c.A,{children:"Geometry type:"}),(0,g.jsxs)(m.A,{value:S,onChange:function(e){k(e.target.value)},children:[(0,g.jsx)(f.A,{value:"fill",children:"fill"},1),(0,g.jsx)(f.A,{value:"circle",children:"circle"},2),(0,g.jsx)(f.A,{value:"line",children:"line"},3)]})]}),(0,g.jsx)(c.A,{children:"Display color:"}),(0,g.jsx)(b.A,{value:w,onChange:function(e){x(e)}}),(0,g.jsx)(c.A,{children:"Opacity:"}),(0,g.jsx)(h.Ay,{defaultValue:1,"aria-label":"Default",value:T,max:1,min:0,step:.01,marks:[{value:0,label:"0%"},{value:.25,label:"25%"},{value:.5,label:"50%"},{value:.75,label:"75%"},{value:1,label:"100%"}],onChange:function(e,n){V(n)}}),(0,g.jsx)(c.A,{paddingTop:4,children:"Stroke:"}),(0,g.jsx)(h.Ay,{value:O,"aria-label":"Default",max:10,min:0,step:1,marks:[{value:0,label:"0"},{value:5,label:"5"},{value:10,label:"10"}],onChange:function(e,n){j(n)},disabled:"line"!==S})]}),function(){try{return!!new URL(q)}catch(e){return!1}}()&&(0,g.jsx)(r.A,{ogcApiUrl:new URL(q),mapId:e.mapId,mlGeoJsonLayerProps:{defaultPaintOverrides:{fill:{"fill-color":w,"fill-opacity":T},circle:{"circle-color":w,"circle-opacity":T},line:{"line-color":w,"line-opacity":T,"line-width":O}},type:S}})]})}.bind({});A.parameters={},A.args={mapId:"map_1"},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:"(props: MlOgcApiFeaturesProps) => {\n  const [showLayer, setShowLayer] = useState(true);\n  const mapHook = useMap({\n    mapId: props.mapId\n  });\n  const initializedRef = useRef(false);\n  useEffect(() => {\n    if (!mapHook.map || initializedRef.current) return;\n    initializedRef.current = true;\n    mapHook.map.map.jumpTo({\n      center: [7.100175528281227, 50.73487992742369],\n      zoom: 8\n    });\n  }, [mapHook.map]);\n  return <>\n            <TopToolbar unmovableButtons={<Button color=\"primary\" variant={showLayer ? 'contained' : 'outlined'} onClick={() => setShowLayer(!showLayer)}>\n                        OGC API Feature Points\n                    </Button>} />\n            <MlOgcApiFeatures visible={showLayer} ogcApiUrl={props.ogcApiUrl} mapId={props.mapId} ogcApiFeatureParams={props.ogcApiFeatureParams} reloadFeaturesOnMapMove={true}></MlOgcApiFeatures>\n        </>;\n}",...x.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:"(props: MlOgcApiFeaturesProps) => {\n  interface Mark {\n    value: number;\n    label: string;\n  }\n  const marks: Mark[] = [{\n    value: 0,\n    label: '0%'\n  }, {\n    value: 0.25,\n    label: '25%'\n  }, {\n    value: 0.5,\n    label: '50%'\n  }, {\n    value: 0.75,\n    label: '75%'\n  }, {\n    value: 1,\n    label: '100%'\n  }];\n  const widthMarks: Mark[] = [{\n    value: 0,\n    label: '0'\n  }, {\n    value: 5,\n    label: '5'\n  }, {\n    value: 10,\n    label: '10'\n  }];\n  const [openSidebar, setOpenSidebar] = useState(true);\n  const [color, setColor] = useState<string>('#0E8A0E');\n  const [opacity, setOpacity] = useState<number>(0.8);\n  const [geomType, setGeomType] = useState<'fill' | 'circle' | 'line'>('fill');\n  const [lineWidth, setLineWidth] = useState<number>(6);\n  const [ogcApiUrl, setOgcApiUrl] = useState('https://demo.ldproxy.net/vineyards/collections/vineyards/items?f=json&limit=100&region=Rheinhessen');\n  const mapHook = useMap({\n    mapId: props.mapId\n  });\n  const initializedRef = useRef(false);\n  useEffect(() => {\n    if (!mapHook.map || initializedRef.current) return;\n    initializedRef.current = true;\n    mapHook.map.map.jumpTo({\n      center: [8.1186, 49.8487],\n      zoom: 10\n    });\n  }, [mapHook.map]);\n  const handleColorChange = (value: string) => {\n    setColor(value);\n  };\n  return <>\n            <TopToolbar unmovableButtons={<Button color=\"primary\" variant={openSidebar ? 'contained' : 'outlined'} onClick={() => setOpenSidebar(!openSidebar)}>\n                        OGC API Feature Loader\n                    </Button>} />\n            <Sidebar open={openSidebar} setOpen={setOpenSidebar} name={'OGC API Feature Loader'}>\n                <FormControl fullWidth sx={{\n        marginTop: '10px'\n      }}>\n                    <TextField label=\"OGC API Features URL\" variant=\"standard\" value={ogcApiUrl} onChange={ev => setOgcApiUrl(ev.target.value)} sx={{\n          marginBottom: '10px'\n        }} />\n                </FormControl>\n\n                <Typography variant={'h5'}>Style Feature</Typography>\n                <FormControl>\n                    <Typography>Geometry type:</Typography>\n                    <Select value={geomType} onChange={e => {\n          setGeomType((e.target.value as 'fill' | 'circle' | 'line'));\n        }}>\n                        <MenuItem value={'fill'} key={1}>\n                            fill\n                        </MenuItem>\n                        <MenuItem value={'circle'} key={2}>\n                            circle\n                        </MenuItem>\n                        <MenuItem value={'line'} key={3}>\n                            line\n                        </MenuItem>\n                    </Select>\n                </FormControl>\n                <Typography>Display color:</Typography>\n                <ColorPicker value={color} onChange={handleColorChange} />\n                <Typography>Opacity:</Typography>\n                <Slider defaultValue={1} aria-label=\"Default\" value={opacity} max={1} min={0} step={0.01} marks={marks} onChange={(_, v) => {\n        setOpacity((v as number));\n      }} />\n                <Typography paddingTop={4}>Stroke:</Typography>\n                <Slider value={lineWidth} aria-label=\"Default\" max={10} min={0} step={1} marks={widthMarks} onChange={(_e, v) => {\n        setLineWidth((v as number));\n      }} disabled={geomType !== 'line'} />\n            </Sidebar>\n            {\n    //only render if valid url\n    (() => {\n      try {\n        return !!new URL(ogcApiUrl);\n      } catch {\n        return false;\n      }\n    })() && <MlOgcApiFeatures ogcApiUrl={new URL(ogcApiUrl)} mapId={props.mapId} mlGeoJsonLayerProps={{\n      defaultPaintOverrides: {\n        fill: {\n          'fill-color': color,\n          'fill-opacity': opacity\n        },\n        circle: {\n          'circle-color': color,\n          'circle-opacity': opacity\n        },\n        line: {\n          'line-color': color,\n          'line-opacity': opacity,\n          'line-width': lineWidth\n        }\n      },\n      type: geomType\n    }}></MlOgcApiFeatures>}\n        </>;\n}",...A.parameters?.docs?.source}}};const T=["Point","OgcApiLoader"]},77477:(e,n,t)=>{t.d(n,{A:()=>f,Y:()=>m});var a=t(96540),i=t(95532),r=t(32348),o=(t(18582),t(68704)),l=t(70008),s=t(30901),u=t(74848);function d(e){return d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},d(e)}function p(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?p(Object(t),!0).forEach((function(n){var a,i,r,o;a=e,i=n,r=t[n],o=function(e,n){if("object"!=d(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var a=t.call(e,"string");if("object"!=d(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(i),(i="symbol"==d(o)?o:String(o))in a?Object.defineProperty(a,i,{value:r,enumerable:!0,configurable:!0,writable:!0}):a[i]=r})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):p(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}var m=function(e){return[function(n,t){var d,p=(0,a.useMemo)((function(){var e;return(0,s.A)(null==t||null===(e=t.globals)||void 0===e?void 0:e.theme)}),[null==t||null===(d=t.globals)||void 0===d?void 0:d.theme]);return(0,u.jsx)("div",{className:"fullscreen_map",children:(0,u.jsx)(i.mO,{children:(0,u.jsxs)(l.A,{theme:p,children:[(0,u.jsx)(n,{}),(0,u.jsx)(r.A,{options:c({zoom:14.5,style:"https://wms.wheregroup.com/tileserver/style/osm-bright.json",center:[7.0851268,50.73884]},e?c({},e):{}),mapId:"map_1"}),(0,u.jsx)(o.A,{showZoomButtons:!1,mapId:"map_1"})]})})})}]};const f=m({});try{m.displayName="makeMapContextDecorators",m.__docgenInfo={description:"",displayName:"makeMapContextDecorators",props:{hash:{defaultValue:null,description:"If `true`, the map's position (zoom, center latitude, center longitude, bearing, and pitch) will be synced with the hash fragment of the page's URL.\nFor example, `http://path/to/my/page.html#2.59/39.26/53.07/-24.1/60`.\nAn additional string may optionally be provided to indicate a parameter-styled hash,\ne.g. http://path/to/my/page.html#map=2.59/39.26/53.07/-24.1/60&foo=bar, where foo\nis a custom parameter and bar is an arbitrary hash distinct from the map hash.\n@defaultValue false",name:"hash",required:!1,type:{name:"string | boolean | undefined"}},interactive:{defaultValue:null,description:"If `false`, no mouse, touch, or keyboard listeners will be attached to the map, so it will not respond to interaction.\n@defaultValue true",name:"interactive",required:!1,type:{name:"boolean | undefined"}},container:{defaultValue:null,description:"The HTML element in which MapLibre GL JS will render the map, or the element's string `id`. The specified element must have no children.",name:"container",required:!1,type:{name:"string | HTMLElement | undefined"}},bearingSnap:{defaultValue:null,description:"The threshold, measured in degrees, that determines when the map's\nbearing will snap to north. For example, with a `bearingSnap` of 7, if the user rotates\nthe map within 7 degrees of north, the map will automatically snap to exact north.\n@defaultValue 7",name:"bearingSnap",required:!1,type:{name:"number | undefined"}},attributionControl:{defaultValue:null,description:'If set, an {@link AttributionControl} will be added to the map with the provided options.\nTo disable the attribution control, pass `false`.\nNote: showing the logo of MapLibre is not required for using MapLibre.\n@defaultValue compact: true, customAttribution: "MapLibre ...".',name:"attributionControl",required:!1,type:{name:"false | AttributionControlOptions | undefined"}},maplibreLogo:{defaultValue:null,description:"If `true`, the MapLibre logo will be shown.",name:"maplibreLogo",required:!1,type:{name:"boolean | undefined"}},logoPosition:{defaultValue:null,description:"A string representing the position of the MapLibre wordmark on the map. Valid options are `top-left`,`top-right`, `bottom-left`, or `bottom-right`.\n@defaultValue 'bottom-left'",name:"logoPosition",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"top-left"'},{value:'"top-right"'},{value:'"bottom-left"'},{value:'"bottom-right"'}]}},failIfMajorPerformanceCaveat:{defaultValue:null,description:"If `true`, map creation will fail if the performance of MapLibre GL JS would be dramatically worse than expected\n(i.e. a software renderer would be used).\n@defaultValue false",name:"failIfMajorPerformanceCaveat",required:!1,type:{name:"boolean | undefined"}},preserveDrawingBuffer:{defaultValue:null,description:"If `true`, the map's canvas can be exported to a PNG using `map.getCanvas().toDataURL()`. This is `false` by default as a performance optimization.\n@defaultValue false",name:"preserveDrawingBuffer",required:!1,type:{name:"boolean | undefined"}},antialias:{defaultValue:null,description:"If `true`, the gl context will be created with MSAA antialiasing, which can be useful for antialiasing custom layers.\nDisabled by default as a performance optimization.",name:"antialias",required:!1,type:{name:"boolean | undefined"}},refreshExpiredTiles:{defaultValue:null,description:"If `false`, the map won't attempt to re-request tiles once they expire per their HTTP `cacheControl`/`expires` headers.\n@defaultValue true",name:"refreshExpiredTiles",required:!1,type:{name:"boolean | undefined"}},maxBounds:{defaultValue:null,description:"If set, the map will be constrained to the given bounds.",name:"maxBounds",required:!1,type:{name:"LngLatBoundsLike | undefined"}},scrollZoom:{defaultValue:null,description:'If `true`, the "scroll to zoom" interaction is enabled. {@link AroundCenterOptions} are passed as options to {@link ScrollZoomHandler#enable }.\n@defaultValue true',name:"scrollZoom",required:!1,type:{name:"boolean | AroundCenterOptions | undefined"}},minZoom:{defaultValue:null,description:"The minimum zoom level of the map (0-24).\n@defaultValue 0",name:"minZoom",required:!1,type:{name:"number | null | undefined"}},maxZoom:{defaultValue:null,description:"The maximum zoom level of the map (0-24).\n@defaultValue 22",name:"maxZoom",required:!1,type:{name:"number | null | undefined"}},minPitch:{defaultValue:null,description:"The minimum pitch of the map (0-85). Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.\n@defaultValue 0",name:"minPitch",required:!1,type:{name:"number | null | undefined"}},maxPitch:{defaultValue:null,description:"The maximum pitch of the map (0-85). Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.\n@defaultValue 60",name:"maxPitch",required:!1,type:{name:"number | null | undefined"}},boxZoom:{defaultValue:null,description:'If `true`, the "box zoom" interaction is enabled (see {@link BoxZoomHandler}).\n@defaultValue true',name:"boxZoom",required:!1,type:{name:"boolean | undefined"}},dragRotate:{defaultValue:null,description:'If `true`, the "drag to rotate" interaction is enabled (see {@link DragRotateHandler}).\n@defaultValue true',name:"dragRotate",required:!1,type:{name:"boolean | undefined"}},dragPan:{defaultValue:null,description:'If `true`, the "drag to pan" interaction is enabled. An `Object` value is passed as options to {@link DragPanHandler#enable }.\n@defaultValue true',name:"dragPan",required:!1,type:{name:"boolean | DragPanOptions | undefined"}},keyboard:{defaultValue:null,description:"If `true`, keyboard shortcuts are enabled (see {@link KeyboardHandler}).\n@defaultValue true",name:"keyboard",required:!1,type:{name:"boolean | undefined"}},doubleClickZoom:{defaultValue:null,description:'If `true`, the "double click to zoom" interaction is enabled (see {@link DoubleClickZoomHandler}).\n@defaultValue true',name:"doubleClickZoom",required:!1,type:{name:"boolean | undefined"}},touchZoomRotate:{defaultValue:null,description:'If `true`, the "pinch to rotate and zoom" interaction is enabled. An `Object` value is passed as options to {@link TwoFingersTouchZoomRotateHandler#enable }.\n@defaultValue true',name:"touchZoomRotate",required:!1,type:{name:"boolean | AroundCenterOptions | undefined"}},touchPitch:{defaultValue:null,description:'If `true`, the "drag to pitch" interaction is enabled. An `Object` value is passed as options to {@link TwoFingersTouchPitchHandler#enable }.\n@defaultValue true',name:"touchPitch",required:!1,type:{name:"boolean | AroundCenterOptions | undefined"}},cooperativeGestures:{defaultValue:null,description:'If `true` or set to an options object, the map is only accessible on desktop while holding Command/Ctrl and only accessible on mobile with two fingers. Interacting with the map using normal gestures will trigger an informational screen. With this option enabled, "drag to pitch" requires a three-finger gesture. Cooperative gestures are disabled when a map enters fullscreen using {@link FullscreenControl}.\n@defaultValue false',name:"cooperativeGestures",required:!1,type:{name:"boolean | undefined"}},trackResize:{defaultValue:null,description:"If `true`, the map will automatically resize when the browser window resizes.\n@defaultValue true",name:"trackResize",required:!1,type:{name:"boolean | undefined"}},center:{defaultValue:null,description:"The initial geographical centerpoint of the map. If `center` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `[0, 0]` Note: MapLibre GL JS uses longitude, latitude coordinate order (as opposed to latitude, longitude) to match GeoJSON.\n@defaultValue [0, 0]",name:"center",required:!1,type:{name:"LngLatLike | undefined"}},zoom:{defaultValue:null,description:"The initial zoom level of the map. If `zoom` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`.\n@defaultValue 0",name:"zoom",required:!1,type:{name:"number | undefined"}},bearing:{defaultValue:null,description:"The initial bearing (rotation) of the map, measured in degrees counter-clockwise from north. If `bearing` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`.\n@defaultValue 0",name:"bearing",required:!1,type:{name:"number | undefined"}},pitch:{defaultValue:null,description:"The initial pitch (tilt) of the map, measured in degrees away from the plane of the screen (0-85). If `pitch` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`. Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.\n@defaultValue 0",name:"pitch",required:!1,type:{name:"number | undefined"}},renderWorldCopies:{defaultValue:null,description:"If `true`, multiple copies of the world will be rendered side by side beyond -180 and 180 degrees longitude. If set to `false`:\n\n- When the map is zoomed out far enough that a single representation of the world does not fill the map's entire\ncontainer, there will be blank space beyond 180 and -180 degrees longitude.\n- Features that cross 180 and -180 degrees longitude will be cut in two (with one portion on the right edge of the\nmap and the other on the left edge of the map) at every zoom level.\n@defaultValue true",name:"renderWorldCopies",required:!1,type:{name:"boolean | undefined"}},maxTileCacheSize:{defaultValue:null,description:"The maximum number of tiles stored in the tile cache for a given source. If omitted, the cache will be dynamically sized based on the current viewport which can be set using `maxTileCacheZoomLevels` constructor options.\n@defaultValue null",name:"maxTileCacheSize",required:!1,type:{name:"number | null | undefined"}},maxTileCacheZoomLevels:{defaultValue:null,description:"The maximum number of zoom levels for which to store tiles for a given source. Tile cache dynamic size is calculated by multiplying `maxTileCacheZoomLevels` with the approximate number of tiles in the viewport for a given source.\n@defaultValue 5",name:"maxTileCacheZoomLevels",required:!1,type:{name:"number | undefined"}},transformRequest:{defaultValue:null,description:"A callback run before the Map makes a request for an external URL. The callback can be used to modify the url, set headers, or set the credentials property for cross-origin requests.\nExpected to return an object with a `url` property and optionally `headers` and `credentials` properties.\n@defaultValue null",name:"transformRequest",required:!1,type:{name:"RequestTransformFunction | null | undefined"}},transformCameraUpdate:{defaultValue:null,description:"A callback run before the map's camera is moved due to user input or animation. The callback can be used to modify the new center, zoom, pitch and bearing.\nExpected to return an object containing center, zoom, pitch or bearing values to overwrite.\n@defaultValue null",name:"transformCameraUpdate",required:!1,type:{name:"CameraUpdateTransformFunction | null | undefined"}},locale:{defaultValue:null,description:"A patch to apply to the default localization table for UI strings, e.g. control tooltips. The `locale` object maps namespaced UI string IDs to translated strings in the target language; see `src/ui/default_locale.js` for an example with all supported string IDs. The object may specify all UI strings (thereby adding support for a new translation) or only a subset of strings (thereby patching the default translation table).\n@defaultValue null",name:"locale",required:!1,type:{name:"any"}},fadeDuration:{defaultValue:null,description:"Controls the duration of the fade-in/fade-out animation for label collisions after initial map load, in milliseconds. This setting affects all symbol layers. This setting does not affect the duration of runtime styling transitions or raster tile cross-fading.\n@defaultValue 300",name:"fadeDuration",required:!1,type:{name:"number | undefined"}},crossSourceCollisions:{defaultValue:null,description:"If `true`, symbols from multiple sources can collide with each other during collision detection. If `false`, collision detection is run separately for the symbols in each source.\n@defaultValue true",name:"crossSourceCollisions",required:!1,type:{name:"boolean | undefined"}},collectResourceTiming:{defaultValue:null,description:"If `true`, Resource Timing API information will be collected for requests made by GeoJSON and Vector Tile web workers (this information is normally inaccessible from the main Javascript thread). Information will be returned in a `resourceTiming` property of relevant `data` events.\n@defaultValue false",name:"collectResourceTiming",required:!1,type:{name:"boolean | undefined"}},clickTolerance:{defaultValue:null,description:"The max number of pixels a user can shift the mouse pointer during a click for it to be considered a valid click (as opposed to a mouse drag).\n@defaultValue 3",name:"clickTolerance",required:!1,type:{name:"number | undefined"}},bounds:{defaultValue:null,description:"The initial bounds of the map. If `bounds` is specified, it overrides `center` and `zoom` constructor options.",name:"bounds",required:!1,type:{name:"LngLatBoundsLike | undefined"}},fitBoundsOptions:{defaultValue:null,description:"A {@link FitBoundsOptions} options object to use _only_ when fitting the initial `bounds` provided above.",name:"fitBoundsOptions",required:!1,type:{name:"FitBoundsOptions | undefined"}},localIdeographFontFamily:{defaultValue:null,description:"Defines a CSS\nfont-family for locally overriding generation of glyphs in the 'CJK Unified Ideographs', 'Hiragana', 'Katakana' and 'Hangul Syllables' ranges.\nIn these ranges, font settings from the map's style will be ignored, except for font-weight keywords (light/regular/medium/bold).\nSet to `false`, to enable font settings from the map's style for these glyph ranges.\nThe purpose of this option is to avoid bandwidth-intensive glyph server requests. (See [Use locally generated ideographs](https://maplibre.org/maplibre-gl-js/docs/examples/local-ideographs).)\n@defaultValue 'sans-serif'",name:"localIdeographFontFamily",required:!1,type:{name:"string | false | undefined"}},style:{defaultValue:null,description:"The map's MapLibre style. This must be a JSON object conforming to\nthe schema described in the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/),\nor a URL to such JSON.\nWhen the style is not specified, calling {@link Map#setStyle } is required to render the map.",name:"style",required:!1,type:{name:"string | StyleSpecification | undefined"}},pitchWithRotate:{defaultValue:null,description:'If `false`, the map\'s pitch (tilt) control with "drag to rotate" interaction will be disabled.\n@defaultValue true',name:"pitchWithRotate",required:!1,type:{name:"boolean | undefined"}},pixelRatio:{defaultValue:null,description:"The pixel ratio.\nThe canvas' `width` attribute will be `container.clientWidth * pixelRatio` and its `height` attribute will be `container.clientHeight * pixelRatio`. Defaults to `devicePixelRatio` if not specified.",name:"pixelRatio",required:!1,type:{name:"number | undefined"}},validateStyle:{defaultValue:null,description:"If false, style validation will be skipped. Useful in production environment.\n@defaultValue true",name:"validateStyle",required:!1,type:{name:"boolean | undefined"}},maxCanvasSize:{defaultValue:null,description:"The canvas' `width` and `height` max size. The values are passed as an array where the first element is max width and the second element is max height.\nYou shouldn't set this above WebGl `MAX_TEXTURE_SIZE`.\n@defaultValue [4096, 4096].",name:"maxCanvasSize",required:!1,type:{name:"[number, number] | undefined"}},cancelPendingTileRequestsWhileZooming:{defaultValue:null,description:"Determines whether to cancel, or retain, tiles from the current viewport which are still loading but which belong to a farther (smaller) zoom level than the current one.\n* If `true`, when zooming in, tiles which didn't manage to load for previous zoom levels will become canceled. This might save some computing resources for slower devices, but the map details might appear more abruptly at the end of the zoom.\n* If `false`, when zooming in, the previous zoom level(s) tiles will progressively appear, giving a smoother map details experience. However, more tiles will be rendered in a short period of time.\n@defaultValue true",name:"cancelPendingTileRequestsWhileZooming",required:!1,type:{name:"boolean | undefined"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/decorators/MapContextDecorator.tsx#makeMapContextDecorators"]={docgenInfo:m.__docgenInfo,name:"makeMapContextDecorators",path:"src/decorators/MapContextDecorator.tsx#makeMapContextDecorators"})}catch(e){}}}]);