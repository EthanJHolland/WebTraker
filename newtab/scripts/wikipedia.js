const storage = chrome.storage.local //use local storage

function main(site){
    const now = Date.now(); //use same time for all pages/cats

    //before doing anything, ensure site is active
    storage.get([activeKey(site)], (res)=>{
        if(res && res[activeKey(site)]){
            //extract information from site
            const page=site.getTitle();
            const cats=site.getCategories();

            //get keys which need updating
            var keys = [];
            if(site.storeCats) keys = cats.map((cat) => hashKey(site,cat,false));
            if(site.storePages) keys.push(hashKey(site,page,true)) //append key for the page title
            
            //update value for each key
            for(let key of keys){
                storage.get([key], (res)=>{
                    var newCount; //update counter
                    if(res && res[key]){
                        //already exists
                        newCount = res[key].count+1;
                    }else{
                        //first visit
                        newCount = 1;
                    }
                    storage.set({[key]: {count: newCount, visited: now}})
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

function isHashKey(site, key, isPage){
    return key === hashKey(site, extractName(key), isPage) 
}

function extractName(key){
    return key.substring(key.indexOf('_')+1) //remove header
}

//*** site status manipulation ***// 
function activate(site){
    storage.set({[activeKey(site)]: true});
}

function deactivate(site){
    storage.set({[activeKey(site)]: false});
}

//*** top 10 extraction ***// 
function topN(site, n, isPages){
    if((isPages && site.storePages) ||(!isPages && site.storeCats)){
        storage.get(null, (res) => { //get all items
            const keys = Object.keys(res).filter((key) => isHashKey(site, key, isPages)) //extract keys of the type we are looking for
            keys.sort((a,b) => res[b].count - res[a].count); //works just like Java compareTo, note sorting in descending order
            const out = keys.slice(0,n).map((key) => extractName(key)) //get first n and make human readable
            console.log(out);
        });
    }
}

//*** recent 10 extraction ***//
function recentN(site, n, isPages){
    if((isPages && site.storePages) ||(!isPages && site.storeCats)){
        storage.get(null, (res) => { //get all items
            const keys = Object.keys(res).filter((key) => isHashKey(site, key, isPages)) //extract keys of the type we are looking for
            keys.sort((a,b) => res[b].visited - res[a].visited); //works just like Java compareTo, note smaller date is further in past
            const out = keys.slice(0,n).map((key) => extractName(key)) //get first n and make human readable
            console.log(out);
        });
    }
}

const wikipedia = {
    key: 'wi',        //two letter key
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

const stackexhange = {
    key: 'se',
    storePages: true,
    storeCats: true,

    getTitle: function(){
        var titleParts = document.title.split("- ")
        return titleParts[titleParts.length-1]
    },

    getCategories: function(){
        const tagElements = document.getElementsByClassName('post-tag');
        var tags=[]
        for(var i=0; i<tagElements.length; i++){
            tags.push(tagElements[i].text)
        }
        return tags
    }
}

const quora = { //TODO: make quora work
    key: 'qu',
    storePages: false,
    storeCats: false,

    getTitle: function(){},

    getCategories: function(){
        var moreLinks = document.getElementsByClassName("ViewMoreLink")
        if(moreLinks){
            moreLinks[0].getElementsByTagName('a')[0].click();
        }

        setTimeout(()=>{
            var topicElements=document.getElementsByClassName('TopicName')
            var topics=[]
            for(var i=0; i<topicElements.length; i++){
                topics.push(topicElements[i].innerText)
            }
        },100)
    }
}

// activate(wikipedia)
main(wikipedia)

// storage.get(null, function(items) {
//     var allKeys = Object.keys(items);
//     console.log(allKeys);
//     console.log(items)
// });

// storage.clear() //clear all stored data