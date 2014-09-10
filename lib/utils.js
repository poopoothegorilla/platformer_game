(function () {
  var Platformer = window.Platformer = (window.Platformer || {});

  var utils = Platformer.Utils = function () {

  };

  // ALLOWS FOR OBJECTS TO INHERIT FUNCTIONS FROM EACH OTHER
  utils.inherits = function (BaseClass, SubClass) {
    var Surrogate = function(){};
    Surrogate.prototype = BaseClass.prototype;
    SubClass.prototype = new Surrogate();
  };

  
})()
