const storage = chrome.storage.local //use local storage

function main(site){
    const now = Date.now(); //use same time for all pages/cats

    //before doing anything, ensure site is active
    storage.get([activeKey(site)], (res)=>{
        if(res && res[activeKey(site)]){
            //extract information from site and build keys which need updating
            var keys = [];
            if(site.storeCats) {
                const cats=site.getCategories();
                keys = cats.map((cat) => hashKey(site,cat,false));
            }
            if(site.storePages){
                const page=site.getTitle();
                keys.push(hashKey(site,page,true)) //append key for the page title
            } 
            
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

//*** metadata manipulation ***// 
function activate(site){
    storage.set({[activeKey(site)]: true});
}

function deactivate(site){
    storage.set({[activeKey(site)]: false});
}

function getAllData(site){
    storage.get(null, (res) => console.log(res));
}

//NOTE: use with caution, this will clear all pages and categories associated with a given site
//this method does not alter the activation state for the site
function clearSiteData(site){
    storage.get(null, (res)=>{
        var keys = Object.keys(res).filter((key) => {
            return isHashKey(site, key, true) || isHashKey(site, key, false); //either a page or a cat
        })
        storage.remove(keys, () => console.log('[WT] data cleared'))
    });
}

//NOTE: use with caution, removes all data including activation data for all sites
function clearAllData(){
    storage.clear()
}

//*** summary extraction ***// 
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

//*** site objects ***/
const wikipedia = {
    key: 'wi',        //two letter key
    storePages: true, //should pages be tracked?
    storeCats: true,  //should categories be tracked?

    matchStrings : [ //regex strings indicating that a url is of the given site
        /^https?:\/\/.*\.wikipedia\.org\/wiki\.+//i
    ],

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

const stackexchange = {
    key: 'se',
    storePages: true,
    storeCats: true,

    matchStrings: [
        /^https?:\/\/.*\.stackexchange\.com\/questions\/.+/i,
        /^https?:\/\/.*\.stackoverflow\.com\/questions\/.+/i,
        /^https?:\/\/serverfault\.com\/questions\/.+/i,
        /^https?:\/\/superuser\.com\/questions\/.+/i,
        /^https?:\/\/askubuntu\.com\/questions\/.+/i,
        /^https?:\/\/stackapps\.com\/questions\/.+/i,
        /^https?:\/\/mathoverflow\.net\/questions\/.+/i
    ],

    getTitle: function(){
        var titleParts = document.title.split("- ")
        return titleParts[titleParts.length-1]
    },

    getCategories: function(){
        return document.getElementsByClassName('post-tag').map((tag) => tag.text);
    }
}

const quora = { //TODO: make quora work
    key: 'qu',
    storePages: false,
    storeCats: false,

    matchStrings: [/^https?:\/\/www\.quora\.com\/[^\/\s]+$/i],

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

const fivethirtyeight = {
    key: 'ft',
    storePages: false,
    storeCats: true,

    matchStrings: [/^https?:\/\/fivethirtyeight\.com\/features\/.+/i],

    getTitle: function(){},

    getCategories: function(){
        return document.getElementsByClassName('post-tag').map((tag) => tag.text)
    }
}

// const medium = { medium is very complicated due to sites like https://itnext.io/visual-studio-code-auto-compile-less-to-css-on-save-using-gulp-2fa15bc7d954
//     key: 'me',
//     storePages:  false,
//     storeCats: true,

//     getTitle: function(){},

//     getCategories: function(){
//         const ul = document.getElementsByClassName('tags')[0];
//         if(ul) return Array.from(ul.getElementsByTagName("li")).map((li) => li.innerText);
//         return []
//     }
// }

const sites = [wkipedia, stackexchange, quora, fivethirtyeight]; //a site must be in this array to be tracked

//*** main ***/
const url = window.location.toString(); //get url of current page
var found = false;
for(let site of sites){
    for(let matchString of site.matchStrings){
        if(matchString.test(url)){
            main(site); //extract information, update state, etc.
            found = true;
            break;
        }
    }
    if(found) break; //ensure that only one site gets called 
}