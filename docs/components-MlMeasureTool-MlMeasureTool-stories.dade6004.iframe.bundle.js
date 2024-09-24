"use strict";(self.webpackChunk_mapcomponents_react_maplibre=self.webpackChunk_mapcomponents_react_maplibre||[]).push([[9407],{24715:(e,n,t)=>{t.r(n),t.d(n,{CatalogueDemo:()=>M,MeasureLine:()=>S,MeasurePolygon:()=>k,__namedExportsOrder:()=>j,default:()=>w});var a=t(96540),i=t(27596),o=t(77477),r=t(75003),l=t(74848);const s=(0,r.A)((0,l.jsx)("path",{d:"M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m0 10H3V8h2v4h2V8h2v4h2V8h2v4h2V8h2v4h2V8h2z"}),"StraightenOutlined"),u=(0,r.A)((0,l.jsx)("path",{d:"m17.66 17.66-1.06 1.06-.71-.71 1.06-1.06-1.94-1.94-1.06 1.06-.71-.71 1.06-1.06-1.94-1.94-1.06 1.06-.71-.71 1.06-1.06L9.7 9.7l-1.06 1.06-.71-.71 1.06-1.06-1.94-1.94-1.06 1.06-.71-.71 1.06-1.06L4 4v14c0 1.1.9 2 2 2h14zM7 17v-5.76L12.76 17z"}),"SquareFootOutlined");var d=t(28161),m=t(2071),c=t(73896),p=t(33551),f=t(86819),h=t(61224),g=t(77070),b=t(61102),y=t(19741);function x(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var a,i,o,r,l=[],s=!0,u=!1;try{if(o=(t=t.call(e)).next,0===n){if(Object(t)!==t)return;s=!1}else for(;!(s=(a=o.call(t)).done)&&(l.push(a.value),l.length!==n);s=!0);}catch(e){u=!0,i=e}finally{try{if(!s&&null!=t.return&&(r=t.return(),Object(r)!==r))return}finally{if(u)throw i}}return l}}(e,n)||function(e,n){if(e){if("string"==typeof e)return v(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?v(e,n):void 0}}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function v(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,a=new Array(n);t<n;t++)a[t]=e[t];return a}const w={title:"MapComponents/MlMeasureTool",component:i.A,argTypes:{},decorators:o.A};var T=function(){var e=x((0,a.useState)(!0),2),n=e[0],t=e[1],o=x((0,a.useState)("kilometers"),2),r=o[0],s=o[1];return(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)(g.A,{open:n,setOpen:t,name:"Measure Tool",children:[(0,l.jsxs)(m.A,{name:"units",onChange:function(e){s(e.target.value)},label:"Unit for measurement",defaultValue:"kilometers",children:[(0,l.jsx)(c.A,{value:"kilometers",children:"Kilometers"}),(0,l.jsx)(c.A,{value:"miles",children:"Miles"})]}),(0,l.jsxs)(d.A,{style:{fontFamily:"sans-serif",marginTop:"20px"},children:[(0,l.jsx)(u,{sx:{float:"left",marginTop:"4px",marginRight:"5px"}}),(0,l.jsx)(p.A,{variant:"h5",children:"Measure Polygon"})]}),(0,l.jsxs)(d.A,{style:{fontFamily:"sans-serif",marginTop:"20px"},children:["Area: ",(0,l.jsx)(i.A,{measureType:"polygon",unit:r})]})]})})},V=function(){var e=x((0,a.useState)(!0),2),n=e[0],t=e[1],o=x((0,a.useState)("kilometers"),2),r=o[0],u=o[1];return(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)(g.A,{open:n,setOpen:t,name:"Measure Tool",children:[(0,l.jsxs)(m.A,{name:"units",onChange:function(e){u(e.target.value)},label:"Unit for measurement",defaultValue:"kilometers",children:[(0,l.jsx)(c.A,{value:"kilometers",children:" Kilometers"}),(0,l.jsx)(c.A,{value:"miles",children:" Miles"})]}),(0,l.jsxs)(d.A,{style:{fontFamily:"sans-serif",marginTop:"20px"},children:[(0,l.jsx)(s,{sx:{float:"left",marginTop:"4px",marginRight:"5px"}}),(0,l.jsx)(p.A,{variant:"h5",children:"Measure Line"})]}),(0,l.jsxs)(d.A,{style:{fontFamily:"sans-serif",marginTop:"20px"},children:["Length: ",(0,l.jsx)(i.A,{measureType:"line",unit:r})]})]})})},S=function(){var e=x((0,a.useState)(!0),2),n=e[0],t=e[1],o=x((0,a.useState)("kilometers"),2),r=o[0],u=o[1];return(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)(g.A,{open:n,setOpen:t,name:"Measure Tool",children:[(0,l.jsxs)(m.A,{name:"units",onChange:function(e){u(e.target.value)},label:"Unit for measurement",defaultValue:"kilometers",children:[(0,l.jsx)(c.A,{value:"kilometers",children:" Kilometers"}),(0,l.jsx)(c.A,{value:"miles",children:" Miles"})]}),(0,l.jsxs)(d.A,{style:{fontFamily:"sans-serif",marginTop:"20px"},children:[(0,l.jsx)(s,{sx:{float:"left",marginTop:"4px",marginRight:"5px"}}),(0,l.jsx)(p.A,{variant:"h5",children:"Measure Line"})]}),(0,l.jsxs)(d.A,{style:{fontFamily:"sans-serif",marginTop:"20px"},children:["Length: ",(0,l.jsx)(i.A,{measureType:"line",unit:r})]})]})})}.bind({});S.parameters={},S.args={};var k=function(){var e=x((0,a.useState)(!0),2),n=e[0],t=e[1],o=x((0,a.useState)("kilometers"),2),r=o[0],s=o[1];return(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)(g.A,{open:n,setOpen:t,name:"Measure Tool",children:[(0,l.jsxs)(m.A,{name:"units",onChange:function(e){s(e.target.value)},label:"Unit for measurement",defaultValue:"kilometers",children:[(0,l.jsx)(c.A,{value:"kilometers",children:"Kilometers"}),(0,l.jsx)(c.A,{value:"miles",children:"Miles"})]}),(0,l.jsxs)(d.A,{style:{fontFamily:"sans-serif",marginTop:"20px"},children:[(0,l.jsx)(u,{sx:{float:"left",marginTop:"4px",marginRight:"5px"}}),(0,l.jsx)(p.A,{variant:"h5",children:"Measure Polygon"})]}),(0,l.jsxs)(d.A,{style:{fontFamily:"sans-serif",marginTop:"20px"},children:["Area: ",(0,l.jsx)(i.A,{measureType:"polygon",unit:r})]})]})})}.bind({});k.parameters={},k.args={};var M=function(){var e=(0,f.A)((function(e){return e.breakpoints.down("lg")})),n=x((0,a.useState)("area_measure"),2),t=n[0],i=n[1],o=x((0,a.useState)(null),2),r=o[0],s=o[1],u=Boolean(r),m=function(e){i(e)};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(d.A,{sx:{position:"fixed",width:{xs:"100%",sm:"auto"},top:{xs:"62px",sm:"22px"},right:{xs:"0px",sm:"120px",md:"145px",lg:"155px",xl:"175px"},paddingRight:{xs:"20px",sm:"0px"},color:"#009ee0",backgroundColor:"#fff",textAlign:"right",fontSize:"16px",fontFamily:"sans-serif",display:"flex",flexDirection:"column",gap:"5px",zIndex:5e3},children:e?"Zum Beenden erneut auf denselben Punkt klicken.":"Die Zeichnung kann beendet werden, indem erneut auf den zuletzt gezeichneten Punkt geklickt wird."}),(0,l.jsx)(b.A,{unmovableButtons:(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(h.A,{id:"basic-button",variant:"contained","aria-controls":u?"basic-menu":void 0,"aria-haspopup":"true","aria-expanded":u?"true":void 0,onClick:function(e){s(e.currentTarget)},children:"Tools"}),(0,l.jsxs)(y.A,{id:"basic-menu",anchorEl:r,open:u,onClose:function(){s(null)},MenuListProps:{"aria-labelledby":"basic-button"},children:[(0,l.jsx)(c.A,{onClick:function(){return m("area_measure")},children:"Measure Area"}),(0,l.jsx)(c.A,{onClick:function(){return m("line_measure")},children:"Measure Distance"})]})]})}),"area_measure"===t&&(0,l.jsx)(T,{}),"line_measure"===t&&(0,l.jsx)(V,{})]})}.bind({});M.parameters={},M.args={},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:"() => {\n  const [openSidebar, setOpenSidebar] = useState(true);\n  const [unit, setUnit] = useState<MlMeasureToolProps['unit']>('kilometers');\n  const handleChange = (event: SelectChangeEvent<MlMeasureToolProps['unit']>) => {\n    setUnit((event.target.value as MlMeasureToolProps['unit']));\n  };\n  return <>\n            <Sidebar open={openSidebar} setOpen={setOpenSidebar} name={'Measure Tool'}>\n                <Select name={'units'} onChange={handleChange} label={'Unit for measurement'} defaultValue={'kilometers'}>\n                    <MenuItem value={'kilometers'}> Kilometers</MenuItem>\n                    <MenuItem value={'miles'}> Miles</MenuItem>\n                </Select>\n\n                <Box style={{\n        fontFamily: 'sans-serif',\n        marginTop: '20px'\n      }}>\n                    <StraightenOutlinedIcon sx={{\n          float: 'left',\n          marginTop: '4px',\n          marginRight: '5px'\n        }} />\n                    <Typography variant=\"h5\">Measure Line</Typography>\n                </Box>\n                <Box style={{\n        fontFamily: 'sans-serif',\n        marginTop: '20px'\n      }}>\n                    Length: <MlMeasureTool measureType={'line'} unit={unit} />\n                </Box>\n            </Sidebar>\n        </>;\n}",...S.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:"() => {\n  const [openSidebar, setOpenSidebar] = useState(true);\n  const [unit, setUnit] = useState<MlMeasureToolProps['unit']>('kilometers');\n  const handleChange = (event: SelectChangeEvent<MlMeasureToolProps['unit']>) => {\n    setUnit((event.target.value as MlMeasureToolProps['unit']));\n  };\n  return <>\n            <Sidebar open={openSidebar} setOpen={setOpenSidebar} name={'Measure Tool'}>\n                <Select name={'units'} onChange={handleChange} label={'Unit for measurement'} defaultValue={'kilometers'}>\n                    <MenuItem value={'kilometers'}>Kilometers</MenuItem>\n                    <MenuItem value={'miles'}>Miles</MenuItem>\n                </Select>\n\n                <Box style={{\n        fontFamily: 'sans-serif',\n        marginTop: '20px'\n      }}>\n                    <SquareFootOutlinedIcon sx={{\n          float: 'left',\n          marginTop: '4px',\n          marginRight: '5px'\n        }} />\n                    <Typography variant=\"h5\">Measure Polygon</Typography>\n                </Box>\n                <Box style={{\n        fontFamily: 'sans-serif',\n        marginTop: '20px'\n      }}>\n                    Area: <MlMeasureTool measureType={'polygon'} unit={unit} />\n                </Box>\n            </Sidebar>\n        </>;\n}",...k.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:"() => {\n  const mediaIsMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));\n  const [selectedTool, setSelectedTool] = useState<string>('area_measure');\n  const [anchorEl, setAnchorEl] = useState(null);\n  const open = Boolean(anchorEl);\n  const handleClick = (event: MouseEvent<any>) => {\n    setAnchorEl(event.currentTarget);\n  };\n  const handleClose = () => {\n    setAnchorEl(null);\n  };\n  const handleToolSelect = (tool: string) => {\n    setSelectedTool(tool);\n  };\n  return <>\n            <Box sx={{\n      position: 'fixed',\n      width: {\n        xs: '100%',\n        sm: 'auto'\n      },\n      top: {\n        xs: '62px',\n        sm: '22px'\n      },\n      right: {\n        xs: '0px',\n        sm: '120px',\n        md: '145px',\n        lg: '155px',\n        xl: '175px'\n      },\n      paddingRight: {\n        xs: '20px',\n        sm: '0px'\n      },\n      color: '#009ee0',\n      backgroundColor: '#fff',\n      textAlign: 'right',\n      fontSize: '16px',\n      fontFamily: 'sans-serif',\n      display: 'flex',\n      flexDirection: 'column',\n      gap: '5px',\n      zIndex: 5000\n    }}>\n                {mediaIsMobile ? 'Zum Beenden erneut auf denselben Punkt klicken.' : 'Die Zeichnung kann beendet werden, indem erneut auf den zuletzt gezeichneten Punkt geklickt wird.'}\n            </Box>\n            <TopToolbar unmovableButtons={<>\n                        <Button id=\"basic-button\" variant=\"contained\" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup=\"true\" aria-expanded={open ? 'true' : undefined} onClick={handleClick}>\n                            Tools\n                        </Button>\n                        <Menu id=\"basic-menu\" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{\n        'aria-labelledby': 'basic-button'\n      }}>\n                            <MenuItem onClick={() => handleToolSelect('area_measure')}>Measure Area</MenuItem>\n                            <MenuItem onClick={() => handleToolSelect('line_measure')}>Measure Distance</MenuItem>\n                        </Menu>\n                    </>} />\n            {selectedTool === 'area_measure' && <CTemplate />}\n            {selectedTool === 'line_measure' && <CLineTemplate />}\n        </>;\n}",...M.parameters?.docs?.source}}};const j=["MeasureLine","MeasurePolygon","CatalogueDemo"]},77477:(e,n,t)=>{t.d(n,{A:()=>f,Y:()=>p});var a=t(96540),i=t(95532),o=t(32348),r=(t(18582),t(68704)),l=t(70008),s=t(30901),u=t(74848);function d(e){return d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},d(e)}function m(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?m(Object(t),!0).forEach((function(n){var a,i,o,r;a=e,i=n,o=t[n],r=function(e,n){if("object"!=d(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var a=t.call(e,"string");if("object"!=d(a))return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(i),(i="symbol"==d(r)?r:String(r))in a?Object.defineProperty(a,i,{value:o,enumerable:!0,configurable:!0,writable:!0}):a[i]=o})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):m(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}var p=function(e){return[function(n,t){var d,m=(0,a.useMemo)((function(){var e;return(0,s.A)(null==t||null===(e=t.globals)||void 0===e?void 0:e.theme)}),[null==t||null===(d=t.globals)||void 0===d?void 0:d.theme]);return(0,u.jsx)("div",{className:"fullscreen_map",children:(0,u.jsx)(i.mO,{children:(0,u.jsxs)(l.A,{theme:m,children:[(0,u.jsx)(n,{}),(0,u.jsx)(o.A,{options:c({zoom:14.5,style:"https://wms.wheregroup.com/tileserver/style/osm-bright.json",center:[7.0851268,50.73884]},e?c({},e):{}),mapId:"map_1"}),(0,u.jsx)(r.A,{showZoomButtons:!1,mapId:"map_1"})]})})})}]};const f=p({});try{p.displayName="makeMapContextDecorators",p.__docgenInfo={description:"",displayName:"makeMapContextDecorators",props:{hash:{defaultValue:null,description:"If `true`, the map's position (zoom, center latitude, center longitude, bearing, and pitch) will be synced with the hash fragment of the page's URL.\nFor example, `http://path/to/my/page.html#2.59/39.26/53.07/-24.1/60`.\nAn additional string may optionally be provided to indicate a parameter-styled hash,\ne.g. http://path/to/my/page.html#map=2.59/39.26/53.07/-24.1/60&foo=bar, where foo\nis a custom parameter and bar is an arbitrary hash distinct from the map hash.\n@defaultValue false",name:"hash",required:!1,type:{name:"string | boolean | undefined"}},interactive:{defaultValue:null,description:"If `false`, no mouse, touch, or keyboard listeners will be attached to the map, so it will not respond to interaction.\n@defaultValue true",name:"interactive",required:!1,type:{name:"boolean | undefined"}},container:{defaultValue:null,description:"The HTML element in which MapLibre GL JS will render the map, or the element's string `id`. The specified element must have no children.",name:"container",required:!1,type:{name:"string | HTMLElement | undefined"}},bearingSnap:{defaultValue:null,description:"The threshold, measured in degrees, that determines when the map's\nbearing will snap to north. For example, with a `bearingSnap` of 7, if the user rotates\nthe map within 7 degrees of north, the map will automatically snap to exact north.\n@defaultValue 7",name:"bearingSnap",required:!1,type:{name:"number | undefined"}},attributionControl:{defaultValue:null,description:'If set, an {@link AttributionControl} will be added to the map with the provided options.\nTo disable the attribution control, pass `false`.\nNote: showing the logo of MapLibre is not required for using MapLibre.\n@defaultValue compact: true, customAttribution: "MapLibre ...".',name:"attributionControl",required:!1,type:{name:"false | AttributionControlOptions | undefined"}},maplibreLogo:{defaultValue:null,description:"If `true`, the MapLibre logo will be shown.",name:"maplibreLogo",required:!1,type:{name:"boolean | undefined"}},logoPosition:{defaultValue:null,description:"A string representing the position of the MapLibre wordmark on the map. Valid options are `top-left`,`top-right`, `bottom-left`, or `bottom-right`.\n@defaultValue 'bottom-left'",name:"logoPosition",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"top-left"'},{value:'"top-right"'},{value:'"bottom-left"'},{value:'"bottom-right"'}]}},failIfMajorPerformanceCaveat:{defaultValue:null,description:"If `true`, map creation will fail if the performance of MapLibre GL JS would be dramatically worse than expected\n(i.e. a software renderer would be used).\n@defaultValue false",name:"failIfMajorPerformanceCaveat",required:!1,type:{name:"boolean | undefined"}},preserveDrawingBuffer:{defaultValue:null,description:"If `true`, the map's canvas can be exported to a PNG using `map.getCanvas().toDataURL()`. This is `false` by default as a performance optimization.\n@defaultValue false",name:"preserveDrawingBuffer",required:!1,type:{name:"boolean | undefined"}},antialias:{defaultValue:null,description:"If `true`, the gl context will be created with MSAA antialiasing, which can be useful for antialiasing custom layers.\nDisabled by default as a performance optimization.",name:"antialias",required:!1,type:{name:"boolean | undefined"}},refreshExpiredTiles:{defaultValue:null,description:"If `false`, the map won't attempt to re-request tiles once they expire per their HTTP `cacheControl`/`expires` headers.\n@defaultValue true",name:"refreshExpiredTiles",required:!1,type:{name:"boolean | undefined"}},maxBounds:{defaultValue:null,description:"If set, the map will be constrained to the given bounds.",name:"maxBounds",required:!1,type:{name:"LngLatBoundsLike | undefined"}},scrollZoom:{defaultValue:null,description:'If `true`, the "scroll to zoom" interaction is enabled. {@link AroundCenterOptions} are passed as options to {@link ScrollZoomHandler#enable }.\n@defaultValue true',name:"scrollZoom",required:!1,type:{name:"boolean | AroundCenterOptions | undefined"}},minZoom:{defaultValue:null,description:"The minimum zoom level of the map (0-24).\n@defaultValue 0",name:"minZoom",required:!1,type:{name:"number | null | undefined"}},maxZoom:{defaultValue:null,description:"The maximum zoom level of the map (0-24).\n@defaultValue 22",name:"maxZoom",required:!1,type:{name:"number | null | undefined"}},minPitch:{defaultValue:null,description:"The minimum pitch of the map (0-85). Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.\n@defaultValue 0",name:"minPitch",required:!1,type:{name:"number | null | undefined"}},maxPitch:{defaultValue:null,description:"The maximum pitch of the map (0-85). Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.\n@defaultValue 60",name:"maxPitch",required:!1,type:{name:"number | null | undefined"}},boxZoom:{defaultValue:null,description:'If `true`, the "box zoom" interaction is enabled (see {@link BoxZoomHandler}).\n@defaultValue true',name:"boxZoom",required:!1,type:{name:"boolean | undefined"}},dragRotate:{defaultValue:null,description:'If `true`, the "drag to rotate" interaction is enabled (see {@link DragRotateHandler}).\n@defaultValue true',name:"dragRotate",required:!1,type:{name:"boolean | undefined"}},dragPan:{defaultValue:null,description:'If `true`, the "drag to pan" interaction is enabled. An `Object` value is passed as options to {@link DragPanHandler#enable }.\n@defaultValue true',name:"dragPan",required:!1,type:{name:"boolean | DragPanOptions | undefined"}},keyboard:{defaultValue:null,description:"If `true`, keyboard shortcuts are enabled (see {@link KeyboardHandler}).\n@defaultValue true",name:"keyboard",required:!1,type:{name:"boolean | undefined"}},doubleClickZoom:{defaultValue:null,description:'If `true`, the "double click to zoom" interaction is enabled (see {@link DoubleClickZoomHandler}).\n@defaultValue true',name:"doubleClickZoom",required:!1,type:{name:"boolean | undefined"}},touchZoomRotate:{defaultValue:null,description:'If `true`, the "pinch to rotate and zoom" interaction is enabled. An `Object` value is passed as options to {@link TwoFingersTouchZoomRotateHandler#enable }.\n@defaultValue true',name:"touchZoomRotate",required:!1,type:{name:"boolean | AroundCenterOptions | undefined"}},touchPitch:{defaultValue:null,description:'If `true`, the "drag to pitch" interaction is enabled. An `Object` value is passed as options to {@link TwoFingersTouchPitchHandler#enable }.\n@defaultValue true',name:"touchPitch",required:!1,type:{name:"boolean | AroundCenterOptions | undefined"}},cooperativeGestures:{defaultValue:null,description:'If `true` or set to an options object, the map is only accessible on desktop while holding Command/Ctrl and only accessible on mobile with two fingers. Interacting with the map using normal gestures will trigger an informational screen. With this option enabled, "drag to pitch" requires a three-finger gesture. Cooperative gestures are disabled when a map enters fullscreen using {@link FullscreenControl}.\n@defaultValue false',name:"cooperativeGestures",required:!1,type:{name:"boolean | undefined"}},trackResize:{defaultValue:null,description:"If `true`, the map will automatically resize when the browser window resizes.\n@defaultValue true",name:"trackResize",required:!1,type:{name:"boolean | undefined"}},center:{defaultValue:null,description:"The initial geographical centerpoint of the map. If `center` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `[0, 0]` Note: MapLibre GL JS uses longitude, latitude coordinate order (as opposed to latitude, longitude) to match GeoJSON.\n@defaultValue [0, 0]",name:"center",required:!1,type:{name:"LngLatLike | undefined"}},zoom:{defaultValue:null,description:"The initial zoom level of the map. If `zoom` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`.\n@defaultValue 0",name:"zoom",required:!1,type:{name:"number | undefined"}},bearing:{defaultValue:null,description:"The initial bearing (rotation) of the map, measured in degrees counter-clockwise from north. If `bearing` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`.\n@defaultValue 0",name:"bearing",required:!1,type:{name:"number | undefined"}},pitch:{defaultValue:null,description:"The initial pitch (tilt) of the map, measured in degrees away from the plane of the screen (0-85). If `pitch` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`. Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.\n@defaultValue 0",name:"pitch",required:!1,type:{name:"number | undefined"}},renderWorldCopies:{defaultValue:null,description:"If `true`, multiple copies of the world will be rendered side by side beyond -180 and 180 degrees longitude. If set to `false`:\n\n- When the map is zoomed out far enough that a single representation of the world does not fill the map's entire\ncontainer, there will be blank space beyond 180 and -180 degrees longitude.\n- Features that cross 180 and -180 degrees longitude will be cut in two (with one portion on the right edge of the\nmap and the other on the left edge of the map) at every zoom level.\n@defaultValue true",name:"renderWorldCopies",required:!1,type:{name:"boolean | undefined"}},maxTileCacheSize:{defaultValue:null,description:"The maximum number of tiles stored in the tile cache for a given source. If omitted, the cache will be dynamically sized based on the current viewport which can be set using `maxTileCacheZoomLevels` constructor options.\n@defaultValue null",name:"maxTileCacheSize",required:!1,type:{name:"number | null | undefined"}},maxTileCacheZoomLevels:{defaultValue:null,description:"The maximum number of zoom levels for which to store tiles for a given source. Tile cache dynamic size is calculated by multiplying `maxTileCacheZoomLevels` with the approximate number of tiles in the viewport for a given source.\n@defaultValue 5",name:"maxTileCacheZoomLevels",required:!1,type:{name:"number | undefined"}},transformRequest:{defaultValue:null,description:"A callback run before the Map makes a request for an external URL. The callback can be used to modify the url, set headers, or set the credentials property for cross-origin requests.\nExpected to return an object with a `url` property and optionally `headers` and `credentials` properties.\n@defaultValue null",name:"transformRequest",required:!1,type:{name:"RequestTransformFunction | null | undefined"}},transformCameraUpdate:{defaultValue:null,description:"A callback run before the map's camera is moved due to user input or animation. The callback can be used to modify the new center, zoom, pitch and bearing.\nExpected to return an object containing center, zoom, pitch or bearing values to overwrite.\n@defaultValue null",name:"transformCameraUpdate",required:!1,type:{name:"CameraUpdateTransformFunction | null | undefined"}},locale:{defaultValue:null,description:"A patch to apply to the default localization table for UI strings, e.g. control tooltips. The `locale` object maps namespaced UI string IDs to translated strings in the target language; see `src/ui/default_locale.js` for an example with all supported string IDs. The object may specify all UI strings (thereby adding support for a new translation) or only a subset of strings (thereby patching the default translation table).\n@defaultValue null",name:"locale",required:!1,type:{name:"any"}},fadeDuration:{defaultValue:null,description:"Controls the duration of the fade-in/fade-out animation for label collisions after initial map load, in milliseconds. This setting affects all symbol layers. This setting does not affect the duration of runtime styling transitions or raster tile cross-fading.\n@defaultValue 300",name:"fadeDuration",required:!1,type:{name:"number | undefined"}},crossSourceCollisions:{defaultValue:null,description:"If `true`, symbols from multiple sources can collide with each other during collision detection. If `false`, collision detection is run separately for the symbols in each source.\n@defaultValue true",name:"crossSourceCollisions",required:!1,type:{name:"boolean | undefined"}},collectResourceTiming:{defaultValue:null,description:"If `true`, Resource Timing API information will be collected for requests made by GeoJSON and Vector Tile web workers (this information is normally inaccessible from the main Javascript thread). Information will be returned in a `resourceTiming` property of relevant `data` events.\n@defaultValue false",name:"collectResourceTiming",required:!1,type:{name:"boolean | undefined"}},clickTolerance:{defaultValue:null,description:"The max number of pixels a user can shift the mouse pointer during a click for it to be considered a valid click (as opposed to a mouse drag).\n@defaultValue 3",name:"clickTolerance",required:!1,type:{name:"number | undefined"}},bounds:{defaultValue:null,description:"The initial bounds of the map. If `bounds` is specified, it overrides `center` and `zoom` constructor options.",name:"bounds",required:!1,type:{name:"LngLatBoundsLike | undefined"}},fitBoundsOptions:{defaultValue:null,description:"A {@link FitBoundsOptions} options object to use _only_ when fitting the initial `bounds` provided above.",name:"fitBoundsOptions",required:!1,type:{name:"FitBoundsOptions | undefined"}},localIdeographFontFamily:{defaultValue:null,description:"Defines a CSS\nfont-family for locally overriding generation of glyphs in the 'CJK Unified Ideographs', 'Hiragana', 'Katakana' and 'Hangul Syllables' ranges.\nIn these ranges, font settings from the map's style will be ignored, except for font-weight keywords (light/regular/medium/bold).\nSet to `false`, to enable font settings from the map's style for these glyph ranges.\nThe purpose of this option is to avoid bandwidth-intensive glyph server requests. (See [Use locally generated ideographs](https://maplibre.org/maplibre-gl-js/docs/examples/local-ideographs).)\n@defaultValue 'sans-serif'",name:"localIdeographFontFamily",required:!1,type:{name:"string | false | undefined"}},style:{defaultValue:null,description:"The map's MapLibre style. This must be a JSON object conforming to\nthe schema described in the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/),\nor a URL to such JSON.\nWhen the style is not specified, calling {@link Map#setStyle } is required to render the map.",name:"style",required:!1,type:{name:"string | StyleSpecification | undefined"}},pitchWithRotate:{defaultValue:null,description:'If `false`, the map\'s pitch (tilt) control with "drag to rotate" interaction will be disabled.\n@defaultValue true',name:"pitchWithRotate",required:!1,type:{name:"boolean | undefined"}},pixelRatio:{defaultValue:null,description:"The pixel ratio.\nThe canvas' `width` attribute will be `container.clientWidth * pixelRatio` and its `height` attribute will be `container.clientHeight * pixelRatio`. Defaults to `devicePixelRatio` if not specified.",name:"pixelRatio",required:!1,type:{name:"number | undefined"}},validateStyle:{defaultValue:null,description:"If false, style validation will be skipped. Useful in production environment.\n@defaultValue true",name:"validateStyle",required:!1,type:{name:"boolean | undefined"}},maxCanvasSize:{defaultValue:null,description:"The canvas' `width` and `height` max size. The values are passed as an array where the first element is max width and the second element is max height.\nYou shouldn't set this above WebGl `MAX_TEXTURE_SIZE`.\n@defaultValue [4096, 4096].",name:"maxCanvasSize",required:!1,type:{name:"[number, number] | undefined"}},cancelPendingTileRequestsWhileZooming:{defaultValue:null,description:"Determines whether to cancel, or retain, tiles from the current viewport which are still loading but which belong to a farther (smaller) zoom level than the current one.\n* If `true`, when zooming in, tiles which didn't manage to load for previous zoom levels will become canceled. This might save some computing resources for slower devices, but the map details might appear more abruptly at the end of the zoom.\n* If `false`, when zooming in, the previous zoom level(s) tiles will progressively appear, giving a smoother map details experience. However, more tiles will be rendered in a short period of time.\n@defaultValue true",name:"cancelPendingTileRequestsWhileZooming",required:!1,type:{name:"boolean | undefined"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/decorators/MapContextDecorator.tsx#makeMapContextDecorators"]={docgenInfo:p.__docgenInfo,name:"makeMapContextDecorators",path:"src/decorators/MapContextDecorator.tsx#makeMapContextDecorators"})}catch(e){}}}]);