<template>
  <div id="app">
    <Header />
    <div class="main-container" id="container">
      <div class="overlay"></div>
      <NavBar />
      <div id="content" class="main-content">
        <div class="layout-px-spacing">
          <div class="page-header">
            <div class="page-title">
              <h3>Dashboard</h3>
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
              class="col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing"
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
import Header from './components/Header';
import NavBar from './components/NavBar';
import SystemStatistics from './components/statistics/SystemStatistics';
import StageStatistics from './components/statistics/StageStatistics';
import LightStatistics from './components/statistics/LightStatistics';
import WaterTemperature from './components/charts/WaterTemperature';
import AirTemperature from './components/charts/AirTemperature';
import Humidity from './components/charts/Humidity';
import PHLevels from './components/charts/PHLevels';
import ECLevels from './components/charts/ECLevels';

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
};
</script>

<style></style>
