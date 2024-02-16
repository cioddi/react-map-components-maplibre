"use strict";(self.webpackChunk_mapcomponents_react_maplibre=self.webpackChunk_mapcomponents_react_maplibre||[]).push([[731],{64148:(r,e,t)=>{t.r(e),t.d(e,{ExampleConfig:()=>L,__namedExportsOrder:()=>C,default:()=>P});var n=t(96540),o=t(4748),a=t(61102),s=t(61224),i=t(77477),l=t(85072),u=t.n(l),c=t(97825),m=t.n(c),p=t(77659),y=t.n(p),f=t(55056),b=t.n(f),d=t(10540),v=t.n(d),h=t(41113),w=t.n(h),g=t(99622),j={};j.styleTagTransform=w(),j.setAttributes=b(),j.insert=y().bind(null,"head"),j.domAPI=m(),j.insertStyleElement=v(),u()(g.A,j),g.A&&g.A.locals&&g.A.locals;var O=t(74848);function A(r){return A="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},A(r)}function S(r,e){var t=Object.keys(r);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(r);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),t.push.apply(t,n)}return t}function _(r){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?S(Object(t),!0).forEach((function(e){var n,o,a,s;n=r,o=e,a=t[e],s=function(r,e){if("object"!=A(r)||!r)return r;var t=r[Symbol.toPrimitive];if(void 0!==t){var n=t.call(r,"string");if("object"!=A(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(r)}(o),(o="symbol"==A(s)?s:String(s))in n?Object.defineProperty(n,o,{value:a,enumerable:!0,configurable:!0,writable:!0}):n[o]=a})):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):S(Object(t)).forEach((function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(t,e))}))}return r}function x(r,e){(null==e||e>r.length)&&(e=r.length);for(var t=0,n=new Array(e);t<e;t++)n[t]=r[t];return n}const P={title:"MapComponents/MlWmsLayer",component:o.A,argTypes:{url:{},layer:{}},decorators:i.A};var L=function(r){var e,t,i=(e=(0,n.useState)(!0),t=2,function(r){if(Array.isArray(r))return r}(e)||function(r,e){var t=null==r?null:"undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(null!=t){var n,o,a,s,i=[],l=!0,u=!1;try{if(a=(t=t.call(r)).next,0===e){if(Object(t)!==t)return;l=!1}else for(;!(l=(n=a.call(t)).done)&&(i.push(n.value),i.length!==e);l=!0);}catch(r){u=!0,o=r}finally{try{if(!l&&null!=t.return&&(s=t.return(),Object(s)!==s))return}finally{if(u)throw o}}return i}}(e,t)||function(r,e){if(r){if("string"==typeof r)return x(r,e);var t=Object.prototype.toString.call(r).slice(8,-1);return"Object"===t&&r.constructor&&(t=r.constructor.name),"Map"===t||"Set"===t?Array.from(r):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?x(r,e):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),l=i[0],u=i[1];return(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(a.A,{unmovableButtons:(0,O.jsx)(s.A,{color:"primary",variant:l?"contained":"outlined",onClick:function(){return u(!l)},children:"WMS"})}),(0,O.jsx)(o.A,_({visible:l},r))]})}.bind({});L.parameters={},L.args={url:"https://www.wms.nrw.de/geobasis/wms_nw_uraufnahme",urlParameters:{layers:"nw_uraufnahme_rw"}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:"(props: MlWmsLayerProps) => {\n  const [showLayer, setShowLayer] = useState(true);\n  return <>\n            <TopToolbar unmovableButtons={<Button color=\"primary\" variant={showLayer ? 'contained' : 'outlined'} onClick={() => setShowLayer(!showLayer)}>\n                        WMS\n                    </Button>} />\n            <MlWmsLayer visible={showLayer} {...props} />\n        </>;\n}",...L.parameters?.docs?.source}}};const C=["ExampleConfig"]},77477:(r,e,t)=>{t.d(e,{A:()=>c});var n=t(96540),o=t(95532),a=t(32348),s=(t(18582),t(68704)),i=t(65793),l=t(30901),u=t(74848);const c=[function(r,e){var t,c=(0,n.useMemo)((function(){var r;return(0,l.A)(null==e||null===(r=e.globals)||void 0===r?void 0:r.theme)}),[null==e||null===(t=e.globals)||void 0===t?void 0:t.theme]);return(0,u.jsx)("div",{className:"fullscreen_map",children:(0,u.jsx)(o.mO,{children:(0,u.jsxs)(i.A,{theme:c,children:[(0,u.jsx)(r,{}),(0,u.jsx)(a.A,{options:{zoom:14.5,style:"https://wms.wheregroup.com/tileserver/style/osm-bright.json",center:[7.0851268,50.73884]},mapId:"map_1"}),(0,u.jsx)(s.A,{showZoomButtons:!1,mapId:"map_1"})]})})})}]},99622:(r,e,t)=>{t.d(e,{A:()=>i});var n=t(71354),o=t.n(n),a=t(76314),s=t.n(a)()(o());s.push([r.id,"","",{version:3,sources:[],names:[],mappings:"",sourceRoot:""}]);const i=s}}]);