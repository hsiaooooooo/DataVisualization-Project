const sec_parentContainer = d3.select("#chart-area2");

const sec_game_width = sec_parentContainer.node().getBoundingClientRect().width;
const sec_game_height = sec_parentContainer.node().getBoundingClientRect().height;

const sec_pie_set = {
    width: sec_game_width / 2,
    height: sec_game_height / 2
};
const sec_donut_set = {
    width: sec_game_width / 2,
    height: sec_game_height / 2
};
const sec_bar_set = {
    width: sec_game_width / 2,
    height: sec_game_height / 2
};

const svg2 = d3.select("#chart-area2").append("svg")
    .attr("width", sec_game_width).attr("height", sec_game_height * 0.9)

document.addEventListener('DOMContentLoaded', function () {
    var startYear = 1980;
    var endYear = 2016;
    var maxDropdownHeight = 200; // Set your desired maximum height in pixels

    var dropdown = document.getElementById('yearDropdown');

    // Generate options dynamically using a loop
    for (var year = startYear; year <= endYear; year++) {
        var option = document.createElement('div');
        option.textContent = year;

        option.addEventListener('click', function () {
            var selectedYear = this.textContent; // Retrieve the selected value
            console.log('Selected Year:', selectedYear);
            d3.csv("vgsales.csv").then(data => {
                //console.log(data)
                year = selectedYear;
                //console.log(year);
                preprocess(data);
                let filteredData = filterYear(data, year);
                console.log(filteredData);
                var newGenreCounts = {};
                var newGenrekeys;
                var newPublisherCounts = {};
                var newPublisherkeys;
                var newPlatformCounts = {};
                var newPlatformKeys;
                processData(filteredData, newGenreCounts, newPublisherCounts, newPlatformCounts);
                newGenrekeys = Object.keys(newGenreCounts);
                newPublisherkeys = Object.keys(PublisherCounts);//console.log(Publisherkeys);
                newPlatformKeys = Object.keys(PlatformCounts);
                updateDonut(newGenreCounts, newGenrekeys);
                var newSalesCounts = [0, 0, 0, 0];
                processPie(filteredData, newSalesCounts)
                updatePie(newSalesCounts);
                const newtop5Publisher = [];
                const newtop5Platform = [];

                top5(newtop5Platform, newPlatformCounts, newPlatformKeys);//console.log(newtop5Platform);
                top5(newtop5Publisher, newPublisherCounts, newPublisherkeys); console.log(newtop5Platform);
                updatebar(Platform_bar_rects, newtop5Platform, plat_originalaxis, plat_originalaxisy)
                updatebar(pub_bar_rects, newtop5Publisher, pub_originalaxis, pub_originalaxisy)

            })
        });

        dropdown.appendChild(option);
    }

    // Set maximum height and enable scrolling
    dropdown.style.maxHeight = maxDropdownHeight + 'px';
    dropdown.style.overflowY = 'auto';


});

var GenreCounts = {};
var Genrekeys;
var SalesCounts = [0, 0, 0, 0];
var PublisherCounts = {};
var Publisherkeys;
var PlatformCounts = {};
var PlatformKeys;
var year; //1980-2016
var theDonut;
var pie_arcs;
const radius = 80;
const pie = d3.pie();
const arc = d3.arc()
    .innerRadius(110)
    .outerRadius(radius);

const top5Publisher = [];
const top5Platform = [];

var thePie;
const pie_radius = 100;
const pie_arc = d3.arc()
    .innerRadius(0)
    .outerRadius(pie_radius);

