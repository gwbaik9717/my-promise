type MyPromiseStatus = "pending" | "fulfilled" | "rejected";

type Executor<T> = (
  resolve: (value: T) => void,
  reject: (reason: any) => void
) => void;
export class MyPromise<T> {
  private status: MyPromiseStatus;

  constructor(executor: Executor<T>) {
    this.status = "pending";

    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  private resolve(value: T) {
    this.status = "fulfilled";
  }

  private reject(reason: any) {
    this.status = "rejected";
  }
}
