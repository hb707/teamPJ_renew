# 팀프로젝트 (https://github.com/hb707/teamPJ) 개선 작업
- 프로젝트 발표 후 다른 팀들이 구현한 기능을 참고 삼아서 작고 귀여운 우리 프로젝트 사이트를 개선해보려고 한다

### 추가할 기능
- 전체 코드를 pool.promise() 사용해 async,await로 코드 변경 (콜백헬타파) ⭕️
- DB 새로 짜기
- 댓글기능 추가 (CRUD, DB)
- 검색기능 추가
- 스크랩기능 추가
- 작성글, 작성댓글, 스크랩글 모아보기
- 페이지 기능 다듬기
- ajax 이용해 아이디 중복체크, 댓글기능 만들기
- 회원가입 페이지 프론트 수정
- 최종 배포까지


# 220228
- user/board 각각 따로였던 db스키마, db.js 파일을 하나로 합치기 
- 라우터와 미들웨어(controller.js) 파일 분리.
- async,await 사용한 코드로 전체 수정. 아래는 추가 수정이 필요한 곳
   - user/join POST
   - board/delete GET
   - admin/board POST
- sql문법 공부 : adminController.js의 62-65 줄, boardController.js 94-96줄 : 같은 sql문이고 같이 에러남 🤯 왜안되냐
