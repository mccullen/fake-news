var APP = APP || {};
//APP.completeFile = "complete.csv";
APP.completeFile = "fake-data.csv";
APP.plotComplete = function () {
    d3.csv(APP.completeFile).then(plot);

    function plot(table) {
        $("#raw-data").dataTable({
            data: table,
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
                    data: "QuoteFrequency",
                    title: "Quote Frequency"
                },
                { 
                    data: "EmotionalLanguage",
                    title: "Emotional Language Frequency"
                },
                { 
                    data: "AuthorTrustworthiness",
                    title: "Author Trustworthiness"
                },
                { 
                    data: "UpdatedDate",
                    title: "Updated Date"
                },
                { 
                    data: "Title",
                    title: "Title"
                }
            ]
        });


        var graph = TableToGraph(table);  // See docs below about graph data structure.
        console.log(graph);  // See graph contents in browser console.

        // Set up the D3 Force layout.
        // Simulation will compute 2D locations of vertices as graph.vertices[i].x and .y
        var forces = d3.forceSimulation(graph.vertices)
            .force("spring", d3.forceLink(graph.edges).distance(edge => 10*(edge.distance+30))
                // Set various useful properties of the forceLink here...
                // Hint: give .distance() an appropriate function.

                )
            // What other forces would be useful here?
            .force("repel", d3.forceManyBody())
            .force("center", d3.forceCenter(400,300))
            .on("tick", ticked);

        //var scale = d3.scaleLinear().domain([250, 16000]).range([5, 20]);

        function ticked() {
            d3.select("svg").selectAll("circle")
                .data(graph.vertices)
                    .attr("cx", node => node.x)
                    .attr("cy", node => node.y)
                .enter().append("circle")
                    //.attr("r", d => scale(d.Born))
                    .attr("r", 5)
                    .on("mouseover", function (d, i) {
                            d3.select(this).classed("highlight", true);
                            //d3.select("#details").html("Name: " + d.Name + ", Shoe Size: " + d.Shoe);
                    })
                    .on("mouseout", function (d, i) {
                            d3.select(this).classed("highlight", false);
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
        function TableToGraph(table) {
            APP.table = APP.table || table;
            var graph = {'vertices':table, 'edges':[], 'norms':{}, 'attrs':Object.keys(table[0])};
            graph.attrs.splice(graph.attrs.indexOf('Name'), 1);  //remove "Name"
            // Compute zscore norms for each attribute:
            for (var attr of graph.attrs)
                graph.norms[attr] = d3.deviation(table, row => row[attr]);
            // Compute all-pairs edges as array of {source:ref, target:ref, distance:value}
            table.forEach( (src, isrc) =>
                table.forEach( (dst, idst) => {
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