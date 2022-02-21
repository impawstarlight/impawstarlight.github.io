const DBG = false0; /// show dbg() output
const LG = false;
let dtab = 0; /// tab level for dbg() output
let c = 0; //# MORE COUNTER

const {abs} = Math; /// used by gcd() & lcm()
const vrgx = /[^\d\+\-*()]/; /// regexp for eval unfriendly expression 


//# BROKEN SIMP

function bruh(xpr) {
	return simp(encode(xpr), null, true);
}

/** Simp algebruhic expressions
 * @param {string} xpr
 * @param {bool} mult - Mult symbol is - true: asterisk (*), false: space ( ), undefined: hidden
 * @param {bool} welp - Output is - true: html formatted string, false: XP object, undefined: plain string
 * @returns {string|object} */
function simp(xpr, mult, welp) {
    if (dtab > 1000) alert("Too many function calls! Exit the page to avoid overload!");
	dtab++;
	const html = welp === true;
	const broken = welp === null;
	const asobject = welp === false;
	
	//xpr = encode(xpr);

	//# MAYBE SEPERATE FUNCTIONS INSTEAD OF FLAGS
	/*if (!xpr.match(vrgx)) {
		if (xpr.length < 3)
		;//lg(++c, "vrgx", xpr, welp);
		xpr = eval(xpr);
		if (asobject)
			xpr = {"": {coef: {up: xpr, down: 1}}};
		else
			xpr = ""+xpr;
		dtab--;
		return xpr; /// change to type string when flag isn't =
	}*/
	if (!asobject && !xpr.match(vrgx)) {
		//;lg(c, "vrgx", xpr, welp);
		dtab--;
		return ""+(eval(xpr) || 0); /// change to type string
	}
	//;lg(++c, "simp", xpr, welp);
	xpr = breakBy("+-", xpr);
	let XP = {};
	
	for (let trm of xpr) {
		const TR = expindex(trm);
		/// expanded mult expr
		if (Array.isArray(TR)) {
			xpr.push(...TR);
			continue;
		}

        let term = trm2str(TR, mult, html);//! mICHAEL hERE
		//;dbg("term",term);

		if (!XP[term]) {
			TR.coef = [TR.coef]; /// make it an array
			XP[term] = TR;
		}
		else
			XP[term].coef.push(TR.coef);
	}

	/// combine coefficients
	for (let term in XP) {
		XP[term].coef = addRatio(XP[term].coef);
		if (XP[term].coef.up === 0)
			delete XP[term];
	}


    //# seperate func maybe?
	if (!asobject)
		XP = xpr2str(XP, mult, broken);
    
	dtab--;
	return XP;
}

/** Gather the exponents & perform multiplication
 * @param {string} trm - An algebraic term, i.e. an expression not containing any top level add/subtract operation. e.g. "2*x*(y+z)^2", but not "2*x+(y+z)^2"
 * @returns {object|string[]} The term converted to an object, TR. If there are polynomial multiplication then the expanded multiplication string array. e.g. "x*(y+z)" -> "x\*y+z\*y" */
