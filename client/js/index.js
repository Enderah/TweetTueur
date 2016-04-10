var socket = io('127.0.0.1:1337')
var renderer = PIXI.autoDetectRenderer(document.body.clientWidth, document.body.clientHeight,{backgroundColor : 0x560CE8});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();
var score = 0;
var style = {
  font : 'bold italic 24px Arial',
  fill : '#F7EDCA',
  stroke : '#4a1850',
  strokeThickness : 5,
  dropShadow : true,
  dropShadowColor : '#000000',
  dropShadowAngle : Math.PI / 6,
  dropShadowDistance : 6,
  wordWrap : true,
  wordWrapWidth : 440
};
var text = new PIXI.Text(score, style);
text.position.set(30,30);
text.interactive = true;
stage.addChild(text);
function animate() {

  requestAnimationFrame(animate);
  renderer.render(stage);
}

socket.on('tweet', function (data) {
  var basicText = new PIXI.Text(data.user.name + " " + data.text, style);
  var x = Math.floor((Math.random() * document.body.clientWidth - 30));
  var y = Math.floor((Math.random() *  document.body.clientHeight));
  basicText.position.set(x,y);
  stage.addChild(basicText);
  basicText.interactive = true;

  var explosions = []
  var loader = new PIXI.loaders.Loader();
  loader.add('explosion',"/client/assets/SpriteSheet.json");
  loader.load();

  function setup(data) {
    stage.removeChild(data)
  }

  basicText.on('mousedown', function() {
    score++;
    var explosionTextures = [];
    for (var i=0; i < 26; i++)
    {
      var texture = PIXI.Texture.fromFrame("Explosion_Sequence_A " + (i+1) + ".png");
      explosionTextures.push(texture);
    };

    var explosion = new PIXI.MovieClip(explosionTextures);
    explosion.position.x = basicText.position.x
    explosion.position.y = basicText.position.y
    explosion.anchor.x = 0.5;
    explosion.anchor.y = 0.5;
    explosion.rotation = Math.random() * Math.PI;
    explosion.scale.x = explosion.scale.y = 0.75 + Math.random() * 0.5
    explosion.loop = false;
    explosions.push(explosion);
    explosion.gotoAndPlay(1);
    stage.removeChild(basicText);
    stage.addChild(explosion);
    text.setText(score);

  })


})

animate();