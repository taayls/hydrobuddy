<template>
  <div class="widget-four">
    <div class="widget-heading">
      <h5 class="">System Status</h5>
    </div>
    <div class="widget-content">
      <div class="vistorsBrowser">
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>Status:</h6>
              <p
                v-if="state === 'STOPPED'"
                class="browser-count"
                style="color: #e7515a"
              >
                {{ state }}
              </p>
              <p
                v-if="state === 'RUNNING'"
                class="browser-count"
                style="color: #8dbf42"
              >
                {{ state }}
              </p>
              <p
                v-if="state === 'FILLING'"
                class="browser-count"
                style="color: #1b55e2"
              >
                {{ state }}
              </p>
              <p
                v-if="state === 'DRAINING'"
                class="browser-count"
                style="color: #1b55e2"
              >
                {{ state }}
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>Water Level:</h6>
              <p class="browser-count">
                <strong style="color: #1b55e2">{{ water_level }} </strong> cm
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>Air Condtioning:</h6>
              <p
                v-if="ac === false"
                class="browser-count"
                style="color: #e7515a"
              >
                Off
              </p>
              <p
                v-if="ac === true"
                class="browser-count"
                style="color: #8dbf42"
              >
                On
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>Lights:</h6>
              <p
                v-if="lights === false"
                class="browser-count"
                style="color: #e7515a"
              >
                Off
              </p>
              <p
                v-if="lights === true"
                class="browser-count"
                style="color: #8dbf42"
              >
                On
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>Exhaust Fan:</h6>
              <p
                v-if="exhaust_fan === false"
                class="browser-count"
                style="color: #e7515a"
              >
                Off
              </p>
              <p
                v-if="exhaust_fan === true"
                class="browser-count"
                style="color: #8dbf42"
              >
                On
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>System Pumps:</h6>
              <p
                v-if="system_pumps === false"
                class="browser-count"
                style="color: #e7515a"
              >
                Off
              </p>
              <p
                v-if="system_pumps === true"
                class="browser-count"
                style="color: #8dbf42"
              >
                On
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>Drain Valve:</h6>
              <p
                v-if="drain_valve === false"
                class="browser-count"
                style="color: #e7515a"
              >
                Off
              </p>
              <p
                v-if="drain_valve === true"
                class="browser-count"
                style="color: #8dbf42"
              >
                On
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>Drain Pump:</h6>
              <p
                v-if="drain_pump === false"
                class="browser-count"
                style="color: #e7515a"
              >
                Off
              </p>
              <p
                v-if="drain_pump === true"
                class="browser-count"
                style="color: #8dbf42"
              >
                On
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'SystemStatistics',
  data() {
    return {
      state: '',
      water_level: 0,
      ac: '',
      lights: '',
      exhaust_fan: '',
      system_pumps: '',
      fill_valve: '',
      drain_valve: '',
      drain_pump: '',
    };
  },
  mounted() {
    axios.get('http://hydrobuddy.local:3000/api/info').then((response) => {
      (this.state = response.data.state),
        (this.stage = response.data.stage),
        (this.ac = response.data.relays.ac),
        (this.lights = response.data.relays.lights),
        (this.exhaust_fan = response.data.relays.exhaust_fan),
        (this.system_pumps = response.data.relays.system_pumps),
        (this.fill_valve = response.data.relays.fill_valve),
        (this.drain_valve = response.data.relays.drain_valve),
        (this.drain_pump = response.data.relays.drain_pump);
    });
  },
  created() {
    this.sockets.subscribe('system.state', (data) => {
      this.state = data;
    });
    this.sockets.subscribe('reservoir.water_level', (data) => {
      this.water_level = data;
    });
    this.sockets.subscribe('ac.status', (data) => {
      this.ac = data;
    });
    this.sockets.subscribe('lights.status', (data) => {
      this.lights = data;
    });
    this.sockets.subscribe('exhaust_fan.status', (data) => {
      this.exhaust_fan = data;
    });
    this.sockets.subscribe('system_pumps.status', (data) => {
      this.system_pumps = data;
    });
    this.sockets.subscribe('fill_valve.status', (data) => {
      this.fill_valve = data;
    });
    this.sockets.subscribe('drain_valve.status', (data) => {
      this.drain_valve = data;
    });
    this.sockets.subscribe('drain_pump.status', (data) => {
      this.drain_pump = data;
    });
  },
};
</script>

<style></style>
