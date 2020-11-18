function GetCookie(name) {
	var cook = (document.cookie.replace(/=/g, ";")).split(";");
	if (cook.indexOf(name) == 0) {
		return cook[cook.indexOf(name) + 1];
	} else { 
		if (cook.indexOf(" " + name) != -1) {
			return cook[cook.indexOf(" " + name) + 1];
		} else {
			return false;
		}
	}
}

function SetCookie(name,value,exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = name + "=" + value + ";" + expires +
	";path=/";
}

function DeleteCookie(name) {
	SetCookie(name,"expired", -10);
}