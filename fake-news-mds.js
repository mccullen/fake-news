var APP = APP || {};
//APP.completeFile = "complete.csv";
APP.completeFile = "fake-data.csv";
APP.fakeFill = "red";
APP.trustworthyFill = "green";
APP.unknownFill = "blue";
// Plot table.
APP.plotComplete = async function () {
    //APP.loadTable().then(plot);
    APP.table = APP.table || await getTable();

    async function getTable() {
        var p = new Promise(async function (resolve, reject){
            var result = await d3.csv(APP.completeFile);
            result = result.map(function(d) {
                return {
                    Title: d.Title,
                    Author: d.Author,
                    AdvertisementCount: Number(d.AdvertisementCount),
                    CapitalWordTitle: Number(d.CapitalWordTitle),
                    Description: d.Description,
                    EmotionalLanguage: Number(d.EmotionalLanguage),
                    FullTextLength: Number(d.FullTextLength),
                    NumberAuthor: Number(d.NumberAuthor),
                    NumberOfQuotes: Number(d.NumberOfQuotes),
                    PotentialFake: Number(d.PotentialFake),
                    Text: d.Text,
                    TextLength: Number(d.TextLength),
                    TotalSentiment: Number(d.TotalSentiment),
                    URL: d.URL,
                    UpdatedDate: Number(d.UpdatedDate)
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
//Title,Text,Description,Author,URL,AdvertisementCount,UpdatedDate,PotentialFake,NumberAuthor,TitleLength,TextLength,FullTextLength,CapitalWordTitle,NumberOfQuotes,TotalSentiment,EmotionalLanguage
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
        var tooltip = d3.select('body').append('div') .attr("class","tooltip").style("color", "blue");

        var graph = TableToGraph();  // See docs below about graph data structure.
        console.log(graph);  // See graph contents in browser console.

        // Set up the D3 Force layout.
        // Simulation will compute 2D locations of vertices as graph.vertices[i].x and .y
        var simulation = d3.forceSimulation(graph.vertices)
            .force("spring", d3.forceLink(graph.edges).distance(edge => 5*(edge.distance+30))
                // Set various useful properties of the forceLink here...
                // Hint: give .distance() an appropriate function.

                )
            // What other forces would be useful here?
            .force("repel", d3.forceManyBody())
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

        function ticked() {
            d3.select("svg").selectAll("circle")
                .data(graph.vertices)
                    .attr("cx", node => node.x)
                    .attr("cy", node => node.y)
                .enter().append("circle")
                    //.attr("r", d => scale(d.Born))
                    .attr("r", d => textLengthScale(d.FullTextLength))
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
                        //d3.select("#details").html("Name: " + d.Name + ", Shoe Size: " + d.Shoe);
                        tooltip.style('opacity', .9)
                        tooltip.html('<p>' + "test" + '</p>' );
                    })
                    .on("mouseout", function (d, i) {
                        d3.select(this).classed("highlight", false);
                        //tooltip.style('opacity', 0);
                    })
                    .on("click", (d, i) => {
                        console.log("clicked");
                        // todo: display content in modal
                    })
                    .on("mousemove", function (d, i) {
                        tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").style("color","blue");
                    });

            // Make text labels for dots:
            d3.select("svg").selectAll("text")
                .data(graph.vertices)
                    .attr("x", node => node.x)
                    .attr("y", node => node.y)
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
            updateDate: updateDate || " ",
            persist: persist || false
        };
        console.log(article);
        $("#add-article-modal").modal("hide");
        $.post("", article).done(jsonResponse => {
            console.log(jsonResponse);
            /*
            article = {
                Title: "title",
                Author: "Author",
                AuthorTrustworthiness: "AT",
                Description: "Desc",
                EmotionalLanguage: 100,
                QuoteFrequency: 4.5,
                Time: 3,
                AdvertisementCount: 3,
                URL: "TEST",
                UpdatedDate: "500000"
            };
            APP.addArticle(article);
            */
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