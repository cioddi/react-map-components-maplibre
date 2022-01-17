import React, { useState } from "react";

import MlShareMapState from "./MlShareMapState";
import mapContextDecorator from "../../decorators/MapContextDecorator";
import useMapState from "../../hooks/useMapState";
import useMap from "../../hooks/useMap";
import Sidebar from "../../ui_components/Sidebar";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ListItemText from "@mui/material/ListItemText";
import sample_geojson_1 from "../MlGeoJsonLayer/assets/sample_1.json";
import List from "@mui/material/List";
import MlGeoJsonLayer from "../MlGeoJsonLayer/MlGeoJsonLayer";

const storyoptions = {
  title: "MapComponents/MlShareMapState",
  component: MlShareMapState,
  argTypes: {},
  decorators: mapContextDecorator,
};
export default storyoptions;

const Template = (props) => {
  const [watchState, setWatchState] = useState(true);
  const [sampleLayerVisibility, setSampleLayerVisibility] = useState(false);
  const mapHook = useMap({ mapId: "map_1" });
  const mapState = useMapState({
    mapId: "map_1",
    watch: {
      viewport: false,
      layers: true,
      sources: false,
    },
    filter: {
      includeBaseLayers: false,
    },
  });

  // TODO: sampleLayerVisibility an aktuelle layer visibility abhängig machen
  return (
    <>
      <button
        style={{ zIndex: "1000", position: "absolute" }}
        onClick={() => setWatchState(!watchState)}
      >
        watch map state {watchState ? 1 : 0}
      </button>
      <MlShareMapState active={watchState} />
      <Sidebar sx={{ wordBreak: "break-word" }}>
        <List dense key="layers">
          <ListItem
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="toggle visibility"
                onClick={() => {
                  console.log(
                    mapHook.map?.getLayer?.("sampleGeoJson")?.getLayoutProperty("visibility")
                  );
                  let currentVisibility = mapHook.map
                    ?.getLayer?.("sampleGeoJson")
                    ?.getLayoutProperty("visibility");
                  mapHook.map
                    ?.getLayer?.("sampleGeoJson")
                    ?.setLayoutProperty(
                      "visibility",
                      currentVisibility === "none" ? "visible" : "none"
                    );
                  mapHook.map._render();
                }}
              >
                {mapState.layers?.[0]?.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            }
          >
            <ListItemText primary={"SampleLayer 1"} secondary={""} />
            <MlGeoJsonLayer layerId={"sampleGeoJson"} type="line" geojson={sample_geojson_1} />
          </ListItem>
        </List>
      </Sidebar>
    </>
  );
};

export const ExampleConfig = Template.bind({});
ExampleConfig.parameters = {};
ExampleConfig.args = {};
