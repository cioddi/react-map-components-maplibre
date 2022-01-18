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
import sample_geojson_2 from "../MlGeoJsonLayer/assets/sample_2.json";
import List from "@mui/material/List";
import MlGeoJsonLayer from "../MlGeoJsonLayer/MlGeoJsonLayer";
import Button from "@mui/material/Button";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationOffIcon from "@mui/icons-material/LocationOff";

const storyoptions = {
  title: "MapComponents/MlShareMapState",
  component: MlShareMapState,
  argTypes: {},
  decorators: mapContextDecorator,
};
export default storyoptions;

const Template = () => {
  const geoJsonArray = [sample_geojson_1, sample_geojson_2];
  const [watchState, setWatchState] = useState(true);
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

  return (
    <>
      <Button
        style={{ zIndex: "1000", position: "absolute" }}
        onClick={() => setWatchState(!watchState)}
      >
        {watchState ? <LocationOnIcon /> : <LocationOffIcon />}
      </Button>
      <MlShareMapState active={watchState} />
      {geoJsonArray.map((el, i) => (
        <MlGeoJsonLayer layerId={"GeoJson_" + i} type="line" geojson={el} key={"GeoJson_" + i} />
      ))}
      <Sidebar sx={{ wordBreak: "break-word" }}>
        <List dense key="layers">
          {mapState.layers?.map((el) => (
            <ListItem
              key={el.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="toggle visibility"
                  onClick={() => {
                    let currentVisibility = mapHook.map
                      ?.getLayer?.(el.id)
                      ?.getLayoutProperty("visibility");
                    mapHook.map
                      ?.getLayer?.(el.id)
                      ?.setLayoutProperty(
                        "visibility",
                        currentVisibility === "none" ? "visible" : "none"
                      );
                    mapHook.map._render();
                  }}
                >
                  {el.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              }
            >
              <ListItemText primary={el.id} secondary={""} />
            </ListItem>
          ))}
        </List>
      </Sidebar>
    </>
  );
};

export const ExampleConfig = Template.bind({});
ExampleConfig.parameters = {};
ExampleConfig.args = {};
