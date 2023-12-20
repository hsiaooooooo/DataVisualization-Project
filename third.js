const line={
    width:1800, 
    height:800
};
const svg3=d3.select("#second-row-container").append("svg")
            .attr("width", line.width).attr("height", line.height);

d3.csv("vgsales.csv").then(data =>{
    preprocess(data);console.log(data)

    const group3=svg3.append('g').attr("transform", 'translate('+0+', '+(0)+')')
    //x
    group3.append("text")
                .attr("x", line.width/2 )
                .attr("y", line.height-30)
                .attr("font-size", "50px").attr("fill", "#004b62")
                .text("Year")

    var line_x = d3.scaleLinear()
                .domain([1980, 2016])
                .range([0, line.width-80])
    const line_xAxisCall = d3.axisBottom(line_x).ticks(37)
    plat_originalaxis=group3.append("g").call(line_xAxisCall)
                .attr("transform", 'translate('+100+', '+(line.height-100)+')')
    //y
    group3.append("text")
                    .attr("x", -(line.height / 2))
                    .attr("y", -40)
                    .attr("font-size", "20px")
                    .attr("text-anchor", "middle")
                    .attr("transform", "rotate(-90)")
                    .text("Count").attr("fill", "black")
    const line_y = d3.scaleLinear()
                    .domain([0, d3.max(data, d=>d.Global_Sales)])
                    .range([line.height-80, 0])
    const line_yAxisCall = d3.axisLeft(line_y).ticks(10)
    group3.append("g").call(line_yAxisCall).attr("transform", 'translate('+100+', '+(0)+')')



})

