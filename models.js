function Game() {
	this.players = [];
	this.boards = [];
	this.answersAccepted = false;
	this.playersThatHaveAnswered = [];
}

Game.prototype.playerHasAnswered = function(player) {
	// See if player is already in this.playersThatHaveAnswered…
	for(var i = 0; i < this.players.length; i++) {
		if(this.playersThatHaveAnswered[i] === player) return true;
	}
	
	return false;
}

function Board() {
	this.categories = [];
	this.questionsShown = 0;
}

Board.prototype.hasShownAllQuestions = function() {
	if(this.questionsShown >= this.questions.length) {
		return true;
	}
	
	return false;
}

function Category() {
	this.title = "Undefined Category";
	this.questions = [];
}

function Question() {
	this.title = "Undefined question";
	this.points = 0;
}


function Player() {
	this.score = 0;
};

Player.prototype.playSound = function() {
	// Play dat sound!
}