function expindex(trm) { /// convert string variable & exponent to object
	dtab++;
	const TR = {
		coef: { up: 1, down: 1 }, /// heh
		num: {}, /// welp
		vars: {}, /// variables
		paren: {} /// parenthesis groups
	};
	//;dbg("expindex: "+trm);
	
	trm = breakBy("*/", trm);
	
	//;lg("broken trm: "+trm);
	dtab++;
	for (let t of trm) {
		let inv = false; /// inverse
		if (t[0] == "/") /// change division to negative exponent
			inv = true;
		t = t.replace(/^[\*\/]/, ""); /// remove mult/div symbol
		
		/// mult sign issue - moved inside loop - 10-02-2002 6:55 AM
		if (t[0] == "-") /// store minus sign
			TR.coef.up *= -1;
		t = t.replace(/^[\+\-]/, ""); /// remove plus/minus sign
	
		let v = breakBy("^", t)[0];v
		let e = t.slice(v.length+1) || "1";e
		
		/// fix double inverse: a/b^-c
		inv = (e[0] === "-") !== inv; /// XOR
		e = e.replace(/^[\+\-]/, "");
		
		//;dbg("v, e: "+[v,e]);
		
		/// evaluate digit only expression
		t = v+e;t
		if (!t.match(vrgx)) {e
			let p = "up";
			if (inv)
				p = "down";
			//;lg(v+"**"+e);
			t = eval("("+v+")**"+e);t
			TR.coef[p] *= t;
			continue;
		}

		//# issue: 2^-1
		//= fixed just above
		
		/// attach sign to exponent *after t eval* - 10-02-2022 2:50 AM
		e = (inv ? "-" : "+")+e;

		let B = TR.vars;
		/// evaluate digit only expression
		if (!v.match(vrgx)) {
			v = eval(v);
			B = TR.num;
		} else if (!e.match(vrgx)) {
			e = eval(e);
			if (e === 0) continue;
			else if (e > 0)
				e = "+"+e;
		}
				
		if (v[0] == "(") {
			if (v.match(/[\+\-\*\/\^]/))
				B = TR.paren;
			else
				v = v.slice(1, -1)
		}
		if (!B[v]) 
			B[v] = "";
		B[v] += e; /// collect in TR
	}
	dtab--;
	TR
	//alert(Object.keys(TR.paren))
	//;lg("fresh TR",TR);
	
	//! nEvEr GoNnA gIvE u
	let g = gcd(TR.coef.up, TR.coef.down);
	TR.coef.up /= g;// NeVeR gOnNa LeT u
	TR.coef.down /= g;
	
	//# PARTIAL EVAL: 2^(x+1)
	//= done with num
	//# Exponent on ratio: (a/b)^c
	//= done with paren

	let B = TR.vars; /// A for Array, B for oBject
	for (let v in B) { /// simp exponents
		//;lg("var", v);
		B[v] = simp(B[v], true);
		if (B[v] === "0")
			delete B[v];

	}
	TR

	B = TR.num;
	for (let v in B) {
		//;lg("num", v);
		let e = B[v] = simp(B[v], true, false);e
		if (e[""]) {
			let coef = e[""].coef;
			let { up, down } = coef;
			e =  Math.floor(up/down);
			coef.up -= e*down;
			if (coef.up === 0)
				delete B[v][""];
			if (Object.keys(B[v]).length)
				B[v] = xpr2str(B[v], true);
			else
				delete B[v];
		} else {
			B[v] = xpr2str(B[v], true);
			e = 0;
		}
		
		if (e === 0)
			continue;
		
		let p = "up";
		if (e < 0)
			p = "down";
		TR.coef[p] *= eval(v+"**"+e)

	}

	const A = []; /// A for Array, B for oBject
	B = TR.paren;
	//# paren loop performance

	for (let v in B) {
		//;lg("par", v);
		let e = B[v] = simp(B[v], true, false);e
		if (e[""] && e[""].coef.up > 0) {
			let coef = e[""].coef;
			let { up, down } = coef;
			e =  Math.floor(up/down);
			coef.up -= e*down;
			if (coef.up === 0)
				delete B[v][""];
			if (Object.keys(B[v]).length)
				B[v] = xpr2str(B[v], true);
			else
				delete B[v];
		} else {
			B[v] = xpr2str(B[v], true);
			e = 0;
		}

		if (e) //# DONT SIMP
			v = simp(v.slice(1, -1), true);v
		while (e--)
			A.push(v);
	}

	/*
	for (let v in B) { /// simp exponents
		;;let e = B[v] = simp(B[v], "=");e
		if (typeof e === "number")
			delete B[v];
		else if (e[""] && e[""].coef.up > 0) {
			let { up, down } = e[""].coef;
			if (down === 1) {
				e = up;
				delete B[v][""];
				if (Object.keys(B[v]).length)
					B[v] = xpr2str(B[v]);
				else
					delete B[v][""];
			} else {e
				e =  Math.floor(up/down);
				B[v][""].coef.up -= e*down;
				B[v] = xpr2str(B[v]);
			}//# Performance tessst
		} else {let x = B[v];x
			B[v] = xpr2str(B[v]);
			e = 0;
		}
		;lg("paren v e ",v,e);
		v
		if (e) v = simp(v.slice(1, -1), "+");v
		while (e--)
			A.push(v);
	}*/

	if (A.length) {
		let XP = {};
		XP[trm2str(TR, true)] = TR;
		trm = xpr2str(XP, true);
		
		if (trm !== "1")
			A.push(trm);
		
		dtab--;
		return mult(A);
	}

	dtab--;
	return TR;
}

