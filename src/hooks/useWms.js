import { useState, useEffect } from "react";
import WMSCapabilities from "wms-capabilities";

function useWms(props) {
  // Use a useRef hook to reference the layer object to be able to access it later inside useEffect hooks
  const [getFeatureInfoUrl, setGetFeatureInfoUrl] = useState(undefined);
  const [url, setUrl] = useState(props.url);
  const [wmsUrl, setWmsUrl] = useState("");
  const [capabilities, setCapabilities] = useState(undefined);
  const [error, setError] = useState(undefined);

  const clearState = () => {
    setGetFeatureInfoUrl(undefined);
    setCapabilities(undefined);
    //setLayers([]);
    setWmsUrl("");
  };

  useEffect(() => {
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
    let _urlParamsFromUrl = new URLSearchParams(_propsUrlParams?.[1]);

    let urlParamsObj = {
      ...Object.fromEntries(_urlParamsFromUrl),
      ...props.urlParameters,
    };
    // create URLSearchParams object to assemble the URL Parameters
    let urlParams = new URLSearchParams(urlParamsObj);

    let urlParamsStr =
      decodeURIComponent(urlParams.toString()) + "".replace(/%2F/g, "/").replace(/%3A/g, ":");

    fetch(_wmsUrl + "?" + urlParamsStr)
      .then((res) => {
        if (!res.ok) {
          throw Error(res.statusText + " (" + res.status + " - " + res.type + ")");
        } else {
          return res.text();
        }
      })
      .then((data) => {
        setCapabilities(new WMSCapabilities(data).toJSON());
      })
      .catch((error) => {
        //reset local state
        clearState();
        console.log(error);
        setError(error.message);
      });
  }, [url, props.urlParameters]);

  useEffect(() => {
    if (!capabilities?.Service) return;

    setWmsUrl(capabilities.Capability?.Request?.GetMap?.DCPType?.[0]?.HTTP?.Get?.OnlineResource);
    // set getFeatureInfo url
    setGetFeatureInfoUrl(
      capabilities.Capability?.Request?.GetFeatureInfo?.DCPType?.[0]?.HTTP?.Get?.OnlineResource
    );
  }, [capabilities]);

  return {
    capabilities,
    getFeatureInfoUrl,
    wmsUrl,
    error,
    setUrl,
  };
}

useWms.defaultProps = {
  url: "",
  urlParameters: {
    SERVICE: "WMS",
    VERSION: "1.3.0",
    REQUEST: "getCapabilities",
  },
};

export default useWms;
