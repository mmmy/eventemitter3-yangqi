describe('EventEmitter-yangqi', function tests() {
  'use strict';

  var EventEmitter = require('../')
    , assume = require('assume');

  it('expose a `prefixed` property', function () {
    assume(EventEmitter.prefixed).is.either([false, '~']);
  });

  it('expose a modlue namespace object', function () {
    assume(EventEmitter.EventEmitter).equals(EventEmitter);
  });

  it('inherits when used with `require("util").inherits`', function () {
    function Beast() {
      EventEmitter.call(this);
    }

    require('util').inherits(Beast, EventEmitter);

    var moop = new Beast()
      , meap = new Beast();

    assume(moop).is.instanceOf(Beast);
    assume(moop).is.instanceOf(EventEmitter);

    moop.on('data', function () {
      throw new Error('I should not emit');
    })
  })

  describe('EventEmitter#on', function () {
    it('throws an error if the listener is not a function', function () {
      var e = new EventEmitter();

      try {
        e.on('foo', 'bar');
      } catch (ex) {
        assume(ex).is.instanceOf(TypeError);
        assume(ex.message).equals('The listener must be a function');
        return
      }

      throw new Error('oops');
    })
  })

})
