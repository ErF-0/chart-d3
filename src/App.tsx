import { useState, useEffect } from "react";
import Chart from "./components/Chart";
import "./App.css";

// Define the structure of a single data point
export type DataPoint = [number, number | number[] | null];

// Define the structure of a chart object
export interface ChartData {
  title: string;
  data: DataPoint[];
}

function App() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setChartData(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Chart Dashboard</h1>
      {chartData.map((chart, index) => (
        <Chart key={index} title={chart.title} data={chart.data} />
      ))}
    </div>
  );
}

export default App;
