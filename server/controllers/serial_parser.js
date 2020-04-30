const sensors = [
  {
    type: 'ph',
    re: /pH: ([\d.]+)/,
    format: function (re_result) {
      return {
        value: parseFloat(re_result[1]),
        key: 'reservoir.ph',
      };
    },
  },
  {
    type: 'ec',
    re: /EC: ([\d.]+)/,
    format: function (re_result) {
      return {
        value: parseFloat(re_result[1]),
        key: 'reservoir.ec',
      };
    },
  },
  {
    type: 'water_temperature',
    re: /Water Temparature: ([\d.]+)/,
    format: function (re_result) {
      return {
        key: 'reservoir.temperature',
        value: parseFloat(re_result[1]),
      };
    },
  },
  {
    type: 'humidity',
    re: /Humidity: ([\d.]+)/,
    format: function (re_result) {
      return {
        key: 'room.humidity',
        value: parseFloat(re_result[1]),
      };
    },
  },
  {
    type: 'air_temperature',
    re: /Temperature: ([\d.]+)/,
    format: function (re_result) {
      return {
        key: 'room.temperature',
        value: parseFloat(re_result[1]),
      };
    },
  },
  {
    type: 'water_level',
    re: /Distance: ([\d]+)/,
    format: function (re_result) {
      return {
        key: 'reservoir.water_level',
        value: parseInt(re_result[1], 10),
      };
    },
  },
  {
    type: 'ir',
    re: /IR: ([\d]+)/,
    format: function (re_result) {
      return {
        key: 'room.infrared_spectrum',
        value: parseInt(re_result[1], 10),
      };
    },
  },
  {
    type: 'full_spectrum',
    re: /Full: ([\d]+)/,
    format: function (re_result) {
      return {
        key: 'room.full_spectrum',
        value: parseInt(re_result[1], 10),
      };
    },
  },
  {
    type: 'visible_spectrum',
    re: /Visible: ([\d]+)/,
    format: function (re_result) {
      return {
        key: 'room.visible_spectrum',
        value: parseInt(re_result[1], 10),
      };
    },
  },
  {
    type: 'illuminance',
    re: /Lux: ([\d]+)/,
    format: function (re_result) {
      return {
        key: 'room.illuminance',
        value: parseInt(re_result[1], 10),
      };
    },
  },
];

const parser = function (message) {
  let item = {};

  for (let i = 0; i < sensors.length; i++) {
    const re_result = sensors[i].re.exec(message);

    if (re_result) {
      item.type = sensors[i].type;
      item.data = sensors[i].format(re_result);
      item.input = re_result.input;
      break;
    }
  }

  return item;
};

module.exports = parser;
