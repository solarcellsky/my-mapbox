<template>
  <div id="mapView"></div>
</template>

<script>
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { Threebox } from 'threebox-plugin';
import 'threebox-plugin/dist/threebox.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
// import { 
//   RulerControl,
//   ZoomControl,
//   InspectControl
// } from 'mapbox-gl-controls';
import 'mapbox-gl-controls/lib/controls.css';
// import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const naviControl = new mapboxgl.NavigationControl();
const mapLanguage = new window.MapboxLanguage({ defaultLanguage: "zh-Hans" });

class Custom3DControl {
  onAdd(map){
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group custom-control';
    const button = this.$_createButton('control_button')
    this.container.appendChild(button);
    return this.container;
  }
  onRemove(){
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
  $_createButton(className) {
    const el = window.document.createElement('button')
    el.className = className;
    el.textContent = '3D';
    el.addEventListener('click', (e) => {
      let _text = e.target.innerText == '2D' ? '3D' : '2D';
      el.textContent = _text;
      switch(_text) {
        case '2D':
          this.map.setPitch(60);
          this.map.setBearing(-17.6);
          break;
        case '3D':
          this.map.setPitch(0);
          this.map.setBearing(0);
          break;
        default:
          this.map.setPitch(60);
          this.map.setBearing(-17.6);
      }
      e.stopPropagation()
    }, false)
    return el;
  }
}

const custom3DControl = new Custom3DControl();

export default {
  name: "Maps",
  data() {
    return {
      accessToken: "pk.eyJ1Ijoic29sYXJjZWxsc2t5IiwiYSI6ImNrbmFmOXVjdjExZ3oycnRhY3ZqNWJqNHcifQ.INN_v0VVzC2KNQVL-nvMLg", // your access token. Needed if you using Mapbox 
      mapStyle: "mapbox://styles/mapbox/dark-v10", // your map style
      drawerTitle: '物业管理区域列表',
      drawer: false,
      coordinates: [
        [108.986133,34.275893]
      ],
    }
  },
  mounted() {
    this.initMap();
  },
  created() {
    // this.initMap();
  },
  methods: {
    initMap() {
      mapboxgl.accessToken = this.accessToken;
      // let self = this;
      let map = new mapboxgl.Map({
        container: "mapView",
        style: this.mapStyle,
        // 地图初始中心经纬度
        center: [108.986133,34.275893],
        // 地图初始缩放级别
        zoom: 16,
        minZoom: 0
      });

      // let Draw = new MapboxDraw();
      let Geocoder = new MapboxGeocoder({
        accessToken: this.accessToken,
        marker: {
          color: '#ff0011'
        },
        country: 'CN',
        language: 'zh-Hans',
        mapboxgl: mapboxgl
      });

      map.addControl(naviControl, "bottom-right");
      map.addControl(custom3DControl, "bottom-right");
      map.addControl(mapLanguage);
      map.addControl(Geocoder, 'top-left');
      // map.addControl(new RulerControl(), 'top-right');
      // map.addControl(new ZoomControl(), 'top-right');
      // map.addControl(new InspectControl(), 'top-right');
      // map.addControl(Draw, 'top-right');

      window.$map = map;

      map.on('style.load', () => {
        this.addThreeDModel(map, [{
          obj: './assets/models/radar/34M_17.glb',
          origin: [108.988133, 34.275893],
          type: 'gltf',
          scale: 666,
          tips: "雷达",
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        },
        {
          obj: './assets/models/landmarks/eiffel.glb',
          origin: [108.984133, 34.275893],
          type: 'gltf',
          scale: 6000,
          tips: "Eiffel Tower",
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        },
        {
          obj: './assets/models/gltf/Duck/glTF/Duck.gltf',
          origin: [108.981133, 34.275893],
          type: 'gltf',
          scale: 50,
          tips: "小黄鸭",
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        },
        {
          obj: './assets/models/plane/plane.glb',
          origin: [108.978133, 34.275893],
          type: 'gltf',
          scale: 30,
          tips: "Plane",
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        },
        {
          obj: './assets/models/Soldier.glb',
          origin: [108.975133, 34.275893],
          type: 'gltf',
          scale: 150,
          tips: "Soldier",
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        }]);
      })

    },
    addThreeDModel(map, options) {
      window.tb = new Threebox(
        map,
        map.getCanvas().getContext('webgl'),
        {
          realSunlight: true,
          sky: false,
          enableSelectingObjects: true, //change this to false to disable 3D objects selection
          enableTooltips: true, // change this to false to disable default tooltips on fill-extrusion and 3D models
        }
      );

      let tb = window.tb;
      let date = new Date();
      map.addLayer({
        id: 'threeD-mpdels',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function () {
          options.map(function(option) {
            tb.loadObj(option, function (model) {
              model.setCoords(option.origin);
              model.setRotation({ x: 0, y: 0, z: 45.7 });
              model.addTooltip(option.tips, true);
              model.castShadow = true;
              tb.add(model);
            })
          })
        },

        render: () => {
          tb.setSunlight(date, options.origin);
          tb.update();
        }
      })
    }
  }
};
</script>

<style>
#mapView {
  width: 100%;
  height: 100%;
}
.custom-control {
  pointer-events: auto;
}
.control_button {
  font-weight: 700;
  display: flex !important;
  align-items: center;
  justify-content: center;
}
.style-icon {
  width: 16px;
}
.mapboxgl-ctrl-geocoder--input:focus {
  outline: 0;
}
.echarts-box {
  min-height: 300px;
}
.echarts-drawer {
  background: #0f0d2a !important;
}
</style>
