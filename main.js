const process = require('process');
const { Buffer } = require('node:buffer');
const path = require('node:path');

const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(x, y) {
        this.field = this.createField(x, y);
        this.fieldSize = {x: x, y: y};
        this.location = {x: 0, y: 0};
        this.outOfField = false;
        this.inHole = false;
        this.charError = false;
        this.foundHat = false;
        this.playing = true;
    }
    createField(x, y) {
        this.fieldSize = {x: x, y: y};
        const field = []
        for (let j = 0; j < y; j +=1) {
            const row = [];
            for (let i = 0; i < x; i += 1) {
                const rnd = Math.random();
                row.push(rnd < 0.3 ? hole : fieldCharacter);
            }
            field.push(row);
        }
        const hatX = Math.floor(Math.random() * x ) - 1;
        const hatY = y - Math.floor(Math.random() * y/2);
        field[hatY][hatX] = hat;
        field[0][0] = pathCharacter;
        return field;
    }

    checkOutOfField() {
        if (0 <= this.location.x &&  this.location.x < this.fieldSize.x &&
            0 <= this.location.y && this.location.y < this.fieldSize.y
        ) {
            this.outOfField = false;
        } else {
            this.outOfField = true;
        }
    }
    checkLocation() {
        const currentSquare = this.field[this.location.y][this.location.x];
        this.inHole = currentSquare === hole ? true : false;
        this.foundHat = currentSquare === hat ? true : false;
    }
    updateField() {
        this.field[this.location.y][this.location.x] = pathCharacter;
        }
    print() {
        process.stdout.write('\x1Bc');
        for (const row of this.field) {
            console.log(row.join(''));
        }
    }
    endGame() {
        console.log('Would you like to play again?');
        this.playing = false;
    }
    processMove(input) {
        if (!this.outOfField && !this.inHole && !this.foundHat) {
            switch (input) {
                case 'w':
                    this.location.y += 1;
                    break;
                case 'a':
                    this.location.x -= 1;
                    break;
                case 's':
                    this.location.y -= 1;
                    break;
                case 'd':
                    this.location.x += 1;
                    break;
                default:
                    this.charError = true;
            }
            this.checkOutOfField();
            if (!this.outOfField && !this.charError) {
                this.checkLocation();
                this.updateField();
                this.print();
                if (this.inHole) {
                    console.log('Sorry, you fell down a hole!');
                    this.endGame();
                } else if (this.foundHat) {
                    console.log('You win, you found the hat!');
                    this.endGame();
                } else {
                    console.log('Please enter your next move (a,w,s,d)')
                }
            } else if (this.outOfField) {
                this.print();
                console.log('Sorry, you are out of bounds.')
                this.endGame();
            } else {
                this.print();
                console.log('Sorry, character not reconised.  Please enter a,s,w or d');
            }
        }
    }
    processPlayAgain(input) {
        switch (input) {
            case 'y':
                this.field = this.createField(10, 20);
                this.fieldSize = {x: 10, y: 20};
                this.location.x = 0;
                this.location.y = 0;
                this.outOfField = false;
                this.inHole = false;
                this.foundHat = false;
                this.playing = true;
                this.print();
                console.log('Please enter your next move (a,w,s,d)');
                break;
            case 'n':
                process.exit();
                break;
            default:
                console.log('Please enter Y or N')
        }
    }
    processInput(userInput) {
        const input = userInput.toString().trim().toLowerCase();
        if (this.playing) {
            this.processMove(input);
        } else {
            this.processPlayAgain(input)
        }
    }
}
const myField = new Field(5, 10);
const myInput = process.stdin
myField.print();
const processInput = userInput => myField.processInput(userInput);
myInput.on('data', processInput);

//Need to add hat to field generator
//Need to show starting point