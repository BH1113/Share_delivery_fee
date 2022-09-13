let $foodList = { 'chicken': '치킨', 'korean': '한식', 'chFood': '중식', 'pizza': '피자/양식', 'pigfoot': '족발/보쌈', 'nigthFood': '야식', 'bunsik': '분식', 'cafe': '카페/디저트', 'asian': '아시안', 'donggas': '돈까스/회/일식', 'dosilak': '도시락/죽', 'bugger': '햄버거' };
let $img = { 'chicken': '/img/chicken.png', 'korean': '/img/korean.png', 'chFood': '/img/chFood.png', 'pizza': '/img/pizza.png', 'pigfoot': '/img/pigfoot.png', 'nigthFood': '/img/nigthFood.png', 'bunsik': '/img/bunsik.png', 'cafe': '/img/cafe.png', 'asian': '/img/asian.png', 'donggas': '/img/donggas.png', 'dosilak': '/img/dosilak.png', 'bugger': '/img/bugger.png' }
let $Food = function(name, url, img) {
    this.name = name;
    this.url = url;
    this.img = img;
}

let initFood = () => {
    let result = [];
    for (i = 0; i < Object.keys($foodList).length; i++) {
        result[i] = new $Food(Object.keys($foodList)[i], '/room', $img[Object.keys($foodList)[i]]);
    }
    return result;
}

let addFoodMenu = () => {
    let arr = initFood();
    let menu = document.createDocumentFragment();
    const foodMenu = document.querySelector('.container');
    for (let el of arr){
        let aEl = document.createElement('button');
        let divEl = document.createElement('div');
        let imgEl = document.createElement('img');
        aEl.dataset.id = el.name;
        imgEl.src = el.img;
        divEl.setAttribute('class', 'container-item');
        aEl.setAttribute('class', 'join-room');
        aEl.appendChild(imgEl);
        divEl.appendChild(aEl);
        menu.appendChild(divEl);
    }
    foodMenu.appendChild(menu);
}

let addFoodSidebar = () => {
    let arr = initFood();
    let menu = document.createDocumentFragment();
    const sideBar = document.querySelector('.side-menu');
    for (let el of arr) {
        let liEl = document.createElement('li');
        let aEl = document.createElement('a');
        let imgEl = document.createElement('img');
        aEl.dataset.id = el.name;
        imgEl.src = el.img;
        aEl.setAttribute('class', 'change-room');
        liEl.setAttribute('id', `${el.name}`);
        aEl.appendChild(imgEl);
        liEl.appendChild(aEl);
        menu.appendChild(liEl);
    }
    sideBar.appendChild(menu);
}

let changeFoodNameToKR = (el) => {
    return $foodList[el];
}

let transferTime = (time) => {
    let date = new Date(time);
    return date.getHours() + ':' + date.getMinutes();
}


let scrollToBottom = () => {
    const ele = document.querySelector("#chat-list");
    ele.scrollTop = ele.scrollHeight - ele.clientHeight;
}