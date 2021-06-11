import controlMixin from "./controlMixin";

class MapStyleControl {
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
    el.textContent = '卫';
    el.addEventListener('click', (e) => {
      let _text = e.target.innerText == '普' ? '卫' : '普';
      el.textContent = _text;
      // Mapbox v8 styles:
      // mapbox://styles/mapbox/streets-v11
      // mapbox://styles/mapbox/outdoors-v11
      // mapbox://styles/mapbox/dark-v10
      // mapbox://styles/mapbox/light-v10
      // mapbox://styles/mapbox/satellite-streets-v11
      // mapbox://styles/mapbox/traffic-day-v2
      // mapbox://styles/mapbox/traffic-night-v2
      switch(_text) {
        case '普':
          this.map.setLayoutProperty('satellite-raster-layer', 'visibility', 'visible');
          break;
        case '卫':
          this.map.setLayoutProperty('satellite-raster-layer', 'visibility', 'none');
          break;
        default:
          this.map.setLayoutProperty('satellite-raster-layer', 'visibility', 'none');
      }
      e.stopPropagation()
    }, false)
    return el;
  }
}

export default {
  name: "MapStyleControl",

  mixins: [controlMixin],

  created() {
    this.control = new MapStyleControl(this.$props);
    this.$_addControl();
  }
};
