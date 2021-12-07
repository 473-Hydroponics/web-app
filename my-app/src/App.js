import logo from './logo.svg';
import './App.css';
import React from 'react';

import Chart from "react-google-charts";

//current values request
//https://oylpp760bf.execute-api.us-east-2.amazonaws.com/prod/hydro_curr_vals
function compare( a, b ) {
  if(a[0] < b[0]){
    return -1;
  }
  else if(a[0] > b[0]){
    return 1;
  }
  return 0;
}

class HydroponicsCurrentValuesTable extends React.Component {
  constructor(props) {
    super(props);

    //get props.id here to get the id of our sensor

    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://oylpp760bf.execute-api.us-east-2.amazonaws.com/prod/473hydrodata")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <b><label htmlFor="ids">Sensor module ID: </label></b>
          <select name="ids" id="ids">
            <option value="1">1</option>
            <option value="2">2</option>
          </select>

          <h3>Current Values</h3>

          <table className="center">
          <thead>
          <tr>
            <th>pH</th>
            <th>tds</th>
            <th>Water Temp</th>
            <th>Air Temp</th>
            <th>Humidity</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>5</td>
            <td>15</td>
            <td>123</td>
            <td>1512</td>
            <td>8</td>
          </tr>
          </tbody>
          </table>

          <h3>Graphs</h3>

          <label htmlFor="ids">Time Range: </label>
          <select name="timeRange" id="timeRange">
            <option value="hour">hour</option>
            <option value="day">day</option>
            <option value="week">week</option>
          </select>

          <h3>All Values</h3>
          <table className="center">
          <thead>
          <tr>
            <th>Time</th>
            <th>pH</th>
            <th>tds</th>
            <th>Water Temp</th>
            <th>Air Temp</th>
            <th>Humidity</th>
          </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr>
              <td key="time">
               {item.requestDateTime}
              </td>
              <td key="ph">
                {item.pH.toFixed(2)}
              </td>
              <td key="tds">
                {item.TDS.toFixed(2)}
              </td>
              <td key="Water Temp">
                {item["Water Temp"].toFixed(2)}
              </td>
              <td key="Air Temp">
                {item["Air Temp"].toFixed(2)}
              </td>
              <td key="humidity">
                {item.Humidity.toFixed(2)}
              </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      );
    }
  }
}


class HydroponicsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://oylpp760bf.execute-api.us-east-2.amazonaws.com/prod/473hydrodata")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {

      //calculate graphs
      var id = 1;
      var id_items_ph = [];
      var id_items_tds = [];
      var id_items_waterTemp = [];
      var id_items_airTemp = [];
      var id_items_humidity = [];
      console.log(items[0]);
      console.log(items.length);
      var sorted_objects = [];

      for(var i = 0; i < items.length; i++){
        if(items[i].id == id){
          //console.log(items[i].RequestTime);
          //time.setTime(Date.parse(items[i].RequestTime));
          var time = new Date();
          time.setTime(Date.parse(items[i].RequestTime));
          id_items_ph.push([time, items[i].pH]);
          id_items_tds.push([time, items[i].TDS]);
          id_items_waterTemp.push([time, items[i]["Water Temp"]]);
          id_items_airTemp.push([time, items[i]["Air Temp"]]);
          id_items_humidity.push([time, items[i].Humidity]);

          sorted_objects.push([time, items[i]]);
        }
      }
      //sort
      id_items_ph.sort(compare);
      id_items_tds.sort(compare);
      id_items_waterTemp.sort(compare);
      id_items_airTemp.sort(compare);
      id_items_humidity.sort(compare);


      sorted_objects.sort(compare);

      id_items_ph.unshift(['time', 'pH']);
      id_items_tds.unshift(['time', 'tds']);
      id_items_waterTemp.unshift(['time', 'Water Temp']);
      id_items_airTemp.unshift(['time', 'Air Temp']);
      id_items_humidity.unshift(['time', 'Humidity']);


      return (
        <div>
          <b><label htmlFor="ids">Sensor module ID: </label></b>
          <select name="ids" id="ids">
            <option value="1">1</option>
            <option value="2">2</option>
          </select>

          <h3>Current Values</h3>

          <table className="center">
          <thead>
          <tr>
            <th>pH</th>
            <th>tds</th>
            <th>Water Temp</th>
            <th>Air Temp</th>
            <th>Humidity</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>5</td>
            <td>15</td>
            <td>123</td>
            <td>1512</td>
            <td>8</td>
          </tr>
          </tbody>
          </table>

          <h3>Graphs</h3>

          <table className="center">
          <tbody>
            <tr>
              <td>
              <Chart
                width={'600px'}
                height={'400px'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={id_items_ph}
                options={{
                  hAxis: {
                    title: 'Time',
                  },
                  vAxis: {
                    title: 'pH',
                  },
                }}
                rootProps={{ 'data-testid': '1' }}
              />
              </td>

              <td>
              <Chart
                width={'600px'}
                height={'400px'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={id_items_tds}
                options={{
                  hAxis: {
                    title: 'Time',
                  },
                  vAxis: {
                    title: 'tds',
                  },
                }}
                rootProps={{ 'data-testid': '1' }}
              />
              </td>
            </tr>
            <tr>
              <td>
              <Chart
                width={'600px'}
                height={'400px'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={id_items_waterTemp}
                options={{
                  hAxis: {
                    title: 'Time',
                  },
                  vAxis: {
                    title: 'Water Temp',
                  },
                }}
                rootProps={{ 'data-testid': '1' }}
              />
              </td>

              <td>
              <Chart
                width={'600px'}
                height={'400px'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={id_items_airTemp}
                options={{
                  hAxis: {
                    title: 'Time',
                  },
                  vAxis: {
                    title: 'Air Temp',
                  },
                }}
                rootProps={{ 'data-testid': '1' }}
              />
              </td>
            </tr>
            <tr>
              <td>
              <Chart
                width={'600px'}
                height={'400px'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={id_items_humidity}
                options={{
                  hAxis: {
                    title: 'Time',
                  },
                  vAxis: {
                    title: 'Humidity',
                  },
                }}
                rootProps={{ 'data-testid': '1' }}
              />
              </td>
            </tr>
          </tbody>
          </table>


          <label htmlFor="ids">Time Range: </label>
          <select name="timeRange" id="timeRange">
            <option value="hour">hour</option>
            <option value="day">day</option>
            <option value="week">week</option>
          </select>

          <h3>All Values</h3>
          <table className="center">
          <thead>
          <tr>
            <th>Time</th>
            <th>pH</th>
            <th>tds</th>
            <th>Water Temp</th>
            <th>Air Temp</th>
            <th>Humidity</th>
          </tr>
          </thead>
          <tbody>
            {sorted_objects.map(item => (
              <tr>
              <td key="time">
               {item[1].requestDateTime}
              </td>
              <td key="ph">
                {item[1].pH.toFixed(2)}
              </td>
              <td key="tds">
                {item[1].TDS.toFixed(2)}
              </td>
              <td key="Water Temp">
                {item[1]["Water Temp"].toFixed(2)}
              </td>
              <td key="Air Temp">
                {item[1]["Air Temp"].toFixed(2)}
              </td>
              <td key="humidity">
                {item[1].Humidity.toFixed(2)}
              </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      );
    }
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <h1>Hydroponics</h1>
      <p>For EECS 473. Created by Peter Hammel, Cole Hudson, Tanvi Jivtode, Ashvin Kumar, Brian Oo, and XiaoXue Zhong</p>
      <HydroponicsTable/>
    </div>
  );
}

export default App;
