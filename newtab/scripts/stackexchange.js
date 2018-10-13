var titleParts = document.title.split("- ")
const title = titleParts[titleParts.length-1]
var tagElements = document.getElementsByClassName('post-tag');
var tags=[]
for(var i=0; i<tagElements.length; i++){
    tags.push(tagElements[i].text)
}