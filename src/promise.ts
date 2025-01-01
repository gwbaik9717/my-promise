type MyPromiseStatus = "pending" | "fulfilled" | "rejected";

type Executor = (
  resolve: (...args: any[]) => any,
  reject: (...args: any[]) => any
) => void;
export class MyPromise {
  private status: MyPromiseStatus;

  constructor(executor: Executor) {
    this.status = "pending";

    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  private resolve() {}

  private reject() {}
}
