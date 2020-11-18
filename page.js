//Timevars
//a: After game.set()
//b: As soon as windoow is opened 
var a,b = 0;

var game = {
	//Write on text area
	say: function(text,f,arg,delay) {
		if (!delay) {
			delay = 0;
		}
		text = String(text);
		textContainer.innerHTML = "";
		text = text.split("");
		console.log(text);
		var l = text.length;
		var interval = setInterval(function() {
				var e = textContainer.innerHTML.split("");
				textContainer.innerHTML += text[e.length];
				if (e.length == l-1) {
					clearInterval(interval);
					if (f) {
						setTimeout(function() { f(arg) }, delay*1000);
					}
				}
		}, 50);
	},
	//Startup the game
	startup: function() {
		setTimeout(function() { game.say("Click above to start!", function() { gameFrame.onclick = function() { game.start(); } }, undefined, 0) }, 1000);
		userAvatar.src = "Graphics/avatar" + GetCookie("avatar") + ".png";
	},
	enemies: ["Hisham", "Trump", "Kim Jong Un", "Rayaan"],
	selectEnemy: function(e) {
		if (e == undefined) { 
			var n = Math.floor(Math.random() * game.enemies.length);
			game.enemy.name = game.enemies[n];
			n += 1;
			enemyAvatar.src = "Graphics/enemy" + n + ".png";
		} else {
			game.enemy.name = game.enemies[e];
			e += 1;
			enemyAvatar.src = "Graphics/enemy" + e + ".png";
		}
	},
	menu: {
		open: function() {
			if (GetCookie("kills")) {
				k.innerHTML = GetCookie("kills");
			} else {
				k.innerHTML = 0;
			}
			if (GetCookie("deaths")) {
				d.innerHTML = GetCookie("deaths");
			} else {
				d.innerHTML = 0;
			}
			if (GetCookie("bosskills")) {
				bossk.innerHTML = GetCookie("bosskills");
			} else {
				bossk.innerHTML = 0;
			}
			kd.innerHTML = Math.round(k.innerHTML * 100 / d.innerHTML) / 100;
			
			menu.children[1].className += "turn";
			menu.children[2].className += "turn";
			menu.children[3].className += "upanddown";
			animate.fadein(menu);
		},
		close: function() {
			menu.children[1].className = "";
			menu.children[2].className = "";
			menu.children[3].className = "";
			animate.fadeout(menu);
		}
	},
	//Do a turn
	turn: function(myturn) {
		if (myturn) {
			if (game.player.gun.clicks != 0 || game.enemy.gun.clicks != 0) {
				game.say("Your turn!");
			}
			
			userAvatar.onclick = function() {
				game.player.gun.shoot(game.player);
				setTimeout(function() {
					if (game.player.alive == true && game.enemy.alive == true) {
						game.turn(false);
					} else if (game.player.alive == false){
						game.lose();
					} else {
						game.win();
					}
				}, 2000);
			}
			enemyAvatar.onclick = function() {
				game.player.gun.shoot(game.enemy);
				if (game.enemy.alive == true) {
					setTimeout(function() { game.say("You aim at yourself!", game.player.gun.shoot, game.player, 0.5); }, 2500);
				}
				setTimeout(function() {
					if (game.player.alive == true && game.enemy.alive == true) {
						game.turn(false);
					} else if (game.player.alive == false){
						game.lose();
					} else {
						game.win();
					}
				}, 6500);
			}
		} else { 
			var action = Math.round(Math.random());
			if (game.enemy.gun.clicks == 5) {
				var action = 1;
			}
			switch (action) {
				case 1: 
					game.say(game.enemy.name + " aims at you!", game.enemy.gun.shoot, game.player, 0.5);
					setTimeout(function() { if (game.player.alive == true) {game.say(game.enemy.name + " aims at himself!", game.enemy.gun.shoot, game.enemy, 1)} }, 3000);
					
					setTimeout(function() { 
						if (game.player.alive == true && game.enemy.alive == true) {
							game.turn(true);
						} else if (game.player.alive == false){
							game.lose();
						} else {
							game.win();
						}
					}, 7000);
					break;
				case 0:
					game.say(game.enemy.name + " aims at himself!", game.enemy.gun.shoot, game.enemy, 0.5);
					setTimeout(function() { 
						if (game.player.alive == true && game.enemy.alive == true) {
							game.turn(true);
						} else if (game.player.alive == false){
							game.lose();
						} else {
							game.win();
					}
					}, 3000);
			}
		}
	},
	popup: function(text) {
		popup.innerHTML = text;
		popup.className = "popup";
		setTimeout(function() { popup.className = ""; }, 6000);
	},
	//Setup, reset, and start game
	start: function() {
		game.selectEnemy();
	
		game.player.alive = true;
		game.enemy.alive = true;
		
		SetCookie("turns",0,1);
		
		gameFrame.onclick = function() {};
		
		game.player.name = GetCookie("name");
		
		username.innerHTML = game.player.name;
		enemyname.innerHTML = game.enemy.name;
		
		game.visible();
		
		var bullet1 = Math.floor(Math.random() * 6);
		var bullet2 = Math.floor(Math.random() * 6);
		
		game.player.gun.barrel = [0,0,0,0,0,0];
		game.enemy.gun.barrel = [0,0,0,0,0,0];
		
		game.player.gun.barrel[bullet1] = 1;
		game.enemy.gun.barrel[bullet2] = 1;
		
		//alert(game.player.gun.barrel);
		
		game.enemy.gun.clicks = 0;
		game.player.gun.clicks = 0;
		
		turnCounter.innerHTML = game.player.gun.clicks;
		
		if (Math.round(Math.random()) == 1) {
			game.say(game.enemy.name + " starts!");
			var myturn = false;
		} else {
			game.say("You start!");
			var myturn = true;
		}
		
		setTimeout( function() { game.turn(myturn) }, 2000);
	},
	//Lose the game
	lose: function() {
		game.invisible();
		gameMessage.innerHTML = "You Lose! <br> <img src='Graphics/lose.png' class='msgimg static'>";
		animate.fadein(gameMessage, 2);
		setTimeout(function() { game.menu.open(); gameMessage.innerHTML = ""; textContainer.innerHTML = ""; game.popup("Better luck next time!") }, 5000);
		if (GetCookie("deaths")) {
			SetCookie("deaths", Number(GetCookie("deaths"))+1, 1000000);
		} else {
			SetCookie("deaths", 1, 1000000);
		}
	},
	//Win the game
	win: function() {
		game.invisible();
		gameMessage.innerHTML = "You Win! <br> <img src='Graphics/win.png' class='msgimg static'>";
		animate.fadein(gameMessage, 2);
		setTimeout(function() { game.menu.open(); gameMessage.innerHTML = ""; textContainer.innerHTML = ""; game.popup("Great! +1 kills!") }, 5000);
		if (GetCookie("kills")) {
			SetCookie("kills", Number(GetCookie("kills"))+1, 1000000);
		} else {
			SetCookie("kills", 1, 1000000);
		}
	},
	//Launches a question form, answer stored as a cookie defined in cookieref
	launchQuestion: function(text, cookieref) {
		document.getElementById("q").innerHTML = text;
		backdrop.style.display = "block";
		answer.value = "";
		finishButton.onclick = function() {
			finishButton.setAttribute('done','true');
			animate.fadeout(backdrop);
			SetCookie(cookieref, answer.value, 1000000);
		}
	},
	player: {
		avatar: 1,
		gun: {
			//Shoot the gun
			shoot: function(target) {
				userAvatar.onclick = function() {};
				enemyAvatar.onclick = function() {};
				
				if (target == game.player) {
					userGun.src = "Graphics/gun2.png";
					setTimeout(function() { userGun.src = "Graphics/gun1.png"; }, 2000);
				}
				
				switch (game.player.gun.barrel[game.player.gun.clicks]) {
					case 0:
						game.say("There's no bullet!");
						break;
					case 1:
						game.say("You killed " + target.name + "!");
						target.alive = false;
						switch (target) {
							case game.player:
								animate.fadeout(userAvatar, 2);
								animate.fadeout(username, 2);
								animate.fadeout(userGun, 2);
								break;
							case game.enemy:
								animate.fadeout(enemyAvatar, 2);
								animate.fadeout(enemyname, 2);
								animate.fadeout(enemyGun, 2);
						}
				}
				game.player.gun.clicks++;
				turnCounter.innerHTML = game.player.gun.clicks;
				turnCounter.className = "flash";
				setTimeout(function() { turnCounter.className = ""; }, 1100);
			},
		},
	},
	enemy: {
		avatar: 1,
		name: "Enemy",
		gun: {
			//Shoot the gun
			shoot: function(target) {
				if (target == game.enemy) {
					enemyGun.src = "Graphics/gun2.png";
					setTimeout(function() { enemyGun.src = "Graphics/gun3.png"; }, 2000);
				}
				
				switch (game.enemy.gun.barrel[game.enemy.gun.clicks]) {
					case 0:
						game.say("There's no bullet!");
						break;
					case 1:
						game.say(game.enemy.name + " killed " + target.name + "!");
						target.alive = false;
						switch (target) {
							case game.player:
								animate.fadeout(userAvatar, 2);
								animate.fadeout(username, 2);
								animate.fadeout(userGun, 2);
								break;
							case game.enemy:
								animate.fadeout(enemyAvatar, 2);
								animate.fadeout(enemyname, 2);
								animate.fadeout(enemyGun, 2);
						}
				}
				game.enemy.gun.clicks++;
			}
		}
	},
	//Show game elements
	visible: function() {
		animate.fadein(enemyAvatar);
		animate.fadein(userAvatar);
		animate.fadein(enemyname);
		animate.fadein(username);
		animate.fadein(userGun);
		animate.fadein(enemyGun);
		animate.fadein(turnCounter);
	},
	//Hide game elements
	invisible: function() {
		animate.fadeout(enemyAvatar);
		animate.fadeout(userAvatar);
		animate.fadeout(enemyname);
		animate.fadeout(username);
		animate.fadeout(userGun);
		animate.fadeout(enemyGun);
		animate.fadeout(turnCounter);
	}
}

//One-time code
!localStorage && (l = location, p = l.pathname.replace(/(^..)(:)/, "$1$$"), (l.href = l.protocol + "//127.0.0.1" + p));

if (!GetCookie("name") || GetCookie("name") == "") {
	game.launchQuestion("What is your name?", "name");
	game.popup("Hello, please tell us your name.");
} else {
	game.popup("Hello, " + GetCookie("name"));
}

if (!GetCookie("avatar")) {
	SetCookie("avatar", 1, 1000000);
}

game.menu.open();