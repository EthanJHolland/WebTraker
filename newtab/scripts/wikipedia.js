function main(site){
    //before doing anything, ensure site is active
    chrome.storage.local.get([activeKey(site)], (res)=>{
        if(res && res[activeKey(site)]){
            //extract information from site
            const page=site.getTitle();
            const cats=site.getCategories();


            //update page count and top 10
            const pageKey = hashKey(site,page,true)
            chrome.storage.local.get([pageKey], (res)=>{
                //update counters
                var newCount; //number of times page has been visited
                if(res && res[pageKey]){
                    //already exists
                    newCount = res[pageKey]+1;
                }else{
                    //first visit
                    newCount = 1;
                }
                chrome.storage.local.set({[pageKey]: newCount})
                
                //update top 10
                updateTopNth(site, page, newCount, 0) //start at smallest
            })

            //update most recent
            chrome.storage.local.get([recentCounterKey(site)], (counterRes)=>{
                //determine new counter
                var newCounter;
                if(counterRes && counterRes[recentCounterKey(site)]){
                    newCounter = (counterRes[recentCounterKey(site)]+1)%10;
                }else{
                    newCounter = 1; //arbitrarily start at 1
                }

                //write new counter
                chrome.storage.local.set({[recentCounterKey(site)]: newCounter})

                //write data to new counter location
                chrome.storage.local.set({[recentKey(site, newCounter)]: page})
            });
            
            //update count and top 10 for each category
            for(let cat of cats){
                catKey = hashKey(site,cat,false)
                chrome.storage.local.get([catKey], (res)=>{
                    //update counters
                    var newCount; //number of times page has been visited
                    if(res && res[catKey]){
                        //already exists
                        newCount = res[catKey]+1;
                    }else{
                        //first visit
                        newCount = 1;
                    }
                    chrome.storage.local.set({[catKey]: newCount})
                    
                    //update top 10
                    updateTopNth(site, cat, newCount, 0) //start at smallest
                })            
            }
        }else{
            console.log('[WT] site inactive')
        }
    })
}

//*** key manipulation ***//
function hashKey(site, name, isPage){
    if(isPage)return site.key+'pg'+'_'+name; //page
    return site.key+'ct'+'_'+name; //category
}

function activeKey(site){
    return site.key+'ia'
}

function recentCounterKey(site){
    return site.key+'rc'
}

function recentKey(site, n){
    return site.key+'re'+n
}

function topKey(site, n, isPage){
    if(isPage)return site.key+'pg'+'to'+n //page
    return site.key+'ct'+'to'+n //category
}

function extractName(key){
    return key.substring(key.indexOf('_')) //remove header
}

//*** site status manipulation ***// 
function activate(site){
    chrome.storage.local.set({[activeKey(site)]: true});
}

function deactivate(site){
    chrome.storage.local.set({[activeKey(site)]: false});
}

//*** update top 10 ***/
function updateTopNth(site, page, n){

}


//*** top 10 extraction ***// 
function top10(site, isPages){
    if((isPages && site.storePages) ||(!isPages && site.storeCats)) topNth(site, 0, isPages);
}

function topNth(site, n, isPage){
    if(n < 10){
        const key = topNthKey(site, n, isPages);
        chrome.storage.local.get([key], (res)=>{
            console.log(res[key])
            topNth(site, n+1, isPage) //recursively get next
        })
    }
}

//*** recent 10 extraction ***//
function recent10(site){ //recent only for pages
    if(site.storePages){
        chrome.storage.local.get([recentCounterKey(site)], (res)=>{
            const counter = res[recentCounterKey(site)]; //the most recent
            var stop = (counter - 1)%10; //the least recent
            recentNth(site, counter, stop)
        })
    }
}

function recentNth(site, n, stop){
    if(n!=stop){
        //have not yet reached stopping point
        const key = recentNthKey(site,n);
        chrome.storage.local.get([key], (res)=>{
            console.log(res[key])
            topNth(site, (n+1)%10, stop) //recursively get next
        })
    }
}

function clearData(site){
    //clears all data - use with great caution
    console.log('data cleared')
    var key=site.key
    chrome.storage.local.set({
        key:{
            'active': true,
            'pages': {},
            'categories': {}
        }
    });
    nk=key+'.active';
    chrome.storage.local.set({
        nk:{
            'active': true,
            'pages': {},
            'categories': {}
        }
    });

    chrome.storage.sync.get('nk', function(result) {
        console.log('Value currently is ' + result.nk);
    });

}

var wikipedia = {
    key: "wi",        //two letter key
    storePages: true, //should pages be tracked?
    storeCats: true,  //should categories be tracked?

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

// chrome.storage.local.remove('wikipedia')

// activate(wikipedia)
main(wikipedia)

chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);
    console.log(allKeys);
    console.log(items)
});