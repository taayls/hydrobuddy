<template>
  <div class="widget-four">
    <div class="widget-heading">
      <h5 class="">
        Current Nutrient Settings
        <a href="/" style="color:#1b55e2"
          ><font-awesome-icon pull="right" :icon="['fas', 'cogs']"
        /></a>
      </h5>
    </div>
    <div class="widget-content">
      <div class="vistorsBrowser">
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>Stage:</h6>
              <p
                v-if="stage === 'seedling'"
                class="browser-count"
                style="color: #8dbf42"
              >
                Seedling
              </p>
              <p
                v-if="stage === 'vegetative_early'"
                class="browser-count"
                style="color: #8dbf42"
              >
                Vegetative (Early)
              </p>
              <p
                v-if="stage === 'vegetative_late'"
                class="browser-count"
                style="color: #8dbf42"
              >
                Vegetative (Late)
              </p>
              <p
                v-if="stage === 'flowering_early'"
                class="browser-count"
                style="color: #8dbf42"
              >
                Flowering (Early)
              </p>
              <p
                v-if="stage === 'flowering_late'"
                class="browser-count"
                style="color: #8dbf42"
              >
                Flowering (Late)
              </p>
              <p
                v-if="stage === 'flush'"
                class="browser-count"
                style="color: #8dbf42"
              >
                Flushing
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>{{ ph_up.name }}:</h6>
              <p
                class="browser-count"
                v-if="ph_up.amount > 0"
                style="color: #bae7ff"
              >
                {{ ph_up.amount }} ml/L
              </p>
              <p
                class="browser-count"
                v-if="ph_up.amount === 0"
                style="color: #e2a03f"
              >
                None
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>{{ ph_down.name }}:</h6>
              <p
                class="browser-count"
                v-if="ph_down.amount > 0"
                style="color: #bae7ff"
              >
                {{ ph_down.amount }} ml/L
              </p>
              <p
                class="browser-count"
                v-if="ph_down.amount === 0"
                style="color: #e2a03f"
              >
                None
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>{{ nutrient_a.name }}:</h6>
              <p
                class="browser-count"
                v-if="nutrient_a.amount > 0"
                style="color: #bae7ff"
              >
                {{ nutrient_a.amount }} ml/L
              </p>
              <p
                class="browser-count"
                v-if="nutrient_a.amount === 0"
                style="color: #e2a03f"
              >
                None
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>{{ nutrient_b.name }}:</h6>
              <p
                class="browser-count"
                v-if="nutrient_b.amount > 0"
                style="color: #bae7ff"
              >
                {{ nutrient_b.amount }} ml/L
              </p>
              <p
                class="browser-count"
                v-if="nutrient_b.amount === 0"
                style="color: #e2a03f"
              >
                None
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>{{ nutrient_c.name }}:</h6>
              <p
                class="browser-count"
                v-if="nutrient_c.amount > 0"
                style="color: #bae7ff"
              >
                {{ nutrient_c.amount }} ml/L
              </p>
              <p
                class="browser-count"
                v-if="nutrient_c.amount === 0"
                style="color: #e2a03f"
              >
                None
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>{{ nutrient_d.name }}:</h6>
              <p
                class="browser-count"
                v-if="nutrient_d.amount > 0"
                style="color: #bae7ff"
              >
                {{ nutrient_d.amount }} ml/L
              </p>
              <p
                class="browser-count"
                v-if="nutrient_d.amount === 0"
                style="color: #e2a03f"
              >
                None
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>{{ nutrient_e.name }}:</h6>
              <p
                class="browser-count"
                v-if="nutrient_e.amount > 0"
                style="color: #bae7ff"
              >
                {{ nutrient_e.amount }} ml/L
              </p>
              <p
                class="browser-count"
                v-if="nutrient_e.amount === 0"
                style="color: #e2a03f"
              >
                None
              </p>
            </div>
          </div>
        </div>
        <div class="browser-list">
          <div class="w-browser-details">
            <div class="w-browser-info">
              <h6>{{ nutrient_f.name }}:</h6>
              <p
                class="browser-count"
                v-if="nutrient_f.amount > 0"
                style="color: #bae7ff"
              >
                {{ nutrient_f.amount }} ml/L
              </p>
              <p
                class="browser-count"
                v-if="nutrient_f.amount === 0"
                style="color: #e2a03f"
              >
                None
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
  name: 'StageStatistics',
  data() {
    return {
      stage: '',
      ph_up: {
        name: '',
        amount: 0,
      },
      ph_down: {
        name: '',
        amount: 0,
      },
      nutrient_a: {
        name: '',
        amount: 0,
      },
      nutrient_b: {
        name: '',
        amount: 0,
      },
      nutrient_c: {
        name: '',
        amount: 0,
      },
      nutrient_d: {
        name: '',
        amount: 0,
      },
      nutrient_e: {
        name: '',
        amount: 0,
      },
      nutrient_f: {
        name: '',
        amount: 0,
      },
    };
  },
  methods: {
    getStage() {
      axios.get('http://hydrobuddy.local:3000/api/info').then((response) => {
        this.stage = response.data.stage;
      });
    },
    getNutrients() {
      const id_array = [0, 1, 2, 3, 4, 5, 6, 7];

      id_array.forEach((id) => {
        axios
          .get('http://hydrobuddy.local:3000/api/nutrients/' + id)
          .then((response) => {
            const key = response.data[0].tag;
            const name = response.data[0].name;

            this[key].name = name;

            axios
              .get('http://hydrobuddy.local:3000/api/nutrients/info/' + key)
              .then((response) => {
                const amount = response.data[0][key];
                this[key].amount = amount;
              });
          });
      });
    },
  },
  mounted() {
    this.getStage();
    this.getNutrients();
  },
};
</script>

<style></style>
