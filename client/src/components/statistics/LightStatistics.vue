<template>
  <div class="widget-four">
    <div class="widget-heading">
      <h5 class="">
        Light Statistics
        <button
          v-on:click="lightsAuto()"
          class="btn btn-primary mb-2 btn-sm"
          style="float:right; margin-left: 5px"
        >
          Auto
        </button>
        <button
          v-on:click="lightsOn()"
          v-if="status === false"
          class="btn btn-success mb-2 btn-sm"
          style="float:right; margin-left: 5px"
        >
          On
        </button>
        <button
          v-on:click="lightsOff()"
          v-if="status === true"
          class="btn btn-danger mb-2 btn-sm"
          style="float:right; margin-left: 5px"
        >
          Off
        </button>
      </h5>
    </div>
    <div class="widget-content">
      <div class="vistorsBrowser">
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>Automated:</h6>
              <p
                class="browser-count"
                v-if="automated === 'false'"
                style="color: #e7515a"
              >
                No
              </p>
              <p
                class="browser-count"
                v-if="automated === 'true'"
                style="color: #8dbf42"
              >
                Yes
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>Lights On/Off:</h6>
              <p class="browser-count" style="color: #8dbf42">
                {{ on_time }} / {{ off_time }}
              </p>
            </div>
          </div>
        </div>
        <br />
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>Lux:</h6>
              <p class="browser-count" style="color: #1b55e2">
                {{ illuminance }}
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>Full:</h6>
              <p class="browser-count" style="color: #1b55e2">
                {{ full_spectrum }}
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>IR:</h6>
              <p class="browser-count" style="color: #1b55e2">
                {{ ir_spectrum }}
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>Visible:</h6>
              <p class="browser-count" style="color: #1b55e2">
                {{ visible_spectrum }}
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>SVP:</h6>
              <p class="browser-count" style="color: #1b55e2">{{ svp }} kPa</p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>VPD:</h6>
              <p class="browser-count" style="color: #1b55e2">{{ vpd }} kPa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
  name: 'LightStatistics',
  data() {
    return {
      automated: '',
      status: '',
      on_time: 0,
      off_time: 0,
      svp: 0,
      vpd: 0,
      temp: 0,
      humidity: 0,
      illuminance: 0,
      full_spectrum: 0,
      ir_spectrum: 0,
      visible_spectrum: 0,
    };
  },
  methods: {
    lightsOn() {
      axios.get('http://hydrobuddy.local:3000/api/lights/on');
      axios
        .get('http://hydrobuddy.local:3000/api/settings/info')
        .then((response) => {
          this.automated = response.data[0].automate_lights;
        });
    },
    lightsOff() {
      axios.get('http://hydrobuddy.local:3000/api/lights/off');
      axios
        .get('http://hydrobuddy.local:3000/api/settings/info')
        .then((response) => {
          this.automated = response.data[0].automate_lights;
        });
    },
    lightsAuto() {
      axios.get('http://hydrobuddy.local:3000/api/lights/auto');
      axios
        .get('http://hydrobuddy.local:3000/api/settings/info')
        .then((response) => {
          this.automated = response.data[0].automate_lights;
        });
    },
    getLightsStage() {
      axios
        .get('http://hydrobuddy.local:3000/api/lights/info')
        .then((response) => {
          this.on_time = moment(response.data[0].lights_on, 'H').format(
            'h:mm A'
          );
          this.off_time = moment(response.data[0].lights_off, 'H').format(
            'h:mm A'
          );
        });
    },
    calculateSVP() {
      const temp = this.temp;
      const calculate =
        (610.78 * Math.pow(2.71828, (temp / (temp + 238.3)) * 17.2694)) / 1000;
      this.svp = calculate.toFixed(2);
    },
    calculateVPD() {
      const svp = this.svp;
      const humidity = this.humidity;
      const calculate = svp * (1 - humidity / 100);

      this.vpd = calculate.toFixed(2);
    },
    getAutoStatus() {
      axios
        .get('http://hydrobuddy.local:3000/api/settings/info')
        .then((response) => {
          this.automated = response.data[0].automate_lights;
        });
    },
    getStatus() {
      axios.get('http://hydrobuddy.local:3000/api/info').then((response) => {
        this.status = response.data.relays.lights;
      });
    },
  },
  created() {
    this.getAutoStatus();
    this.getLightsStage();
    this.getStatus();
    this.calculateSVP();
    this.calculateVPD();
    this.sockets.subscribe('lights.status', (data) => {
      this.status = data;
    });
    this.sockets.subscribe('room.temperature', (data) => {
      this.temp = data;
    });
    this.sockets.subscribe('room.humidity', (data) => {
      this.humidity = data;
    });
    this.sockets.subscribe('room.infrared_spectrum', (data) => {
      this.ir_spectrum = data;
    });
    this.sockets.subscribe('room.full_spectrum', (data) => {
      this.full_spectrum = data;
    });
    this.sockets.subscribe('room.visible_spectrum', (data) => {
      this.visible_spectrum = data;
    });
    this.sockets.subscribe('room.illuminance', (data) => {
      this.room.illuminance = data;
    });
  },
};
</script>

<style></style>
