const debug = 1;
const initialTheme = "Crimson Charm";

const doc = document,
	  id  = "getElementById",
	  cl  = "getElementsByClassName",
	  cr  = "createElement",
	  ap  = "appendChild";

var frame, face,	hands,
	hours, minutes, trans,
	holdr, themes,  curse,
	heh;// quite a  verse!

window.onload = init;




function init() {
	// Getting references
	frame   = doc[id]("frame");
	face    = doc[id]("face");
	hands   = doc[cl]("hands");
	
	heh     = doc[id]("nose");
	themes  = doc[id]("themes");
	trans   = doc[id]("trans");
	
	holdr   = getRule(".holdr");
	hours   = getRule(".hours");
	minutes = getRule(".minutes");
	
	
	// Well then, let us commence!
	
	
	initThemes();
	finalizeDesign();
	setTimeout(halimate, 500);
	//setTimeout(initClock, 2000); it's inside halimate now
	
	function getRule(selector) {
		let sheet = doc.styleSheets["dyncls"]
		for (let rule of sheet.cssRules)
			if (rule.selectorText == selector)
				return rule;
	}
}



function initClock() {
	let date = new Date();  // Adjusting the timezone offset + 1s for transition
	let time = date.getTime() - date.getTimezoneOffset()*6e4 + 1.25e3;
	
	// Getting clock hands rotation with millisecondth precision
	time    	%= 864e5;
	hands[0].deg = time/12e4;
	time    	%= 36e5;
	hands[1].deg = time/1e4;
	time    	%= 6e4;
	hands[2].deg = time*3/5e2;
	
	// Setting clock hands' rotation
	for (let hand of hands)
		hand.style.transform = "rotate("+hand.deg+"deg)";
	
	
	let dss = doc.styleSheets["um"].cssRules;
	
	// Modifying the animation rules with appropriate values
	// Dynamic keyframes modification: 30/12/2019
	setTimeout(function() {
		for (let i = 0; i < 3; i++) {
			dss[i].findRule("0%").style.transform = "rotate("+hands[i].deg+"deg)";
			dss[i].findRule("100%").style.transform = "rotate("+(360+hands[i].deg)+"deg)";
		}
	}, 0);
	
	// Event handler to kick rotation animation after the transition
	hands[0].addEventListener("transitionend", nonsense);
	
}


function nonsense(e) {
	if (e.propertyName != "transform") return;
	hands[0].removeEventListener("transitionend", nonsense);
	doc.styleSheets["um"].disabled = false;
}





