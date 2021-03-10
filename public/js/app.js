window.onload = sendApiRequest;

const btn = document.getElementById("btn");
const result = document.querySelector('#result');
const question = document.querySelector('#question');
var q_number = document.getElementById("q_number");

const MAX_QUESTIONS = 1;
const MAX = 9999;
const range = 10;
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
            let rnd_answers = [];

            if (!output.found) {
                inner = '<h2 class="option wrong">Nothing found</h2>';
            }

            rnd_answers.push(output.number);

            let rnd_num = getRandomInt(output.number - range , output.number + range , rnd_answers );

            rnd_answers.push(rnd_num);

            let rnd_num2 = getRandomInt(output.number + range, output.number + range , rnd_answers );

            rnd_answers.push(rnd_num2);

            let answer_results = shuffle(rnd_answers);


            let i;
            for (i = 0; i < answer_results.length; i++){
                inner += `<div class="option">${answer_results[i]}</div>`;
            }


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


/**
 *  return random int number without number
 * @param min
 * @param max
 * @param used_nums
 * @returns {number}
 */
function getRandomInt(min, max, used_nums = null) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let result = Math.floor(Math.random() * (max - min)) + min;
    if(used_nums.isArray) {
        used_nums.forEach(used_num => {
            if (result == used_num) {
                result = getRandomInt(min, max, used_num);
            }
        });
    }else {
        if (result == used_nums) {
            result = getRandomInt(min, max, used_nums);
        }
    }
    return result;
}

/**
 * shuffle array
 * @param array
 * @returns {*}
 */
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
}
