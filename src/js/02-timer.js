import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix';

const startBtn = document.querySelector('[data-start]');
const daysLeft = document.querySelector('[data-days]');
const hoursLeft = document.querySelector('[data-hours]');
const minutesLeft = document.querySelector('[data-minutes]');
const secondsLeft = document.querySelector('[data-seconds]');
let countdownInterval = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: Date.now(),
  minDate: 'today',
  minuteIncrement: 1,
  onClose(selectedDates) {
    const remainingTime = convertMs(selectedDates[0].getTime() - Date.now());
    if (remainingTime.seconds < 0) {
      Notify.failure('Shoose time in future tense!');
      startBtn.disabled = true;
      return;
    }
    startBtn.disabled = false;
  },
};

function timeInterfaceDrawning({ days, hours, minutes, seconds }) {
  daysLeft.textContent = days;
  hoursLeft.textContent = hours;
  minutesLeft.textContent = minutes;
  secondsLeft.textContent = seconds;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function addZero(value) {
  return String(value).padStart(2, '0');
}

const date = flatpickr('#datetime-picker', options);

startBtn.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
  countdownInterval = setInterval(updateTimeInterface, 1000);
}

function updateTimeInterface() {
  const selectedDate = date.selectedDates[0].getTime();
  const currentTime = Date.now();

  const remainingTime = convertMs(selectedDate - currentTime);

  if (remainingTime.seconds < 0) {
    clearInterval(countdownInterval);
    Notify.failure('Please select a time in the future!');
    return;
  }

  timeInterfaceDrawning(remainingTime);
}
