export default class Scheduler {
  constructor(max) {
    this.max = max
    this.count = 0
    this.queue = []
    this.run = false
  }

  async add(fn) {
    if (this.count >= this.max) {
        await new Promise(resolve => this.queue.push(resolve))
    }

    if (this.run) {
      this.count = 0
      return
    }

    this.count += 1

    const res = await fn()

    this.count -= 1
    this.queue.length && this.queue.shift()()

    return res
  }

  stop() {
    this.run = true
  }

  start() {
    this.run = false
  }
}
