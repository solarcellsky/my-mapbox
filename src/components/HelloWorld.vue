<template>
  <MglMap
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :attributionControl="false"
    :center="coordinates[0]"
    :zoom="16"
    @load="mapLoaded"
  >
    <MglMarker :coordinates="coordinates[0]" color="#CC0000" />
    <MglGeolocateControl position="bottom-right" />
    <MglNavigationControl position="bottom-right" />
    <MglFullscreenControl position="bottom-right" />
    <MglCustom3DControl position="bottom-right" />
    <MglMapStyleControl position="bottom-right" />
    <MglScaleControl position="bottom-left" />

    <el-drawer
      :title="drawerTitle"
      :visible.sync="drawer"
      :append-to-body="false"
      :modal-append-to-body="false"
      direction="ltr"
      custom-class="echarts-drawer"
      @opened="drawerOpen"
      size="100%">
      <div class="drawer-content">
        <el-row :gutter="0">
          <el-col :span="12">
            <div class="echarts-box" id="my-echarts"></div>
          </el-col>
          <el-col :span="12">
            <div class="echarts-box" id="my-pie-echarts"></div>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <div class="echarts-box" id="my-line-echarts"></div>
          </el-col>
          <el-col :span="12">
            <div class="echarts-box" id="my-stack-echarts"></div>
          </el-col>
        </el-row>
        <model-gltf src="../assets/model/34M17/34M_17.gltf" backgroundColor="#0f0d2a"></model-gltf>
      </div>
    </el-drawer>
  </MglMap>
</template>

<script>
import Mapbox from "mapbox-gl";
import * as echarts from 'echarts';
// import * as THREE from 'three';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { 
  RulerControl,
  ZoomControl,
  InspectControl
} from 'mapbox-gl-controls';
import 'mapbox-gl-controls/lib/controls.css';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { ModelGltf } from 'vue-3d-model';
import { Threebox } from 'threebox-plugin';
import "mapbox-gl/dist/mapbox-gl.css";
import 'threebox-plugin/dist/threebox.css';

// const map3dstyle = require('./mapbox/map/map3dstyle.json');


import {
  MglMap,
  MglGeolocateControl,
  MglNavigationControl,
  MglScaleControl,
  MglFullscreenControl,
  MglCustom3DControl,
  MglMapStyleControl,
  MglMarker
} from "./mapbox";

