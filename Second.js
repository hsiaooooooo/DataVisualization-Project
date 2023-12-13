
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
            .attr("width", sec_game_width).attr("height", sec_game_height);

function sec_pie(data)
{

}

var GenreCounts = {};
var keys;
var SalesCounts=[0, 0, 0, 0];

d3.csv("vgsales.csv").then(data =>{
    preprocess(data);
    processPie(data);//console.log(SalesCounts);
    processGenre(data);//console.log(GenreCounts)
    keys = Object.keys(GenreCounts);//console.log(keys);
    sec_donut(data, keys);
    sec_pie(data);


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

function processGenre(data){
    data.forEach(function(item){
        if(GenreCounts.hasOwnProperty(item.Genre))
        {
            GenreCounts[item.Genre]++;
        }
        else{
            GenreCounts[item.Genre]=1;
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
                    return i*35;
                })
                .attr("width", 30).attr("height", 30)
                .style("fill", function (d, i) {
                    return donut_color[i]
                })
                .attr("transform", 'translate(0, '+sec_donut_set.height*2/3+')')

    donut_legend.append("text").attr("x", 40)
                .attr("y", function(d, i){
                    return i*35+20;
                })
                .style("text-anchor", "start").attr("fill", "#004b62").text((d) => d)
                .attr("transform", 'translate(0, '+sec_donut_set.height*2/3+')')


    group2.append("text")
            .attr("x", sec_donut_set.width / 2)
            .attr("y",sec_donut_set.height-50)
            .attr("font-size", "50px")
            .attr("text-anchor", "middle")
            .attr("font-family", "Century")
            .attr("fill", "#004b62")
            .attr("transform", 'translate('+sec_donut_set.width/2+', ' + sec_donut_set.height*2/3 + ')')
            .text("Genre")
    
    //pie chart
    //const radius = Math.min(sec_donut_set.width, sec_donut_set.height) / 2;
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
                    .attr("transform", 'translate('+sec_donut_set.width+', ' + sec_donut_set.height*3/2 + ')');


}
function sec_bar(data)
{

}

function sec_pie(data)
{
    const group2 = svg2.append('g')
    var pie_color = ["#4090dc", "#a3c5dc", "#5cc4c9", "#409079"]
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
            .attr("transform", 'translate('+sec_pie_set.width/2+', 0)')
            .text("Sales Ratio")
    
    //pie chart
    //const radius = Math.min(sec_pie_set.width, sec_pie_set.height) / 2;
    const radius=100;
    const pie = d3.pie();
    const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);
                
    const arcs = pie(SalesCounts);
    var thePiet=group2.selectAll("path").data(arcs)
                    .enter().append("path").attr("d", arc)
                    .attr("fill", (d, i) => {
                        return pie_color[i];
                    })
                    .attr("transform", 'translate('+sec_pie_set.width+', 100)');

}
