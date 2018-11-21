var APP = APP || {};
//APP.completeFile = "Fake-news-original.csv";
APP.completeFile = "Fake-news-original-with-nonEnglish.csv";
//APP.completeFile = "fake-data.csv";
APP.fakeFill = "red";
APP.trustworthyFill = "green";
APP.unknownFill = "blue";
//APP.distanceFactor = 50;
//APP.translate = 0;
APP.distanceFactor = 50;
APP.translate = 0;
// Plot table.
APP.plotComplete = async function () {
    APP.table = APP.table || await getTable();

    async function getTable() {
        var p = new Promise(async function (resolve, reject){
            var result = await d3.csv(APP.completeFile);
            result = result.map(function(d) {
                return {
                    Title: d.Title,
                    Author: d.Author,
                    Text: d.Text,
                    Description: d.Description,
                    URL: d.URL,
                    AdvertisementCount: Number(d.AdvertisementCount || 0),
                    UpdatedDate: Number(d.UpdatedDate),
                    PotentialFake: Number(d.PotentialFake),
                    NumberAuthor: Number(d.NumberAuthor || 0),
                    TitleLength: Number(d.TitleLength),
                    FullTextLength: Number(d.FullTextLength),
                    TextLength: Number(d.TextLength),
                    CapitalWordTitle: Number(d.CapitalWordTitle),
                    NumberOfQuotes: Number(d.NumberOfQuotes),
                    Title_sentiment: Number(d.Title_sentiment),
                    Text_sentiment: Number(d.Text_sentiment),
                    Description_sentiment: Number(d.Description_sentiment),
                    EmotionalLanguage: Number(d.EmotionalLanguage || 0)
                };
            });
            resolve(result);
        });
        return p;
    }
    console.log(APP.table);
    plot();

    function plot() {
        if (!APP.datatable) {
            $(document).ready(function() {
                APP.datatable = $("#raw-data").DataTable({
                    data: APP.table,
                    columns: [
                        { 
                            data: "Author",
                            title: "Author"
                        },
                        { 
                            data: "URL",
                            title: "URL"
                        },
                        { 
                            data: "NumberOfQuotes",
                            title: "Quote Frequency"
                        },
                        { 
                            data: "EmotionalLanguage",
                            title: "Emotional Language Frequency"
                        },
                        { 
                            data: "NumberAuthor",
                            title: "Number of Authors"
                        },
                        { 
                            data: "UpdatedDate",
                            title: "Updated Date"
                        },
                        { 
                            data: "AdvertisementCount",
                            title: "Advertisement Count"
                        },
                        { 
                            data: "Title",
                            title: "Title"
                        }
                    ]
                });
            });
        }
        var tooltip = d3.select('body').append('div') .attr("class","tooltip").style("color", "blue")
            .style("background-color", "white").style("border", "1px solid black");

        var graph = TableToGraph();  // See docs below about graph data structure.
        console.log(graph);  // See graph contents in browser console.

        // Set up the D3 Force layout.
        // Simulation will compute 2D locations of vertices as graph.vertices[i].x and .y
        var simulation = d3.forceSimulation(graph.vertices)
            .force("spring", d3.forceLink(graph.edges).distance(edge => APP.distanceFactor*(edge.distance + APP.translate))
                // Set various useful properties of the forceLink here...
                // Hint: give .distance() an appropriate function.

                )
            // What other forces would be useful here?
            //.force("repel", d3.forceManyBody())
            .force("center", d3.forceCenter(400,300))
            .on("tick", ticked);

        //var scale = d3.scaleLinear().domain([250, 16000]).range([5, 20]);
        var sentiments = APP.table.map(function(d) {
            return Number(d.TotalSentiment);
        });
        var sentimentScale = d3.scaleLinear().domain([d3.min(sentiments), d3.max(sentiments)]).range([5, 20]);
        var textLengths = APP.table.map(function(d) {
            return Number(d.FullTextLength);
        });
        console.log(d3.min(textLengths));
        console.log(d3.max(textLengths));
        var textLengthScale = d3.scaleLinear().domain([d3.min(textLengths), d3.max(textLengths)]).range([5, 50]);

        /*
        var svg = d3.select("svg");
        svg.attr("width", "100%").attr("height", "100%");
        svg.call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform);
        })).append("g");
        */
        function ticked() {
            d3.select("svg").selectAll("circle")
                .data(graph.vertices)
                    .attr("cx", node => node.x)
                    .attr("cy", node => node.y)
                .enter().append("circle")
                    .attr("class", function(d, i) {
                        var classes = "points ";
                        if (d.addedByUser) {
                            classes += "user-point";
                        }
                        return classes;
                    })
                    .attr("r", d => textLengthScale(d.FullTextLength || 0))
                    .attr("fill", function (d, i) {
                        var result = APP.unknownFill;
                        if (d.PotentialFake === 1) {
                            result = APP.fakeFill;
                        } else if (d.PotentialFake === 0) {
                            result = APP.trustworthyFill;
                        }
                        return result;
                    })
                    .on("mouseover", function (d, i) {
                        d3.select(this).classed("highlight", true);
                        tooltip.style('opacity', .9);
                        var author = d.Author;
                        var maxlen = 100;
                        tooltip.html(`
                        <div><b>Advertisement Count:</b> ${d.AdvertisementCount}</div>
                        <div><b>Author:</b> ${author}</div>
                        <div><b>Description:</b> ${d.Description}</div>
                        <div><b>Description sentiment:</b> ${d.Description_sentiment}</div>
                        <div><b>Emotional Language Frequency:</b> ${d.EmotionalLanguage}</div>
                        <div><b>Full Text Length:</b> ${d.FullTextLength}</div>
                        <div><b>Number Of Quotes:</b> ${d.NumberOfQuotes}</div>
                        <div><b>Text:</b> ${d.Text.substring(0, maxlen)}...</div>
                        <div><b>Text sentiment:</b> ${d.Text_sentiment}</div>
                        <div><b>Title:</b> ${d.Title}</div>
                        <div><b>Title sentiment:</b> ${d.Title_sentiment}</div>
                        `);
                    })
                    .on("mouseout", function (d, i) {
                        d3.select(this).classed("highlight", false);
                        tooltip.style('opacity', 0).style("top", "-100000000px");
                    })
                    .on("click", (d, i) => {

                        console.log("clicked");
                        $("#details-ad-count").text(d.AdvertisementCount);
                        $("#details-author").text(d.Author);
                        $("#details-description").text(d.Description);
                        $("#details-description-sent").text(d.Description_sentiment);
                        $("#details-el-freq").text(d.EmotionalLanguage);
                        $("#details-full-text-len").text(d.FullTextLength);
                        $("#details-n-quotes").text(d.NumberOfQuotes);
                        $("#details-text").text(d.Text);
                        $("#details-text-len").text(d.TextLength);
                        $("#details-text-sent").text(d.Text_sentiment);
                        $("#details-title").text(d.Title);
                        $("#details-title-2").text(d.Title);
                        $("#details-title-sent").text(d.Title_sentiment);
                        $("#details-modal").modal("show");
                    })
                    .on("mousemove", function (d, i) {
                        tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").style("color","blue");
                    });

            // Make text labels for dots:
            d3.select("svg").selectAll("text")
                .data(graph.vertices)
                    .attr("x", node => node.x)
                    .attr("y", node => node.y)
                    .attr("class", "small")
                    .text(node => node.URL)
                .enter().append("text");
        }


        ////////////// Completed Code - no need to edit ///////////////

        // Create data structure for a complete (all pairs) weighted graph from a csv table.
        // table = array of n rows, as read by d3.csvParse().
        // Returns graph object where:
        //	graph.vertices = array of n vertices, each vertex is dict of attr:value pairs from data table.
        //  graph.edges = array of n(n-1)/2 edges, where each edge contains:
        //		edge.source, edge.target = references to vertex objects in graph.vertices.
        //		edge.distance = Distance(source, target).
        //  graph.attrs = array of attribute names in the table, not including "Name".
        //  graph.norms = dict of zscore normalization factors for each attribute, for Distance().
        function TableToGraph() {
            var selectedAttributes = $(".attribute-selection input:checked")
                .map(function() {
                    return this.value;
                }).get();
            var graph = {'vertices':APP.table, 'edges':[], 'norms':{}, 'attrs': selectedAttributes};
            // Compute zscore norms for each attribute:
            for (var attr of graph.attrs)
                graph.norms[attr] = d3.deviation(APP.table, row => row[attr]);
            // Compute all-pairs edges as array of {source:ref, target:ref, distance:value}
            APP.table.forEach( (src, isrc) =>
                APP.table.forEach( (dst, idst) => {
                    if(isrc < idst)	 // no duplicate edges
                        graph.edges.push( {'source': src, 'target': dst, 'distance': Distance(src,dst,graph.norms)} );
            }));
            return graph;
        }

        // Distance metric, computes normalized high-dimensional distance between 2 rows in the table.
        // r1, r2 = references to row (vertex) objects.
        // norms = the attribute zscore normalization factors.
        function Distance(r1, r2, norms) {
            return d3.sum(Object.keys(norms).map(attr =>
                    Math.abs(r1[attr] - r2[attr]) / norms[attr] ));  // L1
            //return Math.sqrt(d3.sum(Object.keys(norms).map(attr =>
            //		Math.pow((r1[attr] - r2[attr])/norms[attr], 2)))); // L2
        }
    }
}
APP.plotComplete();
$(document).ready(function() {
    $("#submit-article-btn").on("click", event => {
        var title = $("#article-title").val();
        var text = $("#article-text").val();
        var description = $("#article-description").val();
        var author = $("#article-author").val();
        var url = $("#article-url").val();
        var adCount = $("#article-ad-count").val();
        var updateDate = new Date($("#article-update-date").val()).getTime();
        var persist = $("#article-persist").prop("checked");
        var article = {
            title: title || " ",
            text: text || " ",
            description: description || " ",
            author: author || " ",
            url: url || " ",
            adCount: adCount || 0,
            updateDate: updateDate || 0,
            persist: persist || false
        };
        console.log(article);
        $("#add-article-modal").modal("hide");
        $.post("", article).done(jsonResponse => {
            console.log(jsonResponse);
           jsonResponse.Text = jsonResponse.text;
           jsonResponse.Author = jsonResponse.author;
           jsonResponse.Description = jsonResponse.description;
           jsonResponse.Title = jsonResponse.title;
           jsonResponse.AdvertisementCount = jsonResponse.ad_count;
           jsonResponse.UpdatedDate = jsonResponse.updated_date;
           jsonResponse.URL = jsonResponse.url;
           jsonResponse.EmotionalLanguage = jsonResponse.EmotionalLanguage || 0;
           jsonResponse.NumberAuthor = jsonResponse.NumberAuthor || 0;
           jsonResponse.addedByUser = true;
           APP.addArticle(jsonResponse);
        });
    });

    $(".attribute-selection input").on("click", event => {
        APP.plotComplete();
    });
});


APP.addArticle = function (article) {
    APP.table.push(article);
    APP.datatable.row.add(article).draw();
    APP.plotComplete();
};