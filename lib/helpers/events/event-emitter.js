// Eventually, we can probably replace this with a robust event emitter such as https://github.com/Olical/EventEmitter

var EventEmitter = function(game, player) {
  this.events = {};
  this.player = player;
  console.log(this.player);
}

// each event in the events obj will have an array of listeners (just plain ole js functions)
// so events would look like:
// { myEvent: [function(), function()]}

EventEmitter.prototype.on = function(type, listener) {
    this.events[type] = this.events[type] || []; // if events don't exist, make empty array
    this.events[type].push(listener);
}

EventEmitter.prototype.emit = function(type) {
  // check which event is fired, and for that event, loop through its array of listeners and fire each listener
  if (this.events[type]) {
    this.events[type].forEach(function(listener) {
      listener();
    })
  }
}

// DamageHelpers
var doDamage = function(target, damageAmt) {
  console.log(target)
  console.log('damaging '+target.name+' by '+damageAmt)
  target.health -= damageAmt;
  // if target health is 0, fire killPlayer (or downPlayer?) event
}
