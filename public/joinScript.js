console.log("회원가입 페이지 입니다.")

const idCheckForm = document.querySelector('#idCheckForm')
const userId = document.querySelector('#userId')
const idCheckBtn = document.querySelector('#idCheckBtn')
const joinForm = document.querySelector('#joinForm')

idCheckForm.addEventListener('submit', submitHandler)

function submitHandler(e) {
    e.preventDefault()
    joinForm.preventDefault()
    console.log("ID중복확인 버튼 눌렀음")
} 