const userId = document.querySelector('#userId')
const idCheckBtn = document.querySelector('#idCheckBtn')
const msg = document.querySelector('#idCheckMsg')


idCheckBtn.addEventListener('click', clickHandler)

/* input 내에서 엔터키 눌렀을 때 중복확인되도록 하고싶음. 근데 form태그 submit으로 바로 넘어감.
userId.addEventListener('keyup', (e) => {
    if (e.keyCode == 13) {
        e.preventDefault()
        clickHandler(e)
    }
})
*/

function clickHandler(e) {
    const xhr = new XMLHttpRequest()
    const data = JSON.stringify({ userid: userId.value })

    // 서버로 request 보내기
    xhr.open('post', 'http://localhost:3000/user/idCheck', true)
    xhr.setRequestHeader('Content-type', 'application/json') //urlencoded대신 json으로 body
    xhr.send(data)

    // 서버에서 response 받기
    xhr.onreadystatechange = () => {
        try {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const { usedId } = JSON.parse(xhr.response)
                // 중복아이디가 있으면 , 없으면 0
                if (usedId) {
                    msg.innerHTML = '사용가능한 ID입니다'
                }
                else {
                    msg.innerHTML = '이미 사용 중인 ID입니다'
                }
            }
        }
        catch (error) { throw error }
    }




    // 중복아이디가 있으면 0, 없으면 1
} 