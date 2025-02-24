// src/app/components/CountdownClock.tsx
'use client';
import React, { useState, useEffect } from 'react';

interface CountdownClockProps {
  nextDate: Date; // Only need nextDate now
}

const CountdownClock: React.FC<CountdownClockProps> = ({ nextDate }) => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  const timezoneOffset = nextDate.getTimezoneOffset() / -60;

  function calculateTimeRemaining() {
  const now = new Date(new Date().toUTCString());
    const difference = nextDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { hours, minutes, seconds };
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [nextDate]);


  return (
    <div className="text-center">
      <p>Next Game in</p>
      <span className="text-xl font-bold">
        {String(timeRemaining.hours).padStart(2, '0')}:
        {String(timeRemaining.minutes).padStart(2, '0')}:
        {String(timeRemaining.seconds).padStart(2, '0')}
      </span>
    <p>{nextDate.getHours()}:00 ({timezoneOffset > 0 ? '+' : ''}{timezoneOffset} UTC)</p>
    </div>
  );
};

export default CountdownClock;