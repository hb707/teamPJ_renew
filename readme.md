# 팀프로젝트 (https://github.com/hb707/teamPJ) 개선 작업

### 개선사항
- 전체 코드를 pool.promise() 사용해 async,await로 코드 변경 (콜백헬 타파) 🔴
- DB 새로 짜기 🔴
- 댓글기능 추가 (CRUD, DB) ⭕️
- 검색기능 추가
- 스크랩기능 추가
- 작성글, 작성댓글, 스크랩글 모아보기
- 페이지 기능 다듬기
- ajax 이용해 아이디 중복체크 🔴, 댓글기능 만들기
- 회원가입 페이지 프론트 수정
- 최종 배포까지
- 로그인 방식 JWT로 변경 🔴 -> 패스포트 사용해서 타사인증 방식 추가하기

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
- join 페이지에 id중복체크 ajax로 추가
   - 이상하게 작동해서 찾아보니까 form 안에는 form을 쓰면 안된다고 한다. 한페이지에 form태그는 하나만 작동함.
   - 이 부분을 form > input type="submit" 대신 그냥 button으로 하고 각각을 DOM으로 js에서 처리해줌
   - ❗️input에서 id 입력하고 엔터키 누르면 keyup 이벤트로 중복체크 되도록 하고 싶었는데 바로 form태그 처리로 넘어감. 문제 해결 해주기

# 220308
- 지금 막힌 부분이 글 삭제한 경우에 
    - boarddb에서 해당 글 삭제 후 인덱스 재정렬 🔴해결완료
    - replydb에서 해당 글 인덱스(bidx)로 있는 댓글 모두 삭제 후 변경된 글 번호로 다른 댓글들의 bidx 변경하기
- 이렇게 처리해줘야 되는데 이걸 어떻게 해야 하는지 잘 모르겠다.
- 지금 에러나는 상황이 터미널에서 mysql을 켜서 sql 쿼리문을 그대로 입력하면 제대로 실행되는데, 서버에서 통신으로 쿼리를 날리면 에러가 뜬다.
- 삭제하는건 되는데 인덱스 재정렬하는 쿼리에서 에러가 남. 근데 mysql 켜서 직접입력하면 됨. 뭐지... warning이 뜨긴 한다.
- Setting user variables within expressions is deprecated and will be removed in a future release. Consider alternatives: 'SET variable=expression, ...', or 'SELECT expression(s) INTO variables(s)'.
- 뭐가 문제인거지....?
- ❗️ 코드를 한번에 쓰지 않고 하나씩 나눠서 쓰니까 에러 없이 잘 된다!
- 근데 예전에 했던 팀플에서는 한번에 쿼리를 날려도 잘 됐는데 무슨 차이지?? 전에는 promise 안써서 그런가???

# 220310
- 글 삭제 시 댓글 삭제 : update replydb set bidx=bidx-1 where bidx>${index}
- 이걸로 번호를 재정렬함.
- 관리자페이지에서 한번에 여러개의 게시물을 삭제 할 때 좀 이상해서 나중에 수정해줘야함❗️


# 220312
- 로그인에 패스포트 적용해보기 : passport jwt, facebook, google
- 댓글 ajax 방식으로 변경
- 나중에 로그인도 ajax로 변경해보기

# 220314 - 15
- 게시판 리스트 페이지 비동기적으로 구현하기
- 페이징 기능 url 이동 없이 작동하게