var dropMenu = d3.select("#selDataset")
d3.json("samples.json").then(function (alien){
    console.log(alien.names)
    alien.names.forEach( function (alienloop) {
        dropMenu.append("option").text(alienloop)
        .property("value")
    })
    optionChanged(alien.names[0])
});

function optionChanged(inputdata) {
    d3.json("samples.json").then(function (sampledata){
       console.log(sampledata.metadata)
       var alienfilter = sampledata.metadata.filter(alienmeta => alienmeta.id == inputdata)
       var filterinfo = alienfilter[0]
        var samplemeta = d3.select("#sample-metadata") //referencing demographic info
        //clear the list
        samplemeta.html("")
        Object.entries(filterinfo).forEach(([key,value]) => {
            var appendmeta = samplemeta.append("p")
            appendmeta.text(`${key}-${value}`)
        })
        //building the charts
        console.log(sampledata.samples)
        var sampleinfo = sampledata.samples
        //filtering samples
        var filtersample = sampleinfo.filter(sampleid => sampleid.id == inputdata)
        var initialsample = filtersample[0]
        // creating the bar charts (x-axis & y-axis)
        var xvalue = initialsample.sample_values.slice(0,10).reverse()
        var yvalue = initialsample.otu_ids.slice(0,10).reverse().map(topids => (`otu ids: ${topids}`))
        var textlabels = initialsample.otu_labels.slice(0,10).reverse()

        //creating trace

        var trace1 = {
            x: xvalue,
            y: yvalue,
            text: textlabels,
            type: "bar",
            orientation: "h"

          };
          
          // The data array consists of trace1
          var data = [trace1];
          
          // Note that we omitted the layout object this time
          // This will use default parameters for the layout
          Plotly.newPlot("bar", data);

          //creating bubble chart
          var bubbletrace = {
              x: initialsample.otu_ids,
              y: initialsample.sample_values,
              text: initialsample.otu_labels,
              mode: "markers",
              marker: {
                  color: initialsample.otu_ids,
                  size: initialsample.sample_values
              }
              
          }
        // The data array consists of bubble trace
           var data = [bubbletrace];
          
           // Note that we omitted the layout object this time
           // This will use default parameters for the layout
           Plotly.newPlot("bubble", data);

    })
}
