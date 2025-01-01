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

  then(
    onfulfilled?: (value: T) => T | undefined,
    onrejected?: (reason: any) => any
  ) {
    return new MyPromise((resolve, reject) => {
      if (this.status === "pending") {
        if (onfulfilled) {
          this.onfulfilledQueue.push(onfulfilled);
        }

        if (onrejected) {
          this.onrejectedQueue.push(onrejected);
        }
      } else if (this.status === "fulfilled") {
        queueMicrotask(() => {
          if (onfulfilled) {
            const value = onfulfilled(this.value as T);
            resolve(value);
          } else {
            resolve(undefined);
          }
        });
      } else {
        queueMicrotask(() => {
          if (onrejected) {
            const reason = onrejected(this.reason as T);
            reject(reason);
          } else {
            reject(undefined);
          }
        });
      }
    });
  }

  catch(onrejected: (reason: any) => void) {
    if (this.status === "pending") {
      this.onrejectedQueue.push(onrejected);
    } else if (this.status === "rejected") {
      queueMicrotask(() => {
        onrejected(this.reason as T);
      });
    }

    return this;
  }
}

const promise = new Promise<string>((resolve, reject) => {}).then();
