function pieMouseEnter(event, d, arcOver, pieData, g) {
    d3.select(this)
        .attr("stroke", "white")
        .attr("d", arcOver)
        .attr("stroke-width", 4);

    var index = pieData.indexOf(d);
    console.log(index);

    g.selectAll(".label").style("visibility", "hidden");
    console.log(g.selectAll(".label").filter(":nth-child(" + (index + 1) + ")"))
    g.selectAll(".label").filter(":nth-child(" + (index + 1) + ")").style("visibility", "visible");
}

function pieMouseLeave(d, arc, g) {
    d3.select(this)
        .attr("d", arc)
        .attr("stroke", "none");

    g.selectAll(".label").style("visibility", "hidden");
}