d3.csv("vgsales.csv").then(data => {

    preprocess(data);
    processPie(data, SalesCounts);//console.log(SalesCounts);
    processData(data, GenreCounts, PublisherCounts, PlatformCounts);//console.log(yearCounts);//console.log(GenreCounts)
    Genrekeys = Object.keys(GenreCounts);//console.log(keys);//console.log(PublisherCounts);
    Publisherkeys = Object.keys(PublisherCounts);//console.log(Publisherkeys);
    PlatformKeys = Object.keys(PlatformCounts);//console.log(PlatformKeys);
    sec_donut(data, Genrekeys);
    sec_pie(data);
    top5(top5Publisher, PublisherCounts, Publisherkeys);//console.log(top5Publisher);
    top5(top5Platform, PlatformCounts, PlatformKeys);//console.log(top5Platform);
    sec_bar_pub(data);
    sec_bar_plat(data);

    //console.log(data);
});

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
}
function filterYear(data, year) {
    data.forEach(function (d) {
        d.Year = Number(d.Year)
        d.NA_Sales = Number(d.NA_Sales)
        d.EU_Sales = Number(d.EU_Sales)
        d.JP_Sales = Number(d.JP_Sales)
        d.Other_Sales = Number(d.Other_Sales)
        d.Global_Sales = Number(d.Global_Sales)
    })
    //console.log("inside", year)
    return data.filter(d => d.Year == year);

}

function processData(data, GenreCounts, PublisherCounts, PlatformCounts) {
    data.forEach(function (item) {
        if (GenreCounts.hasOwnProperty(item.Genre)) {
            GenreCounts[item.Genre]++;
        }
        else {
            GenreCounts[item.Genre] = 1;
        }

        if (PublisherCounts.hasOwnProperty(item.Publisher)) {
            PublisherCounts[item.Publisher] += item.NA_Sales;
            PublisherCounts[item.Publisher] += item.EU_Sales;
            PublisherCounts[item.Publisher] += item.JP_Sales;
            PublisherCounts[item.Publisher] += item.Other_Sales;
        }
        else {
            PublisherCounts[item.Publisher] = 0;
            PublisherCounts[item.Publisher] += item.NA_Sales;
            PublisherCounts[item.Publisher] += item.EU_Sales;
            PublisherCounts[item.Publisher] += item.JP_Sales;
            PublisherCounts[item.Publisher] += item.Other_Sales;
        }

        if (PlatformCounts.hasOwnProperty(item.Platform)) {
            PlatformCounts[item.Platform] += item.NA_Sales;
            PlatformCounts[item.Platform] += item.EU_Sales;
            PlatformCounts[item.Platform] += item.JP_Sales;
            PlatformCounts[item.Platform] += item.Other_Sales;
        }
        else {
            PlatformCounts[item.Platform] = 0;
            PlatformCounts[item.Platform] += item.NA_Sales;
            PlatformCounts[item.Platform] += item.EU_Sales;
            PlatformCounts[item.Platform] += item.JP_Sales;
            PlatformCounts[item.Platform] += item.Other_Sales;
        }

        // if(yearCounts.hasOwnProperty(item.Year))
        // {
        //     yearCounts[item.Year]++;
        // }
        // else{
        //     yearCounts[item.Year]=1;
        // }
    })
}


function processPie(data, SalesCounts) {
    data.forEach(function (d) {
        SalesCounts[0] += d.NA_Sales;
        SalesCounts[1] += d.EU_Sales;
        SalesCounts[2] += d.JP_Sales;
        SalesCounts[3] += d.Other_Sales;
    })
}

function top5(top5array, data) {
    top5array.length = 0;

    var dataArray = Object.keys(data).map(function (key) {
        return {
            name: key,
            value: data[key]
        };
    });

    dataArray.sort(function (a, b) {
        return b.value - a.value;
    });
    top5array.push.apply(top5array, dataArray.slice(0, 5));
    while (top5array.length < 5) {
        top5array.push({ name: "", value: 0 });
    }
    top5array.sort(function (a, b) {
        return a.value - b.value;
    });
}


