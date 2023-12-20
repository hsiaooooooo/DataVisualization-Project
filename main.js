// var data = d3.csv("vgsales.csv")

function getData(data) {
    data.forEach(function (d) {
        d.Year = Number(d.Year)
        d.NA_Sales = Number(d.NA_Sales)
        d.EU_Sales = Number(d.EU_Sales)
        d.JP_Sales = Number(d.JP_Sales)
        d.Other_Sales = Number(d.Other_Sales)
        d.Global_Sales = Number(d.Global_Sales)
    })
    //console.log(data)
}

d3.csv("vgsales.csv").then(data => {
    getData(data);

    gamePieChart(data);
    gameBarChart(data);
    gameBubbleChart(data);
})