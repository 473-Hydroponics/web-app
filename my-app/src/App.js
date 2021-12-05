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
        <table>
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
              {item.pH}
            </td>
            <td key="tds">
              {item.TDS}
            </td>
            <td key="Water Temp">
              {item["Water Temp"]}
            </td>
            <td key="Air Temp">
              {item["Air Temp"]}
            </td>
            <td key="humidity">
              {item.Humidity}
            </td>
            </tr>
          ))}
        </tbody>
        </table>
      );
    }
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <HydroponicsTable/>
    </div>
  );
}

export default App;