function sec_donut(data, keys) {
    const group2 = svg2.append('g')
    var donut_color = ["#d8b3ca", "#da9ada", "#a290db", "#5d6a84", "#5d6ac9", "#4090dc",
        "#a3c5dc", "#5cc4c9", "#409079", "#779079", "#d8b579", "#d89079"]

    //donut legend
    var donut_legend = group2.selectAll(".legend").data(keys)
        .enter().append("g").attr("class", "legend")
        .attr("transform", `translate(${0}, ${-sec_donut_set.height * 0.1})`);

    donut_legend.append("rect").attr("x", 0)
        .attr("y", function (d, i) {
            return i * 25;
        })
        .attr("width", 30).attr("height", 10)
        .style("fill", function (d, i) {
            return donut_color[i]
        })
        .attr("transform", 'translate(0, ' + (sec_donut_set.height + 20) + ')')

    donut_legend.append("text").attr("x", 40)
        .attr("y", function (d, i) {
            return i * 25 + 10;
        })
        .style("text-anchor", "start").attr("fill", "#004b62").text((d) => d)
        .style("font-family", "Roboto Mono")
        .attr("transform", 'translate(0, ' + (20 + sec_donut_set.height) + ')')


    group2.append("text")
        .attr("x", sec_donut_set.width / 2)
        .attr("y", sec_donut_set.height * 0.525)
        .attr("font-size", "35px")
        .attr("text-anchor", "middle")
        .attr("fill", "#004b62")
        .attr("transform", `translate(${sec_donut_set.width * 0.09},${sec_donut_set.height * 0.8})`)
        .text("Genre")
        .style("font-family", "Roboto Mono")

    //pie chart

    var genre = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    genre.forEach(function (d, i) {
        genre[i] = GenreCounts[keys[i]];
    })

    const arcs = pie(genre);
    theDonut = group2.selectAll("path").data(arcs)
        .enter().append("path").attr("d", arc)
        .attr("fill", (d, i) => {
            return donut_color[i];
        })
        .attr("transform", 'translate(' + (sec_donut_set.width / 1.7) + ', ' + (sec_donut_set.height * 1.3) + ')');

}

function updateDonut(GenreCounts, keys) {
    var genre = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    genre.forEach(function (d, i) {
        genre[i] = GenreCounts[keys[i]];
    })
    const arcs = pie(genre);
    theDonut.data(arcs);
    theDonut.transition()
        .duration(1000)
        .attrTween("d", function (d) {
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                return arc(interpolate(t));
            };
        });
}

var pub_bar_rects;
var pub_originalaxis;
var pub_originalaxisy;

function sec_bar_pub(data) {
    const group2 = svg2.append('g').attr("transform", 'translate(' + sec_pie_set.width * 1.1 + ', ' + 0 + ')')

    var bar_color = ['#d89079', '#5cc4c9', '#4090dc', '#d8b3ca', '#d8b579'];
    //X label
    group2.append("text")
        .attr("x", sec_bar_set.width / 4)
        .attr("y", sec_bar_set.height * 0.84)
        .attr("font-size", "22px")
        .style("font-family", "Roboto Mono")
        .text("Global Sales").attr("fill", "#004b62")

    const bar_x = d3.scaleLinear()
        .domain([0, d3.max(top5Publisher, d => d.value) + 3])
        .range([0, sec_bar_set.width * 4 / 5])
    const bar_xAxisCall = d3.axisBottom(bar_x)
    pub_originalaxis = group2.append("g")
        .style("font-size", "18px")
        .call(bar_xAxisCall)
        .attr("transform", 'translate(' + sec_bar_set.width * 0 + ', ' + (sec_bar_set.height * 2 / 3) + ')')
    pub_originalaxis.selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("font-family", "Roboto Mono")
        .style("text-anchor", "end");
    // Y label
    const bar_y = d3.scaleBand()
        .domain(top5Publisher.map(d => d.name))
        .range([sec_bar_set.height * 2 / 3, 0])
    const bar_yAxisCall = d3.axisLeft(bar_y).ticks(10)
    pub_originalaxisy = group2.append("g").call(bar_yAxisCall).style("font-size", `${17}px`)
    pub_originalaxisy.selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("font-family", "Roboto Mono")
        .style("text-anchor", "end");
    //.attr("transform", 'translate(' + sec_bar_set.width * 99 / 100 + ', ' + 0 + ')')

    pub_bar_rects = group2.append("g").selectAll("rect")
        .data(top5Publisher)
        .enter().append("rect")
        .attr("x", 0)
        .attr("y", d => bar_y(d.name))
        .attr("width", d => bar_x(d.value))
        .attr("height", 30)
        .style("fill", function (d, i) {
            return bar_color[i];
        })
}
var Platform_bar_rects
var plat_originalaxis;
var plat_originalaxisy;

