function main(){
    chrome.storage.sync.get('wikipedia', (res)=>{
        res=res.wikipedia; //extract wanted data
        console.log(res)
        if(res && res.active){
            console.log(topN(res.pages,5))
            console.log(topN(res.categories,5))
            fillList(topN(res.pages,5))
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
    return items.slice(0,n).map((a)=>a[0]);
}

//based on https://stackoverflow.com/questions/247483/http-get-request-in-javascript
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(JSON.parse(anHttpRequest.responseText));
        }

        anHttpRequest.open("GET", aUrl, true);            
        anHttpRequest.send( null );
    }
}

function fillList(articles){
    var client = new HttpClient();
    for(var i=0; i<articles.length; i++){
        ((index) => {
            client.get('https://en.wikipedia.org/api/rest_v1/page/summary/'+articles[index], (wiki_response) => {
                document.getElementById('title'+index).textContent=wiki_response.title;
            if(wiki_response.thumbnail){
                    document.getElementById('image'+index).src=wiki_response.thumbnail.source;
            }
                document.getElementById('desc'+index).innerHTML=wiki_response.extract_html;
        });
        })(i);
    }
}

main();