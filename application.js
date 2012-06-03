$(function() {
	// Set-up
	var round = 1,
		bubbleNumber,
		points,
		question,
		playersCanAnswer = 0,
		questionAvailable = 0,
		playerIsAnswering = 0,
		playerThatIsAnswering,
		questionCount = 0
		isTestingSounds = 1;
		
	var highscore = new Array(3);
		highscore[0] = 0,
		highscore[1] = 0,
		highscore[2] = 0;
	
	var playerHasAnswered = new Array(3);
		playerHasAnswered[0] = 0,
		playerHasAnswered[1] = 0,
		playerHasAnswered[2] = 0;
	
	$(".overlay").hide();
	
	// Show categories
	
	// Collect headers
	var categoryHeadersRound1 = new Array(),
		categoryHeadersRound2 = new Array(),
		currentCategoryHeader = 0;
	$("#round1 .category").each(function(e){
		var categoryHeader = $(this).find("h1").html();
		categoryHeadersRound1.push(categoryHeader);
	});
	
	$("#round2 .category").each(function(e){
		var categoryHeader = $(this).find("h1").html();
		categoryHeadersRound2.push(categoryHeader);
	});

	
	// Set first text
	$("#categories h1").html(categoryHeadersRound1[0]);
	
	// Bring up question
	$(".category div").click(function(e){
		if($(this).data("hasBeenDisplayed") == 1) return false;
		$(this).data("hasBeenDisplayed", 1);
		questionCount++;
		questionAvailable = 1;
		
		// Which bubble was clicked?
		$clickedBubble = $(this),
			points = parseInt($(this).find("span").html()),
			question = $(this).find(".q").html();
		
		// Set data to be displayed
		$overlay = $(".overlay");
		$overlay.find("p").html(question)
			.end().find(".points span").html(points);
			
		// TO-DO: Animate bubble
		
		// Play sound if sound bubble
		if($(this).hasClass("sound")){
			// Play sound
			$(this).find("audio")[0].play();
		}
		
		// Fade in overlay
		$(".overlay").fadeIn();
	});
	
	$("body").keyup(function(e){
		if(e.keyCode == "13" && questionAvailable) {
			// OK to answer!
			playersCanAnswer = 1;
		}
	});
	
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
		
		// Change category on key right
		if(e.keyCode == 39 && round == 1){
			$("#categories h1").fadeOut('fast', function(e){
				currentCategoryHeader++;
				if(currentCategoryHeader >=5) {
					$("#categories").fadeOut();
					return false;
				}
				$("#categories h1").html(categoryHeadersRound1[currentCategoryHeader]).fadeIn('fast');
			});
		}
		
		// Change category (for round 2) on key right
		if(e.keyCode == 39 && round == 2){
			$("#categories h1").fadeOut('fast', function(e){
				currentCategoryHeader++;
				if(currentCategoryHeader >=5) {
					$("#categories").fadeOut();
					return false;
				}
				$("#categories h1").html(categoryHeadersRound2[currentCategoryHeader]).fadeIn('fast');
			});
		}
		
		// Is on almost last slide, will display the last question. PLACE YOUR BETS PEOPLE
		if(e.keyCode == 39	&& showingLastQuestionCategory == 1){
			showLastQuestion();
		}
		
		
		// A player tries to answer
		if((e.keyCode >= 97 && e.keyCode <= 99) || (e.keyCode >= 49 && e.keyCode <= 51)){
			// Stop if players can't answer or if a player is answering
			if(!playersCanAnswer || playerIsAnswering) return false;
			
			// set playerThatIsAnswering to 1,2 or 3
			if(e.keyCode < 60) { 
				playerThatIsAnswering = e.keyCode - 48;	
			} else {
				playerThatIsAnswering = e.keyCode - 96;					
			}
			
			// If player has already answered, return false
			if(playerHasAnswered[playerThatIsAnswering-1]) return false;
			playerHasAnswered[playerThatIsAnswering-1] = 1;
			
			pauseAllSounds();
			// Play player sound
			$("#s" + playerThatIsAnswering)[0].play();
			
			// Show AWESOME pic from answering player
			$("#p" + playerThatIsAnswering + "pic").show();
			
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
				$("#right").show();
				//alert("RÄTT");
				givePointsToPlayer(points, playerThatIsAnswering);
				setTimeout(removeOverlay,600);
				
			} else {
				// Wrong		
				takePointsFromPlayer(points, playerThatIsAnswering);
				
				// Show "FEL"
				$("#wrong").show();
				// Remove overlay after 600 ms
				setTimeout(removeOverlay,600);
				//alert("FEL");
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
		
		
	});
	
	function givePointsToPlayer(points, playerNumber){
		highscore[playerNumber-1] += points;
		updateScoreBoard();
	}
	
	function takePointsFromPlayer(points, playerNumber){
		highscore[playerNumber-1] -= points;
	}
	
	function updateScoreBoard(){
		// Update score board
		for(var i = 0; i < 3; i++){
			var playerHighscore = highscore[i] == 0 ? "000" : highscore[i];
			//alert(i+1 + ": " + playerHighscore);
			$("#highscore .p" + parseInt(i+1) + " span").html(playerHighscore);
		}
				
		// Assumes that if the scoreboard is updated the current round is over
		reset();
	}
	
	function reset(){
		// Remove the blob that was clicked
		$clickedBubble.animate({opacity: 0.0}, 100);
		
		// Reset all cool stuff
		playersCanAnswer = 0,
		questionAvailable = 0,
		points = 0,
		playerIsAnswering = 0;
		
		playerHasAnswered[0] = 0,
		playerHasAnswered[1] = 0,
		playerHasAnswered[2] = 0;
		
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
		$("#sWrong")[0].play();
		updateScoreBoard();
		reset();
	}
	
	function removeOverlay(){
		$(".playerpic").hide();
		$("#wrong").hide();
		$("#right").hide();
		
		// Were all players wrong?
		if(playerHasAnswered[0] == 1 && playerHasAnswered[1] && playerHasAnswered[2]){
			allPlayersWereWrong();
		}
		
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
		$("#categories h1").html(categoryHeadersRound2[0]);
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

});