function sec_bar_plat(data) {
    const group2 = svg2.append('g').attr("transform", 'translate(' + sec_donut_set.width * 0.1 + ', ' + (sec_bar_set.height * 0.9) + ')')

    var bar_color = ['#d89079', '#5cc4c9', '#4090dc', '#d8b3ca', '#d8b579'];
    //X labeld89079
    group2.append("text")
        .attr("x", sec_bar_set.width * 1.25)
        .attr("y", sec_bar_set.height * 0.8)
        .attr("font-size", "22px").attr("fill", "#004b62")
        .style("font-family", "Roboto Mono")
        .text("Global Sales")

    var plat_bar_x = d3.scaleLinear()
        .domain([0, d3.max(top5Platform, d => d.value) + 3])
        .range([0, sec_bar_set.width * 4 / 5])
    const bar_xAxisCall = d3.axisBottom(plat_bar_x)
    plat_originalaxis = group2.append("g")
        .style("font-size", "17px")
        .call(bar_xAxisCall)
        .attr("transform", 'translate(' + sec_bar_set.width * 99 / 100 + ', ' + sec_bar_set.height * 2 / 3 + ')')
    plat_originalaxis.selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("font-family", "Roboto Mono")
        .style("text-anchor", "end");

    // Y label
    var plat_bar_y = d3.scaleBand()
        .domain(top5Platform.map(d => d.name))
        .range([sec_bar_set.height * 2 / 3, 0])
    const bar_yAxisCall = d3.axisLeft(plat_bar_y)//.ticks(10)
    plat_originalaxisy = group2.append("g")
        .style("font-size", "17px")
        .style("font-family", "Roboto Mono")
        .call(bar_yAxisCall)
        .attr("transform", 'translate(' + sec_bar_set.width * 99 / 100 + ', ' + 0 + ')')
    plat_originalaxisy.selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("text-anchor", "end");

    Platform_bar_rects = group2.append("g").selectAll("rect")
        .data(top5Platform)
        .enter().append("rect")
        .attr("x", sec_bar_set.width * 99 / 100)
        .attr("y", d => plat_bar_y(d.name))
        .attr("width", d => plat_bar_x(d.value))
        .attr("height", 30)
        .style("fill", function (d, i) {
            return bar_color[i];
        })

}

function updatebar(bar, top5array, originalaxis, originalaxisy) {
    console.log(top5array)
    tmp = top5array.filter(d => d.name !== "" && d.value !== 0);

    const newbar_x = d3.scaleLinear()
        .domain([0, d3.max(top5array, d => d.value) + 3])
        .range([0, sec_bar_set.width * 2 / 3])
    const bar_xAxisCall = d3.axisBottom(newbar_x)
    var newbar_y = d3.scaleBand()
        .domain(tmp.map(d => d.name))
        .range([sec_bar_set.height * 2 / 3, 0])
    const bar_yAxisCall = d3.axisLeft(newbar_y)//.ticks(10)

    bar.exit().remove();

    bar = bar.data(top5array);
    bar.enter().append("rect")
        .attr("x", sec_bar_set.width * 99 / 100)
        .attr("height", 30)
        .style("fill", function (d, i) {
            return bar_color[i];
        })
        .merge(bar)
        .transition().duration(1000)
        .attr("y", d => newbar_y(d.name))
        .attr("width", d => newbar_x(d.value));
    originalaxis.transition().duration(1000).call(bar_xAxisCall)
    originalaxisy.transition().duration(1000).call(bar_yAxisCall)

    originalaxisy.selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
}

