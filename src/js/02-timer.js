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
};

const date = flatpickr('#datetime-picker', {
  ...options,
  onClose(selectedDates) {
    handleSelectedDate(selectedDates[0].getTime());
  },
  onChange(selectedDates) {
    handleSelectedDate(selectedDates[0].getTime());
  },
});

startBtn.addEventListener('click', onStartBtnClick);

function handleSelectedDate(selectedDate) {
  clearInterval(countdownInterval);

  const currentTime = Date.now();
  const remainingTime = selectedDate - currentTime;

  if (remainingTime < 0) {
    Notify.failure('Please select a time in the future!');
    startBtn.disabled = true;
    return;
  }

  timeInterfaceDrawing(convertMs(remainingTime));

  if (remainingTime <= 0 && remainingTime !== null) {
    clearInterval(countdownInterval);
    Notify.success('Success');
    startBtn.disabled = true;
  } else {
    startBtn.disabled = false;
  }
}

function timeInterfaceDrawing({ days, hours, minutes, seconds }) {
  daysLeft.textContent = addZero(days);
  hoursLeft.textContent = addZero(hours);
  minutesLeft.textContent = addZero(minutes);
  secondsLeft.textContent = addZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addZero(value) {
  return String(value).padStart(2, '0');
}

function onStartBtnClick() {
  const selectedDate = date.selectedDates[0].getTime();
  const currentTime = Date.now();
  const remainingTime = selectedDate - currentTime;

  if (remainingTime < 0) {
    Notify.failure('Please select a time in the future!');
    startBtn.disabled = true;
    return;
  }

  updateTimeInterface();
  countdownInterval = setInterval(updateTimeInterface, 1000);
  startBtn.disabled = true;
}

function updateTimeInterface() {
  const selectedDate = date.selectedDates[0].getTime();
  const currentTime = Date.now();
  const remainingTime = selectedDate - currentTime;

  if (remainingTime < 0) {
    clearInterval(countdownInterval);
    Notify.failure('Please select a time in the future!');
    startBtn.disabled = true;
    return;
  }

  if (remainingTime <= 0 && remainingTime !== null) {
    clearInterval(countdownInterval);
    Notify.success('Success');
    startBtn.disabled = true;
  } else {
    const remaining = convertMs(remainingTime);
    timeInterfaceDrawing(remaining);
  }
}
