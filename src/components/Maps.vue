<template>
  <div id="mapView">
    <el-drawer
      :visible.sync="drawer"
      :append-to-body="false"
      :modal-append-to-body="false"
      direction="ltr"
      custom-class="echarts-drawer"
      size="50%">
      <div class="drawer-content">
        <model-gltf :src="object.obj" :backgroundAlpha="backgroundAlpha" :lights="lights"></model-gltf>
        <h3>详细信息</h3>
        <p>{{ object.tips }}</p>
        <p>{{ object.origin }}</p>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { Threebox } from 'threebox-plugin';
import SunCalc from 'suncalc';
import 'threebox-plugin/dist/threebox.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { ModelGltf } from 'vue-3d-model';
import Stats from 'three/examples/jsm/libs/stats.module.js';

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
    el.textContent = '2D';
    el.addEventListener('click', (e) => {
      let _text = e.target.innerText == '2D' ? '3D' : '2D';
      el.textContent = _text;
      switch(_text) {
        case '2D':
          this.map.setPitch(50);
          this.map.setBearing(-17.6);
          break;
        case '3D':
          this.map.setPitch(0);
          this.map.setBearing(0);
          break;
        default:
          this.map.setPitch(80);
          this.map.setBearing(-17.6);
      }
      e.stopPropagation()
    }, false)
    return el;
  }
}

const custom3DControl = new Custom3DControl();
const stats = new Stats();

