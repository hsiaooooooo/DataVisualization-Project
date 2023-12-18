const parentContainer = d3.select("#chart-area1");

const game_width = parentContainer.node().getBoundingClientRect().width;
const game_height = parentContainer.node().getBoundingClientRect().height;

const game_bar_config = {
    width: game_width / 3,
    height: game_height / 3
};

const game_pie_config = {
    width: game_width / 3,
    height: game_height / 3,
    radius: Math.min(game_width / 3, game_height / 3) / 2
};

const svg1 = d3.select("#chart-area1")
    .append("svg")
    .attr("width", game_width)
    .attr("height", game_height);


function salesCount(data) {
    var sales = [0, 0, 0, 0, 0];
    data.forEach((d) => {
        sales[0] += d.NA_Sales;
        sales[1] += d.EU_Sales;
        sales[2] += d.JP_Sales;
        sales[3] += d.Other_Sales;
        sales[4] += d.Global_Sales;
    });
    return sales
}

function gamePieChart(data) {
    data.then(d => {
        d = d.filter(d => d.Rank <= 100);
        var sales = salesCount(d).slice(0, 4);
        var sales_categories = ["NA", "EU", "JP", "Other"];

        var color = d3.scaleOrdinal()
            .domain(sales_categories)
            .range(["#097ebe", "#ff7c2a", "#0c9903", "#cd2701"]);

        var pie = d3.pie()
            .sort(null)
            .value((d) => d);

        var pieData = pie(sales);
        var radius = game_pie_config.radius;
        var arc = d3.arc()
            .outerRadius(radius)
            .innerRadius(0);

        var labelArc = d3.arc().outerRadius(radius + 20).innerRadius(radius + 20);

        var g = svg1.append("g")
            .attr("id", "Pie")
            .attr("transform", "translate(" + game_width / 4 + "," + radius + 10 + ")")
            .attr("class", "chart");

        var arcs = g.selectAll("path")
            .data(pieData)
            .join("path")
            .attr("id", "game-pie")
            .attr("d", arc)
            .attr("fill", (d) => color(d.data))
            .attr("transform", "translate(0," + 70 + ")")
            .each(function (d) { this._current = d; });

        var labels = g.selectAll("text")
            .data(pieData)
            .join("text")
            .attr("id", "pie-text")
            .attr("transform", function (d) {
                var pos = labelArc.centroid(d);
                var isLeftSide = pos[0] < 0;
                if (isLeftSide) {
                    return `translate(${-radius - 100},${pos[1] + 70})`;
                }
                else
                    return `translate(${radius + 100}, ${pos[1] + 70})`;
            })
            .attr("dy", "0.35em")
            .text(d => `${(d.data / d3.sum(sales) * 100).toFixed(1)}%`);

        var lines = g.selectAll("line")
            .data(pieData)
            .join("line")
            .attr("id","line1")
            .attr("stroke", "black")
            .attr("x1", function (d) {
                return labelArc.centroid(d)[0];
            })
            .attr("y1", function (d) {
                return labelArc.centroid(d)[1] + 70;
            })
            .attr("x2", function (d) {
                return arc.centroid(d)[0];
            })
            .attr("y2", function (d) {
                return arc.centroid(d)[1] + 70;
            });
        console.log(lines);

            
        var connectingLines = g.selectAll("line.connecting")
            .data(pieData)
            .join("line")
            .attr("id", "connecting")
            .attr("stroke", "black")
            .attr("x1", function (d,i) {
                return lines.nodes()[i].getAttribute("x1");
            })
            .attr("y1", function (d,i) {
                return lines.nodes()[i].getAttribute("y1");
            })
            .attr("x2", function (d) {
                var pos = labelArc.centroid(d);
                var isLeftSide = pos[0] < 0;
                return isLeftSide ? -radius - 50 : radius + 80;
            })
            .attr("y2", function (d) {
                var pos = labelArc.centroid(d);
                return pos[1] + 70;
            });
    });
}

function gameBarChart(data) {
    data.then(d => {
        d = d.filter(d => d.Rank <= 100);

        var sales = salesCount(d).slice(0, 4);
        var bar = [
            { region: "NA", sales: sales[0] },
            { region: "EU", sales: sales[1] },
            { region: "JP", sales: sales[2] },
            { region: "Other", sales: sales[3] },
            // { region: "Global", sales: sales[4] }
        ]

        bar.sort(function (b, a) {
            return a.sales - b.sales;
        });

        var x = d3.scaleBand()
            .domain(bar.map(d => d.region))
            .range([0, game_bar_config.width])
            .padding(0.5);

        const xAxisCall = d3.axisBottom(x)

        var y = d3.scaleLinear()
            .domain([0, d3.max(sales) + 10])
            .range([game_bar_config.height, 0]);

        const yAxisCall = d3.axisLeft(y)
            .ticks(8);


        var g = svg1.append("g")
            .attr("transform", "translate(" + game_width / 2 + ", 70 )")
            .attr("id", "Bar")

        g.append("g")
            .attr("transform", "translate( 0, " + game_bar_config.height + " )")
            .attr("id", "bar-x-axis")
            .attr("class", "text")
            .style("font-size", "17px")
            .style("font-family", "Roboto Mono")
            .call(xAxisCall);

        g.append("g")
            .attr("id", "bar-y-axis")
            .style("font-size", "17px")
            .style("font-family", "Roboto Mono")
            .call(yAxisCall)

        g.selectAll("rect")
            .data(bar)
            .enter().append("rect")
            .attr("id", "game-bar")
            .attr("x", d => x(d.region))
            .attr("y", d => y(d.sales))
            .attr("width", x.bandwidth())
            .attr("height", d => game_bar_config.height - y(d.sales))
            .attr("fill", "#097ebe");
    })
}

function gameBubbleChart(data) {
    data.then(d => {
        d = d.filter(d => d.Rank <= 100);

        const gameGenre = ["Sports", "Platfrom", "Racing", "Role-Playing", "Puzzle", "Misc",
            "Shooter", "Racing", "Action", "Fighting", "Adventure", "Strategy"];

        const color = d3.scaleOrdinal()
            .domain(gameGenre)
            .range(["#d8b3ca", "#da9ada", "#a290db", "#5d6a84", "#5d6ac9", "#4090dc",
                "#a3c5dc", "#5cc4c9", "#409079", "#779079", "#d8b579", "#d89079"]);

        const pack = d3.pack()
            .size([game_width / 2, game_height / 2])
            .padding(5);

        const root = pack(d3.hierarchy({ children: d }).sum(d => d.Global_Sales));
        console.log(root.leaves());

        const g = svg1.append("g")
            .attr("transform", `translate(${game_width / 4},${game_height / 2})`)
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
            .attr("r", d => d.r)

        node.append("title")
            .text(d => `${d.data.Name}\nGenre: ${d.data.Genre}\nGlobal Sales: ${d.data.Global_Sales}`);

        var simulation = d3.forceSimulation()
            .force('charge', d3.forceManyBody().strength(5))
            .force('y', d3.forceY().y(game_height / 4))
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
            }
            else {
                game = d.data.Name;
                circle.attr("stroke", hasStroke ? null : "black")
                circle.attr("stroke-width", 2)

            }
            upGamePie();
            upGameBar();
            console.log("Selected Circle Name:", game);
        }

    });
}


