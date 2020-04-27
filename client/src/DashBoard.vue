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
    <br />
    <Temperature />
  </div>
</template>

<script>
import axios from 'axios';
import Temperature from './components/Temperature';
export default {
  name: 'DashBoard',
  components: { Temperature },
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
  filters: {
    boolean: function(value, trueText, falseText) {
      return value ? trueText || 'On' : falseText || 'Off';
    },
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
      this.$bvToast.toast(`System State has been updated to: ` + this.state, {
        title: 'System State',
        autoHideDelay: 5000,
        variant: 'primary',
        appendToast: true,
      });
    });
    this.sockets.subscribe('system.stage', (data) => {
      this.stage = data;
      this.$bvToast.toast(`Grow Stage has been updated to: ` + this.stage, {
        title: 'Grow Stage',
        autoHideDelay: 5000,
        variant: 'primary',
        appendToast: true,
      });
    });
    this.sockets.subscribe('ac.status', (data) => {
      this.ac = data;
      this.$bvToast.toast(
        `AC has been switched: ${this.$options.filters.boolean(this.ac)}`,
        {
          title: 'AC Status',
          autoHideDelay: 5000,
          variant: 'primary',
          appendToast: true,
        }
      );
    });
    this.sockets.subscribe('lights.status', (data) => {
      this.lights = data;
      this.$bvToast.toast(
        `Lights have been switched: ${this.$options.filters.boolean(
          this.lights
        )}`,
        {
          title: 'Lights Status',
          autoHideDelay: 5000,
          variant: 'primary',
          appendToast: true,
        }
      );
    });
    this.sockets.subscribe('exhaust_fan.status', (data) => {
      this.exhaust_fan = data;
      this.$bvToast.toast(
        `Exhaust Fan has been switched: ${this.$options.filters.boolean(
          this.exhaust_fan
        )}`,
        {
          title: 'Exhaust Fan Status',
          autoHideDelay: 5000,
          variant: 'primary',
          appendToast: true,
        }
      );
    });
    this.sockets.subscribe('system_pumps.status', (data) => {
      this.system_pumps = data;
      this.$bvToast.toast(
        `System Pumps have been switched: ${this.$options.filters.boolean(
          this.system_pumps
        )}`,
        {
          title: 'System Pump Status',
          autoHideDelay: 5000,
          variant: 'primary',
          appendToast: true,
        }
      );
    });
    this.sockets.subscribe('fill_valve.status', (data) => {
      this.fill_valve = data;
      this.$bvToast.toast(
        `Fill Valve has been switched: ${this.$options.filters.boolean(
          this.fill_valve
        )}`,
        {
          title: 'Fill Valve Status',
          autoHideDelay: 5000,
          variant: 'primary',
          appendToast: true,
        }
      );
    });
    this.sockets.subscribe('drain_valve.status', (data) => {
      this.drain_valve = data;
      this.$bvToast.toast(
        `Drain Valve has been switched: ${this.$options.filters.boolean(
          this.drain_valve
        )}`,
        {
          title: 'Drain Valve Status',
          autoHideDelay: 5000,
          variant: 'primary',
          appendToast: true,
        }
      );
    });
    this.sockets.subscribe('drain_pump.status', (data) => {
      this.drain_pump = data;
      this.$bvToast.toast(
        `Drain Pump has been switched: ${this.$options.filters.boolean(
          this.drain_pump
        )}`,
        {
          title: 'Drain Pump Status',
          autoHideDelay: 5000,
          variant: 'primary',
          appendToast: true,
        }
      );
    });
  },
};
</script>

<style></style>
