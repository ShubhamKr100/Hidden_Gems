// src/components/ImageSlider.jsx



// ye slider kerta h
import React from 'react';
import Slider from 'react-slick';

function ImageSlider({ images }) {
  // Slider ki settings
  const settings = {
    dots: true,         // Neeche dots dikhaye
    infinite: true,
    speed: 500,
    slidesToShow: 1,    // Ek time par ek slide dikhaye
    slidesToScroll: 1,
    arrows: true,       // Next/Prev arrows
  };

  return (
    <div className="image-slider-container">
      <Slider {...settings}>
        {images && images.length > 0 ? (
          images.map((img, index) => (
            <div key={index}>
              <img 
                src={img || 'default-image.jpg'} 
                alt={`Slide ${index}`} 
                className="spot-card-image" // Puraani CSS reuse karein
              />
            </div>
          ))
        ) : (
          <div>
            <img 
              src="default-placeholder.jpg" // Ek default image agar koi photo na ho
              alt="No image" 
              className="spot-card-image"
            />
          </div>
        )}
      </Slider>
    </div>
  );
}

export default ImageSlider;