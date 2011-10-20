var chickenImg;
var canvas;
var context;
var levels = [];
var timeLimit = Date.now() / 1000;
var chickens = [];
var terrainImg;
var hutImg;
var hutX;
var hutY;
var animateId;
var score = 0;
var level = 1;
var caughtThisLevel = 0;

function extractTouch(e) {
  return e.originalEvent.touches && e.originalEvent.touches[0]
    || e.originalEvent.changedTouches && e.originalEvent.changedTouches[0]
    || e;
}

function playableMinY() {
  return Math.max(0, $('#game').attr('height') - 450);
}

function playableStartingY(img) {
  return Math.max(0, $('#game').attr('height') - 450 - img.height) + (Math.min(450, $('#game').attr('height')) - img.height) * Math.random();
}

var chicken = function () {
  var dragging, caught;
  dragging = false;
  caught = false;

  return {
    x: ($('#game').attr('width') - chickenImg.width) * Math.random(),
    y: playableStartingY(chickenImg),
    draw: function () {
      context.drawImage(chickenImg, this.x, this.y);
    },
    move: function () {
      if (!dragging && !caught) {
        this.doMove();
      }
    },
    doMove: function () {
      this.x += 2 * Math.random() - 1;
      this.y += 2 * Math.random() - 1;
    },
    startDrag: function (xClick, yClick) {
      if (!caught) {
        var xOffset, yOffset, that;

        xOffset = xClick - this.x;
        yOffset = yClick - this.y;
        dragging = true;

        that = this;
        $('canvas').bind('mousemove touchmove', function (e) {
          e.preventDefault();
          e = extractTouch(e);
          that.x = e.pageX - canvas.offsetLeft - xOffset;
          that.y = e.pageY - canvas.offsetTop - yOffset + document.body.scrollTop;
        });
      }
    },
    endDrag: function () {
      $('canvas').unbind('mousemove touchmove');
      dragging = false;
    },
    distanceFrom: function (x2, y2) {
      return Math.sqrt(Math.pow(this.x + 24 - x2, 2) + Math.pow(this.y + 28 - y2, 2));
    },
    catchIt: function () {
      if (dragging) {
        var isNewlyCaught = !caught;
        caught = true;
        return isNewlyCaught;
      } else {
        return false;
      }
    }
  };
};

var straightLineChicken = function () {
  var baseChicken = chicken();
  baseChicken.doMove = function () {
    baseChicken.x += 1;
  };
  return baseChicken;
};

var pacingChicken = function (magnitude, changeDirectionsAfterSteps) {
  var dx, dy, stepsInThisDirection, baseChicken;

  function init() {
    stepsInThisDirection = 0;
    dx = -1 + 2 * Math.random();
    dy = -1 + 2 * Math.random();
  }

  init();

  baseChicken = chicken();
  baseChicken.doMove = function () {
    if (baseChicken.x < 0) { dx = Math.abs(dx); stepsInThisDirection = 0; }
    if (baseChicken.x + chickenImg.width > $('#game').attr('width')) { dx = -Math.abs(dx); stepsInThisDirection = 0; }
    if (baseChicken.y < playableMinY()) { dy = Math.abs(dy); stepsInThisDirection = 0; }
    if (baseChicken.y + chickenImg.height > $('#game').attr('height')) { dy = -Math.abs(dy); stepsInThisDirection = 0; }

    baseChicken.x += magnitude * dx;
    baseChicken.y += magnitude * dy;
    stepsInThisDirection += 1;
    if (stepsInThisDirection > changeDirectionsAfterSteps) {
      init();
    }
  };
  return baseChicken;
};

function setTimeLimit(seconds) {
  timeLimit = Date.now()/1000 + seconds;
}

