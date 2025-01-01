type MyPromiseStatus = "pending" | "fulfilled" | "rejected";

export class MyPromise {
  private status: MyPromiseStatus;

  constructor() {
    this.status = "pending";
  }
}
