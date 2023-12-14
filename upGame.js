function upGamePie() {
    data.then(d => {
        // console.log(game);
        if (game != null)
            d = d.filter(d => d.Name == game)
        // console.log(d);

        var sales = [0, 0, 0, 0];
        d.forEach((d) => {
            sales[0] += d.NA_Sales;
            sales[1] += d.EU_Sales;
            sales[2] += d.JP_Sales;
            sales[3] += d.Other_Sales;
        });


        const newPieData = pie(sales);
        const paths = d3.selectAll("#game-pie")

        paths.data(newPieData)
            .transition()
            .duration(1000)
            .attrTween("d", function (d) {
                const interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    return arc(interpolate(t));
                };
            })

    })
}
