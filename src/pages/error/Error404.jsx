import React from 'react';
import img404 from '../../assets/error/error_404.png';
import "./Error.scss";

export default function Error404() {
  return (
      <div className='error-404'>
          <img src={img404} alt="error 404" />
      </div>
  );
}
