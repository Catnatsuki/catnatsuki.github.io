//Functions for the gallery carousel 
var firstCarousel = document.querySelector('.firstCarousel');
var flkty = new Flickity( firstCarousel, {
  // options
  cellAlign: 'left',
  contain: true,
  selectedAttraction: 0.03,
  friction: 0.2,
  autoPlay: 5000,
});

var secondCarousel = document.querySelector('.secondCarousel');
var flktyOne = new Flickity( secondCarousel, {
  // options
  cellAlign: 'left',
  contain: true,
  selectedAttraction: 0.03,
  friction: 0.2,
  autoPlay: 5000,
});

var thirdCarousel = document.querySelector('.thirdCarousel');
var flktyTwo = new Flickity( thirdCarousel, {
  // options
  cellAlign: 'left',
  contain: true,
  selectedAttraction: 0.03,
  friction: 0.2,
  autoPlay: 5000,
});