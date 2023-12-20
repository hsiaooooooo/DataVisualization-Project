const line={
    width:1800, 
    height:800
};
const svg3=d3.select("#second-row-container").append("svg")
            .attr("width", line.width).attr("height", line.height);



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


d3.csv("vgsales.csv").then(data =>{
    preprocess(data);//console.log(data)
    processLine(data);//console.log(Globaldata)
    
    const group3=svg3.append('g').attr("transform", 'translate('+100+', '+(-30)+')')
    //x
    group3.append("text")
                .attr("x", line.width/2 )
                .attr("y", line.height-30)
                .attr("font-size", "50px").attr("fill", "#004b62")
                .text("Year").attr("transform", 'translate('+0+', '+(30)+')')

    var line_x = d3.scaleLinear()
                .domain([1980, 2016])
                .range([0, line.width-80])
    const line_xAxisCall = d3.axisBottom(line_x).ticks(37)
    plat_originalaxis=group3.append("g").call(line_xAxisCall)
                .attr("transform", 'translate('+0+', '+(line.height-80)+')')
    //y
    group3.append("text")
                    .attr("x", -(line.height / 2))
                    .attr("y", -40)
                    .attr("font-size", "20px")
                    .attr("text-anchor", "middle")
                    .attr("transform", "rotate(-90)")
                    .text("Count").attr("fill", "black")
    const line_y = d3.scaleLinear()
                    .domain([0, d3.max(Globaldata, d=>d)])
                    .range([line.height-80, 0])
    const line_yAxisCall = d3.axisLeft(line_y).ticks(10)
    group3.append("g").call(line_yAxisCall)//.attr("transform", 'translate('+100+', '+(0)+')')
    
    var color=['#d89079', '#5cc4c9', '#4090dc', '#d8b3ca', '#d8b579']

    //console.log(NAdata)

    const linee = d3.line()
        .x((d, i) => line_x(i+1980))
        .y(d => line_y(d));

    // Draw the line
    naline=group3.append('path')
        .data([NAdata])
        .attr('d', linee)
        .attr('fill', 'none')
        .attr('stroke', color[0]).attr('stroke-width', 5)
        //.attr("transform", 'translate('+100+', '+(-100)+')')

    euline=group3.append('path')
        .data([EUdata])
        .attr('d', linee)
        .attr('fill', 'none')
        .attr('stroke', color[1]).attr('stroke-width', 5)
    
    jpline=group3.append('path')
        .data([JPdata])
        .attr('d', linee)
        .attr('fill', 'none')
        .attr('stroke', color[2]).attr('stroke-width', 5)

    otherline=group3.append('path')
        .data([Otherdata])
        .attr('d', linee)
        .attr('fill', 'none')
        .attr('stroke', color[3]).attr('stroke-width', 5)

    globalline=group3.append('path')
        .data([Globaldata])
        .attr('d', linee)
        .attr('fill', 'none')
        .attr('stroke', color[4]).attr('stroke-width', 5)



})



function processLine(data)
{
    data.forEach(d => {
        //console.log(d.Year)
        if(d.Year>=1980 && d.Year<=2016)
        {
            NAdata[d.Year-1980]+=d.NA_Sales;
            EUdata[d.Year-1980]+=d.EU_Sales;
            JPdata[d.Year-1980]+=d.JP_Sales;
            Otherdata[d.Year-1980]+=d.Other_Sales;
            Globaldata[d.Year-1980]+=d.Global_Sales;
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