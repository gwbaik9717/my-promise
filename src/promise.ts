type MyPromiseStatus = "pending" | "fulfilled" | "rejected";

type Executor<T> = (
  resolve: (value: T) => void,
  reject: (reason: any) => void
) => void;
export class MyPromise<T> {
  private status: MyPromiseStatus;
  private onfulfilledQueue: ((value: T) => void)[];
  private onrejectedQueue: ((reason: any) => void)[];
  private value?: T;
  private reason?: any;

  constructor(executor: Executor<T>) {
    this.status = "pending";

    this.onfulfilledQueue = [];
    this.onrejectedQueue = [];

    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  private resolve(value: T) {
    this.status = "fulfilled";

    queueMicrotask(() => {
      while (this.onfulfilledQueue.length > 0) {
        const onfulfilled = this.onfulfilledQueue.shift();

        if (onfulfilled) {
          onfulfilled(value);
        }
      }
    });

    this.value = value;
  }

  private reject(reason: any) {
    this.status = "rejected";

    queueMicrotask(() => {
      while (this.onrejectedQueue.length > 0) {
        const onrejected = this.onrejectedQueue.shift();

        if (onrejected) {
          onrejected(reason);
        }
      }
    });

    this.reason = reason;
  }

  then(onfulfilled: (value: T) => void, onrejected: (reason: any) => void) {
    if (this.status === "pending") {
      this.onfulfilledQueue.push(onfulfilled);
      this.onrejectedQueue.push(onrejected);
    } else if (this.status === "fulfilled") {
      queueMicrotask(() => {
        onfulfilled(this.value as T);
      });
    } else {
      queueMicrotask(() => {
        onrejected(this.reason as T);
      });
    }

    return this;
  }

  catch(onrejected: (reason: any) => void) {
    this.onrejectedQueue.push(onrejected);

    return this;
  }
}

const promise = new Promise<string>((res, rej) => {
  res("abc");
});

promise.then().catch();
