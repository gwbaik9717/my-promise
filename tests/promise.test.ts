import { describe, expect, test } from "@jest/globals";
import { MyPromise } from "../src/promise";

describe("unit test for promise", () => {
  test("Promise는 초기에 pending 상태이다.", () => {
    const promise = new MyPromise<number>((resolve, reject) => {});

    expect(promise.getStatus()).toBe("pending");
  });

  test("resolve 를 호출하면 Promise 의 상태는 fulfilled 로 변경된다.", () => {
    const promise = new MyPromise<string>((resolve, reject) => {
      resolve("dummys");
    });

    expect(promise.getStatus()).toBe("fulfilled");
  });

  test("reject 를 호출하면 Promise 의 상태는 rejected 로 변경된다.", () => {
    const promise = new MyPromise<string>((resolve, reject) => {
      reject(new Error("Dummy Error"));
    });

    expect(promise.getStatus()).toBe("rejected");
  });

  test("resolve 가 동기적으로 호출되었을 때 then 의 onfulfilled 콜백이 실행된다.", () => {
    const resolved = "answer";

    new MyPromise<string>((resolve, reject) => {
      resolve(resolved);
    }).then((value) => {
      expect(value).toBe(resolved);
    });
  });

  test("resolve 가 비동기적으로 호출되었을 때 then 의 onfulfilled 콜백이 실행된다.", () => {
    const resolved = "answer";

    new MyPromise<string>((resolve, reject) => {
      setTimeout(() => {
        resolve(resolved);
      }, 1000);
    }).then((value) => {
      expect(value).toBe(resolved);
    });
  });

  test("then 이 여러 개 체이닝 되었을 때 각각의 onfulfilled 가 순차적으로 실행된다.", () => {
    const resolved1 = "answer1";
    const resolved2 = "ansewr2";

    new MyPromise<string>((resolve, reject) => {
      setTimeout(() => {
        resolve(resolved1);
      }, 1000);
    })
      .then((value) => {
        expect(value).toBe(resolved1);
        return resolved2;
      })
      .then((value) => {
        expect(value).toBe(resolved2);
      });
  });

  test("reject 가 동기적으로 호출되었을 때 catch 의 onrejected 콜백이 실행된다.", () => {
    const rejected = new Error("Dummy Error");

    new MyPromise<string>((resolve, reject) => {
      reject(rejected);
    }).catch((reason) => {
      expect(reason).toBe(rejected);
    });
  });

  test("reject 가 비동기적으로 호출되었을 때 reject 의 onrejected 콜백이 실행된다.", () => {
    const rejected = new Error("Dummy Error");

    new MyPromise<string>((resolve, reject) => {
      setTimeout(() => {
        reject(rejected);
      }, 1000);
    }).catch((reason) => {
      expect(reason).toBe(rejected);
    });
  });

  test("catch 가 여러 개 체이닝 되었을 때 각각의 onrejected 가 순차적으로 실행된다.", () => {
    const rejected1 = new Error("Dummy Error");
    const rejected2 = new Error("Dummy Error2");

    new MyPromise<string>((resolve, reject) => {
      setTimeout(() => {
        reject(rejected1);
      }, 1000);
    })
      .catch((reason) => {
        expect(reason).toBe(rejected1);

        throw rejected2;
      })
      .catch((reason) => {
        expect(reason).toBe(rejected2);
      });
  });

  test("catch 와 then 이 번갈아가면서 체이닝 되었을 때 onrejected 의 return 값이 존재하면, return 값을 resolve 한다.", () => {
    const resolved = "answer";
    const rejected = new Error("Dummy Error");

    new MyPromise<string>((resolve, reject) => {
      setTimeout(() => {
        reject(rejected);
      }, 1000);
    })
      .catch((reason) => {
        expect(reason).toBe(rejected);

        return resolved;
      })
      .then((value) => {
        expect(value).toBe(resolved);
      });
  });

  test("then 의 onfulfilled 콜백을 실행할 때 에러가 발생하면, catch 로 에러가 전달된다.", () => {
    const resolved = "answer";
    const rejected = new Error("Dummy Error");

    new MyPromise<string>((resolve, reject) => {
      setTimeout(() => {
        resolve(resolved);
      }, 1000);
    })
      .then((value) => {
        expect(value).toBe(resolved);

        throw rejected;
      })
      .catch((reason) => {
        expect(reason).toBe(rejected);
      });
  });
});