/** Convert term object to string
 * @param {object} XP 
 * @param {bool} mult - Mult symbol is - true: asterisk (*), false: space ( ), undefined: hidden
 * @param {bool} html - Output is - true: html formatted string, else: plain string */
function trm2str(TR, mult, html) {
	let s = "";
	let m = mult ? "*" : (mult === false ? " " : ""); /// bruh
    //# OPTIMIZE WITH MULT SIGN - less calls to encode()

    let {num, vars, paren} = TR;
	for (let B of [num, vars, paren]) {
		let keys = Object.keys(B);
		keys.sort();
		
		for (let v of keys) {		
			let e = B[v];
			//;lg("exp ",e);
			if (html)
				v = v.replace(/(?<=\D)(\d+)/g, "<sub>$1</sub>");
			
			if (e === "1")
				e = "";
			else if (!html && e.match(/[\+\-\*\/]/)) /// attach necessary parenthesis
				e = "("+e+")";
			
			if (e) {
				if (html)
					e = "<sup>"+e+"</sup>";
				else
					e = "^"+e;
			}
			
			s += m+v+e;
		}
	}

    if (m)
    	s = s.slice(m.length);

	return s;
}

/** Convert expression object to string
 * @param {object} XP 
 * @param {bool} mult - Mult symbol is - true: asterisk (x*y), false: space (x y), undefined: hidden (xy)
 * @param {bool} broken - Output is - true: unjoined terms array, else: joined whole expression
 * @returns {string|string[]} */
function xpr2str(XP, mult, broken) {
	let s = [];
	let m = mult ? "*" : (mult === false ? " " : ""); /// bruh
	let keys = Object.keys(XP);
	//;keys.sort(); /// sort the terms alphabetically
	//;keys.sort((a, b) => (a[0] === b[0]) ? (a = -strcmp(a, b)) : -a); /// sort the terms algebraically
	//# ALGEBRUHIC SORT

	for (let term of keys) {
		let up = XP[term].coef.up;
		if (up > 0)
			up = "+"+up;
		else
			up = ""+up;
		/// 10-02-2022 4:55 AM
		if (term) {
			if (up.slice(1) === "1")
				up = up[0];
			else if (m || term[0].match(/\d/)) /// num group fix - 10-02-2022 10:58 PM
				up += m || "*";
		}
		
		//! NeVeR gOnNa
		let down = XP[term].coef.down;
		if (down == 1)
			down = "";
		else
			down = "/"+down;
			
		s.push(up+term+down);
	}
	
	if (!broken)
		s = s.join("") || "0";
	if (s[0] === "+")
		s = s.slice(1);
	
	return s;
}

/** Compare two strings */
function strcmp(a, b) {
	return a === b ? 0 : (a > b ? 1 : -1);
}	


//*/
//= Finalized functions

/** Attach omitted mult symbol & remove whitespaces
 * @param {string} expr - Algebraic expression */
