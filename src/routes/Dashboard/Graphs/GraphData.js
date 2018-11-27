import { Toast } from "../../../utils";
import $ from "jquery";

const stubData = [
  {
    process: "Gnome-terminal",
    start: 1525537363,
    end: 1525537365
  },
  {
    process: "Main.py",
    start: 1525537360,
    end: 1525537369
  },
  {
    process: "jetbrains-clion",
    start: 1525547569,
    end: 1525547571
  },
  {
    idle: true,
    start: 1525347569,
    end: 1525347571
  }
];

function getDate(d) {
  return `${d.getFullYear()}-${("00" + (d.getMonth() + 1)).slice(-2)}-${(
    "00" + d.getDate()
  ).slice(-2)}`;
}

function getTime(d) {
  return `${("00" + d.getHours()).slice(-2)}:${("00" + d.getMinutes()).slice(
    -2
  )}:${("00" + d.getSeconds()).slice(-2)}`;
}

function makeHeatmapData(data) {
  let global = [];
  data.forEach(e => {
    const date = new Date(e.start);
    const dateStr = getDate(date);
    const timeStr = getTime(date);

    let item = global.find(e => e.date === dateStr);
    if (!item) {
      item = {
        date: dateStr,
        total: 0,
        details: []
      };
      global.push(item);
    }
    item.details.push({
      name: e.afk ? "Idle" : e.process,
      date: `${dateStr} ${timeStr}`,
      value: Math.abs((e.end - e.start) / 1000)
    });
    item.total += Math.abs((e.end - e.start) / 1000);
  });
  return global;
}

function makeTotalData(data) {
  let total = [];
  data.forEach(e => {
    if (!e.afk) {
      let item = total.find(
        i => i.process === (!e.process ? "Idle" : e.process)
      );
      if (!item) {
        item = {
          process: !e.process ? "Idle" : e.process,
          length: 0
        };
        total.push(item);
      }
      item.length += Math.abs((e.end - e.start) / 1000);
    }
  });
  return total;
}

function makeActivitySummary(data) {
  let sum = [
    {
      name: "Activity",
      value: 0,
      percent: 0
    },
    {
      name: "Idle",
      value: 0,
      percent: 0
    }
  ];

  let total = 0;

  data.forEach(e => {
    sum[e.afk ? 1 : 0].value += Math.abs((e.end - e.start) / 1000);
    total += Math.abs((e.end - e.start) / 1000);
  });

  sum.forEach(e => {
    e.percent = Math.round((e.value / total) * 100);
  });
  return sum;
}

const processor = {
  total: makeTotalData,
  heatmap: makeHeatmapData,
  summary: makeActivitySummary
};

export default class graphData {
  static data = null;

  // Fecthes() then converts to type
  static get(type, options, reload) {
    return new Promise((resolve, reject) => {
      console.log(options);
      if (!this.data || reload) {
        console.log($.param(options));
        fetch("http://backend.thefocuscompany.me:8080/window", {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: $.param(options)
        })
          .then(data => data.json())
          .then(data => {
            console.log(data);
            if (!data) {
              data = [];
            }
            data = data.map(d => {
              d.start = new Date(d.start);
              d.end = new Date(d.end);
              return d;
            });
            this.data = data;
            if (processor[type]) {
              return resolve(processor[type](data));
            } else {
              return reject("Unknown data type");
            }
          })
          .catch(err => {
            Toast.warn(`Could not fetch data for ${type}, using stub`);
            if (processor[type]) {
              return resolve(processor[type](stubData));
            } else {
              return reject("Unknown data type");
            }
          });
      } else {
        if (processor[type]) {
          return resolve(processor[type](this.data));
        } else {
          return reject("Unknown data type");
        }
      }
    });
  }
}
