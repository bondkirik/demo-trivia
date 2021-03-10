window.onload = sendApiRequest;

const btn = document.getElementById("btn");
const result = document.querySelector('#result');
const question = document.querySelector('#question');
var q_number = document.getElementById("q_number");

const MAX_QUESTIONS = 20;
const MAX = 9999;
const answers_check = [];

const server = `http://numbersapi.com/random/trivia?json&fragment&min=1&max=`+MAX;


/**
 * api server
 * @param event
 * @returns {Promise<void>}
 */

async function sendApiRequest(event) {
    event.preventDefault();
    await fetch(server).then(function (value) {
        if(value.status !== 200){
            return Promise.reject(new Error(value.status));
        }
        return value.json();

    }).then(function (data) {

        answers_check.forEach(answer => {
            if (answer === data.number) {
                data = false;
            }
        });
        return data;

    }).then(function (output) {
        if (!output){
            sendApiRequest(event);
        }else {
            let inner = '';

            if (!output.found) {
                inner = '<h2 class="option wrong">Nothing found</h2>';
            }

            inner += `<div class="option">${output.number}</div>`;
            inner += `<div class="option">1</div>`;
            inner += `<div class="option">2</div>`;


            question.innerHTML = output.text;
            result.innerHTML = inner;

            answers_check.push(output.number);

        }
    })
        .catch(function (reason) {
            result.innerHTML = 'Something wrong';
            console.error('error' + reason);
        });
}

btn.addEventListener("click", sendApiRequest);
