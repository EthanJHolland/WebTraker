function main(site){
    key=site.key
    console.log(key)
    chrome.storage.sync.get(key, (res)=>{
        res=res[key] //get to the data
        if(res && res.active){
            //make sure structure is setup properly
            if(!res.pages)res.pages={}
            if(!res.categories)res.categories={}
            console.log(res)

            //title
            var title=site.getTitle();
            if(!res.pages[title]){
                res.pages[title]=0
            }
            res.pages[title]+=1
    
            //categories
            var cats=site.getCategories();
            for(let cat of cats){
                if(!res.categories[cat]){
                    res.categories[cat]=0;
                }
                res.categories[cat]+=1;
            }
    
            //write out
            out={}; out[key]=res
            chrome.storage.sync.set(out)
        }
    })
}

function clearData(site){
    //clears all data - use with great caution
    console.log('data cleared')
    var key=site.key
    chrome.storage.sync.set({
        key:{
            'active': true,
            'pages': {},
            'categories': {}
        }
    });
}

var wikipedia = {
    key: "wikipedia",

    getTitle: function(){
        return document.getElementById('firstHeading').innerText
    },
   
    getCategories: function(){
        var catElements=document.getElementById('mw-normal-catlinks').getElementsByTagName('li');
        var cats=[];
        for(var i=0; i<catElements.length; i++){
            cats.push(catElements[i].innerText)
        }
        return cats;
    }
};

// chrome.storage.sync.remove('wikipedia')
// clearData()
main(wikipedia)