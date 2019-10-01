'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

function Events() { }

if (Object.create) {
  Events.prototype = Object.create(null);
  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) {
    emitter._events[evt] = listener;
    emitter._eventsCount++;
  } else if (!emitter._events[evt].fn) {
    emitter._events[evt].push(listener);
  } else {
    emitter._events[evt] = [emitter._events[evt], listener];
  }

  return emitter
}

function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

EventEmitter.prototype.eventNames = function eventsNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
}

EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
}

EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
}

EventEmitter.prefixed = prefix;

EventEmitter.EventEmitter = EventEmitter;

if ('undifined' !== typeof module) {
  module.exports = EventEmitter;
}