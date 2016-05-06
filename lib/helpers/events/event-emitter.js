// Eventually, we can probably replace this with a robust event emitter such as https://github.com/Olical/EventEmitter

export default class EventEmitter {

  constructor() {
    this.events = {};
  }

  // each event in the events obj will have an array of listeners (just plain ole js functions)
  // so events would look like:
  // { myEvent: [function(), function()]}

  on(type, listener) {
      this.events[type] = this.events[type] || []; // if events don't exist, make empty array
      this.events[type].push(listener);
  }

  emit(type, arg=null) {
    // check which event is fired, and for that event, loop through its array of listeners and fire each listener
    if (this.events[type]) {
      this.events[type].forEach(function(listener) {
        listener(arg);
      })
    }
  }
}
