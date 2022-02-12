// for( let i = 65; i <= 90; i++ )
// {
//   // 65 is A; 90 is Z; 97 is a (smol letter)
//   let character = String.fromCharCode(i);
//   document.querySelector( '#letter' + audioneeded ).onclick = function(){
//     let mySound = new Audio("sound-" + character + ".ogg" );
//     mySound.play();
//   }
// }
function initSounds() {
  console.log("initSoundsloaded");
  $("[data-audio-url]").each(
      function(){
          $(this).on('click', function() {
              var mp3Url = $(this).attr('data-audio-url');
              var a = new Audio(mp3Url);
              a.play();
          });
      }
  );

}
