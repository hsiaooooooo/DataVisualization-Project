const line = {
    width: 1800,
    height: 800
};
const svg3 = d3.select("#second-row-container").append("svg")
    .attr("width", line.width * 1.5).attr("height", line.height * 1.3)


var EUdata = new Array(37).fill(0);
var NAdata = new Array(37).fill(0);
var JPdata = new Array(37).fill(0);
var Otherdata = new Array(37).fill(0);
var Globaldata = new Array(37).fill(0);

var naline;
var euline;
var jpline;
var otherline;
var globalline;
var selectGenre;

var line_x = d3.scaleLinear()
    .domain([1980, 2016])
    .range([0, line.width + 50])
var line_x = d3.scaleLinear()
    .domain([1980, 2016])
    .range([0, line.width - 80])
var line_originalaxis;

document.addEventListener('DOMContentLoaded', function () {
    var startYear = 0;
    var endYear = 11;
    var name = ["Sports", "Platform", "Racing", "Role-Playing", "Puzzle", "Misc", "Shooter", "Simulation", "Action", "Fighting", "Advanture", "Strategy"]
    var maxDropdownHeight = 200; // Set your desired maximum height in pixels

    var dropdown = document.getElementById('GenreDropdown');

    // Generate options dynamically using a loop
    for (var year = startYear; year <= endYear; year++) {
        var option = document.createElement('div');
        option.textContent = name[year];

        option.addEventListener('click', function () {
            var selectedYear = this.textContent; // Retrieve the selected value
            console.log('Selected Year:', selectedYear);
            d3.csv("vgsales.csv").then(data => {
                //console.log(data)
                preprocess(data);//console.log(data)
                selectGenre = selectedYear;//console.log(selectGenre);
                processLineUpdate(data, selectGenre); console.log(NAdata)
                updateline(NAdata, EUdata, JPdata, Otherdata, Globaldata, selectGenre)

            })
        });

        dropdown.appendChild(option);
    }

    // Set maximum height and enable scrolling
    dropdown.style.maxHeight = maxDropdownHeight + 'px';
    dropdown.style.overflowY = 'auto';

});


