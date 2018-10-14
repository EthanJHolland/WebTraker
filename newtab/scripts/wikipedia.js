function main(){
    chrome.storage.sync.get('wikipedia', (res)=>{
        res=res.wikipedia //get to the data
        console.log(res)
        if(res && res.active){
            //make sure structure is setup properly
            if(!res.pages)res.pages={}
            if(!res.categories)res.categories={}

            //title
            var title=getTitle();
            if(!res.pages[title]){
                res.pages[title]=0
            }
            res.pages[title]+=1
    
            //categories
            var cats=getCategories();
            for(let cat of cats){
                if(!res.categories[cat]){
                    res.categories[cat]=0;
                }
                res.categories[cat]+=1;
            }
    
            //write out
            chrome.storage.sync.set({wikipedia:res})
        } 
        console.log(res)
    })
}

function getTitle(){
     return document.getElementById('firstHeading').innerText
}

function getCategories(){
    var catElements=document.getElementById('mw-normal-catlinks').getElementsByTagName('li');
    var cats=[];
    for(var i=0; i<catElements.length; i++){
        cats.push(catElements[i].innerText)
    }
    return cats;
}

function clearData(){
    //clears all data - use with great caution
    console.log('data cleared')
    chrome.storage.sync.set({
        'wikipedia':{
            'active': true,
            'pages': {},
            'categories': {}
        }
    });
}

// chrome.storage.sync.remove('wikipedia')
// clearData()
main()