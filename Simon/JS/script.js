//colours and map to translate colour id to string
const colours = {
    Green: 0,
    Red: 1,
    Yellow: 2,
    Blue: 3,
}

let colourMap = new Map();
colourMap.set(colours.Green, "green");
colourMap.set(colours.Red, "red");
colourMap.set(colours.Yellow, "yellow");
colourMap.set(colours.Blue, "blue");

// game variables
let gameActive = false;
let sequence = [];
let sequenceIndex = 0;
let nextInSequence = "";
let score = 0;

function setNextInSequence(){

    //if we've hit the maximum sequence, then add to the sequence
    if(sequenceIndex < sequence.length)
    {
        nextInSequence = sequence[sequenceIndex];
        sequenceIndex++;
    }
    else
    {
        removeEvents();
        score = sequence.length;
        setTimeout(() =>{
            playGame();
        }, 1000);
    }
}

function addToSequence() {
    //add a random value to the sequence
    let value = Math.floor(Math.random() * (colours.Blue + 1));
    let item = colourMap.get(value);
    sequence.push(item);
}

function playSound(sound) {
    let audio = new Audio("sounds/"+ sound + ".mp3");
    audio.play();
}

function playSingleItem(item, timeout)
{
    //will play out an item animation (sound and highlight)
    setTimeout(() => {
        playSound(item);
        const colourClass = "." + item;
        const highlight = item + "-highlight";
        $(colourClass).addClass(highlight);

        setTimeout(() => {
            $(colourClass).removeClass(highlight);
        }, 500);
    }, timeout);
}

//plays through the current sequence to be repeated
function playSequence() {
    $(".title").text("Remember The Sequence");
    let timeout = 0;
    sequence.forEach((item) => {
        playSingleItem(item, timeout);
        timeout += 550;
    });

    return timeout;
}

function loseGame() {
    $(".title").text(`Unlucky. You scored ${score} points. Press a key to play again`);
    playSound("wrong")
    $("body").addClass("lose");

    setTimeout(() => {
        $("body").removeClass("lose");
    }, 100);

    gameActive = false;
}

//call this when we are ready for user input
function addEvents()
{
    $(".button").on("click", function() {
        if($(this).attr("id") != nextInSequence)
        {
            removeEvents();
            loseGame();
        }
        else
        {
            playSingleItem($(this).attr("id"), 0);
            setNextInSequence();
        }
    });
}

//removes click events when we don't want the user to press anything
function removeEvents()
{
    $(".button").off("click");
}

function startGame() {
    //clear sequence
    sequence.length = 0;
    score = 0;
    playGame();
}

function playGame() {
    sequenceIndex = 0;
    addToSequence();
    setNextInSequence();
    let timeout = playSequence();

    setTimeout(function(){
        $(".title").text("Repeat The Sequence");
        addEvents();
    }, timeout); 
}

$(document).keypress(() => {
    if(!gameActive)
    {
        gameActive = true;
        startGame();
    }
})
