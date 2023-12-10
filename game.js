const game_width = 1000;
const game_height = 700;

const game_bar_config = {
    width: 300,
    height: 300
};

const game_pie_config = {
    width: 300,
    height: 300
};

const svg1 = d3.select("#chart-area1")
    .append("svg")
    .attr("width", game_width)
    .attr("height", game_height);

function gamePieChart(data, callback) {
    var sales = [0, 0, 0, 0];
    var sales_categories = ["NA", "EU", "JP", "Other"];
    var radius = Math.min(game_pie_config.width, game_pie_config.height) / 2;

    data.then(d => {
        d.forEach((d) => {
            sales[0] += d.NA_Sales;
            sales[1] += d.EU_Sales;
            sales[2] += d.JP_Sales;
            sales[3] += d.Other_Sales;
        });

        console.log(sales);

        var color = d3.scaleOrdinal()
            .domain(sales_categories)
            .range(["#097ebe", "#ff7c2a", "#0c9903", "#cd2701"]);

        var pie = d3.pie()
            .sort(null)
            .value((d) => d);

        var pieData = pie(sales);

        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0); // Adjust the inner radius as needed

        var g = svg1.append("g")
            .attr("transform", "translate(" + game_width / 2 + "," + game_height / 2 + ")");

        // g = svg1.selectAll("arc")
        //     .data(pieData)
        //     .join("path")
        //     .attr("id", "donut-chart")
        //     .attr("d", arc)
        //     .attr("fill", (d) => color(d.data))
        //     .attr("transform", `translate(${game_width / 2},${game_height / 2})`)
        //     .each(function (d) { this._current = d; });
        g.selectAll("path")
            .data(pieData)
            .join("path")
            .attr("id", "donut-chart")
            .attr("d", arc)
            .attr("fill", (d) => color(d.data))
            .each(function (d) { this._current = d; });

        if (callback) {
            callback();
        }
    });
}

// Call the function with a callback to ensure the data has been loaded
gamePieChart(data, function () {
    console.log("Pie chart created!");
});
