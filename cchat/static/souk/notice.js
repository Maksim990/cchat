function notice(text,num,val) {
    if(num == 1) { //info
        let div = document.createElement("div");div.style.display = "none";

        div.innerHTML =
        `<div class="alert alert-primary d-flex align-items-center" role="alert">
            <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Информация:" _mstaria-label="1634958"><use xlink:href="#info-fill"></use></svg>
            <div _msthash="1738425" _msttexthash="6694844">${text}</div>
        </div>`;

        div.style.display = "block";
        document.getElementById("vyv").appendChild(div);

        setTimeout(() => {
            div.classList.add("smoot2");
            setTimeout(() => div.style.display = "none",1000);
        },val*1000);
    };
    if(num == 2) { //success
        let div = document.createElement("div");div.style.display = "none";

        div.innerHTML =
        `<div class="alert alert-success d-flex align-items-center" role="alert">
            <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Успех:" _mstaria-label="642161"><use xlink:href="#check-circle-fill"></use></svg>
            <div _msthash="1738646" _msttexthash="18382312">${text}</div>
        </div>`;

        div.style.display = "block";
        document.getElementById("vyv").appendChild(div);

        setTimeout(() => {
            div.classList.add("smoot2");
            setTimeout(() => div.style.display = "none",1000);
        },val*1000);
    };
    if(num == 3) { //warn
        let div = document.createElement("div");div.style.display = "none";

        div.innerHTML =
        `<div class="alert alert-warning d-flex align-items-center" role="alert">
            <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Предупреждение:" _mstaria-label="2669056"><use xlink:href="#exclamation-triangle-fill"></use></svg>
            <div _msthash="1738867" _msttexthash="15601053">${text}</div>
        </div>`;

        div.style.display = "block";
        document.getElementById("vyv").appendChild(div);

        setTimeout(() => {
            div.classList.add("smoot2");
            setTimeout(() => div.style.display = "none",1000);
        },val*1000);
    };
    if(num == 4) {
        let div = document.createElement("div");div.style.display = "none";

        div.innerHTML =
        `<div class="alert alert-danger d-flex align-items-center" role="alert">
            <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Опасность:" _mstaria-label="1409512"><use xlink:href="#exclamation-triangle-fill"></use></svg>
            <div _msthash="1739088" _msttexthash="14934868">${text}</div>
        </div>`;

        div.style.display = "block";
        document.getElementById("vyv").appendChild(div);

        setTimeout(() => {
            div.classList.add("smoot2");
            setTimeout(() => div.style.display = "none",1000);
        },val*1000);
    };
    return null;
}