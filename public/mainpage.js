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