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
    // el.textContent = '卫';
    el.innerHTML = '<img src="../../../../assets/satellite.svg" class="style-icon" />';
    el.addEventListener('click', (e) => {
      let _satellite = (e.target.src).includes('satellite');
      let _src = _satellite ? '../../../../assets/map.svg' : '../../../../assets/satellite.svg';
      e.target.src = _src;
      if (_satellite) {
        this.map.setLayoutProperty('satellite-raster-layer', 'visibility', 'visible');
      } else {
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
