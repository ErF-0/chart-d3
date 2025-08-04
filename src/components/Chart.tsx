import { useEffect, useRef } from "react";

//  D3 imports
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { line as d3Line } from "d3-shape";
import { axisBottom, axisLeft } from "d3-axis";
import { extent, min, max } from "d3-array";
//utils
import { formatTitle } from "../utils/formatter";
//types
import type { DataPoint } from "../App"; // Only import what is needed

interface ChartProps {
  title: string;
  data: DataPoint[];
}

const Chart = ({ title, data }: ChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // ... rest of the component code remains the same
    if (!data || data.length === 0) return;

    // Chart dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Remove any existing SVG content
    select(svgRef.current).selectAll("*").remove();

    // Create SVG container
    const svg = select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // --- Scales ---
    const x = scaleLinear()
      .domain(extent(data, (d) => d[0]) as [number, number])
      .range([0, width])
      .nice();

    const y = scaleLinear()
      .domain([
        min(data, (d) => {
          if (d[1] === null) return null;
          return Array.isArray(d[1]) ? min(d[1]) : d[1];
        }) as number,
        max(data, (d) => {
          if (d[1] === null) return null;
          return Array.isArray(d[1]) ? max(d[1]) : d[1];
        }) as number,
      ])
      .range([height, 0])
      .nice();

    // --- Axes ---
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(axisBottom(x));

    svg.append("g").call(axisLeft(y));

    // --- Chart Type Detection ---
    const isMultiSeries = Array.isArray(data.find((d) => d[1] !== null)?.[1]);

    if (isMultiSeries) {
      // --- Multi-Series Chart ---
      const colors = ["#00BFFF", "#32CD32", "#FF4500"];
      for (let i = 0; i < 3; i++) {
        const line = d3Line<DataPoint>()
          .x((d) => x(d[0]))
          .y((d) => {
            const value = (d[1] as number[] | null)?.[i];
            return value != null ? y(value) : y(0); // Fallback for missing data
          })
          .defined((d) => (d[1] as number[] | null)?.[i] != null);

        svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", colors[i])
          .attr("stroke-width", 1.5)
          .attr("d", line);
      }
    } else {
      // --- Single-Series Chart ---
      const line = d3Line<DataPoint>()
        .x((d) => x(d[0]))
        .y((d) => y(d[1] as number))
        .defined((d) => d[1] !== null);

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#1E90FF")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    }
  }, [data, title]);

  return (
    <div className="chart-container">
      <h3>{formatTitle(title)}</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Chart;
