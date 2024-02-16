/*! For license information please see 9589.3fbe3d05.iframe.bundle.js.LICENSE.txt */
(self.webpackChunk_mapcomponents_react_maplibre=self.webpackChunk_mapcomponents_react_maplibre||[]).push([[9589],{45228:t=>{"use strict";var e=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,n=Object.prototype.propertyIsEnumerable;t.exports=function(){try{if(!Object.assign)return!1;var t=new String("abc");if(t[5]="de","5"===Object.getOwnPropertyNames(t)[0])return!1;for(var e={},r=0;r<10;r++)e["_"+String.fromCharCode(r)]=r;if("0123456789"!==Object.getOwnPropertyNames(e).map((function(t){return e[t]})).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach((function(t){n[t]=t})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(t){return!1}}()?Object.assign:function(t,s){for(var i,a,o=function(t){if(null==t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}(t),l=1;l<arguments.length;l++){for(var u in i=Object(arguments[l]))r.call(i,u)&&(o[u]=i[u]);if(e){a=e(i);for(var h=0;h<a.length;h++)n.call(i,a[h])&&(o[a[h]]=i[a[h]])}}return o}},80210:(t,e,r)=>{const{Node:n,Way:s,Relation:i}=r(80301),{purgeProps:a,RefElements:o}=r(42291),l=r(6076);t.exports=(t,e)=>{let r=!1,u=!1,h=!0;(t=>{if(t){r=!(!t.completeFeature&&!t.allFeatures),u=!!t.renderTagged;let e=t.suppressWay||t.excludeWay;void 0===e||e||(h=!1)}})(e);let p=(t=>t.elements?"json":t.indexOf("<osm")>=0?"xml":t.trim().startsWith("{")?"json-raw":"invalid")(t),d=new o,f=[];"json-raw"===p&&(p=(t=JSON.parse(t)).elements?"json":"invalid"),"json"===p?(t=>{for(let e of t.elements)switch(e.type){case"node":let t=new n(e.id,d);e.tags&&t.addTags(e.tags),t.addProps(a(e,["id","type","tags","lat","lon"])),t.setLatLng(e);break;case"way":let r=new s(e.id,d);if(e.tags&&r.addTags(e.tags),r.addProps(a(e,["id","type","tags","nodes","geometry"])),e.nodes)for(let t of e.nodes)r.addNodeRef(t);else e.geometry&&r.setLatLngArray(e.geometry);break;case"relation":let o=new i(e.id,d);if(e.bounds&&o.setBounds([parseFloat(e.bounds.minlon),parseFloat(e.bounds.minlat),parseFloat(e.bounds.maxlon),parseFloat(e.bounds.maxlat)]),e.tags&&o.addTags(e.tags),o.addProps(a(e,["id","type","tags","bounds","members"])),e.members)for(let t of e.members)o.addMember(t)}})(t):"xml"===p&&(t=>{const e=new l({progressive:!0});e.on("</osm.node>",(t=>{let e=new n(t.id,d);for(let[r,n]of Object.entries(t))!r.startsWith("$")&&["id","lon","lat"].indexOf(r)<0&&e.addProp(r,n);if(e.setLatLng(t),t.$innerNodes)for(let r of t.$innerNodes)"tag"===r.$tag&&e.addTag(r.k,r.v)})),e.on("</osm.way>",(t=>{let e=new s(t.id,d);for(let[r,n]of Object.entries(t))!r.startsWith("$")&&["id"].indexOf(r)<0&&e.addProp(r,n);if(t.$innerNodes)for(let r of t.$innerNodes)"nd"===r.$tag?r.lon&&r.lat?e.addLatLng(r):r.ref&&e.addNodeRef(r.ref):"tag"===r.$tag&&e.addTag(r.k,r.v)})),e.on("<osm.relation>",(t=>{new i(t.id,d)})),e.on("</osm.relation.member>",((t,e)=>{let r=d.get(`relation/${e.id}`),n={type:t.type,role:t.role?t.role:"",ref:t.ref};if(t.lat&&t.lon){n.lat=t.lat,n.lon=t.lon,n.tags={};for(let[e,r]of Object.entries(t))!e.startsWith("$")&&["type","lat","lon"].indexOf(e)<0&&(n[e]=r)}if(t.$innerNodes){let e=[],r=[];for(let n of t.$innerNodes)n.lat&&n.lon?e.push(n):r.push(n.ref);e.length>0?n.geometry=e:r.length>0&&(n.nodes=r)}r.addMember(n)})),e.on("</osm.relation.bounds>",((t,e)=>{d.get(`relation/${e.id}`).setBounds([parseFloat(t.minlon),parseFloat(t.minlat),parseFloat(t.maxlon),parseFloat(t.maxlat)])})),e.on("</osm.relation.tag>",((t,e)=>{d.get(`relation/${e.id}`).addTag(t.k,t.v)})),e.parse(t)})(t),d.bindAll();for(let t of d.values())if(t.refCount<=0||t.hasTag&&u&&!(t instanceof s&&h)){let e=t.toFeatureArray();if(t instanceof i&&!r&&e.length>0)return e[0].geometry;f=f.concat(e)}return{type:"FeatureCollection",features:f}}},80301:(t,e,r)=>{t.exports=(()=>{"use strict";const{first:t,last:e,coordsToKey:n,addToMap:s,removeFromMap:i,getFirstFromMap:a,isRing:o,ringDirection:l,ptInsidePolygon:u,strToFloat:h,LateBinder:p,WayCollection:d}=r(42291),f=r(29940);class c{constructor(t,e,r){this.type=t,this.id=e,this.refElems=r,this.tags={},this.props={id:this.getCompositeId()},this.refCount=0,this.hasTag=!1,r&&r.add(this.getCompositeId(),this)}addTags(t){this.tags=Object.assign(this.tags,t),this.hasTag=!!t}addTag(t,e){this.tags[t]=e,this.hasTag=!!t}addProp(t,e){this.props[t]=e}addProps(t){this.props=Object.assign(this.props,t)}getCompositeId(){return`${this.type}/${this.id}`}getProps(){return Object.assign(this.props,this.tags)}toFeatureArray(){return[]}}class g extends c{constructor(t,e){super("node",t,e),this.latLng=null}setLatLng(t){this.latLng=t}toFeatureArray(){return this.latLng?[{type:"Feature",id:this.getCompositeId(),properties:this.getProps(),geometry:{type:"Point",coordinates:h([this.latLng.lon,this.latLng.lat])}}]:[]}getLatLng(){return this.latLng}}class m extends c{constructor(t,e){super("way",t,e),this.latLngArray=[],this.isPolygon=!1}addLatLng(t){this.latLngArray.push(t)}setLatLngArray(t){this.latLngArray=t}addNodeRef(t){let e=new p(this.latLngArray,(function(t){let e=this.refElems.get(`node/${t}`);if(e)return e.refCount++,e.getLatLng()}),this,[t]);this.latLngArray.push(e),this.refElems.addBinder(e)}analyzeGeometryType(t,e){let r=f[t];r&&(this.isPolygon=!0,r.whitelist?this.isPolygon=r.whitelist.indexOf(e)>=0:r.blacklist&&(this.isPolygon=!(r.blacklist.indexOf(e)>=0)))}addTags(t){super.addTags(t);for(let[e,r]of Object.entries(t))this.analyzeGeometryType(e,r)}addTag(t,e){super.addTag(t,e),this.analyzeGeometryType(t,e)}toCoordsArray(){return this.latLngArray.map((t=>[t.lon,t.lat]))}toFeatureArray(){let t=this.toCoordsArray();if(t.length>1){t=h(t);let e={type:"Feature",id:this.getCompositeId(),properties:this.getProps(),geometry:{type:"LineString",coordinates:t}};return this.isPolygon&&o(t)?("counterclockwise"!==l(t)&&t.reverse(),e.geometry={type:"Polygon",coordinates:[t]},[e]):[e]}return[]}}return{Node:g,Way:m,Relation:class extends c{constructor(t,e){super("relation",t,e),this.relations=[],this.nodes=[],this.bounds=null}setBounds(t){this.bounds=t}addMember(t){switch(t.type){case"relation":let e=new p(this.relations,(function(t){let e=this.refElems.get(`relation/${t}`);if(e)return e.refCount++,e}),this,[t.ref]);this.relations.push(e),this.refElems.addBinder(e);break;case"way":t.role||(t.role="");let r=this[t.role];if(r||(r=this[t.role]=[]),t.geometry){let e=new m(t.ref,this.refElems);e.setLatLngArray(t.geometry),e.refCount++,r.push(e)}else if(t.nodes){let e=new m(t.ref,this.refElems);for(let r of t.nodes)e.addNodeRef(r);e.refCount++,r.push(e)}else{let e=new p(r,(function(t){let e=this.refElems.get(`way/${t}`);if(e)return e.refCount++,e}),this,[t.ref]);r.push(e),this.refElems.addBinder(e)}break;case"node":let n=null;if(t.lat&&t.lon){n=new g(t.ref,this.refElems),n.setLatLng({lon:t.lon,lat:t.lat}),t.tags&&n.addTags(t.tags);for(let[e,r]of Object.entries(t))["id","type","lat","lon"].indexOf(e)<0&&n.addProp(e,r);n.refCount++,this.nodes.push(n)}else{let e=new p(this.nodes,(function(t){let e=this.refElems.get(`node/${t}`);if(e)return e.refCount++,e}),this,[t.ref]);this.nodes.push(e),this.refElems.addBinder(e)}}}toFeatureArray(){let e=[],r=[],n=[];const s=["outer","inner",""];for(let t of this.relations)if(t)for(let e of s){let r=t[e];if(r){let t=this[e];t?[].splice.apply(t,[t.length,0].concat(r)):this[e]=r}}for(let t of s){let e=this[t];if(e){this[t]=new d;for(let r of e)this[t].addWay(r)}}let i=null,a={type:"Feature",id:this.getCompositeId(),bbox:this.bounds,properties:this.getProps()};this.bounds||delete a.bbox,this.outer?(i=((e,r)=>{let n=e?e.toRings("counterclockwise"):[],s=r?r.toRings("clockwise"):[];if(n.length>0){let e=[],r=null;for(r of n)e.push([r]);for(;r=s.shift();)for(let s in n)if(u(t(r),n[s])){e[s].push(r);break}return 1===e.length?{type:"Polygon",coordinates:e[0]}:{type:"MultiPolygon",coordinates:e}}return null})(this.outer,this.inner),i&&(a.geometry=i,e.push(a))):this[""]&&(i=(t=>{let e=t?t.toStrings():[];return e.length>0?1===e.length?{type:"LineString",coordinates:e[0]}:{type:"MultiLineString",coordinates:e}:null})(this[""]),i&&(a.geometry=i,r.push(a)));for(let t of this.nodes)n=n.concat(t.toFeatureArray());return e.concat(r).concat(n)}}}})()},42291:t=>{t.exports=(()=>{"use strict";const t=t=>t[0],e=t=>t[t.length-1],r=t=>t.join(","),n=(t,e,r)=>{let n=t[e];n?n.push(r):t[e]=[r]},s=(t,e,r)=>{let n=t[e],s=null;n&&(s=n.indexOf(r))>=0&&n.splice(s,1)},i=(t,e)=>{let r=t[e];return r&&r.length>0?r[0]:null},a=n=>n.length>3&&r(t(n))===r(e(n)),o=(t,e,r)=>{e=e||0,r=r||1;let n=t.reduce(((r,n,s)=>t[r][e]>n[e]?r:s),0),s=n<=0?t.length-2:n-1,i=n>=t.length-1?1:n+1,a=t[s][e],o=t[n][e],l=t[i][e],u=t[s][r],h=t[n][r];return(o-a)*(t[i][r]-u)-(l-a)*(h-u)<0?"clockwise":"counterclockwise"},l=t=>t instanceof Array?t.map(l):parseFloat(t);class u extends Map{constructor(){super(),this.binders=[]}add(t,e){this.has(t)||this.set(t,e)}addBinder(t){this.binders.push(t)}bindAll(){this.binders.forEach((t=>t.bind()))}}return{purgeProps:(t,e)=>{if(t){let r=Object.assign({},t);if(e)for(let t of e)delete r[t];return r}return{}},mergeProps:(t,e)=>(t=t||{},e=e||{},Object.assign(t,e)),first:t,last:e,coordsToKey:r,addToMap:n,removeFromMap:s,getFirstFromMap:i,isRing:a,ringDirection:o,ptInsidePolygon:(t,e,r,n)=>{r=r||0,n=n||1;let s=!1;for(let i=0,a=e.length-1;i<e.length;a=i++)(e[i][r]<=t[r]&&t[r]<e[a][r]||e[a][r]<=t[r]&&t[r]<e[i][r])&&t[n]<(e[a][n]-e[i][n])*(t[r]-e[i][r])/(e[a][r]-e[i][r])+e[i][n]&&(s=!s);return s},strToFloat:l,RefElements:u,LateBinder:class{constructor(t,e,r,n){this.container=t,this.valueFunc=e,this.ctx=r,this.args=n}bind(){let t=this.valueFunc.apply(this.ctx,this.args);if(this.container instanceof Array){let e=this.container.indexOf(this);if(e>=0){let r=[e,1];t&&r.push(t),[].splice.apply(this.container,r)}}else if("object"==typeof this.container){let e=Object.keys(this.container).find((t=>this.container[t]===this));e&&(t?this.container[e]=t:delete this.container[e])}}},WayCollection:class extends Array{constructor(){super(),this.firstMap={},this.lastMap={}}addWay(s){(s=s.toCoordsArray()).length>0&&(this.push(s),n(this.firstMap,r(t(s)),s),n(this.lastMap,r(e(s)),s))}toStrings(){let n=[],a=null;for(;a=this.shift();){s(this.firstMap,r(t(a)),a),s(this.lastMap,r(e(a)),a);let o=a,u=null;do{let n=r(e(o)),a=!1;u=i(this.firstMap,n),u||(u=i(this.lastMap,n),a=!0),u&&(this.splice(this.indexOf(u),1),s(this.firstMap,r(t(u)),u),s(this.lastMap,r(e(u)),u),a&&(u.length>o.length&&([o,u]=[u,o]),u.reverse()),o=o.concat(u.slice(1)))}while(u);n.push(l(o))}return n}toRings(t){let e=this.toStrings(),r=[],n=null;for(;n=e.shift();)a(n)&&(o(n)!==t&&n.reverse(),r.push(n));return r}}}})()},6076:t=>{t.exports=(()=>{"use strict";function t(t){return null!=t.match(/^(.+?)\[(.+?)\]>$/g)}function e(t){let e=/^(.+?)\[(.+?)\]>$/g.exec(t);return e?{evt:e[1]+">",exp:e[2]}:{evt:t}}return class{constructor(t){t&&(this.queryParent=!!t.queryParent,this.progressive=t.progressive,this.queryParent&&(this.parentMap=new WeakMap)),this.evtListeners={}}parse(t,e,r){r=r?r+".":"";let n=/<([^ >\/]+)(.*?)>/gm,s=null,i=[];for(;s=n.exec(t);){let a=s[1],o={$tag:a},l=r+a,u=s[2].trim(),h=!1;(u.endsWith("/")||a.startsWith("?")||a.startsWith("!"))&&(h=!0);let p=/([^ ]+?)="(.+?)"/g,d=/([^ ]+?)='(.+?)'/g,f=null,c=!1;for(;f=p.exec(u);)c=!0,o[f[1]]=f[2];if(!c)for(;f=d.exec(u);)c=!0,o[f[1]]=f[2];if(c||""===u||(o.text=u),this.progressive&&this.emit(`<${l}>`,o,e),!h){let e=new RegExp(`([^]+?)</${a}>`,"g");e.lastIndex=n.lastIndex;let r=e.exec(t);if(r&&r[1]){n.lastIndex=e.lastIndex;let t=this.parse(r[1],o,l);t.length>0?o.$innerNodes=t:o.$innerText=r[1]}}this.queryParent&&e&&this.parentMap.set(o,e),this.progressive&&this.emit(`</${l}>`,o,e),i.push(o)}return i}getParent(t){return this.queryParent?this.parentMap.get(t):null}#t(t,e){let r=this.evtListeners[t];r?r.push(e):this.evtListeners[t]=[e]}addListener(r,n){t(r)&&(r=e(r),n.condition=function(t){let e="return "+t.replace(/(\$.+?)(?=[=!.])/g,"node.$&")+";";return new Function("node",e)}(r.exp),r=r.evt),this.#t(r,n)}#e(t,e){let r=this.evtListeners[t],n=null;r&&(n=r.indexOf(e))>=0&&r.splice(n,1)}removeListener(r,n){t(r)&&(r=(r=e(r)).evt),this.#e(r,n)}emit(t,...e){let r=this.evtListeners[t];if(r)for(let t of r)t.condition?!0===t.condition.apply(null,e)&&t.apply(null,e):t.apply(null,e)}on(t,e){this.addListener(t,e)}off(t,e){this.removeListener(t,e)}}})()},90077:(t,e,r)=>{"use strict";r.d(e,{B9:()=>i,FK:()=>l,FV:()=>a,Qk:()=>o,VM:()=>h,tT:()=>f});var n=r(7728);function s(t){return(0,n.nF)(t,n._4)}function i(t){return t.length<3?0:Math.abs((0,n.cz)(t.map((function(e,r){var n=t[r+1]||t[0];return e[0]*n[1]-n[0]*e[1]}))))/2}function a(t,e){var r=e.width,n=e.height,s=e.left,i=e.top,a=o(t),l=a.minX,u=a.minY,h=a.maxX,p=a.maxY,d=r/(h-l),f=n/(p-u);return t.map((function(t){return[s+(t[0]-l)*d,i+(t[1]-u)*f]}))}function o(t){var e=t.map((function(t){return t[0]})),r=t.map((function(t){return t[1]}));return{minX:Math.min.apply(Math,e),minY:Math.min.apply(Math,r),maxX:Math.max.apply(Math,e),maxY:Math.max.apply(Math,r)}}function l(t,e,r){var i=t[0],a=t[1],l=o(e),f=l.minX,c=l.maxX,g=[[f,a],[c,a]],m=u(g[0],g[1]),y=d(e),b=[];if(y.forEach((function(e){var r,n=u(e[0],e[1]),i=e[0];r=n,m.every((function(t,e){return 0===s(t-r[e])}))?b.push({pos:t,line:e,type:"line"}):p(h(m,n),[g,e]).forEach((function(t){e.some((function(e){return n=t,!s((r=e)[0]-n[0])&&!s(r[1]-n[1]);var r,n}))?b.push({pos:t,line:e,type:"point"}):0!==s(i[1]-a)&&b.push({pos:t,line:e,type:"intersection"})}))})),!r&&(0,n.I6)(b,(function(t){return t[0]===i})))return!0;var v=0,x={};return b.forEach((function(t){var e=t.pos,r=t.type,s=t.line;if(!(e[0]>i))if("intersection"===r)++v;else{if("line"===r)return;if("point"===r){var o=(0,n.I6)(s,(function(t){return t[1]!==a})),l=x[e[0]],u=o[1]>a?1:-1;l?l!==u&&++v:x[e[0]]=u}}})),v%2==1}function u(t,e){var r=t[0],s=t[1],i=e[0]-r,a=e[1]-s;Math.abs(i)<n._4&&(i=0),Math.abs(a)<n._4&&(a=0);var o=0,l=0,u=0;return i?a?(l=1,u=-(o=-a/i)*r-s):(l=1,u=-s):a&&(o=-1,u=r),[o,l,u]}function h(t,e){var r=t[0],n=t[1],s=t[2],i=e[0],a=e[1],o=e[2],l=0===r&&0===i,u=0===n&&0===a,h=[];if(l&&u)return[];if(l){var p=-s/n;return p!==-o/a?[]:[[-1/0,p],[1/0,p]]}if(u){var d=-s/r;return d!==-o/i?[]:[[d,-1/0],[d,1/0]]}if(0===r)h=[[f=-(a*(c=-s/n)+o)/i,c]];else if(0===i)h=[[f=-(n*(c=-o/a)+s)/r,c]];else if(0===n)h=[[f=-s/r,c=-(i*f+o)/a]];else if(0===a)h=[[f=-o/i,c=-(r*f+s)/n]];else{var f,c;h=[[f=(n*o-a*s)/(a*r-n*i),c=-(r*f+s)/n]]}return h.map((function(t){return[t[0],t[1]]}))}function p(t,e){var r=e.map((function(t){return[0,1].map((function(e){return[Math.min(t[0][e],t[1][e]),Math.max(t[0][e],t[1][e])]}))})),n=[];if(2===t.length){var i=t[0],a=i[0],o=i[1];if(s(a-t[1][0])){if(!s(o-t[1][1])){var l=Math.max.apply(Math,r.map((function(t){return t[0][0]}))),u=Math.min.apply(Math,r.map((function(t){return t[0][1]})));if(s(l-u)>0)return[];n=[[l,o],[u,o]]}}else{var h=Math.max.apply(Math,r.map((function(t){return t[1][0]}))),p=Math.min.apply(Math,r.map((function(t){return t[1][1]})));if(s(h-p)>0)return[];n=[[a,h],[a,p]]}}return n.length||(n=t.filter((function(t){var e=t[0],n=t[1];return r.every((function(t){return 0<=s(e-t[0][0])&&0<=s(t[0][1]-e)&&0<=s(n-t[1][0])&&0<=s(t[1][1]-n)}))}))),n.map((function(t){return[s(t[0]),s(t[1])]}))}function d(t){return function(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;var n=Array(t),s=0;for(e=0;e<r;e++)for(var i=arguments[e],a=0,o=i.length;a<o;a++,s++)n[s]=i[a];return n}(t.slice(1),[t[0]]).map((function(e,r){return[t[r],e]}))}function f(t,e){var r=function(t,e){return function(t,e){var r=t.slice(),s=e.slice();-1===(0,n.rB)(r)&&r.reverse(),-1===(0,n.rB)(s)&&s.reverse();var i=d(r),a=d(s),o=i.map((function(t){return u(t[0],t[1])})),f=a.map((function(t){return u(t[0],t[1])})),c=[];o.forEach((function(t,e){var r=i[e],o=[];f.forEach((function(n,s){var i=p(h(t,n),[r,a[s]]);o.push.apply(o,i.map((function(t){return{index1:e,index2:s,pos:t,type:"intersection"}})))})),o.sort((function(t,e){return(0,n.l$)(r[0],t.pos)-(0,n.l$)(r[0],e.pos)})),c.push.apply(c,o),l(r[1],s)&&c.push({index1:e,index2:-1,pos:r[1],type:"inside"})})),a.forEach((function(t,e){if(l(t[1],r)){var s=!1,i=(0,n.SL)(c,(function(t){return t.index2===e?(s=!0,!1):!!s}));-1===i&&(s=!1,i=(0,n.SL)(c,(function(t){var r=t.index1,n=t.index2;return-1===r&&n+1===e?(s=!0,!1):!!s}))),-1===i?c.push({index1:-1,index2:e,pos:t[1],type:"inside"}):c.splice(i,0,{index1:-1,index2:e,pos:t[1],type:"inside"})}}));var g={};return c.filter((function(t){var e=t.pos,r=e[0]+"x"+e[1];return!g[r]&&(g[r]=!0,!0)}))}(t,e).map((function(t){return t.pos}))}(t,e);return i(r)}},29940:t=>{"use strict";t.exports=JSON.parse('{"building":{},"highway":{"whitelist":["services","rest_area","escape","elevator"]},"natural":{"blacklist":["coastline","cliff","ridge","arete","tree_row"]},"landuse":{},"waterway":{"whitelist":["riverbank","dock","boatyard","dam"]},"amenity":{},"leisure":{},"barrier":{"whitelist":["city_wall","ditch","hedge","retaining_wall","wall","spikes"]},"railway":{"whitelist":["station","turntable","roundhouse","platform"]},"area":{},"boundary":{},"man_made":{"blacklist":["cutline","embankment","pipeline"]},"power":{"whitelist":["plant","substation","generator","transformer"]},"place":{},"shop":{},"aeroway":{"blacklist":["taxiway"]},"tourism":{},"historic":{},"public_transport":{},"office":{},"building:part":{},"military":{},"ruins":{},"area:highway":{},"craft":{},"golf":{},"indoor":{}}')}}]);