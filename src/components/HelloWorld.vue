<template>
  <MglMap
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :attributionControl="false"
    :center="coordinates[0]"
    :zoom="10"
  >
    <MglMarker :coordinates="coordinates[0]" color="#CC0000" />
    <MglGeolocateControl position="bottom-right" />
    <MglNavigationControl position="bottom-right" />
    <MglFullscreenControl position="bottom-right" />
    <MglCustom3DControl position="bottom-right" />
    <MglMapStyleControl position="bottom-right" />
    <MglScaleControl position="bottom-left" />

    <MglVideoLayer
      sourceId="myvideosource"
      :source="sources"
      layerId="myLayer"
      :layer="layer"
    />
    <MglGeojsonLayer 
      sourceId="mypolyource"
      :source="geoJsonSource"
      layerId="myPolyLayer"
      :layer="geoJsonLayer"
    />
    <MglGeojsonLayer 
      sourceId="myoutlineource"
      :source="geoJsonSource"
      layerId="myoutLineLayer"
      :layer="geoJsonOutlinelayer"
    />
  </MglMap>
</template>

<script>
import "mapbox-gl/dist/mapbox-gl.css";
import Mapbox from "mapbox-gl";
import {
  MglMap,
  MglGeolocateControl,
  MglNavigationControl,
  MglScaleControl,
  MglFullscreenControl,
  MglCustom3DControl,
  MglMapStyleControl,
  MglMarker,
  MglVideoLayer,
  MglGeojsonLayer
} from "./mapbox";

export default {
  name: "HelloWorld",
  components: {
    MglMap,
    MglGeolocateControl,
    MglNavigationControl,
    MglScaleControl,
    MglFullscreenControl,
    MglCustom3DControl,
    MglMapStyleControl,
    MglMarker,
    MglVideoLayer,
    MglGeojsonLayer
  },
  data() {
    return {
      accessToken: "pk.eyJ1Ijoic29sYXJjZWxsc2t5IiwiYSI6ImNrbmFmOXVjdjExZ3oycnRhY3ZqNWJqNHcifQ.INN_v0VVzC2KNQVL-nvMLg", // your access token. Needed if you using Mapbox maps
      // Mapbox v8 styles:
      // mapbox://styles/mapbox/streets-v11
      // mapbox://styles/mapbox/outdoors-v11
      // mapbox://styles/mapbox/dark-v10
      // mapbox://styles/mapbox/light-v10
      // mapbox://styles/mapbox/satellite-streets-v11
      // mapbox://styles/mapbox/traffic-day-v2
      // mapbox://styles/mapbox/traffic-night-v2
      mapStyle: "mapbox://styles/mapbox/light-v10", // your map style
      coordinates: [
        [108.986133,34.275893]
      ],
      layer: {
        id: 'video',
        type: 'raster',
        source: 'myvideosource'
      },
      sources: {
        type: 'video',
        urls: [
          '../assets/drone.mp4',
          '../assets/drone.webm'
        ],
        coordinates: [
          [108.858891,34.233124],
          [109.032138,34.233124],
          [109.032138,34.161876],
          [108.858891,34.161876]
        ]
      },
      geoJsonLayer: {
        id: 'maine',
        type: 'fill',
        source: 'mypolyource', // reference the data source
        layout: {},
        paint: {
          'fill-color': '#0080ff', // blue color fill
          'fill-opacity': 0.5
        }
      },
      geoJsonOutlinelayer: {
        id: 'outline',
        type: 'line',
        source: 'myoutlineource',
        layout: {},
        paint: {
          'line-color': '#0099FF',
          'line-width': 3
        }
      },
      geoJsonSource: {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [108.589595,34.34654],
                [108.551143,34.189356],
                [108.551143,34.119356],
                [108.671306,34.134812],
                [108.589595,34.34654],
              ],
            ],
          },
        }
      }
    }
  },

  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;
  },
};
</script>

<style>
.custom-control {
  pointer-events: auto;
}
.control_button {
  font-weight: 700;
}
</style>