var catElements=document.getElementById('mw-normal-catlinks').getElementsByTagName('li');
var cats=[];
for(var i=0; i<catElements.length; i++){
    cats.push(catElements[i].innerText)
}

var title=document.getElementById('firstHeading').innerText

console.log(cats)
console.log(title)