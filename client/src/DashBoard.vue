<template>
  <div id="app">
    <span>State: {{ state }}</span>
    <br />
    <span>Stage: {{ stage }}</span>
    <br />
    <span>AC: {{ ac | boolean }}</span>
    <br />
    <span>Lights: {{ lights | boolean }}</span>
    <br />
    <span>Exhaust Fan: {{ exhaust_fan | boolean }}</span>
    <br />
    <span>System Pumps: {{ system_pumps | boolean }}</span>
    <br />
    <span>Fill Valve: {{ fill_valve | boolean }}</span>
    <br />
    <span>Drain Valve: {{ drain_valve | boolean }}</span>
    <br />
    <span>Drain Pump: {{ drain_pump | boolean }}</span>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'DashBoard',
  components: {},
  data() {
    return {
      state: '',
      stage: '',
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
    this.sockets.subscribe('system.stage', (data) => {
      this.stage = data;
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
