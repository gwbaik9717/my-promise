### Promise 구현하기

이 프로젝트는 JavaScript의 내장 `Promise` 객체를 직접 구현한 코드로, 비동기 처리, 클로저, this 바인딩 등의 원리를 학습하기 위해 진행하였습니다.

#### 주요 원리

**1. Promise의 상태 관리**

`Promise` 는 세 가지 상태를 가집니다:

- `pending`: 초기 상태로, 비동기 작업이 아직 완료되지 않은 상태.
- `fulfilled`: 비동기 작업이 성공적으로 완료된 상태.
- `rejected`: 비동기 작업이 실패한 상태.

`MyPromise`는 `status` 라는 프로퍼티를 통해 현재 상태를 관리합니다. `resolve`와 `reject` 메서드는 상태를 `fulfilled` 또는 `rejected` 로 변경하며, 이를 통해 상태 전환을 제어합니다.

**2. 클로저**

- 클로저는 `MyPromise` 체이닝이 가능하도록 돕는 핵심 요소입니다. 각 체이닝 단계에서 새로운 `MyPromise` 를 반환하면서, 클로저는 이전 `MyPromise` 의 상태와 값을 유지해 다음 핸들러로 전달합니다.
- 예를 들어, `then` 메서드에서 등록된 `onfulfilled`와 `onrejected` 핸들러는 클로저를 통해 이전 상태(`value` 또는 `reason`)에 접근하며, 이를 기반으로 새로운 결과를 계산하거나 처리합니다.

**3. this 바인딩**

- `resolve`와 `reject` 메서드는 생성자에서 `executor` 함수에 전달되며, 명시적으로 `this` 를 바인딩해야 합니다.
- 그 이유는 `resolve` 와 `reject` 메서드가 `executor` 함수 내부에서 호출될 때 `메서드가 아닌 함수로 호출`되기 때문에, `this` 가 전역객체를 가리키는 문제를 해결하기 위함입니다.

```typescript
executor(this.resolve.bind(this), this.reject.bind(this));
```

**4. 비동기 처리**

- ES2019의 `queueMicrotask` 를 사용해 비동기 처리를 구현했습니다
- `queueMicrotask` 는 마이크로태스크 큐에 작업을 추가하는 함수로, `then` 또는 `catch` 메서드가 호출되면 마이크로태스크 큐에 해당 핸들러를 추가하여 비동기 처리를 보장합니다.
