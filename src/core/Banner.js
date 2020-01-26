import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';

const Banner = () => (
    <Carousel 
        autoPlay 
        infiniteLoop 
        showArrows={false} 
        showStatus={false} 
        showIndicators={false} 
        showThumbs={false}
        interval={5000}
        transitionTime={500}
    >
        <div>
            <img src={banner1} alt="banner1" />
        </div>
        <div>
            <img src={banner2} alt="banner2" />
        </div>
    </Carousel>
);

export default Banner;