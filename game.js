const parentContainer = d3.select("#chart-area1");

const game_width = parentContainer.node().getBoundingClientRect().width;
const game_height = parentContainer.node().getBoundingClientRect().height;

const game_bar_config = {
    width: game_width/2,
    height: game_height/2
};

const game_pie_config = {
    width: game_width/2,
    height: game_height/2
};

const svg1 = d3.select("#chart-area1")
    .append("svg")
    .attr("width", game_width)
    .attr("height", game_height);

function gamePieChart(data) {
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

        //console.log(sales);

        var color = d3.scaleOrdinal()
            .domain(sales_categories)
            .range(["#097ebe", "#ff7c2a", "#0c9903", "#cd2701"]);

        var pie = d3.pie()
            .sort(null)
            .value((d) => d);

        var pieData = pie(sales);

        var arc = d3.arc()
            .outerRadius(radius)
            .innerRadius(0)

        var g = svg1.append("g")
            .attr("transform", "translate(" + radius + "," + radius + ")")
            .attr("class", "chart")

        g.selectAll("path")
            .data(pieData)
            .join("path")
            .attr("id", "donut-chart")
            .attr("d", arc)
            .attr("fill", (d) => color(d.data))
            .each(function (d) { this._current = d; });
    });
}

function gameBarChart(data) {
    data.then(d => {

        var sales = [0, 0, 0, 0, 0];
        var sales_categories = ["NA", "EU", "JP", "Other", "Global"];

        d.forEach((d) => {
            sales[0] += d.NA_Sales;
            sales[1] += d.EU_Sales;
            sales[2] += d.JP_Sales;
            sales[3] += d.Other_Sales;
            sales[4] += d.Global_Sales;
        });

        var bar = [
            { region: "NA", sales: sales[0] },
            { region: "EU", sales: sales[1] },
            { region: "JP", sales: sales[2] },
            { region: "Other", sales: sales[3] },
            { region: "Global", sales: sales[4] }
        ]
        //console.log(bar);

        var x = d3.scaleBand()
            .domain(sales_categories)
            .range([0, game_width/2])
            .padding(0.5);

        var y = d3.scaleLinear()
            .domain([0, d3.max(sales)])
            .range([game_height/2, 0]);

        var g = svg1.append("g")
        .attr("transform", "translate(" + game_width/2 + ", 0 )");

        g.selectAll("rect")
            .data(bar)
            .enter().append("rect")
            .attr("x", d => x(d.region))
            .attr("y", d => y(d.sales))
            .attr("width", x.bandwidth())
            .attr("height", d => 300 - y(d.sales))
            .attr("fill", "#097ebe");
    })
}