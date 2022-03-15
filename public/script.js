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


