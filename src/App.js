import "./App.css";
import ReactTooltip from "react-tooltip";
import React from "react";
import moment from "moment";
import changes from "./changes.json";

const { counts } = changes;
const DayNames = {
  1: "Mon",
  3: "Wed",
  5: "Fri",
};

const findMaxMin = (data) => {
  const arrayOfValues = [];
  let MAX, MIN;
  data.forEach((element) => {
    arrayOfValues.push(element.count);
  });
  MAX = Math.max(...arrayOfValues);
  MIN = Math.min(...arrayOfValues);
  return { MAX, MIN };
};

function Cell({ data, max_min }) {
  const { MAX, MIN } = max_min;
  const reqObj = data;
  return (
    <div
      data-tip={`${reqObj.count} changes on ${reqObj.date}`}
      className="timeline-cells-cell"
      style={{
        backgroundColor: `rgba(0, 128, 0, ${
          1 - (MAX - reqObj.count) / (MAX - MIN)
        })`,
      }}
      onClick={() => {
        if (document.getElementById("changes")) {
          document.body
            .getElementsByClassName("footer")[0]
            .removeChild(document.getElementById("changes"));
          document.body
            .getElementsByClassName("footer")[0]
            .removeChild(document.getElementById("changes2"));
        }
        var div = document.createElement("changes");
        var div1 = document.createElement("changes2");
        if (reqObj.changes.length > 0) {
          var ol = document.createElement("ol");
          for (var i = 0; i < reqObj.changes.length; i++) {
            var li = document.createElement("li");
            li.innerHTML = reqObj.changes[i].description;
            ol.appendChild(li);
          }
          div1.appendChild(ol);
        } else {
          var p = document.createElement("p");
          p.innerHTML = `${reqObj.count} changes `;
          div1.appendChild(p);
        }
        var h2 = document.createElement("h2");
        h2.innerHTML = `showing ${reqObj.count} changes occured on ${reqObj.date}`;
        div.appendChild(h2);
        div.id = "changes";
        div1.id = "changes2";
        document.body.getElementsByClassName("footer")[0].appendChild(div);
        document.body.getElementsByClassName("footer")[0].appendChild(div1);
      }}
    ></div>
  );
}

function Month({ startDate, index }) {
  let date = moment(startDate).add(index * 7, "day");
  let monthName = date.format("MMM");
  return (
    <div className={`timeline-months-month ${monthName}`}>{monthName}</div>
  );
}

function WeekDay({ index }) {
  return <div className="timeline-weekdays-weekday">{DayNames[index]}</div>;
}

function Timeline({ range, data }) {
  let days = Math.abs(range[0].diff(range[1], "days"));
  let cells = Array.from(new Array(days));
  let weekDays = Array.from(new Array(7));
  let months = Array.from(new Array(Math.floor(days / 7)));

  let startDate = range[0];
  const max_min = findMaxMin(data);

  return (
    <div className="timeline">
      <div className="timeline-months">
        {months.map((_, index) => (
          <Month key={index} index={index} startDate={startDate} />
        ))}
      </div>

      <div className="timeline-body">
        <div className="timeline-weekdays">
          {weekDays.map((_, index) => (
            <WeekDay key={index} index={index} startDate={startDate} />
          ))}
        </div>

        <div className="timeline-cells">
          {cells.map((_, index) => {
            let date = moment(startDate).add(index, "day");
            return (
              <Cell
                key={index}
                index={index}
                max_min={max_min}
                data={
                  data.filter(
                    (obj) => obj.date === moment(date).format("YYYY-MM-DD")
                  )[0]
                }
              />
            );
          })}
        </div>
      </div>
      <div className="footer">
        <h1>Select a box to view Changes for that date</h1>
      </div>
    </div>
  );
}

function App() {
  let startDate = moment().add(-365, "days");
  let dateRange = [startDate, moment()];

  let data = Array.from(new Array(365)).map((_, index) => {
    if (moment(startDate).add(index, "day").format("YYYY-MM-DD") in counts) {
      return {
        date: moment(startDate).add(index, "day").format("YYYY-MM-DD"),
        count:
          counts[moment(startDate).add(index, "day").format("YYYY-MM-DD")]
            .count,
        changes:
          counts[moment(startDate).add(index, "day").format("YYYY-MM-DD")]
            .changes,
      };
    } else {
      return {
        date: moment(startDate).add(index, "day").format("YYYY-MM-DD"),
        count: 0,
        changes: [],
      };
    }
  });

  return (
    <>
      <Timeline range={dateRange} data={data} />
      <ReactTooltip delayShow={100} />;
    </>
  );
}

export default App;
