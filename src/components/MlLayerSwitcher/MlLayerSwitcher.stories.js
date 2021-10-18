import React from "react";
import TopToolbar from "../../ui_components/TopToolbar";
import MlWmsLayer from "../MlWmsLayer/MlWmsLayer";
import MlLayerSwitcher from "./MlLayerSwitcher";

import mapContextDecorator from "../../decorators/MapContextDecorator";

const storyoptions = {
  title: "MapComponents/MlLayerSwitcher",
  component: MlLayerSwitcher,
  argTypes: {
    url: {},
    layer: {},
  },
  decorators: mapContextDecorator,
};
export default storyoptions;
const layerId = "nw_uraufnahme_rw";
const Template = (args) => (
  <>
    <MlWmsLayer
      url={args.url}
      urlParameters={{layers:args.layer}}
      sourceOptions={args.sourceOptions}
      layerId="historic"
    />
     <MlWmsLayer
      url={args.url2}
      urlParameters={{layers:args.layer2}}
      sourceOptions={args.sourceOptions}
      layerId={args.layer2}
    />
    <MlLayerSwitcher
      style={{ zIndex: 101 }}
      baseSourceConfig={{
        active: args.baseSourcesActive,
        layers: args.layers,
      }}
    />
    ;
  </>
);

export const ExampleConfig = Template.bind({});
ExampleConfig.parameters = {};
ExampleConfig.args = {
  url: "https://www.wms.nrw.de/geobasis/wms_nw_uraufnahme",
  url2 : "https://www.wms.nrw.de/geobasis/wms_nw_dop",
  layer: "nw_uraufnahme_rw",
  layer2: "WMS_NW_DOP",
  sourceOptions: {
    minzoom: 13,
    maxzoom: 20,
    
  },
  baseSourcesActive: true,
  layers: [
    {
      label: "Historic",
      layerId: "historic",
      src: "/assets/historic.png",
      active: true,
    }, {
      label: "Straßenkarte",
      layerId: "styleBase",
      src: "",
      active: false,
    },
    {
      label: "DOP",
      layerId: "WMS_NW_DOP",
      src: "",
      active: false,
    }
  ]
};
