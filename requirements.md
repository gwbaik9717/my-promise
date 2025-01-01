### 기능 요구사항

- [x] Promise는 pending, fulfilled, rejected 의 상태를 가진다.
- [x] Promise의 기본 상태는 pending 이다.
- [x] Promise의 constructor 함수는 executor 함수를 인자로 받는다.
- [x] executor 함수는 resolve, reject 두 개의 콜백 함수를 인자로 받는다.
- [x] executor 함수는 constructor 함수가 실행될 때 즉시 실행된다.
- [x] resolve 함수를 호출하면 fulfilled 상태로 변경된다.
- [x] reject 함수를 호출하면 rejected 상태로 변경된다.
- [x] resolve, reject 함수는 인자로 아무 값이나 받을 수 있다.
- [ ] Promise의 상태가 fulfilled 이면 then 메소드의 콜백 함수가 실행된다.
- [ ] Promise의 상태가 rejected 이면 catch 메소드의 콜백 함수가 실행된다.
- [ ] then 메소드는 새로운 Promise를 반환한다.
