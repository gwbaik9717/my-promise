type MyPromiseStatus = "pending" | "fulfilled" | "rejected";

type Executor<T> = (
  resolve: (value: T) => void,
  reject: (reason: any) => void
) => void;
export class MyPromise<T> {
  private status: MyPromiseStatus;
  private onfulfilledQueue: ((value: T) => void)[];
  private onrejectedQueue: ((reason: any) => void)[];

  constructor(executor: Executor<T>) {
    this.status = "pending";

    this.onfulfilledQueue = [];
    this.onrejectedQueue = [];

    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  private resolve(value: T) {
    this.status = "fulfilled";
  }

  private reject(reason: any) {
    this.status = "rejected";
  }

  then(onfulfilled: (value: T) => void, onrejected: (reason: any) => void) {
    this.onfulfilledQueue.push(onfulfilled);
    this.onrejectedQueue.push(onrejected);
  }

  catch(onrejected: (reason: any) => void) {
    this.onrejectedQueue.push(onrejected);
  }
}

const promise = new Promise<string>((res, rej) => {
  res("abc");
});

promise.then().catch();
