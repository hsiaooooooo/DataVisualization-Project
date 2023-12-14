const parentContainer = d3.select("#chart-area1");

const game_width = parentContainer.node().getBoundingClientRect().width;
const game_height = parentContainer.node().getBoundingClientRect().height;

const game_bar_config = {
    width: game_width / 3,
    height: game_height / 3
};

const game_pie_config = {
    width: game_width / 3,
    height: game_height / 3
};


const svg1 = d3.select("#chart-area1")
    .append("svg")
    .attr("width", game_width)
    .attr("height", game_height);

var radius = Math.min(game_pie_config.width, game_pie_config.height) / 2;
var arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(0)
var pie = d3.pie()
    .sort(null)
    .value((d) => d);

function gamePieChart(data) {
    var sales = [0, 0, 0, 0];
    var sales_categories = ["NA", "EU", "JP", "Other"];

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



        var pieData = pie(sales);

        var g = svg1.append("g")
            .attr("id", "Pie")
            .attr("transform", "translate(" + game_width / 4 + "," + radius + ")")
            .attr("class", "chart")

        g.selectAll("path")
            .data(pieData)
            .join("path")
            .attr("id", "game-pie")
            .attr("d", arc)
            .attr("fill", (d) => color(d.data))
            .each(function (d) { this._current = d; });
    });
}

function gameBarChart(data) {
    data.then(d => {

        var sales = [0, 0, 0, 0, 0];

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

        // console.log(bar);

        bar.sort(function (b, a) {
            return a.sales - b.sales;
        });

        // console.log(bar);

        var x = d3.scaleBand()
            .domain(bar.map(d => d.region))
            .range([0, game_bar_config.width])
            .padding(0.5);

        const xAxisCall = d3.axisBottom(x)
        // .ticks(10);

        var y = d3.scaleLinear()
            .domain([0, d3.max(sales)])
            .range([game_bar_config.height, 0]);

        const yAxisCall = d3.axisLeft(y)
            .ticks(10);

        var g = svg1.append("g")
            .attr("transform", "translate(" + game_width / 2 + ", 0 )")
            .attr("id", "Bar")

        g.append("g")
            .attr("transform", "translate( 0, " + game_bar_config.height + " )")
            .attr("id", "game-bar")
            .call(xAxisCall);


        g.append("g")
            .call(yAxisCall)

        g.selectAll("rect")
            .data(bar)
            .enter().append("rect")
            .attr("x", d => x(d.region))
            .attr("y", d => y(d.sales))
            .attr("width", x.bandwidth())
            .attr("height", d => game_bar_config.height - y(d.sales))
            .attr("fill", "#097ebe");
    })
}

function gameBubbleChart(data) {
    data.then(d => {
        d = d.filter(d => d.Global_Sales > 10);
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pack = d3.pack()
            .size([game_width, game_height * 3 / 4])
            .padding(5);

        const root = pack(d3.hierarchy({ children: d }).sum(d => d.Global_Sales));
        console.log(root.leaves());

        const g = svg1.append("g")
            .attr("transform", "translate(0, " + game_height / 3 + " )")
            .attr("id", "Bubble")

        const node = g.selectAll("g")
            .data(root.leaves())
            .join("g")
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .attr("id", "game-bubble")
            // .call(d3.drag().on("start", dragstart).on("drag", dragged).on("end", dragend))
            .on("click", handleClick);

        node.append("circle")
            .attr("fill-opacity", 0.7)
            .attr("fill", d => color(d.data.Genre))
            .attr("r", d => d.r);

        // Add a title
        node.append("title")
            .text(d => `${d.data.Name}\nGenre: ${d.data.Genre}\nGlobal Sales: ${d.data.Global_Sales}`);

        // Create force simulation and bind data
        var simulation = d3.forceSimulation()
            .force('charge', d3.forceManyBody().strength(5))
            .force('y', d3.forceY().y(game_height / 4)) // Adjust the y-coordinate based on your requirements
            .force('collision', d3.forceCollide().radius(function (d) {
                return d.r + 3;
            }));

        simulation.nodes(root.leaves())
            .on('tick', tick);

        // Drag functions
        function dragstart(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragend(event, d) {
            if (event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        function tick() {
            node.attr('transform', function (d) {
                return `translate(${d.x},${d.y})`;
            });
        }
        function handleClick(event, d) {

            svg1.selectAll("circle").attr("stroke", null);

            const circle = d3.select(this).select("circle");
            const hasStroke = circle.attr("stroke") === "black";
            if (d.data.Name == game) {
                game = null;
                circle.attr("stroke", null);
                upGamePie();
            }
            else {
                game = d.data.Name;
                circle.attr("stroke", hasStroke ? null : "black");
                upGamePie();
            }
            console.log("Selected Circle Name:", game);
        }
    });
}