levels = [
  function () {
    chickens = [
      pacingChicken(3, 20),
      pacingChicken(4, 15),
      pacingChicken(5, 25)
    ];
    setTimeLimit(30);
  },
  function () {
    chickens = [
      pacingChicken(4, 15),
      pacingChicken(4, 15),
      pacingChicken(5, 20),
      pacingChicken(5, 15),
      pacingChicken(6, 20)
    ];
    setTimeLimit(20);
  },
  function () {
    chickens = [
      pacingChicken(1, 5),
      pacingChicken(1, 5),
      pacingChicken(3, 30),
      pacingChicken(3, 30),
      pacingChicken(3, 30),
      pacingChicken(4, 15),
      pacingChicken(5, 20),
      pacingChicken(5, 15),
      pacingChicken(6, 20)
    ];
    setTimeLimit(30);
  },
  function () {
    chickens = [
      pacingChicken(1, 5),
      pacingChicken(3, 30),
      pacingChicken(4, 15),
      pacingChicken(5, 20),
      pacingChicken(5, 15),
      pacingChicken(6, 20),
      pacingChicken(9, 9),
      pacingChicken(10, 10),
      pacingChicken(11, 11),
      pacingChicken(10, 8),
      pacingChicken(10, 6)
    ];
    setTimeLimit(45);
  }
];

start = function () {
  $('#splash-screen').hide();
  $('#game').show();

  chickenImg = document.getElementById('chicken');
  hutImg = document.getElementById('hut');
  hutX = ($('#game').attr('width') - hutImg.width) * Math.random();
  hutY = playableStartingY(hutImg);
  canvas = document.getElementById("game");
  if (canvas.getContext) {
    context = canvas.getContext("2d");
    levels.shift().call();

    animateId = setInterval(function () {
      context.clearRect(0, 0, 640, 480);
      sizeGameAndDrawTerrain();
      context.drawImage(hutImg, hutX, hutY);
      if (timeLeft() <= 0) {
        level = "Out of time!"
        sizeGameAndDrawTerrain();
        context.drawImage(hutImg, hutX, hutY);
        stop();
      }
      $.each(chickens, function (i) {
        chickens[i].draw();
        chickens[i].move();
      });
    }, 25);

    $('canvas').bind('mousedown touchstart', function (e) {
      e.preventDefault();
      e = extractTouch(e);
      var x = e.pageX - canvas.offsetLeft;
      var y = e.pageY - canvas.offsetTop + document.body.scrollTop;

      $.each(chickens, function (i) {
        var distance = chickens[i].distanceFrom(x, y);
        if (distance < 25) {
          chickens[i].startDrag(x, y);
        }
      });
    });

    $('canvas').bind('mouseup touchend', function (e) {
      e.preventDefault();
      e = extractTouch(e);
      $.each(chickens, function (i) {
        if (chickens[i].distanceFrom(hutX + 70, hutY + 70) < 50) {
          if (chickens[i].catchIt()) {
            score += 1;
            caughtThisLevel += 1;
            if (caughtThisLevel == chickens.length) {
              if (levels.length > 0) {
                caughtThisLevel = 0;
                level += 1;
                levels.shift().call();
              } else {
                level = "You win!";
                sizeGameAndDrawTerrain();
                stop();
              }
            }
          }
        }
        chickens[i].endDrag();
      });
    });
  }
};

function stop() {
  clearInterval(animateId);
}

function timeLeft() {
   return Math.max(0, Math.ceil(timeLimit - Date.now() / 1000));
}

function sizeGameAndDrawTerrain() {
  $('#game').attr('width', Math.min(window.innerWidth, terrainImg.width));
  $('#game').attr('height', Math.min(window.innerHeight, terrainImg.height));
  context.drawImage(
    terrainImg,
    Math.min(0, (window.innerWidth - terrainImg.width) / 2),
    Math.min(0, window.innerHeight - terrainImg.height)
  );

  // draw display
  context.font = "20pt PTF Nordic Rnd";

  context.fillText("Seconds left: " + timeLeft(), 10, 30);
  context.fillText("Score: " + score, 10, 60);
  context.fillText("Level: " + level, 10, 90);
}

window.onload = function () {
  terrainImg = document.getElementById('terrain');

  canvas = document.getElementById("game");
  if (canvas.getContext) {
        context = canvas.getContext("2d");
    sizeGameAndDrawTerrain();

    $(window).resize(function () {
      sizeGameAndDrawTerrain();
    });

    $('#play').click(start);
  }
};