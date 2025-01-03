type MyPromiseStatus = "pending" | "fulfilled" | "rejected";

type Executor<T> = (
  resolve: (value: T) => void,
  reject: (reason: any) => void
) => void;

type OnFulfilled<T, U = T> = ((value: T) => U | void) | null;

type OnRejected<U> = ((reason: any) => U | void) | null;

type OnFinally = (() => void) | null;

export class MyPromise<T> {
  private status: MyPromiseStatus;
  private onfulfilledQueue: OnFulfilled<T>[];
  private onrejectedQueue: OnRejected<T>[];
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

  then(onfulfilled?: OnFulfilled<T>, onrejected?: OnRejected<T>) {
    return new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
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
      };

      const handleRejected = () => {
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
      };

      const handlePending = () => {
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
      };

      if (this.status === "fulfilled") {
        queueMicrotask(handleFulfilled);
      } else if (this.status === "rejected") {
        queueMicrotask(handleRejected);
      } else {
        handlePending();
      }
    });
  }

  catch(onrejected?: OnRejected<T>) {
    return this.then(null, onrejected);
  }

  finally(onfinally?: OnFinally) {
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
