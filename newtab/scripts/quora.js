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