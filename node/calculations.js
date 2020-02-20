'use strict';

const speechScorer = require('word-error-rate');

let reference = 'Hallo, hoe gaat het met je gap?';
let translated = 'Hallo, boe hoe gaat het je?';

let wer = speechScorer.wordErrorRate(reference, translated);
let wcr = compareWords(reference, translated)/numbOfWords(reference);
let rtf = tijdOutput - tijdInput;

console.log(wer);
console.log(wcr);

function compareWords(reference, translated) {
    let amountRight = 0;
    reference = reference.split(' ');
    translated = translated.split(' ');

    for(let i = 0; i < reference.length; i++) {
        for(let j = 0; j < translated.length; j++) {
            if(reference[i] === translated[j]) {
                amountRight++;
                break;
            }
        }
    }
    return amountRight;
}

function numbOfWords(reference) {
    return reference.split(' ').length;
}