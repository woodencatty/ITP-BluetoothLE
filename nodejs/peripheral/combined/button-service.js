var Gpio = require('onoff').Gpio,
  button = new Gpio(23, 'in', 'both');

var bleno = require('bleno');
var util = require('util');

var ButtonCharacteristic = function () {
  ButtonCharacteristic.super_.call(this, {
    uuid: 'ffe1',
    properties: ['notify'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Button'
      })
    ]
  });
};
util.inherits(ButtonCharacteristic, bleno.Characteristic);

ButtonCharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {
  console.log('ButtonCharacteristic subscribe');

  button.watch(function (err, value) {
    console.log('button ' + value);
    var data = new Buffer(1);
    data[0] = value;
    updateValueCallback(data);
  });
};

var buttonService = new bleno.PrimaryService({
  uuid: 'ffe0',
  characteristics: [
    new ButtonCharacteristic()
  ]
});

// cleanup GPIO on exit
function exit() {
  button.unexport();
  process.exit();
}
process.on('SIGINT', exit);

module.exports = buttonService;