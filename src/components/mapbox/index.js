import GlMap from "./map/GlMap";

import NavigationControl from "./UI/controls/NavigationControl";
import GeolocateControl from "./UI/controls/GeolocateControl";
import FullscreenControl from "./UI/controls/FullscreenControl";
import AttributionControl from "./UI/controls/AttributionControl";
import ScaleControl from "./UI/controls/ScaleControl";
import Custom3DControl from "./UI/controls/Custom3DControl";
import MapStyleControl from "./UI/controls/MapStyleControl";

import Marker from "./UI/Marker";
import Popup from "./UI/Popup";

import GeojsonLayer from "./layer/GeojsonLayer";
import ImageLayer from "./layer/ImageLayer";
import CanvasLayer from "./layer/CanvasLayer";
import VideoLayer from "./layer/VideoLayer";
import VectorLayer from "./layer/VectorLayer";
import RasterLayer from "./layer/RasterLayer";

import withEventsMixin from "./lib/withEvents";
import withSelfEventsMixin from "./UI/withSelfEvents";
import controlMixin from "./UI/controls/controlMixin";
import layerMixin from "./layer/layerMixin";

export const withEvents = withEventsMixin;
export const withSelfEvents = withSelfEventsMixin;
export const asControl = controlMixin;
export const asLayer = layerMixin;

export const $helpers = {
  withEvents: withEventsMixin,
  withSelfEvents: withSelfEventsMixin,
  asControl: controlMixin,
  asLayer: layerMixin
};

export const MglMap = GlMap;

export const MglNavigationControl = NavigationControl;
export const MglGeolocateControl = GeolocateControl;
export const MglFullscreenControl = FullscreenControl;
export const MglAttributionControl = AttributionControl;
export const MglScaleControl = ScaleControl;
export const MglCustom3DControl = Custom3DControl;
export const MglMapStyleControl = MapStyleControl;

export const MglGeojsonLayer = GeojsonLayer;
export const MglImageLayer = ImageLayer;
export const MglCanvasLayer = CanvasLayer;
export const MglVideoLayer = VideoLayer;
export const MglVectorLayer = VectorLayer;
export const MglRasterLayer = RasterLayer;

export const MglMarker = Marker;
export const MglPopup = Popup;
