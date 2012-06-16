$(function() {
	// Initialize
	var JP = new Game();
	
	var player1 = new Player(),
		player2 = new Player(),
		player3 = new Player();
	
	// TODO: set dynamically after counting boards in HTML	
	var board1 = new Board(),
		board2 = new Board();
	
	JP.players.push(player1, player2, player3);
	JP.boards.push(board1, board2);
	
	// Old set-up
	var round = 1,
		questionAvailable = 0,
		playerIsAnswering = 0,
		playerThatIsAnswering,
		questionCount = 0,
		currentCategoryHeader = 0,
		isTestingSounds = 1;
	
	$(".overlay").hide();
		
	// Collect headers and questions and create objects
	$(".round").each(function(index){
		$(this).find(".category").each(function(e){
			var categoryTitle = $(this).find("h1").html(),
				newCategory = new Category();
			newCategory.title = categoryTitle;
			
			// Find questions in category and add to category
			$(this).find(".q").each(function(questionIndex){
				var questionHTML = $(this).html(),
					questionPoints = parseInt($(this).parent().find("span").html()),
					newQuestion = new Question();
				newQuestion.title = questionHTML;
				newQuestion.points = questionPoints;
				newCategory.questions.push(newQuestion);	
			});
			
			// Add category to board			
			JP.boards[index].categories.push(newCategory);
		});
	});
	
	// A question is clicked: Show it
	$(".category div").click(function(e){
		if($(this).data("hasBeenDisplayed") == 1) return false;
		$(this).data("hasBeenDisplayed", 1);
		questionCount++;
		questionAvailable = 1; // Replace with: if(JP.currentQuestion.shown == false) or something similar

		var questionIndex = $(this).index()-1,
			categoryIndex = $(this).parent().index(),
			boardIndex = $(this).parent().parent().index();
		JP.currentQuestion = JP.boards[boardIndex].categories[categoryIndex].questions[questionIndex];
				
		// Set data to be displayed
		$overlay = $(".overlay");
		$overlay.find("p").html(JP.currentQuestion.title)
			.end().find(".points span").html(JP.currentQuestion.points);
			
		// TO-DO: Animate bubble - flip and expand
		// Remove the blob that was clicked
		$(this).animate({opacity: 0.0}, 100);
		
		// Play sound if sound bubble
		if($(this).hasClass("sound")){
			$(this).find("audio")[0].play();
			// Set OK to answer!
			JP.answersAccepted = true;
		} else if ($(this).hasClass("video")) { // If not, play if it is a video
			// Fade in background, and once that is finished, show and play the movie
			$(".videoOverlay").fadeIn('fast', function(){
				$(".videoOverlay video").eq(questionIndex).fadeIn('fast')[0].play();
			});
			// Set OK to answer! 
			JP.answersAccepted = true;
		}
		
		// Fade in overlay
		$(this).hasClass("video") ? 0 : $(".overlay").fadeIn();
	});
	
	$("body").keyup(function(e){
	});
	
	// TODO: Remove this and set in intro function
	// Set first text for intro
	$("#categories h1").html(JP.boards[0].categories[0].title);
	
	// Keyboard events
	$("body").keyup(function(e){
	
		// Are we testing sound?
		if(isTestingSounds == 1){
			if(e.keyCode >= 97 && e.keyCode <= 99){
				playerThatIsAnswering = e.keyCode - 96;
				// Play player sound
				$("#s" + playerThatIsAnswering)[0].play();
			
				// Show AWESOME pic from answering player
				$("#p" + playerThatIsAnswering + "pic").fadeIn('slow', function(e){
					$("#p" + playerThatIsAnswering + "pic").fadeOut('slow');	
				});
				return false;
				
	    	} else if (e.keyCode == 39) {
	    		isTestingSounds = 0;
	    		$("#testSounds").fadeOut();
	    		
	    		return false;
	    	}
		}
		
		// Round intro!
		// Change category on key right
		// Don't if a qurstion is showing
		if(e.keyCode == 39 && round == 1 && !questionAvailable && !JP.answersAccepted){
			$("#categories h1").fadeOut('fast', function(e){
				currentCategoryHeader++;
				if(currentCategoryHeader >=5) {
					$('#round1 .category > div').hide();
					var delay = 80;
                    $("#categories").fadeOut(300, function(){
                        for (var i=0; i < 5; i++) {
                            $('#round1 .category:eq(0) > div:eq('+i+')').delay(delay*i).fadeIn();
                            $('#round1 .category:eq(1) > div:eq('+i+')').delay((delay*5)+delay*i).fadeIn();
                            $('#round1 .category:eq(2) > div:eq('+i+')').delay((delay*10)+delay*i).fadeIn();
                            $('#round1 .category:eq(3) > div:eq('+i+')').delay((delay*15)+delay*i).fadeIn();
                            $('#round1 .category:eq(4) > div:eq('+i+')').delay((delay*20)+delay*i).fadeIn();
                        };
                    });
					return false;
				}
				$("#categories h1").html(JP.boards[0].categories[currentCategoryHeader].title).fadeIn('fast');
			});
		}
		
		// Round intro again!
		// Change category (for round 2) on key right
		if(e.keyCode == 39 && round == 2){
			$("#categories h1").fadeOut('fast', function(e){
				currentCategoryHeader++;
				if(currentCategoryHeader >=5) {
					$('#round2 .category > div').hide();
					var delay = 80;
                    $("#categories").fadeOut(300, function(){
                        for (var i=0; i < 5; i++) {
                            $('#round2 .category:eq(0) > div:eq('+i+')').delay(delay*i).fadeIn();
                            $('#round2 .category:eq(1) > div:eq('+i+')').delay((delay*5)+delay*i).fadeIn();
                            $('#round2 .category:eq(2) > div:eq('+i+')').delay((delay*10)+delay*i).fadeIn();
                            $('#round2 .category:eq(3) > div:eq('+i+')').delay((delay*15)+delay*i).fadeIn();
                            $('#round2 .category:eq(4) > div:eq('+i+')').delay((delay*20)+delay*i).fadeIn();
                        };
                    });
					
					
					return false;
				}
				$("#categories h1").html(JP.boards[1].categories[currentCategoryHeader].title).fadeIn('fast');
			});
		}
		
		// Is on almost last slide, will display the last question. PLACE YOUR BETS PEOPLE
		if(e.keyCode == 39	&& showingLastQuestionCategory == 1){
			showLastQuestion();
		}
		
		// Set OK to answer!
		if(e.keyCode == "13" && questionAvailable) {
			// OK to answer!
			JP.answersAccepted = true;
		}
		
		// A player tries to answer
		if((e.keyCode >= 97 && e.keyCode <= 99) || (e.keyCode >= 49 && e.keyCode <= 51)){
			// Stop if players can't answer or if a player is answering
			if(!JP.answersAccepted || playerIsAnswering) return false;
			
			// set playerThatIsAnswering to 1,2 or 3
			// TODO: Change this to 0, 1 or 2 -everywhere-
			if(e.keyCode < 60) { 
				playerThatIsAnswering = e.keyCode - 48;
			} else {
				playerThatIsAnswering = e.keyCode - 96;	
			}
			
			// If player has already answered, return false
			if(JP.playerHasAnswered(JP.players[playerThatIsAnswering-1])) return false;
			// Else, add to answered list as that players answers
			JP.playersThatHaveAnswered.push(JP.players[playerThatIsAnswering-1]);
			
			pauseAllSounds();
			// Is video playing? Pause it!
			$(".videoOverlay video:visible")[0] ? $(".videoOverlay video:visible")[0].pause() : console.log("No video is playing");
			
			// TODO: Replace the two functions below with one function: "presentPlayer(player)"
			// Play player sound
			$("#s" + playerThatIsAnswering)[0].play();
			
			// Show AWESOME pic from answering player
			$("#p" + playerThatIsAnswering + "pic").show();
			
			// Show name from the player that is answering
			var playerName = $("#p" + playerThatIsAnswering + "Name").html();
			$("#playerNameFromAnsweringPlayer").html(playerName);
			$("#playerNameFromAnsweringPlayer").show();
			
			// Allow judgement, prevents more answers
			playerIsAnswering = 1;
		}
		
		// Judgement - "W" or "R" key is pressed
		if(e.keyCode == "82" || e.keyCode == "87"){
			if(!playerIsAnswering && e.keyCode == "87"){
				$("#sBidup")[0].play();
				removeOverlay();
				reset();
			}
			if(!playerIsAnswering) return false;
			// Right?
			if(e.keyCode == 82) {
				// Correct!							
				//$("#right").show();
				JP.players[playerThatIsAnswering-1].score += JP.currentQuestion.points;
				removeOverlay();
				// Reset the UI. Totally fucked up function: redo
				
				// If right, and video queston - start playing the video again
				//$(".videoOverlay video:visible")[0] ? $(".videoOverlay video:visible")[0].play() : reset();
				if ($(".videoOverlay video:visible")[0]) {
					$(".videoOverlay video:visible")[0].play();
				} else {
					reset();
					// If not videoOverlay, show points and count up
					showHighScoreAndAnimate(playerThatIsAnswering);
				}
				
			} else {
				// Wrong		
				JP.players[playerThatIsAnswering-1].score -= JP.currentQuestion.points;
				
				// Play wrong sound
				$("#sBidup")[0].play();
				
				//$("#wrong").show();
				// Remove overlay after 600 ms
				setTimeout(removeOverlay,600);	
			}
		}	
		
		// MAN TRYCKER PÅ M
		if(e.keyCode == 77){
			cheatStartRound2();
		}
		
		// MAN TRYCKER PÅ H
		if(e.keyCode == 72){
			toggleHighScores();
		}
		
		// Spacebar. Ifall en video visas, pausa / spela den
		if (e.keyCode == 32) {
			toggleVisibleVideoPlayState();
		}
		
		// Man trycker på "P". Spela det-kukar-ur-ljudet
		if (e.keyCode == 80) {
			var theSound = $("#sKukarUr")[0];
			if(theSound.paused) {
				theSound.play();
			} else {
				// If is playing, pause instead
				theSound.pause();
				theSound.currentTime = 0
			}
		}
		
	});
	
	// TODO: Rename to newRound()
	function reset(){		
		// Reset all cool stuff
		JP.answersAccepted = false,
		questionAvailable = 0,
		playerIsAnswering = 0;
		
		JP.playersThatHaveAnswered = [];
		
		// Reset UI
		$(".overlay").fadeOut();
		
		// Is round 1 over?
		if(questionCount >= 25 && round == 1){
			startRound2();
		}
		
		if(questionCount >= 50 && round == 2){
			showLastQuestionCategory();
		}
	}
	
	function allPlayersWereWrong(){
		// $("#sWrong")[0].play(); – Sound is too annoying. Change to a new one
		reset();
	}
	
	function removeOverlay(){
		$(".playerpic").hide();
		$("#wrong").hide();
		$("#right").hide();
		$("#playerNameFromAnsweringPlayer").hide();
		
		// Were all players wrong?
		if(JP.playersThatHaveAnswered.length >= JP.players.length) allPlayersWereWrong();
		
		// Let players answer again
		playerIsAnswering = 0;
	}
	
	function startRound2(){
		$("#round1").fadeOut('fast', function(e){
			showRound2();
		});
		round = 2;
	}
	
	function showRound2(){
		currentCategoryHeader = 0;
		$("#categories h1").html(JP.boards[1].categories[0].title);
		$("#categories h1").fadeIn();
		$("#categories").fadeIn();
		$("#round2").fadeIn();
	}
	
	function cheatStartRound2(){
		questionCount = 25;
		reset();
	}
	
	function toggleHighScores(){
		if($("#highscore").is(":visible")){
			$("#highscore").fadeOut();
		} else {
			// If highscore will be shown, update the scores
			for(var i = 0; i < 3; i++){
				var playerHighscore = JP.players[i].score == 0 ? "000" : JP.players[i].score;
				//alert(i+1 + ": " + playerHighscore);
				$("#highscore .p" + parseInt(i+1) + " span").html(playerHighscore);
			}
			
			$("#highscore").fadeIn();
		}
	}
	
	function pauseAllSounds(){
		$("#round1 .c2 audio").each(function(e){
			$(this)[0].pause();
		});
	}
	
	var showingLastQuestionCategory = 0;
	function showLastQuestionCategory(){
		// Is showing last category
		showingLastQuestionCategory = 1;
		$("#finalQuestionCategory").fadeIn();
	}
	
	function showLastQuestion(){
		$("#finalQuestion").fadeIn();	
	}
	
	function toggleVisibleVideoPlayState(){
		$(".videoOverlay video:visible")[0].paused ? $(".videoOverlay video:visible")[0].play() : $(".videoOverlay video:visible")[0].pause();
	}
	
	// When a video finishes, hide all shit and reset
	$(".videoOverlay video").each(function(e){
		var video = $(this)[0];
		video.addEventListener('ended',hideVideoAndReset,false);
	});
	
	function hideVideoAndReset() {
		if($(".videoOverlay video:visible")) {
			$(".videoOverlay video:visible").hide();
			$(".videoOverlay").fadeOut('fast');
			reset();
		}
	}
	
	function setOKToAnswer() {
		if (questionAvailable) {
			JP.answersAccepted = true;
		}
	}
	
	function showHighScoreAndAnimate(playerThatAnswered) {
		// Calculate highscore
	    for(var i = 0; i < 3; i++){
	        var playerHighscore = JP.players[i].score == 0 ? "000" : JP.players[i].score;
	        $("#highscore .p" + parseInt(i+1) + " span").html(playerHighscore);
	    }
	    
		// Show the highscore board
		$("#highscore").fadeIn('fast', function(){
		
			// Grow and shrink that players' points
			$("#highscore .p" + playerThatAnswered + " span").animate({fontSize: 130.0}, 250, function(){
				// Animate back
				$(this).animate({fontSize: 120.0}, 250);
			});

		});
			
		
		//$("#highscore .p" + playerThatAnswered + " span").fadeOut('fast');

	}

});