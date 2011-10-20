var narrativeStep = 0;
var narrative = [
  "Sight-seeing in Kenya! And you've volunteered for a day on the farm.",
  "Simon welcomes your help. He's a local farmer raising indigenous chickens, and these otherwise hardy birds need protection from Newcastle disease.",
  "When Simon leaves to pick up the vaccines he ordered, he leaves you in charge. All is well until...",
  "The chickens have flown the coop!",
  "They're running amok, and it's your job to drag them back to their hut.",
  "But hurry up! Simon's already on his way back!"
];

$(document).ready(function () {
  $('#narrative-next').bind('click', function () {
    narrativeStep++;
    $('#narrative p').text(narrative[narrativeStep]);
    if (narrativeStep >= narrative.length - 1) {
      $('#narrative-next').hide();
      $('#narrative-play').show();
    }
  });
  $('#narrative-play').bind('click', function () {
    $('.layer').hide();
    start();
  });
});