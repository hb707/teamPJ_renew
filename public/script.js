// 로고 로딩 효과
const logotr = document.querySelector("#logotr")
let idx = 0;


const moveLogo = () => {
    if (idx > 12) {
        clearInterval(interval)
    }
    logotr.classList.add(`on${idx}`)
    idx++
}

const interval = setInterval(moveLogo, 300)




// 스크롤 시 헤더에 밑줄
const header = document.querySelector("#header");
const headerHeight = header.getBoundingClientRect().height;

window.addEventListener("scroll", () => {
    if (window.scrollY > headerHeight / 2) {
        header.setAttribute("class", "background");
    } else {

        header.setAttribute("class", "");
    }
});



// 버튼 클릭 시 해당하는 사람의 div로 슬라이드
const btn1 = document.querySelector('#btn1');
const btn2 = document.querySelector('#btn2');
const btn3 = document.querySelector('#btn3');
const btn4 = document.querySelector('#btn4');
const btn5 = document.querySelector('#btn5');

const slide = document.querySelector('#slideDiv > ul')

let count = 1;

const changeSlide = (count) => {
    slide.setAttribute("class", `sliding${count}`)
}

btn1.addEventListener('click', () => { changeSlide(1) })
btn2.addEventListener('click', () => { changeSlide(2) })
btn3.addEventListener('click', () => { changeSlide(3) })
btn4.addEventListener('click', () => { changeSlide(4) })
btn5.addEventListener('click', () => { changeSlide(5) })