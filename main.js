

var data = d3.csv("vgsales.csv");

// Create an SVG element for the second chart
// const svg2 = d3.select("#chart-area2")
//     .append("svg")
//     .attr("width", game_width)
//     .attr("height", game_height);

// const svg3 = d3.select("#chart-area3")
//     .append("svg")
//     .attr("width", game_width)
//     .attr("height", game_height);

getData(data);
gamePieChart(data);

function getData(data) {
    data.then(d =>
        d.forEach(function (d) {
            d.Year = Number(d.Year)
            d.NA_Sales = Number(d.NA_Sales)
            d.EU_Sales = Number(d.EU_Sales)
            d.JP_Sales = Number(d.JP_Sales)
            d.Other_Sales = Number(d.Other_Sales)
            d.Global_Sales = Number(d.Global_Sales)
        })
    )
    console.log(data)
}



