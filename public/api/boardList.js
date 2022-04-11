document.addEventListener('DOMCOntentLoaded', init())

async function init() {

    const trElement = document.querySelector('#boardList').innerHTML
    const pgElement = document.querySelector('#pageList').innerHTML
    const pageBtnDiv = document.querySelector('#pageBtnDiv')

    // 1. axios로 백엔드에서 board db 가져오기
    const response = await axios.post('/api/board/list', {
        withCredentials: true
    })
    const errorFlag = response.data.errno // 나중에 에러 처리 해주기
    const Nodes = response.data.result
    const totalRecord = response.data.totalRecord

    const viewArticle = 10 // 한 화면에 보일 게시물 수
    const blockArticle = 10 // 한번에 보이는 페이지버튼 개수
    const totalPage = Math.ceil(totalRecord / viewArticle)
    const totalBlock = Math.ceil(totalPage / blockArticle)

    // 초기값 : 페이지1, 페이징블럭1
    let currentBlock = 1
    let currentPage = 1


    // 버튼 렌더링 이벤트
    const BtnDivEvent = (currentBlock) => {
        if (currentBlock > totalBlock) { currentBlock = totalBlock }
        if (currentBlock < 1) { currentBlock = 1 }
        let pageTemplate = ''
        for (let i = currentBlock * 10 - 9; i <= currentBlock * 10; i++) {
            if (i >= 1 && i <= totalPage) { pageTemplate += pgElement.replace('{pNum}', i).replace('{pNum}', i) }
            pageBtnDiv.innerHTML = pageTemplate
        }
        const pageArr = document.querySelectorAll('.pNum')
        pageArr.forEach((v, i) => {
            v.addEventListener('click', () => {
                currentPage = v.innerHTML;
                ListEvent(currentPage)
            })
        })
    }


    // 리스트 렌더링 이벤트
    const ListEvent = (currentPage) => {
        let str = ''
        Nodes.slice(currentPage * 10 - 10, currentPage * 10).forEach(v => {
            str += trElement.replace('{idx}', v.idx)
                .replace('{idx}', v.idx)
                .replace('{subject}', v.subject)
                .replace('{nickname}', v.nickname)
                .replace('{date}', v.date)
                .replace('{hit}', v.hit)
        })
        const tbody = document.querySelector('tbody')
        tbody.innerHTML = str
    }


    BtnDivEvent(currentBlock)
    ListEvent(currentPage)


    // 페이징 버튼 변경 함수
    const nextBtn = document.querySelector('#nextBtn')
    const prevBtn = document.querySelector('#prevBtn')

    nextBtn.addEventListener('click', () => {
        currentBlock += 1
        if (currentBlock > totalBlock) { currentBlock = totalBlock }
        BtnDivEvent(currentBlock)
    })

    prevBtn.addEventListener('click', () => {
        currentBlock -= 1
        if (currentBlock < 1) { currentBlock = 1 }
        BtnDivEvent(currentBlock)
    })

}