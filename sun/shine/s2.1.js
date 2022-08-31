// glow on text

function finalizeDesign() {
	let el, hl;
	
	for (let i = 1; i <= 60; i++) {
		hl = doc[cr]("div");
		el = doc[cr]("div");
		hl.className = "holdr";
		
		if (i%5)
			el.className = "minutes";
		else {
			el.className = "hours";
			el.innerHTML = i/5;
			if (i < 30)
				el.style.transform = "rotate(1turn)";
			else
				el.style.transform = "rotate(-2turn)";
		}
		
		hl[ap](el);
		face.insertBefore(hl, trans);
	}
	
	doc.styleSheets["um"].disabled = true;
	
	
	
}



function halimate() {
	let hls = doc[cl]("holdr");
	let t   = .6;
	let i   = 1;
	
	for (let hl of hls) {
		let d = t * ((i%30) || 30) / 30;
		if (i%5)
			hl.style.transition = `opacity ${t}s ease-in ${2*t+d}s`;
		else {
			hl.style.transition = `height ${t}s ease-out ${d}s, opacity ${t}s ease-in ${d}s`;
			let hr = hl.children[0];
			hr.style.transition = `transform ${t}s ease-in-out ${2*t+d}s, color 1s, text-shadow 1s`;
			hr.style.transform = `rotate(${-6*i}deg)`;
		}
		hl.style.transform = `rotate(${6*i++}deg)`;
	}
	
	holdr.style.height = "50%";
	holdr.style.opacity = "1";
	
	// Kick off initClock after the 12th hour number has transitioned to the proper position
	hls[59].addEventListener("transitionend", function f(e) {
		if (e.propertyName != "height") return;
		e.target.removeEventListener("transitionend", f);
		initClock();
	});
}


function lastTheme() {
	try {
		let name = window.localStorage._lastTheme;
		window.lcs = true;
		if (!name) {
			firsttimehuh();
			throw "First time huh";
		}
		setTheme(name);
	} catch(error) {
		setTheme(initialTheme);
		//if (debug) curse(error.toString());
	}
	
}

function firsttimehuh() {
	setTimeout('alert("Tap on the clock to change theme");', 10000);
}

function initThemes() {
	let el;
	for (let name in thms) {
		el = doc[cr]("div");
		el.className = "thm";
		el.innerHTML = name;
		themes[ap](el);
	}
	themes.addEventListener("click", setTheme);
	
	themes.active  = false;
	themes.timeout = 0;
	
	themes.toggle = () => {
		if (themes.active) {
			themes.active = false;
			themes.style.maxWidth = "0";
		} else {
			themes.active = true;
			themes.style.maxWidth = "40%";
		}
	}
	
	themes.transcluent = () => {
		themes.style.opacity = ".4";
		if (themes.timeout)
			clearInterval(themes.timeout);
		
		themes.timeout = setTimeout(() => {
			themes.style.opacity = ".95";
			themes.timeout = 0;
		}, 3500);
	}
	
	frame.setAttribute("onclick", "themes.toggle()");
	//themes.setAttribute("onclick", "themes.transcluent()");
	
	// Hidden elements to compare the lightness of frame & face color
	frame[ap](frame.telm = doc[cr]("div"));
	face[ap](face.telm   = doc[cr]("div"));
	frame.cs = getComputedStyle(frame.telm);
	face.cs  = getComputedStyle(face.telm);
	
	lastTheme();
}


