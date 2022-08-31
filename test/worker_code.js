'use strict'
;(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      var rejected = (value) => {
        try {
          step(generator.throw(value))
        } catch (e) {
          reject(e)
        }
      }
      var step = (x) =>
        x.done
          ? resolve(x.value)
          : Promise.resolve(x.value).then(fulfilled, rejected)
      step((generator = generator.apply(__this, __arguments)).next())
    })
  }

  // node_modules/typed-worker/dist/index.mjs
  var WORKER_READY_MESSAGE_ID = 'typed-worker-ready'
  var IFRAME_ID_ATTR = 'data-typed-worker'
  var handleActions = (actions2, options = {}) => {
    var _a
    const inWorker =
      typeof WorkerGlobalScope !== 'undefined' &&
      self instanceof WorkerGlobalScope
    const postMessage = (message) => {
      if (inWorker) {
        globalThis.postMessage(message)
      } else {
        window.parent.postMessage(message, '*')
      }
    }
    const id = inWorker
      ? WORKER_READY_MESSAGE_ID
      : options.readyMessageId ||
        ((_a = window.frameElement) == null
          ? void 0
          : _a.getAttribute(IFRAME_ID_ATTR))
    if (id) {
      postMessage({ id })
    }
    onmessage = async (e) => {
      const { id: id2, type, args } = e.data
      const action = actions2[type]
      if (action) {
        const result = await action(...args)
        postMessage({ id: id2, result })
      }
    }
  }

  // ts/worker_code.ts
  function sleep(time) {
    return __async(this, null, function* () {
      return new Promise((res) => setTimeout(res, time))
    })
  }
  var actions = {
    sum(a, b) {
      return __async(this, null, function* () {
        yield sleep(1500)
        return a + b
      })
    },
  }
  handleActions(actions)
})()
