declare module 'react-slick' {
  import { Component } from 'react';

  interface SliderProps {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    // Add other props as needed
  }

  export default class Slider extends Component<SliderProps> {}
} 