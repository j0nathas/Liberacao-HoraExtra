import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const data = [
    { month: "Jan", revenue: 42 },
    { month: "Fev", revenue: 58 },
    { month: "Mar", revenue: 51 },
    { month: "Abr", revenue: 67 },
    { month: "Mai", revenue: 74 },
    { month: "Jun", revenue: 63 },
];

const ACCENT = "#3b6e5e";
const TRACK = "#e7e2d8";

export default function D3BarChart() {
    const svgRef = useRef(null);
    const wrapRef = useRef(null);

    useEffect(() => {
        const width = wrapRef.current.clientWidth;
        const height = 300;
        const margin = { top: 10, right: 10, bottom: 24, left: 34 };

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        svg.attr("width", width).attr("height", height);

        // escalas
        const x = d3
            .scaleBand()
            .domain(data.map((d) => d.month))
            .range([margin.left, width - margin.right])
            .padding(0.35);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.revenue) * 1.1])
            .range([height - margin.bottom, margin.top]);

        // eixo X
        svg
            .append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSize(0))
            .call((g) => g.select(".domain").attr("stroke", TRACK))
            .selectAll("text")
            .attr("fill", "#6b6558")
            .attr("font-size", 11);

        // eixo Y
        svg
            .append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(4).tickSize(0))
            .call((g) => g.select(".domain").remove())
            .selectAll("text")
            .attr("fill", "#6b6558")
            .attr("font-size", 11);

        // barras
        svg
            .selectAll("rect.bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.month))
            .attr("y", (d) => y(d.revenue))
            .attr("width", x.bandwidth())
            .attr("height", (d) => height - margin.bottom - y(d.revenue))
            .attr("fill", ACCENT)
            .attr("rx", 3);

        // tooltip simples via title
        svg
            .selectAll("rect.bar")
            .append("title")
            .text((d) => `${d.month}: ${d.revenue}`);
    }, []);

    return (
        <div ref={wrapRef} style={{ width: "100%", maxWidth: 600 }}>
            <svg ref={svgRef} />
        </div>
    );
}