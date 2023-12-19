function upGamePie() {
    data.then(d => {
        if (game != null)
            d = d.filter(d => d.Name == game)
        else {
            d = d.filter(d => d.Rank <= 100)
        }

        var sales = salesCount(d).slice(0, 4);

        var pie = d3.pie()
            .sort(null)
            .value((d) => d);

        var radius = game_pie_config.radius
        var labelArc = d3.arc().outerRadius(radius + 100).innerRadius(radius + 20);

        var arc = d3.arc()
            .outerRadius(radius)
            .innerRadius(0)

        // update path
        pieData = pie(sales);
        const paths = d3.selectAll("#game-pie")

        paths.data(pieData)
            .transition()
            .duration(1000)
            .attrTween("d", function (d) {
                const interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    return arc(interpolate(t));
                };
            })

        // update labels
        let percentage = d3.selectAll(".label")
            .data(pieData)

        percentage.transition().duration(1000)
            .attr("transform", function (d) {
                var pos = labelArc.centroid(d);
                var isLeftSide = pos[0] < 0;
                if (isLeftSide) {
                    return `translate(${pos[0] - radius * 0.075},${pos[1] + radius * 0.5})`;
                }
                else
                    return `translate(${pos[0]}, ${pos[1] + radius * 0.4})`;
            })
            .attr("class", "label")
            .text(d => `${(d.data / d3.sum(sales) * 100).toFixed(1)}%`)
    })
}

function upGameBar() {
    data.then(d => {
        if (game != null) {
            d = d.filter(d => d.Name == game)
        }
        else {
            d = d.filter(d => d.Rank <= 100)
        }

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

        const xAxis_new = d3.axisBottom(x);

        var y = d3.scaleLinear()
            .domain([0, d3.max(sales) + 5])
            .range([game_bar_config.height, 0]);

        const yAxis_new = d3.axisLeft(y)
            .ticks(8)

        d3.selectAll("#bar-y-axis")
            .transition().duration(1000)
            .call(yAxis_new)

        d3.selectAll("#bar-x-axis")
            .transition().duration(1000)
            .call(xAxis_new)

        let bins = svg1.selectAll("#game-bar")
            .data(bar)

        bins.transition()
            .duration(1000)
            // .data(bar)
            .attr("fill", "steelblue")
            .attr("x", d => x(d.region))
            .attr("y", d => y(d.sales))
            .attr("width", x.bandwidth())
            .attr("height", d => game_bar_config.height - y(d.sales))
            .attr("fill", "#097ebe");
    })
}
