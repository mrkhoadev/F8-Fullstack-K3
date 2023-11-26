import React from 'react';
import errorImg from "../../assets/image/error/error.jpeg";
import './Error.scss'

export default function Error() {
  return (
      <div className="error">
          <img src={errorImg} alt="error" />
      </div>
  );
}
