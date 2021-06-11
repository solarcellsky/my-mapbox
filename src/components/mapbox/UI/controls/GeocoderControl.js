import controlMixin from "./controlMixin";
import withEvents from "../../lib/withEvents";
import withSelfEvents from "../withSelfEvents";


export default {
  name: "GeocoderControl",
  mixins: [withEvents, withSelfEvents, controlMixin],

  props: {
    accessToken: {
      type: String,
      default: ''
    },
    marker: {
      type: Object,
      default: () => ({ color: 'orange' })
    },
    mapboxgl: {
      type: Object,
      default: () => ({})
    }
  },

  created() {
    // console.log(this.mapboxgl)
    const GeocoderControl = window.MapboxGeocoder;
    this.control = new GeocoderControl(this.$props);
    this.$_addControl();
  },

  methods: {
    trigger() {
      if (this.control) {
        return this.control.trigger();
      }
    }
  }
};
