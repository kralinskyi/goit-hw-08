import { Notify } from 'notiflix';

const form = document
  .querySelector('.form')
  .addEventListener('submit', handleSubmitform);

function handleSubmitform(e) {
  e.preventDefault();

  const { delay, step, amount } = e.target.elements;

  let currentDelay = Number(delay.value);
  let delayStep = Number(step.value);
  let amountNumber = Number(amount.value);

  for (let i = 1; i <= amountNumber; i += 1) {
    createPromise(i, currentDelay).then(onSuccess).catch(onRejected);

    currentDelay += delayStep;
  }
  setTimeout(() => {
    e.target.reset();
  }, currentDelay);
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      }

      reject({ position, delay });
    }, delay);
  });
}

function onSuccess({ position, delay }) {
  Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
}
function onRejected({ position, delay }) {
  Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
}

console.log('HO_HO_HO');
