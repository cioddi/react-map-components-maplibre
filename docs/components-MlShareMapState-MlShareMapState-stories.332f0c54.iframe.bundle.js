"use strict";(self.webpackChunk_mapcomponents_react_maplibre=self.webpackChunk_mapcomponents_react_maplibre||[]).push([[7823],{58407:(e,t,a)=>{var n=a(95709);t.A=void 0;var i=n(a(42032)),o=a(74848);t.A=(0,i.default)((0,o.jsx)("path",{d:"M16.59 7.58 10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8"}),"CheckCircleOutline")},51249:(e,t,a)=>{var n=a(95709);t.A=void 0;var i=n(a(42032)),o=a(74848);t.A=(0,i.default)((0,o.jsx)("path",{d:"M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8"}),"ErrorOutline")},5673:(e,t,a)=>{var n=a(95709);t.A=void 0;var i=n(a(42032)),o=a(74848);t.A=(0,i.default)((0,o.jsx)("path",{d:"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3"}),"Visibility")},76768:(e,t,a)=>{var n=a(95709);t.A=void 0;var i=n(a(42032)),o=a(74848);t.A=(0,i.default)((0,o.jsx)("path",{d:"M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7M2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2m4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3z"}),"VisibilityOff")},71340:(e,t,a)=>{a.r(t),a.d(t,{ExampleConfig:()=>N,__namedExportsOrder:()=>$,default:()=>G});var n=a(96540),i=a(25812),o=a(77477),r=a(4725),l=a(40554),s=a(77070),d=a(44090),u=a(11641),c=a(5673),p=a(76768),m=a(82241),f=a(40948),h=a(73377),b=a(49799),y=a(36852),g=a(61224),v=a(40644),w=a(55285),x=a(28919),S=a(46311),V=a(64111),C=a(24279),k=a(18850),A=a(28466),T=a(3541),I=a(11848),L=a(27553),O=a(17245);function j(e){return(0,O.Ay)("MuiToggleButton",e)}const z=(0,L.A)("MuiToggleButton",["root","disabled","selected","standard","primary","secondary","sizeSmall","sizeMedium","sizeLarge","fullWidth"]),M=n.createContext({}),q=n.createContext(void 0);function R(e,t){return void 0!==t&&void 0!==e&&(Array.isArray(t)?t.indexOf(e)>=0:e===t)}var P=a(74848);const _=["value"],F=["children","className","color","disabled","disableFocusRipple","fullWidth","onChange","onClick","selected","size","value"],B=(0,I.Ay)(k.A,{name:"MuiToggleButton",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,t[`size${(0,A.A)(a.size)}`]]}})((({theme:e,ownerState:t})=>{let a,n="standard"===t.color?e.palette.text.primary:e.palette[t.color].main;return e.vars&&(n="standard"===t.color?e.vars.palette.text.primary:e.vars.palette[t.color].main,a="standard"===t.color?e.vars.palette.text.primaryChannel:e.vars.palette[t.color].mainChannel),(0,w.A)({},e.typography.button,{borderRadius:(e.vars||e).shape.borderRadius,padding:11,border:`1px solid ${(e.vars||e).palette.divider}`,color:(e.vars||e).palette.action.active},t.fullWidth&&{width:"100%"},{[`&.${z.disabled}`]:{color:(e.vars||e).palette.action.disabled,border:`1px solid ${(e.vars||e).palette.action.disabledBackground}`},"&:hover":{textDecoration:"none",backgroundColor:e.vars?`rgba(${e.vars.palette.text.primaryChannel} / ${e.vars.palette.action.hoverOpacity})`:(0,C.X4)(e.palette.text.primary,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${z.selected}`]:{color:n,backgroundColor:e.vars?`rgba(${a} / ${e.vars.palette.action.selectedOpacity})`:(0,C.X4)(n,e.palette.action.selectedOpacity),"&:hover":{backgroundColor:e.vars?`rgba(${a} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.hoverOpacity}))`:(0,C.X4)(n,e.palette.action.selectedOpacity+e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:e.vars?`rgba(${a} / ${e.vars.palette.action.selectedOpacity})`:(0,C.X4)(n,e.palette.action.selectedOpacity)}}}},"small"===t.size&&{padding:7,fontSize:e.typography.pxToRem(13)},"large"===t.size&&{padding:15,fontSize:e.typography.pxToRem(15)})})),D=n.forwardRef((function(e,t){const a=n.useContext(M),{value:i}=a,o=(0,v.A)(a,_),r=n.useContext(q),l=(0,S.A)((0,w.A)({},o,{selected:R(e.value,i)}),e),s=(0,T.A)({props:l,name:"MuiToggleButton"}),{children:d,className:u,color:c="standard",disabled:p=!1,disableFocusRipple:m=!1,fullWidth:f=!1,onChange:h,onClick:b,selected:y,size:g="medium",value:C}=s,k=(0,v.A)(s,F),I=(0,w.A)({},s,{color:c,disabled:p,disableFocusRipple:m,fullWidth:f,size:g}),L=(e=>{const{classes:t,fullWidth:a,selected:n,disabled:i,size:o,color:r}=e,l={root:["root",n&&"selected",i&&"disabled",a&&"fullWidth",`size${(0,A.A)(o)}`,r]};return(0,V.A)(l,j,t)})(I),O=r||"";return(0,P.jsx)(B,(0,w.A)({className:(0,x.A)(o.className,L.root,u,O),disabled:p,focusRipple:!m,ref:t,onClick:e=>{b&&(b(e,C),e.defaultPrevented)||h&&h(e,C)},onChange:h,value:C,ownerState:I,"aria-pressed":y},k,{children:d}))}));var Z=a(58407),E=a(51249),H=a(61102);function J(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var a=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=a){var n,i,o,r,l=[],s=!0,d=!1;try{if(o=(a=a.call(e)).next,0===t){if(Object(a)!==a)return;s=!1}else for(;!(s=(n=o.call(a)).done)&&(l.push(n.value),l.length!==t);s=!0);}catch(e){d=!0,i=e}finally{try{if(!s&&null!=a.return&&(r=a.return(),Object(r)!==r))return}finally{if(d)throw i}}return l}}(e,t)||function(e,t){if(e){if("string"==typeof e)return W(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?W(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function W(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}const G={title:"MapComponents/MlShareMapState",component:i.A,argTypes:{},decorators:o.A};var N=function(){var e,t=[f,h],a=J((0,n.useState)(!0),2),o=a[0],v=a[1],w=(0,l.A)({mapId:"map_1"}),x=(0,r.A)({mapId:"map_1",watch:{viewport:!1,layers:!0,sources:!1},filter:{includeBaseLayers:!1}}),S=J((0,n.useState)(!0),2),V=S[0],C=S[1];return(0,n.useEffect)((function(){w.map&&w.map.map.flyTo({center:[7.100175528281227,50.73348799274236],zoom:15.5})}),[w.map]),(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(H.A,{buttons:(0,P.jsx)(g.A,{variant:V?"contained":"outlined",onClick:function(){return C(!V)},sx:{marginRight:{xs:"0px",sm:"10px"}},children:"Share Map State"})}),(0,P.jsx)(i.A,{active:o}),t.map((function(e,t){return(0,P.jsx)(y.A,{layerId:"GeoJson_"+t,type:"line",geojson:e},"GeoJson_"+t)})),(0,P.jsxs)(s.A,{open:V,setOpen:C,name:"Share Map State",children:[(0,P.jsxs)(D,{size:"small",selected:o,value:o,onChange:function(){v(!o)},children:[o?(0,P.jsx)(Z.A,{}):(0,P.jsx)(E.A,{}),o?"active":"inactive"]}),(0,P.jsx)(b.A,{dense:!0,children:null===(e=x.layers)||void 0===e?void 0:e.map((function(e){return(0,P.jsx)(d.Ay,{secondaryAction:(0,P.jsx)(u.A,{edge:"end","aria-label":"toggle visibility",onClick:function(){if(null!=e&&e.id){var t,a,n,i,o,r=null===(t=w.map)||void 0===t||null===(a=t.getLayer)||void 0===a||null===(a=a.call(t,null==e?void 0:e.id))||void 0===a?void 0:a.getLayoutProperty("visibility");null===(n=w.map)||void 0===n||null===(i=n.getLayer)||void 0===i||null===(i=i.call(n,null==e?void 0:e.id))||void 0===i||i.setLayoutProperty("visibility","none"===r?"visible":"none"),null===(o=w.map)||void 0===o||o.map.fire("zoom")}},children:null!=e&&e.visible?(0,P.jsx)(c.A,{}):(0,P.jsx)(p.A,{})}),children:(0,P.jsx)(m.A,{primary:null==e?void 0:e.id,secondary:""})},null==e?void 0:e.id)}))},"layers")]})]})}.bind({});N.parameters={},N.args={},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:"() => {\n  const geoJsonArray = [sample_geojson_1, sample_geojson_2];\n  const [watchState, setWatchState] = useState(true);\n  const mapHook = useMap({\n    mapId: 'map_1'\n  });\n  const mapState = useMapState({\n    mapId: 'map_1',\n    watch: {\n      viewport: false,\n      layers: true,\n      sources: false\n    },\n    filter: {\n      includeBaseLayers: false\n    }\n  });\n  const [openSidebar, setOpenSidebar] = useState(true);\n  useEffect(() => {\n    if (!mapHook.map) return;\n    mapHook.map.map.flyTo({\n      center: [7.100175528281227, 50.73348799274236],\n      zoom: 15.5\n    });\n  }, [mapHook.map]);\n  return <>\n            <TopToolbar buttons={<Button variant={openSidebar ? 'contained' : 'outlined'} onClick={() => setOpenSidebar(!openSidebar)} sx={{\n      marginRight: {\n        xs: '0px',\n        sm: '10px'\n      }\n    }}>\n                        Share Map State\n                    </Button>} />\n            <MlShareMapState active={watchState} />\n            {geoJsonArray.map((el, i) => <MlGeoJsonLayer layerId={'GeoJson_' + i} type=\"line\" geojson={((el as unknown) as Feature)} key={'GeoJson_' + i} />)}\n            <Sidebar open={openSidebar} setOpen={setOpenSidebar} name={'Share Map State'}>\n                <ToggleButton size=\"small\" selected={watchState} value={watchState} onChange={() => {\n        setWatchState(!watchState);\n      }}>\n                    {watchState ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}\n\n                    {watchState ? 'active' : 'inactive'}\n                </ToggleButton>\n                <List dense key=\"layers\">\n                    {mapState.layers?.map(el => <ListItem key={el?.id} secondaryAction={<IconButton edge=\"end\" aria-label=\"toggle visibility\" onClick={() => {\n          if (el?.id) {\n            const currentVisibility = mapHook.map?.getLayer?.(el?.id)?.getLayoutProperty('visibility');\n            mapHook.map?.getLayer?.(el?.id)?.setLayoutProperty('visibility', currentVisibility === 'none' ? 'visible' : 'none');\n            mapHook.map?.map.fire('zoom');\n          }\n        }}>\n                                    {el?.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}\n                                </IconButton>}>\n                            <ListItemText primary={el?.id} secondary={''} />\n                        </ListItem>)}\n                </List>\n            </Sidebar>\n        </>;\n}",...N.parameters?.docs?.source}}};const $=["ExampleConfig"]},77477:(e,t,a)=>{a.d(t,{A:()=>f,Y:()=>m});var n=a(96540),i=a(95532),o=a(32348),r=(a(18582),a(68704)),l=a(65793),s=a(30901),d=a(74848);function u(e){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u(e)}function c(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function p(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?c(Object(a),!0).forEach((function(t){var n,i,o,r;n=e,i=t,o=a[t],r=function(e,t){if("object"!=u(e)||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var n=a.call(e,"string");if("object"!=u(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(i),(i="symbol"==u(r)?r:String(r))in n?Object.defineProperty(n,i,{value:o,enumerable:!0,configurable:!0,writable:!0}):n[i]=o})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):c(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var m=function(e){return[function(t,a){var u,c=(0,n.useMemo)((function(){var e;return(0,s.A)(null==a||null===(e=a.globals)||void 0===e?void 0:e.theme)}),[null==a||null===(u=a.globals)||void 0===u?void 0:u.theme]);return(0,d.jsx)("div",{className:"fullscreen_map",children:(0,d.jsx)(i.mO,{children:(0,d.jsxs)(l.A,{theme:c,children:[(0,d.jsx)(t,{}),(0,d.jsx)(o.A,{options:p({zoom:14.5,style:"https://wms.wheregroup.com/tileserver/style/osm-bright.json",center:[7.0851268,50.73884]},e?p({},e):{}),mapId:"map_1"}),(0,d.jsx)(r.A,{showZoomButtons:!1,mapId:"map_1"})]})})})}]};const f=m({});try{m.displayName="makeMapContextDecorators",m.__docgenInfo={description:"",displayName:"makeMapContextDecorators",props:{hash:{defaultValue:null,description:"If `true`, the map's position (zoom, center latitude, center longitude, bearing, and pitch) will be synced with the hash fragment of the page's URL.\nFor example, `http://path/to/my/page.html#2.59/39.26/53.07/-24.1/60`.\nAn additional string may optionally be provided to indicate a parameter-styled hash,\ne.g. http://path/to/my/page.html#map=2.59/39.26/53.07/-24.1/60&foo=bar, where foo\nis a custom parameter and bar is an arbitrary hash distinct from the map hash.\n@defaultValue false",name:"hash",required:!1,type:{name:"string | boolean | undefined"}},interactive:{defaultValue:null,description:"If `false`, no mouse, touch, or keyboard listeners will be attached to the map, so it will not respond to interaction.\n@defaultValue true",name:"interactive",required:!1,type:{name:"boolean | undefined"}},container:{defaultValue:null,description:"The HTML element in which MapLibre GL JS will render the map, or the element's string `id`. The specified element must have no children.",name:"container",required:!1,type:{name:"string | HTMLElement | undefined"}},bearingSnap:{defaultValue:null,description:"The threshold, measured in degrees, that determines when the map's\nbearing will snap to north. For example, with a `bearingSnap` of 7, if the user rotates\nthe map within 7 degrees of north, the map will automatically snap to exact north.\n@defaultValue 7",name:"bearingSnap",required:!1,type:{name:"number | undefined"}},attributionControl:{defaultValue:null,description:'If set, an {@link AttributionControl} will be added to the map with the provided options.\nTo disable the attribution control, pass `false`.\nNote: showing the logo of MapLibre is not required for using MapLibre.\n@defaultValue compact: true, customAttribution: "MapLibre ...".',name:"attributionControl",required:!1,type:{name:"false | AttributionControlOptions | undefined"}},maplibreLogo:{defaultValue:null,description:"If `true`, the MapLibre logo will be shown.",name:"maplibreLogo",required:!1,type:{name:"boolean | undefined"}},logoPosition:{defaultValue:null,description:"A string representing the position of the MapLibre wordmark on the map. Valid options are `top-left`,`top-right`, `bottom-left`, or `bottom-right`.\n@defaultValue 'bottom-left'",name:"logoPosition",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"top-left"'},{value:'"top-right"'},{value:'"bottom-left"'},{value:'"bottom-right"'}]}},failIfMajorPerformanceCaveat:{defaultValue:null,description:"If `true`, map creation will fail if the performance of MapLibre GL JS would be dramatically worse than expected\n(i.e. a software renderer would be used).\n@defaultValue false",name:"failIfMajorPerformanceCaveat",required:!1,type:{name:"boolean | undefined"}},preserveDrawingBuffer:{defaultValue:null,description:"If `true`, the map's canvas can be exported to a PNG using `map.getCanvas().toDataURL()`. This is `false` by default as a performance optimization.\n@defaultValue false",name:"preserveDrawingBuffer",required:!1,type:{name:"boolean | undefined"}},antialias:{defaultValue:null,description:"If `true`, the gl context will be created with MSAA antialiasing, which can be useful for antialiasing custom layers.\nDisabled by default as a performance optimization.",name:"antialias",required:!1,type:{name:"boolean | undefined"}},refreshExpiredTiles:{defaultValue:null,description:"If `false`, the map won't attempt to re-request tiles once they expire per their HTTP `cacheControl`/`expires` headers.\n@defaultValue true",name:"refreshExpiredTiles",required:!1,type:{name:"boolean | undefined"}},maxBounds:{defaultValue:null,description:"If set, the map will be constrained to the given bounds.",name:"maxBounds",required:!1,type:{name:"LngLatBoundsLike | undefined"}},scrollZoom:{defaultValue:null,description:'If `true`, the "scroll to zoom" interaction is enabled. {@link AroundCenterOptions} are passed as options to {@link ScrollZoomHandler#enable }.\n@defaultValue true',name:"scrollZoom",required:!1,type:{name:"boolean | AroundCenterOptions | undefined"}},minZoom:{defaultValue:null,description:"The minimum zoom level of the map (0-24).\n@defaultValue 0",name:"minZoom",required:!1,type:{name:"number | null | undefined"}},maxZoom:{defaultValue:null,description:"The maximum zoom level of the map (0-24).\n@defaultValue 22",name:"maxZoom",required:!1,type:{name:"number | null | undefined"}},minPitch:{defaultValue:null,description:"The minimum pitch of the map (0-85). Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.\n@defaultValue 0",name:"minPitch",required:!1,type:{name:"number | null | undefined"}},maxPitch:{defaultValue:null,description:"The maximum pitch of the map (0-85). Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.\n@defaultValue 60",name:"maxPitch",required:!1,type:{name:"number | null | undefined"}},boxZoom:{defaultValue:null,description:'If `true`, the "box zoom" interaction is enabled (see {@link BoxZoomHandler}).\n@defaultValue true',name:"boxZoom",required:!1,type:{name:"boolean | undefined"}},dragRotate:{defaultValue:null,description:'If `true`, the "drag to rotate" interaction is enabled (see {@link DragRotateHandler}).\n@defaultValue true',name:"dragRotate",required:!1,type:{name:"boolean | undefined"}},dragPan:{defaultValue:null,description:'If `true`, the "drag to pan" interaction is enabled. An `Object` value is passed as options to {@link DragPanHandler#enable }.\n@defaultValue true',name:"dragPan",required:!1,type:{name:"boolean | DragPanOptions | undefined"}},keyboard:{defaultValue:null,description:"If `true`, keyboard shortcuts are enabled (see {@link KeyboardHandler}).\n@defaultValue true",name:"keyboard",required:!1,type:{name:"boolean | undefined"}},doubleClickZoom:{defaultValue:null,description:'If `true`, the "double click to zoom" interaction is enabled (see {@link DoubleClickZoomHandler}).\n@defaultValue true',name:"doubleClickZoom",required:!1,type:{name:"boolean | undefined"}},touchZoomRotate:{defaultValue:null,description:'If `true`, the "pinch to rotate and zoom" interaction is enabled. An `Object` value is passed as options to {@link TwoFingersTouchZoomRotateHandler#enable }.\n@defaultValue true',name:"touchZoomRotate",required:!1,type:{name:"boolean | AroundCenterOptions | undefined"}},touchPitch:{defaultValue:null,description:'If `true`, the "drag to pitch" interaction is enabled. An `Object` value is passed as options to {@link TwoFingersTouchPitchHandler#enable }.\n@defaultValue true',name:"touchPitch",required:!1,type:{name:"boolean | AroundCenterOptions | undefined"}},cooperativeGestures:{defaultValue:null,description:'If `true` or set to an options object, the map is only accessible on desktop while holding Command/Ctrl and only accessible on mobile with two fingers. Interacting with the map using normal gestures will trigger an informational screen. With this option enabled, "drag to pitch" requires a three-finger gesture. Cooperative gestures are disabled when a map enters fullscreen using {@link FullscreenControl}.\n@defaultValue false',name:"cooperativeGestures",required:!1,type:{name:"boolean | undefined"}},trackResize:{defaultValue:null,description:"If `true`, the map will automatically resize when the browser window resizes.\n@defaultValue true",name:"trackResize",required:!1,type:{name:"boolean | undefined"}},center:{defaultValue:null,description:"The initial geographical centerpoint of the map. If `center` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `[0, 0]` Note: MapLibre GL JS uses longitude, latitude coordinate order (as opposed to latitude, longitude) to match GeoJSON.\n@defaultValue [0, 0]",name:"center",required:!1,type:{name:"LngLatLike | undefined"}},zoom:{defaultValue:null,description:"The initial zoom level of the map. If `zoom` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`.\n@defaultValue 0",name:"zoom",required:!1,type:{name:"number | undefined"}},bearing:{defaultValue:null,description:"The initial bearing (rotation) of the map, measured in degrees counter-clockwise from north. If `bearing` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`.\n@defaultValue 0",name:"bearing",required:!1,type:{name:"number | undefined"}},pitch:{defaultValue:null,description:"The initial pitch (tilt) of the map, measured in degrees away from the plane of the screen (0-85). If `pitch` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`. Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.\n@defaultValue 0",name:"pitch",required:!1,type:{name:"number | undefined"}},renderWorldCopies:{defaultValue:null,description:"If `true`, multiple copies of the world will be rendered side by side beyond -180 and 180 degrees longitude. If set to `false`:\n\n- When the map is zoomed out far enough that a single representation of the world does not fill the map's entire\ncontainer, there will be blank space beyond 180 and -180 degrees longitude.\n- Features that cross 180 and -180 degrees longitude will be cut in two (with one portion on the right edge of the\nmap and the other on the left edge of the map) at every zoom level.\n@defaultValue true",name:"renderWorldCopies",required:!1,type:{name:"boolean | undefined"}},maxTileCacheSize:{defaultValue:null,description:"The maximum number of tiles stored in the tile cache for a given source. If omitted, the cache will be dynamically sized based on the current viewport which can be set using `maxTileCacheZoomLevels` constructor options.\n@defaultValue null",name:"maxTileCacheSize",required:!1,type:{name:"number | null | undefined"}},maxTileCacheZoomLevels:{defaultValue:null,description:"The maximum number of zoom levels for which to store tiles for a given source. Tile cache dynamic size is calculated by multiplying `maxTileCacheZoomLevels` with the approximate number of tiles in the viewport for a given source.\n@defaultValue 5",name:"maxTileCacheZoomLevels",required:!1,type:{name:"number | undefined"}},transformRequest:{defaultValue:null,description:"A callback run before the Map makes a request for an external URL. The callback can be used to modify the url, set headers, or set the credentials property for cross-origin requests.\nExpected to return an object with a `url` property and optionally `headers` and `credentials` properties.\n@defaultValue null",name:"transformRequest",required:!1,type:{name:"RequestTransformFunction | null | undefined"}},transformCameraUpdate:{defaultValue:null,description:"A callback run before the map's camera is moved due to user input or animation. The callback can be used to modify the new center, zoom, pitch and bearing.\nExpected to return an object containing center, zoom, pitch or bearing values to overwrite.\n@defaultValue null",name:"transformCameraUpdate",required:!1,type:{name:"CameraUpdateTransformFunction | null | undefined"}},locale:{defaultValue:null,description:"A patch to apply to the default localization table for UI strings, e.g. control tooltips. The `locale` object maps namespaced UI string IDs to translated strings in the target language; see `src/ui/default_locale.js` for an example with all supported string IDs. The object may specify all UI strings (thereby adding support for a new translation) or only a subset of strings (thereby patching the default translation table).\n@defaultValue null",name:"locale",required:!1,type:{name:"any"}},fadeDuration:{defaultValue:null,description:"Controls the duration of the fade-in/fade-out animation for label collisions after initial map load, in milliseconds. This setting affects all symbol layers. This setting does not affect the duration of runtime styling transitions or raster tile cross-fading.\n@defaultValue 300",name:"fadeDuration",required:!1,type:{name:"number | undefined"}},crossSourceCollisions:{defaultValue:null,description:"If `true`, symbols from multiple sources can collide with each other during collision detection. If `false`, collision detection is run separately for the symbols in each source.\n@defaultValue true",name:"crossSourceCollisions",required:!1,type:{name:"boolean | undefined"}},collectResourceTiming:{defaultValue:null,description:"If `true`, Resource Timing API information will be collected for requests made by GeoJSON and Vector Tile web workers (this information is normally inaccessible from the main Javascript thread). Information will be returned in a `resourceTiming` property of relevant `data` events.\n@defaultValue false",name:"collectResourceTiming",required:!1,type:{name:"boolean | undefined"}},clickTolerance:{defaultValue:null,description:"The max number of pixels a user can shift the mouse pointer during a click for it to be considered a valid click (as opposed to a mouse drag).\n@defaultValue 3",name:"clickTolerance",required:!1,type:{name:"number | undefined"}},bounds:{defaultValue:null,description:"The initial bounds of the map. If `bounds` is specified, it overrides `center` and `zoom` constructor options.",name:"bounds",required:!1,type:{name:"LngLatBoundsLike | undefined"}},fitBoundsOptions:{defaultValue:null,description:"A {@link FitBoundsOptions} options object to use _only_ when fitting the initial `bounds` provided above.",name:"fitBoundsOptions",required:!1,type:{name:"FitBoundsOptions | undefined"}},localIdeographFontFamily:{defaultValue:null,description:"Defines a CSS\nfont-family for locally overriding generation of glyphs in the 'CJK Unified Ideographs', 'Hiragana', 'Katakana' and 'Hangul Syllables' ranges.\nIn these ranges, font settings from the map's style will be ignored, except for font-weight keywords (light/regular/medium/bold).\nSet to `false`, to enable font settings from the map's style for these glyph ranges.\nThe purpose of this option is to avoid bandwidth-intensive glyph server requests. (See [Use locally generated ideographs](https://maplibre.org/maplibre-gl-js/docs/examples/local-ideographs).)\n@defaultValue 'sans-serif'",name:"localIdeographFontFamily",required:!1,type:{name:"string | false | undefined"}},style:{defaultValue:null,description:"The map's MapLibre style. This must be a JSON object conforming to\nthe schema described in the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/),\nor a URL to such JSON.\nWhen the style is not specified, calling {@link Map#setStyle } is required to render the map.",name:"style",required:!1,type:{name:"string | StyleSpecification | undefined"}},pitchWithRotate:{defaultValue:null,description:'If `false`, the map\'s pitch (tilt) control with "drag to rotate" interaction will be disabled.\n@defaultValue true',name:"pitchWithRotate",required:!1,type:{name:"boolean | undefined"}},pixelRatio:{defaultValue:null,description:"The pixel ratio.\nThe canvas' `width` attribute will be `container.clientWidth * pixelRatio` and its `height` attribute will be `container.clientHeight * pixelRatio`. Defaults to `devicePixelRatio` if not specified.",name:"pixelRatio",required:!1,type:{name:"number | undefined"}},validateStyle:{defaultValue:null,description:"If false, style validation will be skipped. Useful in production environment.\n@defaultValue true",name:"validateStyle",required:!1,type:{name:"boolean | undefined"}},maxCanvasSize:{defaultValue:null,description:"The canvas' `width` and `height` max size. The values are passed as an array where the first element is max width and the second element is max height.\nYou shouldn't set this above WebGl `MAX_TEXTURE_SIZE`.\n@defaultValue [4096, 4096].",name:"maxCanvasSize",required:!1,type:{name:"[number, number] | undefined"}},cancelPendingTileRequestsWhileZooming:{defaultValue:null,description:"Determines whether to cancel, or retain, tiles from the current viewport which are still loading but which belong to a farther (smaller) zoom level than the current one.\n* If `true`, when zooming in, tiles which didn't manage to load for previous zoom levels will become canceled. This might save some computing resources for slower devices, but the map details might appear more abruptly at the end of the zoom.\n* If `false`, when zooming in, the previous zoom level(s) tiles will progressively appear, giving a smoother map details experience. However, more tiles will be rendered in a short period of time.\n@defaultValue true",name:"cancelPendingTileRequestsWhileZooming",required:!1,type:{name:"boolean | undefined"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/decorators/MapContextDecorator.tsx#makeMapContextDecorators"]={docgenInfo:m.__docgenInfo,name:"makeMapContextDecorators",path:"src/decorators/MapContextDecorator.tsx#makeMapContextDecorators"})}catch(e){}},40948:e=>{e.exports=JSON.parse('{"type":"FeatureCollection","features":[{"id":"1","type":"Feature","properties":{"name":"Hofgarten"},"geometry":{"coordinates":[[[7.104246282215286,50.734109601136055],[7.10209443365315,50.732370465826534],[7.104720792410859,50.73113417375197],[7.1049635650692835,50.73112718895845],[7.105724988405626,50.73137864087451],[7.107071273146147,50.73179073970729],[7.107060238024758,50.73190249469832],[7.106629868312979,50.732552065303736],[7.104246282215286,50.734109601136055]]],"type":"Polygon"}},{"id":"2","type":"Feature","properties":{"name":"Stadtgarten"},"geometry":{"coordinates":[[[7.105893155288783,50.73444907786518],[7.106402034397206,50.733582900352985],[7.106897536862704,50.73369549309848],[7.107111352729277,50.7336105803617],[7.107157469878132,50.733549549237495],[7.108406816456494,50.733927190803854],[7.1084747528756225,50.73402627417772],[7.10853382802236,50.734039360645426],[7.1083093424639685,50.73448242889327],[7.108247313560071,50.73447868993853],[7.108226637258156,50.734508601570155],[7.107907631465423,50.734559077405464],[7.107694960936584,50.73457777214577],[7.107597486944087,50.734575902671935],[7.107576810643138,50.73462077001935],[7.108185284655264,50.734633856320954],[7.108087810663733,50.73492362349066],[7.107910600755304,50.734888120981594],[7.107875467179866,50.734952050517165],[7.107778849851883,50.73496038914578],[7.107682232521427,50.734963168688125],[7.10769979930771,50.7350132004259],[7.107339680163761,50.73499652318577],[7.107221104348952,50.73497706639833],[7.107278196408828,50.73488534143442],[7.107019086291899,50.73484364820982],[7.106988344414447,50.734927034622416],[7.106514041150831,50.73484364820982],[7.106606266786173,50.734604606338195],[7.105893155288783,50.73444907786518]]],"type":"Polygon"}},{"id":"3","type":"Feature","properties":{"name":"Opernplatz"},"geometry":{"coordinates":[[[7.104632320011916,50.736606042555366],[7.104779316251751,50.736422797521044],[7.104817178920001,50.7363283555695],[7.104868404882268,50.736319898072],[7.105434117684382,50.73653415420432],[7.105596704435243,50.736569393605805],[7.105797153853388,50.73659758510803],[7.105725882948974,50.73684848872955],[7.105338347406786,50.736800563422435],[7.1051824423039704,50.73677237204271],[7.104863950451204,50.73668356908482],[7.104632320011916,50.736606042555366]]],"type":"Polygon"}},{"id":"2c3972ac51f4350582ecc9de57d47c75","type":"Feature","properties":{"name":"Keiserplatz"},"geometry":{"coordinates":[[[7.100878520474112,50.73167947463554],[7.100876728417518,50.731653654340704],[7.100857282327439,50.731633541894354],[7.10079841102764,50.73157086579248],[7.100757419228046,50.731538946883745],[7.100606042670478,50.73140800018959],[7.100525308506718,50.73136967425927],[7.10037393194915,50.731331348297005],[7.100313381326117,50.731308991470826],[7.100267968358821,50.73127226237719],[7.100184711252609,50.73119561026192],[7.099690214497514,50.73138724031432],[7.099691475969678,50.73140400766788],[7.099861143861631,50.73141398829278],[7.0998571229209375,50.73145675554436],[7.099832918440285,50.73150591044205],[7.099780384599569,50.73155556557083],[7.099892082101547,50.73155547486934],[7.099882074627317,50.73158758317477],[7.0999202108099695,50.73158998765363],[7.099912858928455,50.73159899760262],[7.0999207681442975,50.73160353227202],[7.099921690047621,50.7316057996082],[7.099930036031913,50.73160923675198],[7.100091909667459,50.731627463555895],[7.100165737828326,50.731649680201066],[7.1003014331650665,50.731709520224214],[7.100316426855426,50.73173557596814],[7.100384577793838,50.73178469147469],[7.100415620558475,50.731796580130755],[7.100494222199336,50.7318078992016],[7.100585685541193,50.731804728779615],[7.100677188738862,50.73177247244158],[7.100842140282873,50.73170978389162],[7.100873170896176,50.73169013008063],[7.100878520474112,50.73167947463554]]],"type":"Polygon"}}]}')},73377:e=>{e.exports=JSON.parse('{"type":"FeatureCollection","features":[{"id":"af85dc8aa961efd66cfcf74213b7ef57","type":"Feature","properties":{"name":"Mauspfad"},"geometry":{"coordinates":[[7.100862609363844,50.7344404792787],[7.100561470141059,50.73464673993831],[7.100435651698547,50.73473812095355],[7.1003510852035845,50.73478772771537],[7.100264456112427,50.73485561056759],[7.100087072734084,50.734958740096886],[7.099971567278942,50.73501487379605],[7.09977149532881,50.735103643229735],[7.099688991431805,50.7351166975437]],"type":"LineString"}},{"id":"7498f72ced719c8385232abc8e5c5df8","type":"Feature","properties":{"name":"Windeckstraße"},"geometry":{"coordinates":[[7.0985272716624195,50.73420515798543],[7.097871372036735,50.73446815229278],[7.097802428041831,50.73450471192254],[7.097748390856651,50.73456485834811]],"type":"LineString"}},{"id":"70dd65167a084220c36e4d7a345610f0","type":"Feature","properties":{"name":"Münsterplatz"},"geometry":{"coordinates":[[7.09894081766015,50.73432444924248],[7.098486102002624,50.734163776827444],[7.098957555660746,50.73453808973156]],"type":"LineString"}},{"id":"1f6aead42b46810c75898899823be3b2","type":"Feature","properties":{"name":"Poststraße"},"geometry":{"coordinates":[[7.098527916107116,50.73420653271353],[7.098053194441377,50.733712281883356],[7.0978593731692,50.73351315777262],[7.0975330642553445,50.7331307848207],[7.097445985132765,50.73302944371906]],"type":"LineString"}},{"id":"5cf9f0c4a8faf5abe1ddb87e1a6ffb39","type":"Feature","properties":{"name":"Münsterplatz"},"geometry":{"coordinates":[[7.099941299919607,50.73368573357055],[7.099819174531035,50.73374711589318],[7.099592883371059,50.73406084651026],[7.098939153351864,50.734320013695765],[7.09900021604534,50.73444050321487],[7.098964296814302,50.73454735215134],[7.099327081054895,50.734774689503496],[7.0994384306740415,50.73483834376472],[7.099686332909442,50.735125016962115],[7.099847969462104,50.73530006466575]],"type":"LineString"}},{"id":"d3317ba30229f1abd8bfb1b91264a366","type":"Feature","properties":{"name":"In der Sürst"},"geometry":{"coordinates":[[7.099398298122509,50.7338345667178],[7.099134563357126,50.73366617816262],[7.09898418827251,50.73359735831775],[7.098873142055368,50.733547573686366],[7.098732020821615,50.73351828858421],[7.09853537647993,50.7334963247454],[7.0981860435900614,50.733547573686366],[7.0979315626756545,50.7335944298116]],"type":"LineString"}},{"id":"b493531ab87539db3b5b70b397a9391f","type":"Feature","properties":{"name":"Remiglustraße"},"geometry":{"coordinates":[[7.101445198112543,50.735019714263245],[7.101169850280485,50.734715034478285],[7.100892127092777,50.7344711021496],[7.100591732624622,50.73421281947634],[7.100295116692507,50.73395333960934],[7.099399601108104,50.73383376315303]],"type":"LineString"}},{"id":"52212dad7a1cc396e34cb6d89c40bdd8","type":"Feature","properties":{"name":"Münsterplatz"},"geometry":{"coordinates":[[7.100582376610475,50.73329792502423],[7.10032965928491,50.733507640237804],[7.100032014435698,50.73363915607925],[7.09986353621963,50.73369958215281],[7.099672594239564,50.733728017925586],[7.099588355131516,50.73373512686561],[7.099397436366161,50.733829782653686],[7.099276521129809,50.73390228483311],[7.099158787873421,50.73396471717578],[7.098942413240309,50.73405131673837],[7.098811952064125,50.73409562342968],[7.098519209913093,50.734202362104526]],"type":"LineString"}}]}')}}]);