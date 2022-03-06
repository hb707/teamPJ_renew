# 팀프로젝트 (https://github.com/hb707/teamPJ) 개선 작업

### 개선사항
- 전체 코드를 pool.promise() 사용해 async,await로 코드 변경 (콜백헬 타파) 🔴
- DB 새로 짜기 🔴
- 댓글기능 추가 (CRUD, DB) ⭕️
- 검색기능 추가
- 스크랩기능 추가
- 작성글, 작성댓글, 스크랩글 모아보기
- 페이지 기능 다듬기
- ajax 이용해 아이디 중복체크, 댓글기능 만들기
- 회원가입 페이지 프론트 수정
- 최종 배포까지
- 로그인 방식 JWT로 변경 🔴

# 220228
- user/board 각각 따로였던 db스키마, db.js 파일을 하나로 합치기 
- 라우터와 미들웨어(controller.js) 파일 분리.
- async,await 사용한 코드로 전체 수정. 아래는 추가 수정이 필요한 곳
   - user/join POST
   - board/delete GET
   - admin/board POST
- sql문법 공부 : adminController.js의 62-65 줄, boardController.js 94-96줄 : 둘이 똑같은 쿼리문이고 똑같이 에러남 🤯 왜안되냐
- 댓글기능 추가. db 만들고 연결함. 근데 post날리면 db에 추가는 되는데 그 이후로 갑자기 에러남. 이유를 모르겠네 🤯🤯🤯
- 댓글 고치고 나면 수정 가능하도록 admin/replyUpdate 페이지도 넣어줄 예정


# 220302
- 코드 수정

# 220303
- 로그인 JWT 이용한 방식으로 변경.
   - 로그인, 사용자인증, 로그아웃, 게시판 Write&View
   - util 폴더에 jwt 파일 생성 : createJwt, verifyJWT, encoding, decoding, createSignature 함수
   - auth, menuChange 미들웨어 -> middleware 폴더 생성 후 모듈화하여 분리, jwt 이용방식으로 변경.
   - npm cookie-parser 이용
   - 회원가입시 생성되는 user 객체는 세션 그대로 유지. + welcome 페이지 라우터로 넘어간 뒤에 바로 세션 삭제되도록
- 댓글 CRUD
    - reply 라우터 새로 만듦 : write, like, edit, delete
    - write랑 like까지 라우터 완성
    - 댓글 css


# 220305
- 회원가입 페이지 아이디 중복체크 ajax로


### 해야할것
- 0228 작업 중 오류 나는 곳 수정
    - 삭제 시 DB의 인덱스 번호 고치는 쿼리문 공부하기
    - 게시글 삭제 시에 replydb에 있는 해당 글의 댓글도 함께 삭제해주도록 처리해주기


# 220306
- user/join 라우터 수정 : checkJoin 함수 수정 -> 정상작동