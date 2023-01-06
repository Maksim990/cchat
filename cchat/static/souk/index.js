function shadeColor(color, percent) {
    let R = parseInt(parseInt(color.substring(1,3),16) * (100 - percent) / 100),
        G = parseInt(parseInt(color.substring(3,5),16) * (100 - percent) / 100),
        B = parseInt(parseInt(color.substring(5,7),16) * (100 - percent) / 100);
    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;
    let RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16)),
        GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16)),
        BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    return "#"+RR+GG+BB;
}

//RGB - изменение фона для чата
const colorizeButton = document.getElementById("colorizeButton");
const colorizeMenu = document.getElementById("colorizeMenu");
const colorize = document.getElementsByClassName("colorize");

colorizeButton.addEventListener("click", (e) => {
    e.preventDefault();
    for(let key = 0; key < colorize.length; key++) {
        let list = colorize[key].classList[0];
        console.log(list);
        if(list == "chatInput" || list == "colorizeMenu-") {
            colorize[key].style.backgroundColor = shadeColor(colorizeMenu.value, 50);
        } else {
            colorize[key].style.backgroundColor = colorizeMenu.value;
        }
    }
});
/*
 var parentDOM = document.getElementById("parent-id");

        var test=parentDOM.getElementsByClassName("test");//test is not target element
        console.log(test);//HTMLCollection[1]

        var testTarget=parentDOM.getElementsByClassName("test")[0];//hear , this element is target
        console.log(testTarget);//<p class="test">hello word2</p>

const a = document.getElementById('vyv');
const a1 = document.getElementById('vyv1');
const a2 = document.getElementById('vyv2');
const a3 = document.getElementById('vyv3');
a.style.display = "none";
a1.style.display = "none";
a2.style.display = "none";
a3.style.display = "none";
/*
setTimeout(() => {
    a.style.display = "block";
},5000);
submitFormPicker.addEventListener("click",function(event){
    event.preventDefault();
    for(var z=0;z<massiveGreen.length;z++){
        massiveGreen[z].style.backgroundColor = picker.value;
    }
});
*/