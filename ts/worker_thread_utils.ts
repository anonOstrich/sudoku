import { ResponseThinker, WorkerMessage, WorkerResponse } from './worker_code';

export class WorkerThreadManager {
  private static workerInstance: Worker | null = null;

  // Does this prevent the user from being able to call as new? Hope so but nbd either way
  private constructor() {
    throw new Error('no!');
  }

  public static getInstance() {
    if (this.workerInstance === null) {
      console.log('About to generate the worker instance!');
      const url = (this.workerInstance = new Worker(
        new URL('./worker_code', import.meta.url),
        { type: 'module' }
      ));
    }
    return this.workerInstance;
  }

  public static async postMessage<T extends WorkerMessage>(
    msg: T
  ): Promise<ResponseThinker<T>> {
    return new Promise((res) => {
      this.getInstance().addEventListener(
        'message',
        (e: MessageEvent<ResponseThinker<T>>) => {
          console.log('received from worker!');
          res(e.data);
        }
      );
      this.getInstance().postMessage(msg);
    });
  }
}
