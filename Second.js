
const sec_parentContainer = d3.select("#chart-area2");

const sec_game_width = sec_parentContainer.node().getBoundingClientRect().width;
const sec_game_height = sec_parentContainer.node().getBoundingClientRect().height;

const sec_pie_set={
    width:sec_game_width/2, 
    height:sec_game_height/2
};
const sec_donut_set={
    width:sec_game_width/2, 
    height:sec_game_height/2
};
const sec_bar_set={
    width:sec_game_width/2, 
    height:sec_game_height/2
};

const svg2=d3.select("#chart-area2").append("svg")
            .attr("width", sec_game_width).attr("height", 800);

function sec_pie(data)
{

}

var GenreCounts = {};
var Genrekeys;
var SalesCounts=[0, 0, 0, 0];
var PublisherCounts = {};
var Publisherkeys;
var PlatformCounts = {};
var PlatformKeys;

const top5Publisher=[];
const top5Platform=[];

d3.csv("vgsales.csv").then(data =>{
    preprocess(data);
    processPie(data);//console.log(SalesCounts);
    processData(data);//console.log(GenreCounts)
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
    //console.log(data)
}

function processData(data){
    data.forEach(function(item){
        if(GenreCounts.hasOwnProperty(item.Genre))
        {
            GenreCounts[item.Genre]++;
        }
        else{
            GenreCounts[item.Genre]=1;
        }

        if(PublisherCounts.hasOwnProperty(item.Publisher))
        {
            PublisherCounts[item.Publisher]+=item.NA_Sales;
            PublisherCounts[item.Publisher]+=item.EU_Sales;
            PublisherCounts[item.Publisher]+=item.JP_Sales;
            PublisherCounts[item.Publisher]+=item.Other_Sales;
        }
        else{
            PublisherCounts[item.Publisher]=0;
            PublisherCounts[item.Publisher]+=item.NA_Sales;
            PublisherCounts[item.Publisher]+=item.EU_Sales;
            PublisherCounts[item.Publisher]+=item.JP_Sales;
            PublisherCounts[item.Publisher]+=item.Other_Sales;
        }

        if(PlatformCounts.hasOwnProperty(item.Platform))
        {
            PlatformCounts[item.Platform]+=item.NA_Sales;
            PlatformCounts[item.Platform]+=item.EU_Sales;
            PlatformCounts[item.Platform]+=item.JP_Sales;
            PlatformCounts[item.Platform]+=item.Other_Sales;
        }
        else{
            PlatformCounts[item.Platform]=0;
            PlatformCounts[item.Platform]+=item.NA_Sales;
            PlatformCounts[item.Platform]+=item.EU_Sales;
            PlatformCounts[item.Platform]+=item.JP_Sales;
            PlatformCounts[item.Platform]+=item.Other_Sales;
        }
    })
}


function processPie(data)
{
    data.forEach(function(d){
        SalesCounts[0]+=d.NA_Sales;
        SalesCounts[1]+=d.EU_Sales;
        SalesCounts[2]+=d.JP_Sales;
        SalesCounts[3]+=d.Other_Sales;
    })
}

function top5(top5array, data, keys)
{
    top5array.length = 0; 
    
    var dataArray = Object.keys(data).map(function(key) {
        return {
            name: key,
            value: data[key]
        };
    });

    dataArray.sort(function(a, b) {
        return b.value - a.value;
    });
    top5array.push.apply(top5array, dataArray.slice(0, 5));
    top5array.sort(function(a, b) {
        return a.value - b.value;
    });
}


function sec_donut(data, keys)
{
    const group2 = svg2.append('g')
    var donut_color = ["#d8b3ca", "#da9ada", "#a290db", "#5d6a84", "#5d6ac9", "#4090dc", 
                        "#a3c5dc", "#5cc4c9", "#409079", "#779079", "#d8b579", "#d89079"]
    
    //donut legend
    var donut_legend = group2.selectAll(".legend").data(keys)
                    .enter().append("g").attr("class", "legend")
                    //.attr("transform", 'translate(50, 30)');
    
    donut_legend.append("rect").attr("x", 0)
                .attr("y", function(d, i){
                    return i*25;
                })
                .attr("width", 30).attr("height", 10)
                .style("fill", function (d, i) {
                    return donut_color[i]
                })
                .attr("transform", 'translate(0, '+(sec_donut_set.height+20)+')')

    donut_legend.append("text").attr("x", 40)
                .attr("y", function(d, i){
                    return i*25+10;
                })
                .style("text-anchor", "start").attr("fill", "#004b62").text((d) => d)
                .attr("transform", 'translate(0, '+(20+sec_donut_set.height)+')')


    group2.append("text")
            .attr("x", sec_donut_set.width / 2)
            .attr("y",sec_donut_set.height-50)
            .attr("font-size", "50px")
            .attr("text-anchor", "middle")
            .attr("font-family", "Century")
            .attr("fill", "#004b62")
            .attr("transform", 'translate('+(sec_donut_set.width/40)+', ' + (sec_donut_set.height+30) + ')')
            .text("Genre")
    
    //pie chart
    const radius=80;
    const pie = d3.pie();
    const arc = d3.arc()
                .innerRadius(110)
                .outerRadius(radius);

    var genre=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    genre.forEach(function(d, i){
        genre[i]=GenreCounts[keys[i]];
    })
                
    const arcs = pie(genre);
    var theDonut=group2.selectAll("path").data(arcs)
                    .enter().append("path").attr("d", arc)
                    .attr("fill", (d, i) => {
                        return donut_color[i];
                    })
                    .attr("transform", 'translate('+(sec_donut_set.width/3+100)+', ' + (sec_donut_set.height+150) + ')');

}



function sec_bar_pub(data)
{
    const group2=svg2.append('g')

    var bar_color=['#d89079', '#5cc4c9', '#4090dc', '#d8b3ca', '#d8b579'];
    //X label
    group2.append("text")
                .attr("x", sec_bar_set.width+120 )
                .attr("y",sec_bar_set.height-30)
                .attr("font-size", "50px")
                .text("Sales").attr("fill", "#004b62")

    const bar_x = d3.scaleLinear()
                .domain([0, d3.max(top5Publisher, d=>d.value)])
                .range([0, sec_bar_set.width*2/3])
    const bar_xAxisCall = d3.axisBottom(bar_x)
    group2.append("g").call(bar_xAxisCall)
                .attr("transform", 'translate('+sec_bar_set.width*99/100+', '+sec_bar_set.height*2/3+')')
    // Y label
    const bar_y = d3.scaleBand()
                .domain(top5Publisher.map(d=>d.name))
                .range([sec_bar_set.height*2/3, 0])
    const bar_yAxisCall = d3.axisLeft(bar_y).ticks(10)
    group2.append("g").call(bar_yAxisCall)
                .attr("transform", 'translate('+sec_bar_set.width*99/100+', '+0+')')

    var bar_rects=group2.append("g").selectAll("rect")
                .data(top5Publisher)
                .enter().append("rect")
                .attr("x", sec_bar_set.width*99/100)
                .attr("y", d => bar_y(d.name))
                .attr("width", d=> bar_x(d.value))
                .attr("height", 30)
                .style("fill", function (d, i) {
                    return bar_color[i];
                })
                //.attr("transfrom", 'translate(0, '+sec_bar_set.height+')')


}

function sec_bar_plat(data)
{
    const group2=svg2.append('g').attr("transform", 'translate('+0+', '+(sec_bar_set.height)+')')

    var bar_color=['#d89079', '#5cc4c9', '#4090dc', '#d8b3ca', '#d8b579'];
    //X labeld89079
    group2.append("text")
                .attr("x", sec_bar_set.width+120 )
                .attr("y",sec_bar_set.height-30)
                .attr("font-size", "50px").attr("fill", "#004b62")
                .text("Sales")

    const bar_x = d3.scaleLinear()
                .domain([0, d3.max(top5Platform, d=>d.value)])
                .range([0, sec_bar_set.width*2/3])
    const bar_xAxisCall = d3.axisBottom(bar_x)
    group2.append("g").call(bar_xAxisCall)
                .attr("transform", 'translate('+sec_bar_set.width*99/100+', '+sec_bar_set.height*2/3+')')
    // Y label
    const bar_y = d3.scaleBand()
                .domain(top5Platform.map(d=>d.name))
                .range([sec_bar_set.height*2/3, 0])
    const bar_yAxisCall = d3.axisLeft(bar_y).ticks(10)
    group2.append("g").call(bar_yAxisCall)
                .attr("transform", 'translate('+sec_bar_set.width*99/100+', '+0+')')

    var bar_rects=group2.append("g").selectAll("rect")
                .data(top5Platform)
                .enter().append("rect")
                .attr("x", sec_bar_set.width*99/100)
                .attr("y", d => bar_y(d.name))
                .attr("width", d=> bar_x(d.value))
                .attr("height", 30)
                .style("fill", function (d, i) {
                    return bar_color[i];
                })

}

function sec_pie(data)
{
    const group2 = svg2.append('g')
    //var pie_color = ["#4090dc", "#a3c5dc", "#5cc4c9", "#409079"]
    var pie_color = ['#d89079', '#5cc4c9', '#4090dc', '#d8b3ca']
    var pie_name=['NA', 'EU', 'JP', 'Other']
    
    //pie legend
    var pie_legend = group2.selectAll(".legend").data(pie_name)
                    .enter().append("g").attr("class", "legend")
                    //.attr("transform", 'translate(50, 30)');
    
    pie_legend.append("rect").attr("x", 0)
                .attr("y", function(d, i){
                    return i*35;
                })
                .attr("width", 30).attr("height", 30)
                .style("fill", function (d, i) {
                    return pie_color[i];
                })

    pie_legend.append("text").attr("x", 40)
                .attr("y", function(d, i){
                    return i*35+20;
                })
                .style("text-anchor", "start").attr("fill", "#004b62").text((d) => d)

    group2.append("text")
            .attr("x", sec_pie_set.width / 2)
            .attr("y",sec_pie_set.height-50)
            .attr("font-size", "50px")
            .attr("text-anchor", "middle")
            .attr("font-family", "Century")
            .attr("fill", "#004b62")
            .attr("transform", 'translate('+sec_pie_set.width/12+', '+(-10)+')')
            .text("Sales Ratio")
    
    //pie chart
    //const radius = Math.min(sec_pie_set.width, sec_pie_set.height) / 2;
    const radius=100;
    const pie = d3.pie();
    const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);
                
    const arcs = pie(SalesCounts);
    var thePie=group2.selectAll("path").data(arcs)
                    .enter().append("path").attr("d", arc)
                    .attr("fill", (d, i) => {
                        return pie_color[i];
                    })
                    .attr("transform", 'translate('+(sec_pie_set.width/3+100)+', 100)');

    var tip = d3.tip().attr('class', 'd3-tip').html((d) => (pie_name[d.index]))
    group2.call(tip);
    thePie.on('mouseover', tip.show).on('mouseout', tip.hide);
}