function setTheme(arg) {
	let name, thm;
	
	if (typeof arg == "string")
		name = arg;
	else if (typeof arg == "object")
		if (arg.target.className == "thm")
			name = arg.target.innerHTML;
	
	if (!(name && (thm = thms[name])))
		return;
	
	if (window.lcs)
		localStorage._lastTheme = name;
	
	if (!debug && thm.z) {
		console.log(thm.z);
		thm.z  = "";
	}
	
	
	let a, b, f, h, m, s, hr, mn, fr, fs, tr, ns;
	
	a  = thm[thm.a]  || thm.a  || "#555";
	f  = thm[thm.f]  || thm.f  || "#FFF";
	b  = thm[thm.b]  || thm.b  || "#333";
	h  = thm[thm.h]  || thm.h  || a;
	m  = thm[thm.m]  || thm.m  || a;
	s  = thm[thm.s]  || thm.s  || a;
	
	hr = thm[thm.hr] || thm.hr || h;
	mn = thm[thm.mn] || thm.mn || m;
	fr = thm[thm.fr] || thm.fr || s;
	fs = thm[thm.fs] || thm.fs || fr;
	tr = thm[thm.tr] || thm.tr || s;
	ns = thm[thm.ns] || thm.ns || f;
	
	
	
	// Checking for fallback color in case when frame or face background is an image
	let k;
	if ((k = fs.indexOf("url(")) > -1)
		if (k > 3) fs = fs.slice(0, k-1);
		else { fbc("fs"); return; }
	
	if ((k = ns.indexOf("url(")) > -1)
		if (k > 3) ns = ns.slice(0, k-1);
		else { fbc("ns"); return; }
	
	function fbc(s) {
		console.log(`Please specify a color for ${s}, or add a fallback background color in ${(s == "fs")? "fr": "f"}`);
	}
	
	// The real setting
	// Clock
	hands[0].style.background  = h;
	hands[1].style.background  = m;
	hands[2].style.background  = s;
	hands[2].style.borderColor = s;
	
	doc.body.style.background  = b
	face.style.background      = f;
	hours.style.color    	  = hr;
	minutes.style.background   = mn;
	frame.style.background     = fr;
	heh.style.background       = ns;
	
	face.style.boxShadow  = "inset 0 0 4px "+fs;
	frame.style.boxShadow = "0 0 2px "+fs;
	
	// Themes
	frame.telm.style.background = fs;
	face.telm.style.background  = f;
	
	let y1 = thm[thm.th] || thm.th || fs;
	let y2 = f;
	
	if (!thm.th) {
		if (dlt() < 20) {
			y1 = hr;
			(!thm.tr) && (tr = hr);
		}
		(thm.y) && ([y1, y2] = [y2, y1]);
	}
	
	themes.style.background = y1;
	themes.style.color      = y2;
	themes.style.boxShadow  = "0 0 2px "+fs;
	
	// Glow
	if (thm.x) {
		for (let hand of hands)
			hand.style.filter   = "drop-shadow(0 0 2px "+hand.style.background+")";
		hours.style.textShadow  = "0 0 2px "+hr;
		hours.style.opacity     = "1";
		minutes.style.boxShadow = "0 0 2px "+mn;
		heh.style.boxShadow     = "inset 0 0 2px "+s;
		themes.style.textShadow = "0 0 2px "+y2;
		trans.style.textShadow  = "0 0 2px "+tr;
	}
	else if (hands[0].style.filter) {
		for (let hand of hands)
			hand.style.filter   = "";
		hours.style.textShadow  = "";
		hours.style.opacity     = "";
		minutes.style.boxShadow = "";
		heh.style.boxShadow     = "";
		themes.style.textShadow = "";
		trans.style.textShadow  = "";
	}
	
	
	// Logo / Theme Name
	if (trans.text !== undefined)
		trans.removeEventListener("transitionend", transtext);
	
	trans.text  = (thm.t !== undefined)? thm.t: name;
	//trans.glow  = thm.x;
	trans.style.color = tr;
	trans.lastElementChild.style.color = mn;
	trans.style.filter = "opacity(0) blur(5px)";
	trans.addEventListener("transitionend", transtext);
}

function transtext(e) {
	if (e.propertyName != "filter") return;
	trans.removeEventListener("transitionend", transtext);
	
	//trans.innerHTML = trans.text;
	delete trans.text;
	
	if (trans.style.textShadow)
		trans.style.filter = "opacity(1)";
	else
		trans.style.filter = "opacity(.6)";
}
	

//mjx
function dlt() {
	return 100*Math.abs(lt(face.cs.backgroundColor)-lt(frame.cs.backgroundColor));
	
	function lt(clr) {
		let c = clr.match(/\d+/g).slice(0, 3);
		for (i in c)
			c[i] = parseInt(c[i]);
		return (c[0]*.33 + c[1]*.44 + c[2]*.23)/255;
		// Custom weights for rgb channels
	}
}



function dbg() {
	alert("!going smooth?");
}




