<template>
  <div id="app">
    <Header />
    <div class="main-container" id="container">
      <div class="overlay"></div>
      <NavBar />
      <div id="content" class="main-content">
        <div class="layout-px-spacing">
          <div class="page-header">
            <div class="page-title" style="width: 100%">
              <h3>
                Dashboard
                <button
                  v-if="this.status === 'STOPPED'"
                  class="btn btn-primary mb-2 btn-sm"
                  style="float:right; margin-left: 5px"
                >
                  Start
                </button>
                <button
                  v-if="this.status != 'STOPPED'"
                  class="btn btn-danger mb-2 btn-sm"
                  style="float:right; margin-left: 5px"
                >
                  Stop
                </button>
              </h3>
            </div>
          </div>
          <div class="row layout-top-spacing">
            <div
              class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 layout-spacing"
            >
              <SystemStatistics />
            </div>
            <div
              class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 layout-spacing"
            >
              <StageStatistics />
            </div>
            <div
              class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 layout-spacing"
            >
              <LightStatistics />
            </div>
            <div
              class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing"
            >
              <div class="row widget-statistic">
                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                  <WaterTemperature />
                </div>
                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                  <AirTemperature />
                </div>
                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                  <Humidity />
                </div>
              </div>
            </div>
            <div
              class="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing"
            >
              <div class="widget widget-chart-three">
                <PHLevels />
              </div>
            </div>
            <div
              class="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing"
            >
              <div class="widget widget-chart-three">
                <ECLevels />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import SystemStatistics from '@/components/statistics/SystemStatistics';
import StageStatistics from '@/components/statistics/StageStatistics';
import LightStatistics from '@/components/statistics/LightStatistics';
import WaterTemperature from '@/components/charts/simple/WaterTemperature';
import AirTemperature from '@/components/charts/simple/AirTemperature';
import Humidity from '@/components/charts/simple/Humidity';
import PHLevels from '@/components/charts/simple/PHLevels';
import ECLevels from '@/components/charts/simple/ECLevels';

export default {
  name: 'DashBoard',
  components: {
    LightStatistics,
    SystemStatistics,
    StageStatistics,
    WaterTemperature,
    AirTemperature,
    Humidity,
    PHLevels,
    ECLevels,
    Header,
    NavBar,
  },
  data() {
    return {
      status: '',
    };
  },
  methods: {},
  mounted() {
    axios.get('http://hydrobuddy.local:3000/api/info').then((response) => {
      this.status = response.data.state;
    });
  },
  created() {
    this.sockets.subscribe('system.state', (data) => {
      this.state = data;
    });
  },
};
</script>

<style></style>