d3.csv("vgsales.csv").then(data => {
    preprocess(data);//console.log(data)
    processLine(data);//console.log(Globaldata)

    const group3 = svg3.append('g').attr("transform", 'translate(' + line.width * 0.1 + ', ' + line.height * 0.1 + ')')
    var color = ['#d89079', '#5cc4c9', '#4090dc', '#d8b3ca', '#d8b579']
    var line_name = ["NA", "EU", "JP", "Other", "Global"]
    var line_legend = group3.selectAll(".legend").data(line_name)
        .enter().append("g").attr("class", "legend")
        .attr("transform", 'translate(50, -300)');

    const genreText = group3.append("text")
        .attr("x", line.width / 2)
        .attr("y", 0)
        .attr("id", "genre_title")
        .attr("text-anchor", "middle")
        .style("font-family", "Roboto Mono")
        .style("font-size", "40px")
        .text("All genres").attr("fill", "#004b62")

    line_legend.append("rect").attr("x", 0)
        .attr("y", function (d, i) {
            return i * 35 + sec_game_height / 3;
        })
        .attr("width", 30).attr("height", 10)
        .style("fill", function (d, i) {
            return color[i];
        }).attr("transform", 'translate(0, 5)')

    line_legend.append("text").attr("x", 40)
        .attr("y", function (d, i) {
            return i * 35 + sec_game_height / 3 + 20;
        })
        .style("font-size", `${sec_game_width * 0.02}`)
        .style("font-family", "Roboto Mono")
        .style("text-anchor", "start").attr("fill", "#004b62").text((d) => d)


    //x
    group3.append("text")
        .attr("x", line.width / 2)
        .attr("y", line.height - 30)
        .attr("font-size", "50px")
        .style("font-family", "Roboto Mono").attr("fill", "#004b62")
        .text("Year").attr("transform", 'translate(' + 0 + ', ' + (50) + ')')



    const line_xAxisCall = d3.axisBottom(line_x).ticks(37)

    var line_xaxis = group3.append("g").call(line_xAxisCall)
        .attr("transform", 'translate(' + 0 + ', ' + (line.height - 80) + ')')
    line_xaxis.selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("font-family", "Roboto Mono").attr("font-size", "15px")
        .style("text-anchor", "end").attr("fill", "#004b62");
    //y
    group3.append("text")
        .attr("x", -(line.height / 2))
        .attr("y", -40)
        .attr("font-size", "40px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .style("font-family", "Roboto Mono")
        .text("Sales").attr("fill", "#004b62")
    const line_y = d3.scaleLinear()//.domain([0, 900])
        .domain([0, d3.max(Globaldata, d => d)])
        .range([line.height - 80, 0])
    const line_yAxisCall = d3.axisLeft(line_y).ticks(10)
    line_originalaxis = group3.append("g").call(line_yAxisCall)//.attr("transform", 'translate('+100+', '+(0)+')')
    line_originalaxis.selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("font-family", "Roboto Mono").attr("font-size", "15px").attr("fill", "#004b62")
        .style("text-anchor", "end");


    //console.log(NAdata)

    const linee = d3.line()
        .x((d, i) => line_x(i + 1980))
        .y(d => line_y(d));

    // Draw the line
    naline = group3.append('path')
        .data([NAdata])
        .attr('d', linee)
        .attr('fill', 'none')
        .attr('stroke', color[0]).attr('stroke-width', 5)

    euline = group3.append('path')
        .data([EUdata])
        .attr('d', linee)
        .attr('fill', 'none')
        .attr('stroke', color[1]).attr('stroke-width', 5)

    jpline = group3.append('path')
        .data([JPdata])
        .attr('d', linee)
        .attr('fill', 'none')
        .attr('stroke', color[2]).attr('stroke-width', 5)

    otherline = group3.append('path')
        .data([Otherdata])
        .attr('d', linee)
        .attr('fill', 'none')
        .attr('stroke', color[3]).attr('stroke-width', 5)

    globalline = group3.append('path')
        .data([Globaldata])
        .attr('d', linee)
        .attr('fill', 'none')
        .attr('stroke', color[4]).attr('stroke-width', 5)

})

function updateline(NAdata, EUdata, JPdata, Otherdata, Globaldata, Genre) {
    //console.log("a")
    const newline_y = d3.scaleLinear()//.domain([0, 900])
        .domain([0, d3.max(Globaldata, d => d)])
        .range([line.height - 80, 0])
    const line_yAxisCall = d3.axisLeft(newline_y).ticks(10)
    //originalaxis=group3.append("g").call(line_yAxisCall)//.attr("transform", 'translate('+100+', '+(0)+')')
    line_originalaxis.transition().duration(1000).call(line_yAxisCall)
    line_originalaxis.selectAll("text")
    .attr("transform", "rotate(-40)").attr("fill", "#004b62").attr("font-size", "15px")
    .style("text-anchor", "end");

    d3.selectAll("#genre_title")
        .text(Genre)
    //console.log(NAdata)

    const linee = d3.line()
        .x((d, i) => line_x(i + 1980))
        .y(d => newline_y(d));
    naline.data([NAdata]).transition().duration(1000).attr('d', linee)
    euline.data([EUdata]).transition().duration(1000).attr('d', linee)
    jpline.data([JPdata]).transition().duration(1000).attr('d', linee)
    otherline.data([Otherdata]).transition().duration(1000).attr('d', linee)
    globalline.data([Globaldata]).transition().duration(1000).attr('d', linee)

}


function processLine(data) {
    data.forEach(d => {
        //console.log(d.Year)
        if (d.Year >= 1980 && d.Year <= 2016) {
            NAdata[d.Year - 1980] += d.NA_Sales;
            EUdata[d.Year - 1980] += d.EU_Sales;
            JPdata[d.Year - 1980] += d.JP_Sales;
            Otherdata[d.Year - 1980] += d.Other_Sales;
            Globaldata[d.Year - 1980] += d.Global_Sales;
        }

    });
    //onsole.log(EUdata)
}

function processLineUpdate(data, selectedGenre) {
    NAdata.forEach(function (_, i, arr) {
        arr[i] = 0;
    });
    EUdata.forEach(function (_, i, arr) {
        arr[i] = 0;
    });
    JPdata.forEach(function (_, i, arr) {
        arr[i] = 0;
    });
    Otherdata.forEach(function (_, i, arr) {
        arr[i] = 0;
    });
    Globaldata.forEach(function (_, i, arr) {
        arr[i] = 0;
    });

    data.forEach(d => {
        //console.log(d.Year)
        if (d.Year >= 1980 && d.Year <= 2016 && d.Genre === selectedGenre) {
            NAdata[d.Year - 1980] += d.NA_Sales;
            EUdata[d.Year - 1980] += d.EU_Sales;
            JPdata[d.Year - 1980] += d.JP_Sales;
            Otherdata[d.Year - 1980] += d.Other_Sales;
            Globaldata[d.Year - 1980] += d.Global_Sales;
        }

    });
    //onsole.log(EUdata)
}

function preprocess(data) {
    //data.then(d =>
    data.forEach(function (d) {
        d.Year = Number(d.Year)
        d.NA_Sales = Number(d.NA_Sales)
        d.EU_Sales = Number(d.EU_Sales)
        d.JP_Sales = Number(d.JP_Sales)
        d.Other_Sales = Number(d.Other_Sales)
        d.Global_Sales = Number(d.Global_Sales)
    })
    //)
    //console.log(data)
}