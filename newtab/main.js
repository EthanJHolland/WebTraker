function main(){
    chrome.storage.sync.get('wikipedia', (res)=>{
        res=res.wikipedia; //extract wanted data
        console.log(res)
        if(res && res.active){
            console.log(topN(res.pages,5))
            console.log(topN(res.categories,5))
            treeMap(res.categories)
        }
    })
}

function topN(dict,n){
    // Create items array
    var items = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
    });
    
    // Sort the array based on the second element
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    
    // Create a new array with only the first 5 items
    return items.slice(0,n);
}

function treeMap(dict){
    //convert dict to needed format
    children=[]
    Object.keys(dict).forEach((key)=>{
        children.push({name: key, value: dict[key]})
    });

    var data = [{children: children}];
    
    // create a chart and set the data
    chart = anychart.treeMap(data, "as-tree");

    // configure labels
    chart.labels().useHtml(true);
    chart.labels().format(function(){
        return "<span style='font-weight:bold'>"+this.name+"</span>";
    });

    // configure tooltips
    chart.tooltip().format(function() {
        return "Pages in this category: "+this.value;
    });
    
    // set the container id
    chart.container("container");
    
    // initiate drawing the chart
    chart.draw();
}

main();