function sec_pie(data) {
    const group2 = svg2.append('g')
    //var pie_color = ["#4090dc", "#a3c5dc", "#5cc4c9", "#409079"]
    var pie_color = ['#d89079', '#5cc4c9', '#4090dc', '#d8b3ca']
    var pie_name = ['NA', 'EU', 'JP', 'Other']
    var arc = d3.arc().outerRadius(radius).innerRadius(0);
    var labelArc = d3.arc().outerRadius(radius + 100).innerRadius(radius + 20);
    var arcOver = d3.arc().outerRadius(radius + 30).innerRadius(0);

    //pie legend
    var pie_legend = group2.selectAll(".legend").data(pie_name)
        .enter().append("g").attr("class", "legend")
    //.attr("transform", 'translate(50, 30)');

    pie_legend.append("rect").attr("x", 0)
        .attr("y", function (d, i) {
            return i * 35 + sec_game_height / 5;
        })
        .attr("width", 30).attr("height", 10)
        .style("fill", function (d, i) {
            return pie_color[i];
        }).attr("transform", 'translate(0, 5)')

    pie_legend.append("text").attr("x", 40)
        .attr("y", function (d, i) {
            return i * 35 + sec_game_height / 5 + 20;
        })
        .style("font-size", `${sec_game_width * 0.02}`)
        .style("font-family", "Roboto Mono")
        .style("text-anchor", "start").attr("fill", "#004b62").text((d) => d)

    group2.append("text")
        .attr("x", sec_pie_set.width / 2)
        .attr("y", sec_pie_set.height - 50)
        .attr("font-size", "35px")
        .attr("text-anchor", "middle")
        .attr("font-family", "Century")
        .attr("fill", "#004b62")
        .attr("transform", 'translate(' + sec_pie_set.width / 18 + ', ' + - sec_pie_set.height * 0.15 + ')')
        .text("Sales Ratio")
        .style("font-family", "Roboto Mono")


    //pie chart
    //const radius = Math.min(sec_pie_set.width, sec_pie_set.height) / 2;

    pie_arcs = pie(SalesCounts);

    var labels = group2.selectAll("second-pie-label")
        .data(pie_arcs)
        .join("text")
        .attr("class", "second-pie-label")
        .attr("id", (d, i) => "label-text-" + i) // Assign a unique ID based on the index
        .attr("transform", function (d) {
            var pos = labelArc.centroid(d);
            var isLeftSide = pos[0] < 0;
            if (isLeftSide) {
                return `translate(${pos[0] + radius * 3},${pos[1] + 150})`;
            }
            else
                return `translate(${pos[0] + radius * 3.2}, ${pos[1] + 150})`;
        })
        .attr("dy", "0.35em")
        .attr("font-size", "20px")
        .style("visibility", "hidden")
        .text(d => `${(d.data / d3.sum(SalesCounts) * 100).toFixed(1)}%`);

    thePie = group2.selectAll("path").data(pie_arcs)
        .enter().append("path").attr("d", pie_arc)
        .attr("fill", (d, i) => {
            return pie_color[i];
        })
        .attr("transform", 'translate(' + (sec_pie_set.width / 3 + 100) + ', 150)')
        .on("mouseenter", function (event, d) {
            d3.select(this)
                .attr("stroke", "white")
                .attr("d", arcOver)
                .attr("stroke-width", 4);
            var index = pie_arcs.indexOf(d);
            console.log(index);
            group2.selectAll(".second-pie-label").style("visibility", "hidden");
            group2.selectAll("#label-text-" + index).style("visibility", "visible");
        })
        .on("mouseleave", function (d) {
            d3.select(this)
                .attr("d", pie_arc)
                .attr("stroke", "none");
            group2.selectAll(".second-pie-label").style("visibility", "hidden");

        })
        .each(function (d) {
            this._current = d;
        });

}

function updatePie(SalesCounts) {
    var labelArc = d3.arc().outerRadius(radius + 100).innerRadius(radius + 20);

    pie_arcs = pie(SalesCounts);
    thePie.data(pie_arcs);
    thePie.transition()
        .duration(1000)
        .attrTween("d", function (d) {
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                return pie_arc(interpolate(t));
            };
        });

    let percentage = d3.selectAll(".second-pie-label")
        .data(pie_arcs)
    percentage.transition().duration(1000)
        .attr("transform", function (d) {
            var pos = labelArc.centroid(d);
            var isLeftSide = pos[0] < 0;
            if (isLeftSide) {
                return `translate(${pos[0] + radius * 3},${pos[1] + 150})`;
            }
            else
                return `translate(${pos[0] + radius * 3.2}, ${pos[1] + 150})`;
        })
        .text(d => `${(d.data / d3.sum(SalesCounts) * 100).toFixed(1)}%`)
}