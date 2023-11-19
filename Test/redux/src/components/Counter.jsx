import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from '../redux/actions/countActions';

export default function Counter() {
    const dispatch = useDispatch();
    const count = useSelector((state) => state.counter.count);

  return (
      <div>
          <h1>Count: {count}</h1>
          <button
              onClick={() => {
                  dispatch(decrement(5));
              }}
          >
              -
          </button>
          <button
              onClick={() => {
                  dispatch(increment(10));
              }}
          >
              +
          </button>
      </div>
  );
}