function encode(expr) {
    //;if (!expr.match(/[^\d\+\-\*\/\^]/)) return expr;
	let xpr = expr
		.replace(/\b\s+\b/g, "*") /// replace whitespace between terms with mult
		.replace(/\s+/g, "") /// remove unnecessary whitespaces
		.replace(/((?<=[\w\)])(?=\())|((?<=\))(?=[\w\(]))/g, "*") /// attach ommitted mult sign with parenthesis
		.replace(/\B(?=\w)(?=\D)/g, "*"); /// attach ommitted mult sign between variables
	//# MULTICHARACTER NAME

	let flag = 0, op = 0; /// to match parenthesises
	const F = {"(": 1, ")": -1};

	for (let c of xpr) {
		if (c == "(" || c == ")") 
			flag += F[c];	
		if (flag < 0)
			op -= flag++
	}
	xpr = "(".repeat(op)+xpr+")".repeat(flag);
	xpr;
	return xpr;
}

/** Split expression by given delimiter symbols
 * @param {string} d - String containing the delimiters. e.g. "+-", "^"
 * @param {string} expr - The expression to split */
function breakBy(d, expr) {
	let flag = 0; /// to not break parenthesis groupss
	const F = {"(": 1, ")": -1};
	const A = [];
	let k = 0;

	for (let i = (expr[0] == "(") ? 0 : 1; i < expr.length; i++) {
		let c = expr[i];c
		if (c == "(" || c == ")")
			flag += F[c];
		//; else if ((c == d[0] || c == d[1]) && !flag) {
		//# TEST REGEX VS EQUALITY
		else if (!flag && d.match("\\"+c)) {
			/// to not break 2[*\^][+-]1 like 2^-1
			if (c.match(/[+\-]/) && expr[i-1].match(/[*\/^]/))
				continue;

			A.push(expr.slice(k, i));
			k = i;
		}
	}

	A.push(expr.slice(k));

	return A;
}

/** Expand multinomial multiplications
 * @param {string[]} A - Array of expressions */
function mult(A) {
	for (let i in A)
		A[i] = breakBy("+-", A[i]);
		
	let prod = A[0];
	A = A.slice(1);
	
	for (let xpr of A) {
		/// XPR.length === prod.length
		let tmp = [];
		for (let trm1 of prod)
			for (trm2 of xpr)
				tmp.push(trm1+"*"+trm2);
		prod = tmp;
	}
	//# OPTIMIZE BY NOT SIMPING
	//;lg("prod1", prod);
	//prod = simp(prod.join(""), "*");
	//;lg("prod2", prod);
	return prod;
}

/** Add constant rational expressions
 * @param {coef[]} coefs - Array of TR.coef objects */
function addRatio(coefs) {
	let downs = [];
	for (let i in coefs)
		downs.push(coefs[i].down);

	//! NeVeR gOnNa
	let down = lcm(...downs);
	/** @type number */
	let up = coefs.reduce((a, b) => a+down*b.up/b.down, 0);
	
	let g = gcd(up, down);
	up /= g;
	down /= g;
	return { up, down };
}

/** Least commmon multiple
 * @param  {...number} N - Two or more integers
 * @returns */
function lcm(...N) {
	let a = abs(N[0]);
	for (let i = 1; i < N.length; i++) {
		let b = abs(N[i]);
		let n = a*b;
		/// inline gcd code
		while (b)
			[a, b] = [b, a%b];
		
		a = n/a; /// bruh
	}
	return a;
}

/** Greatest common divisor
 * @param  {...number} N - Two or more integers
 * @returns */
function gcd(...N) {
	let a = abs(N[0]);
	for (let i = 1; i < N.length; i++) {
		let b = abs(N[i]);
		while (b)
			[a, b] = [b, a%b];
	}
	return a;
}

/** Simplest GCD algorithm */
function _gcd(a, b) {
	while (b)
		[a, b] = [b, a%b];
	return a;
}

/** Log */
function lg(...a) {
	if (LG) {
		let indent = ">\t".repeat(dtab);
		//alert(a);
		console.log(indent,...a);
	}
}

/** Debug log */
function dbg(...a) {
	if (DBG) {
		let indent = "\t".repeat(dtab);
		//alert(a);
		console.log(indent,...a);
	}
}
