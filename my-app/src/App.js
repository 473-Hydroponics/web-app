import logo from './logo.svg';
import './App.css';
import React from 'react';

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