export default {
  name: "Maps",
  components: {
    ModelGltf
  },
  data() {
    return {
      accessToken: "pk.eyJ1Ijoic29sYXJjZWxsc2t5IiwiYSI6ImNrbmFmOXVjdjExZ3oycnRhY3ZqNWJqNHcifQ.INN_v0VVzC2KNQVL-nvMLg", // your access token. Needed if you using Mapbox 
      mapStyle: "mapbox://styles/mapbox/dark-v10", // your map style
      drawer: false,
      coordinates: [
        [108.986133,34.275893]
      ],
      minZoom: 10,
      backgroundAlpha: 0,
      object: {},
      lights: [ 
         { 
           type: 'HemisphereLight', 
           position: { x: 0, y: 1, z: 0 }, 
           skyColor: 0xffffff, 
           groundColor: 0xeeeeee, 
           intensity: 0.2, 
         }, 
         { 
           type: 'DirectionalLight', 
           position: { x: 1, y: 1, z: 1 }, 
           color: 0xffffff, 
           intensity: 0.8, 
         }, 
       ]
    }
  },
  mounted() {
    this.initMap();
  },
  created() {
    // this.initMap();
  },
  methods: {
    animate() {
      requestAnimationFrame(this.animate);
      stats.update();
    },
    initMap() {
      let self = this;
      mapboxgl.accessToken = this.accessToken;
      // let self = this;
      let map = new mapboxgl.Map({
        container: "mapView",
        style: this.mapStyle,
        // 地图初始中心经纬度
        center: [108.981133, 34.275893],
        // 地图初始缩放级别
        zoom: 14.5,
        pitch: 80,
        bearing: -17.6,
        minZoom: 0
      });

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

      window.$map = map;

      map.on('load', () => {
        map.getContainer().appendChild(stats.dom);
        self.animate();
        map.addLayer({
          id: 'sky-layer',
          type: 'sky',
          paint: {
          'sky-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            0,
            5,
            0.3,
            8,
            1
          ],
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': self.getSunPosition(null, map),
          'sky-atmosphere-sun-intensity': 5
          }
        });

        // map.addSource('mapbox-dem', {
        //   type: 'raster-dem',
        //   url: 'mapbox://mapbox.terrain-rgb',
        //   tileSize: 512,
        //   maxzoom: 14
        // });
        // map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        // map.setFog({
        //   range: [-0.5, 2],
        //   color: 'white',
        //   'horizon-blend': 0.3
        // });
      })

      map.on('style.load', () => {
        this.addThreeDModel(map, [{
          id: '34M_17',
          geojson: '',
          extrusion: false,
          sourceId: '34M_17',
          obj: './assets/models/34M17/34M_17.gltf',
          origin: [108.988133, 34.275893],
          type: 'gltf',
          scale: 3.5,
          tips: "雷达",
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        },
        {
          id: 'eiffel',
          geojson: '',
          extrusion: false,
          sourceId: 'eiffel',
          obj: './assets/models/landmarks/eiffel.glb',
          origin: [108.984133, 34.275893],
          type: 'gltf',
          scale: 6000,
          tips: "Eiffel Tower",
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        },
        {
          id: 'Duck',
          geojson: '',
          extrusion: false,
          sourceId: 'Duck',
          obj: './assets/models/gltf/Duck/glTF/Duck.gltf',
          origin: [108.981133, 34.275893],
          type: 'gltf',
          scale: 50,
          tips: "小黄鸭",
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        },
        {
          id: 'plane',
          geojson: '',
          extrusion: false,
          sourceId: 'plane',
          obj: './assets/models/plane/plane.glb',
          origin: [108.984119, 34.270911],
          type: 'gltf',
          scale: 30,
          tips: "Plane",
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        },
        {
          id: 'Soldier',
          geojson: '',
          extrusion: false,
          sourceId: 'Soldier',
          obj: './assets/models/Soldier.glb',
          origin: [108.975133, 34.275893],
          type: 'gltf',
          scale: 150,
          tips: "Soldier",
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        },
        {
          id: 'libertystatue',
          geojson: './assets/geojson/statue-of-liberty.geojson',
          extrusion: false,
          sourceId: 'libertystatue',
          obj: './assets/models/landmarks/libertystatue.glb',
          origin: [108.985212, 34.266347, 0],
          type: 'gltf',
          scale: 666,
          tips: "Statue of Liberty",
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        },
        {
          id: 'elephant',
          geojson: '',
          extrusion: false,
          sourceId: 'elephant',
          obj: './assets/models/history/elephant.glb',
          origin: [108.980006, 34.268553],
          type: 'gltf',
          scale: 150,
          tips: "Elephant",
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        },
        {
          id: 'seraphine',
          geojson: '',
          extrusion: false,
          sourceId: 'seraphine',
          obj: './assets/models/seraphine/scene.gltf',
          origin: [108.981133, 34.266553],
          type: 'gltf',
          scale: 150,
          tips: "Seraphine",
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 }
        }]);
      })

    },
    getSunPosition(date, map) {
      let center = map.getCenter();
      let sunPos = SunCalc.getPosition(
        date || Date.now(),
        center.lat,
        center.lng
      );
      let sunAzimuth = 180 + (sunPos.azimuth * 180) / Math.PI;
      let sunAltitude = 90 - (sunPos.altitude * 180) / Math.PI;
      return [sunAzimuth, sunAltitude];
    },
    addThreeDModel(map, options) {
      let self = this;
      window.tb = new Threebox(
        map,
        map.getCanvas().getContext('webgl'),
        {
          realSunlight: true,
          sky: false,
          enableSelectingFeatures: true,
          enableSelectingObjects: true,
          enableDraggingObjects: true,
          enableRotatingObjects: true,
          enableTooltips: true, // change this to false to disable default tooltips on fill-extrusion and 3D models
        }
      );

      options.map(function(option) {
        if (option.extrusion) {
          self.createExtrusionLayer(map, option.geojson, option.sourceId + '-source', option.id + '-extrusion');
        }
      })

      let tb = window.tb;
      let date = new Date();
      map.addLayer({
        id: 'custom-3d-models',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function () {
          options.map(function(option) {
            tb.loadObj(option, function (model) {
              model.setCoords(option.origin);
              model.setRotation({ x: 0, y: 0, z: 80 });
              model.addTooltip(option.tips, true);
              model.castShadow = true;
              tb.add(model);
              if (model) {
                model.addEventListener('SelectedChange', self.onSelectedChange, false);
              }
            })
          })
        },

        render: () => {
          tb.setSunlight(date, options.origin);
          tb.update();
        }
      })
    },
    onSelectedChange(e) {
      // let selected = e.detail.selected;
      this.object = e.detail.userData;
      // window.$map.repaint = true;
      this.drawer = true;
      // this.$message.info("Press 'Shift' to drag or ress 'Alt' to rotate")
      window.tb.update();
    },
    createExtrusionLayer(map, geojson, sourceId, layerId) {
      map.addSource(sourceId, {
        // GeoJSON Data source used in vector tiles, documented at
        // https://gist.github.com/ryanbaumann/a7d970386ce59d11c16278b90dde094d
        type: "geojson",
        generateId: true, // This ensures that all features have unique IDs and allow selecting them
        data: geojson,
      });

      let layer = {
        'id': layerId,
        'source': sourceId,
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': this.minZoom,
        'paint': {
          'fill-extrusion-color':
            [
              'case',
              ['boolean', ['feature-state', 'select'], false],
              "lightgreen",
              ['boolean', ['feature-state', 'hover'], false],
              "lightblue",
              '#C7B299'
            ],
          // use an 'interpolate' expression to add a smooth transition effect to the
          // buildings as the user zooms in
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            this.minZoom,
            0,
            this.minZoom + 0.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            this.minZoom,
            0,
            this.minZoom + 0.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 1
        }
      };
      map.addLayer(layer);
    }
  }
};
</script>

<style>
::-webkit-scrollbar {
    height: 5px;
    width: 10px;
    border-radius: 10px;
}

::-webkit-scrollbar-button:vertical {
    display: none
}

::-webkit-scrollbar-corner:vertical {
    background-color: #0f0d2a;
    border-radius: 10px;
}

::-webkit-scrollbar-resizer:vertical {
    background-color: #ff6e00
}

::-webkit-scrollbar-thumb:vertical {
    background-color: #8e8e8e
}

::-webkit-scrollbar-thumb:vertical:hover {
    background-color: #0099ff
}

::-webkit-scrollbar-track-piece {
    background: #ccc
}

::-webkit-scrollbar-track:vertical {
    background-color: #000;
    border-radius: 10px;
}
#mapView {
  width: 100%;
  height: 100%;
}
canvas:focus-visible {
  outline: 0;
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
.el-drawer {
  text-align: left;
}
.el-drawer__header {
  color: #eeeeee !important;
}
.el-drawer.echarts-drawer {
  background: rgba(0, 0, 0, .6) !important;
  height: 100%;
  overflow: hidden;
}
.drawer-content {
  max-height: calc(100vh - 90px);
  padding: 0 20px;
  overflow: auto;
  color: #eeeeee;
}
</style>
