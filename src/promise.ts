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
    if (this.status !== "pending") {
      return;
    }

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
    if (this.status !== "pending") {
      return;
    }

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

  getStatus() {
    return this.status;
  }

  then(
    onfulfilled?: ((value: T) => T) | ((value: T) => void) | null,
    onrejected?: ((reason: any) => any) | null
  ) {
    return new MyPromise((resolve, reject) => {
      if (this.status === "fulfilled") {
        queueMicrotask(() => {
          try {
            if (onfulfilled) {
              const value = onfulfilled(this.value as T);
              resolve(value);
            } else {
              resolve(undefined);
            }
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.status === "rejected") {
        queueMicrotask(() => {
          try {
            if (onrejected) {
              const reason = onrejected(this.reason as T);

              // 반환값이 존재하면 resolve
              if (reason !== undefined) {
                resolve(reason);
              }
            } else {
              reject(undefined);
            }
          } catch (error) {
            reject(error);
          }
        });
      } else {
        this.onfulfilledQueue.push((value: T) => {
          try {
            if (onfulfilled) {
              const fulfilled = onfulfilled(value);
              resolve(fulfilled);
            } else {
              resolve(undefined);
            }
          } catch (error) {
            reject(error);
          }
        });

        this.onrejectedQueue.push((reason: any) => {
          try {
            if (onrejected) {
              const rejected = onrejected(reason);
              reject(rejected);
            } else {
              reject(undefined);
            }
          } catch (error) {
            reject(error);
          }
        });
      }
    });
  }

  catch(onrejected?: ((reason: any) => any) | null) {
    return this.then(null, onrejected);
  }

  finally(onfinally?: (() => void) | null) {
    return this.then(
      (value) => {
        onfinally?.();
        return value;
      },
      (reason) => {
        onfinally?.();
        throw reason;
      }
    );
  }
}
