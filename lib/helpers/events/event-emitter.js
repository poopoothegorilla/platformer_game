// Eventually, we can probably replace this with a robust event emitter such as https://github.com/Olical/EventEmitter

export default class EventEmitter {

  constructor(game, player) {
    this.events = {};
    this.player = player;
    console.log(this.player);
  }

  // each event in the events obj will have an array of listeners (just plain ole js functions)
  // so events would look like:
  // { myEvent: [function(), function()]}

  on(type, listener) {
      this.events[type] = this.events[type] || []; // if events don't exist, make empty array
      this.events[type].push(listener);
  }

  emit(type) {
    // check which event is fired, and for that event, loop through its array of listeners and fire each listener
    if (this.events[type]) {
      this.events[type].forEach(function(listener) {
        listener();
      })
    }
  }

  // DamageHelpers
  doDamage(target, damageAmt) {
    console.log(target)
    console.log('damaging '+target.name+' by '+damageAmt)
    target.health -= damageAmt;
    // if target health is 0, fire killPlayer (or downPlayer?) event
  }
}
