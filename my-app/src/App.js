import logo from './logo.svg';
import './App.css';
import React from 'react';

import Chart from "react-google-charts";

import 'bootstrap/dist/css/bootstrap.min.css';

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

const selectStyle = {
  width: 130
};

const floatLeftStyle = {
  float: "left"
}

const logoStyle = {
  "padding-left": 20
}

const namePadding = {
  "padding-right": 20
}

class HydroponicsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      hourDifference: 24,
      sensorId: 1
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSensor = this.handleChangeSensor.bind(this);
  }

  componentDidMount() {
    fetch("https://oylpp760bf.execute-api.us-east-2.amazonaws.com/prod/473hydrodata")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items,
            hourDifference: 24
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

  handleChange(event){
    if(event.target.value == "day"){
      this.setState({hourDifference: 24});
    }else if(event.target.value == "hour"){
      this.setState({hourDifference: 2});
    }else if(event.target.value == "week"){
      this.setState({hourDifference: 168});
    }
  };

  handleChangeSensor(event){
      this.setState({sensorId: event.target.value});
  };

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
        if(items[i].id == this.state.sensorId){
          //console.log(items[i].RequestTime);
          //time.setTime(Date.parse(items[i].RequestTime));
          var time = new Date();
          time.setTime(Date.parse(items[i].RequestTime));

          var now = new Date();
          var hoursDif = Math.abs(now - time) / 36e5;
          if(hoursDif < this.state.hourDifference){
            id_items_ph.push([time, items[i].pH]);
            id_items_tds.push([time, items[i].TDS]);
            id_items_waterTemp.push([time, items[i]["Water Temp"]]);
            id_items_airTemp.push([time, items[i]["Air Temp"]]);
            id_items_humidity.push([time, items[i].Humidity]);

            sorted_objects.push([time, items[i]]);
          }
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
      id_items_tds.unshift(['time', 'EC']);
      id_items_waterTemp.unshift(['time', 'Water Temp']);
      id_items_airTemp.unshift(['time', 'Air Temp']);
      id_items_humidity.unshift(['time', 'Humidity']);

      var newest_item = sorted_objects[sorted_objects.length - 1];

      return (
        <div>
        <div>

          <div class="container py-3">
          <div class="row row-cols-1 row-cols-md-3 mb-3 text-center">
            <div class="col">
              <div class="card mb-4 rounded-3 shadow-sm">
                <div class="card-header py-3">
                  <h4 class="my-0 fw-normal">Current Values</h4>
                </div>
                <div class="card-body">
                <table className="center table">
                <thead>
                <tr>
                  <th>pH</th>
                  <th>Electrical Conductivity</th>
                  <th>Water Temp</th>
                  <th>Air Temp</th>
                  <th>Humidity</th>
                </tr>
                </thead>
                <tbody>
                {newest_item &&
                <tr>

                    <td>{newest_item[1]["pH"].toFixed(2)}</td>
                    <td>{newest_item[1]["TDS"].toFixed(2)}</td>
                    <td>{newest_item[1]["Water Temp"].toFixed(2)}</td>
                    <td>{newest_item[1]["Air Temp"].toFixed(2)}</td>
                    <td>{newest_item[1]["Humidity"].toFixed(2)}</td>
                </tr>
                }
                </tbody>
                </table>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card mb-4 rounded-3 shadow-sm">
                <div class="card-header py-3">
                  <h4 class="my-0 fw-normal">Time Range</h4>
                </div>
                <div class="card-body">
                  <select class="form-select center" style={selectStyle} name="timeRange" id="timeRange" value={this.state.selected} onChange={this.handleChange}>
                    <option value="hour">hour</option>
                    <option value="day">day</option>
                    <option value="week">week</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card mb-4 rounded-3 shadow-sm">
                <div class="card-header py-3">
                  <h4 class="my-0 fw-normal">Sensor Module ID</h4>
                </div>
                  <div class="card-body">
                  <select class="form-select center"  style={selectStyle} name="ids" id="ids" value={this.state.sensorId} onChange={this.handleChangeSensor}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          </div>
          </div>

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
                  series:{
                    0: {color: '#e2431e'}
                  },
                  title: 'pH',
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
                  series:{
                    0: {color: '#e7711b'}
                  },
                  title: 'Electrical Conductivity',
                  hAxis: {
                    title: 'Time',
                  },
                  vAxis: {
                    title: 'EC',
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
                  series:{
                    0: {color: '#f1ca3a'}
                  },
                  title: 'Water Temperature',
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
                  series:{
                    0: {color: '#6f9654'}
                  },
                  title: 'Air Temperature',
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
                  series:{
                    0: {color: '#1c91c0'}
                  },
                  title: 'Humidity',
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

          <h3>All Values</h3>

          <div class="container py-3">
          <table className="center table">
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
        </div>
      );
    }
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div class="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
          <a href="/" class="d-flex align-items-center text-dark text-decoration-none">
            <img src="hydroIgrow.png" alt="logo" style={logoStyle} width="200"/>
          </a>

          <nav class="d-inline-flex mt-2 mt-md-0 ms-md-auto">
            <span class="fs-4" style={namePadding}>EECS 473 Team 16: Hydroponics</span>
          </nav>
        </div>
      </header>
      <p>For EECS 473. Created by Peter Hammel, Cole Hudson, Tanvi Jivtode, Ashvin Kumar, Brian Oo, and XiaoXue Zhong</p>
      <HydroponicsTable/>
    </div>
  );
}

export default App;
