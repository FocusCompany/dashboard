import $ from "jquery";
import { ellipsizeText, callRenewBACK } from "../../../utils";

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

function makeHeatmapData(data, process) {
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
    let name = "";
    if (!process) {
      name = e.afk ? "Idle" : e.process;
    } else if (process === e.process) {
      name = e.afk ? "Idle" : e.window;
    }
    name = ellipsizeText(name);
    if (name !== "") {
      item.details.push({
        name: name,
        date: `${dateStr} ${timeStr}`,
        value: Math.abs((e.end - e.start) / 1000)
      });
      item.total += Math.abs((e.end - e.start) / 1000);
    }
  });
  return global;
}

function makeTotalData(data, process) {
  let total = [];
  data.forEach(e => {
    if (!e.afk) {
      let name = "";
      if (!process) {
        name = !e.process ? "Idle" : e.process;
      } else if (process === e.process) {
        name = !e.process ? "Idle" : e.window;
      }
      name = ellipsizeText(name);
      if (name !== "") {
        let item = total.find(i => i.process === name);
        if (!item) {
          item = {
            process: name,
            length: 0
          };
          total.push(item);
        }
        item.length += Math.abs((e.end - e.start) / 1000);
      }
    }
  });
  return total;
}

function makeActivitySummary(data, process) {
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
    if (!process || process === e.process) {
      sum[e.afk ? 1 : 0].value += Math.abs((e.end - e.start) / 1000);
      total += Math.abs((e.end - e.start) / 1000);
    }
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
  static get(type, options, reload, process) {
    return new Promise((resolve, reject) => {
      console.log(options);
      if (!this.data || reload) {
        console.log($.param(options));
        let res = null;
        if (process) {
          res = callRenewBACK("/window", $.param(options), "POST", null, true);
        } else {
          res = callRenewBACK("/process", $.param(options), "POST", null, true);
        }
        res
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
              return resolve(processor[type](data, process));
            } else {
              return reject("Unknown data type");
            }
          })
          .catch(err => {
            if (processor[type]) {
              return resolve(processor[type](stubData));
            } else {
              return reject("Unknown data type");
            }
          });
      } else {
        if (processor[type]) {
          return resolve(processor[type](this.data, process));
        } else {
          return reject("Unknown data type");
        }
      }
    });
  }
}
