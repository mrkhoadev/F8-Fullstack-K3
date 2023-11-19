import React from 'react'

export default function Input({name, type = "text"}) {
  return (
      <div>
          <label htmlFor="">{name}</label>
          <input type={ type } placeholder={name} id='' />
    </div>
  )
}
