import controlMixin from "./controlMixin";

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
          this.map.setPitch(45);
          this.map.setBearing(-17.6);
          break;
        case '3D':
          this.map.setPitch(0);
          this.map.setBearing(0);
          break;
        default:
          this.map.setPitch(45);
          this.map.setBearing(-17.6);
      }
      e.stopPropagation()
    }, false)
    return el;
  }
}

export default {
  name: "Custom3DControl",

  mixins: [controlMixin],

  created() {
    this.control = new Custom3DControl(this.$props);
    this.$_addControl();
  }
};