const mapLanguage = new window.MapboxLanguage({ defaultLanguage: "zh-Hans" });

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
    ModelGltf
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
      mapStyle: "mapbox://styles/mapbox/dark-v10", // your map style
      drawerTitle: '物业管理区域列表',
      drawer: false,
      camera: null,
      scene: null,
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
                [108.551143,34.119356],
                [108.671306,34.134812],
                [108.589595,34.34654]
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
  methods: {
    async mapLoaded(obj) {
      // let self = this;
      window.$_map = obj.map;
      this.add3DBuildingLayer(window.$_map);

      let satelliteRaster = 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.webp?access_token=' + this.accessToken;
      
      window.$_map.addControl(mapLanguage);

      let Geocoder = new MapboxGeocoder({
        accessToken: this.accessToken,
        marker: {
          color: '#ff0011'
        },
        country: 'CN',
        language: 'zh-Hans',
        mapboxgl: this.mapbox
      });

      let Draw = new MapboxDraw();
      

      window.$_map.addControl(Geocoder, 'top-left');
      window.$_map.addControl(new RulerControl(), 'top-right');
      window.$_map.on('ruler.on', () => console.log('ruler: on'));
      window.$_map.on('ruler.off', () => console.log('ruler: off'));
      window.$_map.addControl(new ZoomControl(), 'top-right');
      window.$_map.addControl(new InspectControl(), 'top-right');
      window.$_map.addControl(Draw, 'top-right');

      this.addThreeDModel(obj.map, [{
        obj: './assets/models/radar/34M_17.glb',
        origin: [108.988133, 34.275893],
        type: 'gltf',
        scale: 333,
        tips: "雷达",
        units: 'meters',
        rotation: { x: 90, y: 0, z: 0 }
      },
      {
        obj: './assets/models/landmarks/eiffel.glb',
        origin: [108.984133, 34.275893],
        type: 'gltf',
        scale: 3000,
        tips: "Eiffel Tower",
        units: 'meters',
        rotation: { x: 90, y: 0, z: 0 }
      }]);

      this.addRasterTileLayer(window.$_map, satelliteRaster, 'satellite-raster', 'satellite-raster-layer');
      window.$_map.setLayoutProperty('satellite-raster-layer', 'visibility', 'none');
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
    },
    drawerOpen() {
      this.drawCharts('my-echarts', {
        title: {
            text: 'ECharts'
        },
        tooltip: {},
        xAxis: {
            data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks']
        },
        yAxis: {},
        series: [{
            name: 'sales',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
      });

      this.drawCharts('my-pie-echarts', {
          visualMap: {
              show: false,
              min: 80,
              max: 600,
              inRange: {
                  colorLightness: [0, 1]
              }
          },
          series : [
              {
                  name: '访问来源',
                  type: 'pie',
                  radius: '55%',
                  data:[
                      {value:235, name:'视频广告'},
                      {value:274, name:'联盟广告'},
                      {value:310, name:'邮件营销'},
                      {value:335, name:'直接访问'},
                      {value:400, name:'搜索引擎'}
                  ],
                  roseType: 'angle',
                  label: {
                      normal: {
                          textStyle: {
                              color: 'rgba(255, 255, 255, 0.3)'
                          }
                      }
                  },
                  labelLine: {
                      normal: {
                          lineStyle: {
                              color: 'rgba(255, 255, 255, 0.3)'
                          }
                      }
                  },
                  itemStyle: {
                      normal: {
                          color: '#c23531',
                          shadowBlur: 200,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
          ]
      });

      this.drawCharts('my-line-echarts', {
          title: {
              text: '折线图堆叠'
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
              type: 'value'
          },
          series: [
              {
                  name: '邮件营销',
                  type: 'line',
                  stack: '总量',
                  data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                  name: '联盟广告',
                  type: 'line',
                  stack: '总量',
                  data: [220, 182, 191, 234, 290, 330, 310]
              },
              {
                  name: '视频广告',
                  type: 'line',
                  stack: '总量',
                  data: [150, 232, 201, 154, 190, 330, 410]
              },
              {
                  name: '直接访问',
                  type: 'line',
                  stack: '总量',
                  data: [320, 332, 301, 334, 390, 330, 320]
              },
              {
                  name: '搜索引擎',
                  type: 'line',
                  stack: '总量',
                  data: [820, 932, 901, 934, 1290, 1330, 1320]
              }
          ]
      });

      this.drawCharts('my-stack-echarts', {
          color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
          title: {
              text: '渐变堆叠面积图'
          },
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  label: {
                      backgroundColor: '#6a7985'
                  }
              }
          },
          legend: {
              data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: [
              {
                  type: 'category',
                  boundaryGap: false,
                  data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
              }
          ],
          yAxis: [
              {
                  type: 'value'
              }
          ],
          series: [
              {
                  name: 'Line 1',
                  type: 'line',
                  stack: '总量',
                  smooth: true,
                  lineStyle: {
                      width: 0
                  },
                  showSymbol: false,
                  areaStyle: {
                      opacity: 0.8,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgba(128, 255, 165)'
                      }, {
                          offset: 1,
                          color: 'rgba(1, 191, 236)'
                      }])
                  },
                  emphasis: {
                      focus: 'series'
                  },
                  data: [140, 232, 101, 264, 90, 340, 250]
              },
              {
                  name: 'Line 2',
                  type: 'line',
                  stack: '总量',
                  smooth: true,
                  lineStyle: {
                      width: 0
                  },
                  showSymbol: false,
                  areaStyle: {
                      opacity: 0.8,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgba(0, 221, 255)'
                      }, {
                          offset: 1,
                          color: 'rgba(77, 119, 255)'
                      }])
                  },
                  emphasis: {
                      focus: 'series'
                  },
                  data: [120, 282, 111, 234, 220, 340, 310]
              },
              {
                  name: 'Line 3',
                  type: 'line',
                  stack: '总量',
                  smooth: true,
                  lineStyle: {
                      width: 0
                  },
                  showSymbol: false,
                  areaStyle: {
                      opacity: 0.8,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgba(55, 162, 255)'
                      }, {
                          offset: 1,
                          color: 'rgba(116, 21, 219)'
                      }])
                  },
                  emphasis: {
                      focus: 'series'
                  },
                  data: [320, 132, 201, 334, 190, 130, 220]
              },
              {
                  name: 'Line 4',
                  type: 'line',
                  stack: '总量',
                  smooth: true,
                  lineStyle: {
                      width: 0
                  },
                  showSymbol: false,
                  areaStyle: {
                      opacity: 0.8,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgba(255, 0, 135)'
                      }, {
                          offset: 1,
                          color: 'rgba(135, 0, 157)'
                      }])
                  },
                  emphasis: {
                      focus: 'series'
                  },
                  data: [220, 402, 231, 134, 190, 230, 120]
              },
              {
                  name: 'Line 5',
                  type: 'line',
                  stack: '总量',
                  smooth: true,
                  lineStyle: {
                      width: 0
                  },
                  showSymbol: false,
                  label: {
                      show: true,
                      position: 'top'
                  },
                  areaStyle: {
                      opacity: 0.8,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgba(255, 191, 0)'
                      }, {
                          offset: 1,
                          color: 'rgba(224, 62, 76)'
                      }])
                  },
                  emphasis: {
                      focus: 'series'
                  },
                  data: [220, 302, 181, 234, 210, 290, 150]
              }
          ]
      })
    },
    drawCharts(container, options) {
      // initialize the echarts instance
      let myChart = echarts.init(document.getElementById(container), 'dark');
      // Draw the chart
      myChart.setOption(options);
    },
    addRasterTileLayer(map, url, sourceId, layerId) {
      map.addSource(sourceId, {
        type: "raster",
        tiles: [url],
        tileSize: 256
      });
      map.addLayer({
        id: layerId,
        type: "raster",
        source: sourceId
      });
    },
    add3DBuildingLayer(map) {
      let layers = map.getStyle().layers;

      let labelLayerId;
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      map.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#666",

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              10,
              0,
              15.05,
              ["get", "height"]
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              10,
              0,
              15.05,
              ["get", "min_height"]
            ],
            "fill-extrusion-opacity": 0.6
          }
        },
        labelLayerId
      );
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
.el-drawer.echarts-drawer {
  background: #0f0d2a !important;
  height: 100%;
  overflow: hidden;
}
.drawer-content {
  max-height: calc(100vh - 90px);
  overflow: auto;
}
</style>
