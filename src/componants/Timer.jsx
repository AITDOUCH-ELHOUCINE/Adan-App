import React, { useState } from 'react';

function Timer() {
  const [time, setTime] = useState(new Date());

  setInterval(() => {
    setTime(new Date());
  }, 1000);



  return (

    <div className="header">

      <div className="date">
        <h1>{time.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h1>
      </div>
      <div className="time">
        <h1>
          {time.getSeconds().toString().padStart(2, '0')} :
          {time.getMinutes().toString().padStart(2, '0')} :
          {time.getHours().toString().padStart(2, '0')}
        </h1>
      </div>
    </div>
  );
}

export default Timer;
