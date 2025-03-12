(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.O.E === region.T.E)
	{
		return 'on line ' + region.O.E;
	}
	return 'on lines ' + region.O.E + ' through ' + region.T.E;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aG,
		impl.bc,
		impl.a3,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		r: func(record.r),
		P: record.P,
		M: record.M
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.r;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.P;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.M) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aG,
		impl.bc,
		impl.a3,
		function(sendToApp, initialModel) {
			var view = impl.bd;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aG,
		impl.bc,
		impl.a3,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.N && impl.N(sendToApp)
			var view = impl.bd;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.as);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.a6) && (_VirtualDom_doc.title = title = doc.a6);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.aR;
	var onUrlRequest = impl.aS;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		N: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.ae === next.ae
							&& curr.X === next.X
							&& curr.ab.a === next.ab.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		aG: function(flags)
		{
			return A3(impl.aG, flags, _Browser_getUrl(), key);
		},
		bd: impl.bd,
		bc: impl.bc,
		a3: impl.a3
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { aA: 'hidden', at: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { aA: 'mozHidden', at: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { aA: 'msHidden', at: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { aA: 'webkitHidden', at: 'webkitvisibilitychange' }
		: { aA: 'hidden', at: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		ai: _Browser_getScene(),
		am: {
			ao: _Browser_window.pageXOffset,
			ap: _Browser_window.pageYOffset,
			an: _Browser_doc.documentElement.clientWidth,
			W: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		an: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		W: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			ai: {
				an: node.scrollWidth,
				W: node.scrollHeight
			},
			am: {
				ao: node.scrollLeft,
				ap: node.scrollTop,
				an: node.clientWidth,
				W: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			ai: _Browser_getScene(),
			am: {
				ao: x,
				ap: y,
				an: _Browser_doc.documentElement.clientWidth,
				W: _Browser_doc.documentElement.clientHeight
			},
			aw: {
				ao: x + rect.left,
				ap: y + rect.top,
				an: rect.width,
				W: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $author$project$Main$NoOp = {$: 7};
var $author$project$Main$UrlChanged = function (a) {
	return {$: 3, a: a};
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.a) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.c),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.c);
		} else {
			var treeLen = builder.a * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.d) : builder.d;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.a);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.c) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.c);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{d: nodeList, a: (len / $elm$core$Array$branchFactor) | 0, c: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {V: fragment, X: host, _: path, ab: port_, ae: protocol, af: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Main$AbacusMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$AbacusPage = 1;
var $author$project$Shared$Types$ConsoleMessage$InfoMessage = 0;
var $author$project$Main$Landing = 0;
var $author$project$Main$RamMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$RamPage = 2;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Shared$Ports$getItem = _Platform_outgoingPort('getItem', $elm$json$Json$Encode$string);
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{d: nodeList, a: nodeListSize, c: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Am$Utils$Init$init = function () {
	var initialModel = {
		au: _List_Nil,
		ax: 0,
		aB: $elm$core$Dict$empty,
		aI: '',
		aJ: 0,
		aK: _List_Nil,
		aL: false,
		aV: $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (n) {
					return _Utils_Tuple2(
						n,
						_Utils_Tuple2(0, false));
				},
				A2($elm$core$List$range, 0, 100))),
		aX: false,
		aY: false,
		aZ: false,
		a_: false,
		a$: $elm$core$Maybe$Nothing,
		a0: $elm$core$Array$fromList(
			_List_fromArray(
				[
					{aI: '', aQ: ''},
					{aI: '', aQ: 'Slot 1'},
					{aI: '', aQ: 'Slot 2'},
					{aI: '', aQ: 'Slot 3'},
					{aI: '', aQ: 'Slot 4'},
					{aI: '', aQ: 'Slot 5'},
					{aI: '', aQ: 'Slot 6'},
					{aI: '', aQ: 'Slot 7'},
					{aI: '', aQ: 'Slot 8'},
					{aI: '', aQ: 'Slot 9'},
					{aI: '', aQ: 'Slot 10'},
					{aI: '', aQ: 'Slot 11'},
					{aI: '', aQ: 'Slot 12'},
					{aI: '', aQ: 'Slot 13'},
					{aI: '', aQ: 'Slot 14'},
					{aI: '', aQ: 'Slot 15'},
					{aI: '', aQ: 'Slot 16'},
					{aI: '', aQ: 'Slot 17'},
					{aI: '', aQ: 'Slot 18'},
					{aI: '', aQ: 'Slot 19'},
					{aI: '', aQ: 'Slot 20'},
					{aI: '# a + b\n# Result: R3\n# Destructive approach\n\n# Load \'a\' into R1\na1a1a1a1\n\n# Load \'b\' into R2\na2a2\n\n# Transfer \'a\' from R1 to R3\n(s1 a3)1\n\n# Transfer \'b\' from R2 to R3\n(s2 a3)2', aQ: ''},
					{aI: '# a * b\n# Result: R3\n# Destructive approach\n\n# Load \'a\' into R1 and \'b\' into R2\na1a1a1\na2a2a2a2\n\n# Loop of copying \'a\' from R1 do R3 and decrementing \'b\' till it\'s 0\n(\n\t# Copy \'a\' from R1 to R3 (via helper register R10).\n\t(s1 a3 a10)1\n\t(s10 a1)10\n\n\t# Decrement \'b\'\n\ts2\t\n)2', aQ: ''},
					{aI: '# n!\n# Result: R2\n# Destructive approach\n\n# Load \'n\' into R1 (n = 4)\na1a1a1a1\n\n# Initialize R2 to 1 (accumulator for the factorial result)\na2\n\n# Outer loop: while R1 is nonzero, multiply R2 by R1 and then decrement R1\n(\n\n    # Inner multiplication loop: repeats for each unit in R2\n    (\n\n        # Transfer value from R1 to R3 and R4.\n        (s1 a3 a4)1\n        \n        # Decrement R2 to account for one iteration of multiplication.\n        s2\n        \n        # Restore R1 by transferring the value from R4 back to R1.\n        (s4 a1)4\n\n    )2\n    \n    # Transfer the accumulated value from R3 into R2.\n    # This effectively multiplies the old R2 by the original value of R1.\n    (s3 a2)3\n    \n    # Decrement R1 by 1 to prepare for the next multiplication step.\n    s1\n\n)1\n', aQ: ''}
				])),
		a1: 4,
		a2: $elm$core$Array$fromList(
			_List_fromArray(
				[4000, 2000, 1000, 500, 200, 0, 0])),
		a8: 1000000,
		a9: 100,
		ba: '',
		bb: ''
	};
	return initialModel;
}();
var $author$project$Ram$Utils$Init$init = function () {
	var initialModel = {
		au: _List_Nil,
		ax: 0,
		az: false,
		aC: $elm$core$Dict$empty,
		aD: $elm$core$Dict$empty,
		aE: $elm$core$Dict$empty,
		J: $elm$core$Array$empty,
		aH: 0,
		aI: '',
		aJ: 0,
		aK: _List_Nil,
		aL: false,
		aM: 2,
		aN: 0,
		aO: 0,
		aU: $elm$core$Array$empty,
		aV: $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (n) {
					return _Utils_Tuple2(
						n,
						_Utils_Tuple2(0, $elm$core$Maybe$Nothing));
				},
				A2($elm$core$List$range, 0, 100))),
		aX: false,
		aY: false,
		aZ: false,
		a_: false,
		a$: $elm$core$Maybe$Nothing,
		a0: $elm$core$Array$fromList(
			_List_fromArray(
				[
					{J: $elm$core$Array$empty, aI: '', aQ: ''},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 1'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 2'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 3'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 4'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 5'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 6'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 7'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 8'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 9'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 10'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 11'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 12'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 13'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 14'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 15'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 16'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 17'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 18'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 19'},
					{J: $elm$core$Array$empty, aI: '', aQ: 'Slot 20'},
					{
					J: $elm$core$Array$fromList(
						_List_fromArray(
							[48, 152])),
					aI: '# Average of two numbers\n\n# Read numbers from input tape into R1 and R2\nread 1\nread 2\n\n# Add numbers into accumulator\nadd 1\nadd 2\n\n# Divide numbers by 2\ndiv =2\n\n# Write the result to the output tape\nwrite 0\n\nhalt',
					aQ: ''
				},
					{
					J: $elm$core$Array$fromList(
						_List_fromArray(
							[5, 4])),
					aI: '# a^n\n\n# Read \'a\' and \'n\' into R1 and R2\nread 1\nread 2\n\n# Load 1 into helper register R3\nload =1\nstore 3\n\n# Multiply R3 by R1 and decrement R2\n# Loops until R2 is greater than 0\ncyklus:\n\tload 3\n\tmul 1\n\tstore 3\n\n\tload 2\n\tsub =1\n\tstore 2\n\n\tJGTZ cyklus\n\n# Write result from R3 in the output tape\nwrite 3\nhalt',
					aQ: ''
				},
					{
					J: $elm$core$Array$fromList(
						_List_fromArray(
							[5])),
					aI: '# n!\n\n# Read number from input tape into R1\nread 1\n\n# Load number from R1 into accumulator\nload 1\n\n# If it\'s zero, jump to label zero, because 0! is 1 \njzero zero\n\n# Load constant 1 into accumulator and store it in R2\nload =1\nstore 2\n\n# Load number from R2, multiply it by input number and decrement input number\n# Loops until the input value is zero\nloop:\n\tload 2\n\tmul 1\n\tstore 2\n\n\tload 1\n\tsub =1\n\tstore 1\n\t\n\tJGTZ loop\n\n# Reslt is in R2, write it in the output tape and halt\nwrite 2\nhalt\n\n# 0! is 1, so write it in the output tape and halt\nzero:\n\tload =1\n\twrite 0\n\thalt',
					aQ: ''
				}
				])),
		a1: 4,
		a2: $elm$core$Array$fromList(
			_List_fromArray(
				[4000, 2000, 1000, 500, 200, 0, 0])),
		a7: false,
		a8: 100000,
		a9: 100,
		al: '',
		ba: '',
		bb: ''
	};
	return initialModel;
}();
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Am$Types$Messages$AddMessageWithTime = F3(
	function (a, b, c) {
		return {$: 8, a: a, b: b, c: c};
	});
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $author$project$Am$Utils$HelperFunctions$requestAddMessage = function (_v0) {
	var messageType = _v0.a;
	var textOfMessage = _v0.b;
	return A2(
		$elm$core$Task$perform,
		function (posix) {
			return A3($author$project$Am$Types$Messages$AddMessageWithTime, messageType, posix, textOfMessage);
		},
		$elm$time$Time$now);
};
var $author$project$Ram$Types$Messages$AddMessageWithTime = F3(
	function (a, b, c) {
		return {$: 11, a: a, b: b, c: c};
	});
var $author$project$Ram$Utils$HelperFunctions$requestAddMessage = function (_v0) {
	var messageType = _v0.a;
	var textOfMessage = _v0.b;
	return A2(
		$elm$core$Task$perform,
		function (posix) {
			return A3($author$project$Ram$Types$Messages$AddMessageWithTime, messageType, posix, textOfMessage);
		},
		$elm$time$Time$now);
};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Shared$Ports$subToTextArea = _Platform_outgoingPort(
	'subToTextArea',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$init = F3(
	function (_v0, url, key) {
		var pageFromUrl = function () {
			var _v1 = url.V;
			_v1$2:
			while (true) {
				if (!_v1.$) {
					switch (_v1.a) {
						case 'abacus':
							return 1;
						case 'ram':
							return 2;
						default:
							break _v1$2;
					}
				} else {
					break _v1$2;
				}
			}
			return 0;
		}();
		var cmdToLoad = ((pageFromUrl === 1) || (pageFromUrl === 2)) ? $elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					$author$project$Shared$Ports$getItem('am_current'),
					$author$project$Shared$Ports$getItem('ram_current'),
					$elm$core$Platform$Cmd$batch(
					A2(
						$elm$core$List$map,
						function (i) {
							return $author$project$Shared$Ports$getItem(
								'am_slot_' + $elm$core$String$fromInt(i));
						},
						A2($elm$core$List$range, 1, 20))),
					$elm$core$Platform$Cmd$batch(
					A2(
						$elm$core$List$map,
						function (i) {
							return $author$project$Shared$Ports$getItem(
								'ram_slot_' + $elm$core$String$fromInt(i));
						},
						A2($elm$core$List$range, 1, 20))),
					A2(
					$elm$core$Platform$Cmd$map,
					$author$project$Main$AbacusMsg,
					$author$project$Am$Utils$HelperFunctions$requestAddMessage(
						_Utils_Tuple2(0, 'Welcome to Abacus Machine Simulator'))),
					A2(
					$elm$core$Platform$Cmd$map,
					$author$project$Main$RamMsg,
					$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
						_Utils_Tuple2(0, 'Welcome to RAM Simulator'))),
					$author$project$Shared$Ports$subToTextArea(0)
				])) : $elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					$author$project$Shared$Ports$getItem('am_current'),
					$author$project$Shared$Ports$getItem('ram_current'),
					$elm$core$Platform$Cmd$batch(
					A2(
						$elm$core$List$map,
						function (i) {
							return $author$project$Shared$Ports$getItem(
								'am_slot_' + $elm$core$String$fromInt(i));
						},
						A2($elm$core$List$range, 1, 20))),
					$elm$core$Platform$Cmd$batch(
					A2(
						$elm$core$List$map,
						function (i) {
							return $author$project$Shared$Ports$getItem(
								'ram_slot_' + $elm$core$String$fromInt(i));
						},
						A2($elm$core$List$range, 1, 20))),
					A2(
					$elm$core$Platform$Cmd$map,
					$author$project$Main$AbacusMsg,
					$author$project$Am$Utils$HelperFunctions$requestAddMessage(
						_Utils_Tuple2(0, 'Welcome to Abacus Machine Simulator'))),
					A2(
					$elm$core$Platform$Cmd$map,
					$author$project$Main$RamMsg,
					$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
						_Utils_Tuple2(0, 'Welcome to RAM Simulator')))
				]));
		return _Utils_Tuple2(
			{f: $author$project$Am$Utils$Init$init, B: false, D: key, o: pageFromUrl, h: $author$project$Ram$Utils$Init$init},
			cmdToLoad);
	});
var $author$project$Main$GotItem = function (a) {
	return {$: 4, a: a};
};
var $author$project$Am$Types$Messages$Tick = function (a) {
	return {$: 2, a: a};
};
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {ad: processes, ak: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.ad;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.ak);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$abacusSubscriptions = function (model) {
	if (model.aL) {
		var speed = A2(
			$elm$core$Maybe$withDefault,
			1000,
			A2($elm$core$Array$get, model.a1 - 1, model.a2));
		return A2($elm$time$Time$every, speed, $author$project$Am$Types$Messages$Tick);
	} else {
		return $elm$core$Platform$Sub$none;
	}
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Shared$Ports$gotItem = _Platform_incomingPort(
	'gotItem',
	A2(
		$elm$json$Json$Decode$andThen,
		function (_v0) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (_v1) {
					return $elm$json$Json$Decode$succeed(
						_Utils_Tuple2(_v0, _v1));
				},
				A2(
					$elm$json$Json$Decode$index,
					1,
					$elm$json$Json$Decode$oneOf(
						_List_fromArray(
							[
								$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
								A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$string)
							]))));
		},
		A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$string)));
var $elm$core$Platform$Sub$map = _Platform_map;
var $author$project$Ram$Types$Messages$Tick = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$ramSubscriptions = function (model) {
	if (model.aL) {
		var speed = A2(
			$elm$core$Maybe$withDefault,
			1000,
			A2($elm$core$Array$get, model.a1 - 1, model.a2));
		return A2($elm$time$Time$every, speed, $author$project$Ram$Types$Messages$Tick);
	} else {
		return $elm$core$Platform$Sub$none;
	}
};
var $author$project$Main$subscriptions = function (model) {
	var ramSubs = function () {
		var _v1 = model.o;
		if (_v1 === 2) {
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$RamMsg,
				$author$project$Main$ramSubscriptions(model.h));
		} else {
			return $elm$core$Platform$Sub$none;
		}
	}();
	var abacusSubs = function () {
		var _v0 = model.o;
		if (_v0 === 1) {
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$AbacusMsg,
				$author$project$Main$abacusSubscriptions(model.f));
		} else {
			return $elm$core$Platform$Sub$none;
		}
	}();
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				abacusSubs,
				ramSubs,
				$author$project$Shared$Ports$gotItem($author$project$Main$GotItem)
			]));
};
var $author$project$Main$DelayedSubToTextArea = {$: 5};
var $author$project$Am$Types$Slot$Slot = F2(
	function (name, inputText) {
		return {aI: inputText, aQ: name};
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$decodeSlotAm = function (str) {
	var decodedSlot = A3(
		$elm$json$Json$Decode$map2,
		$author$project$Am$Types$Slot$Slot,
		A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'inputText', $elm$json$Json$Decode$string));
	return $elm$core$Result$toMaybe(
		A2($elm$json$Json$Decode$decodeString, decodedSlot, str));
};
var $author$project$Ram$Types$Slot$Slot = F3(
	function (name, inputText, inputTape) {
		return {J: inputTape, aI: inputText, aQ: name};
	});
var $elm$json$Json$Decode$array = _Json_decodeArray;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Main$decodeSlotRam = function (str) {
	var decodedSlot = A4(
		$elm$json$Json$Decode$map3,
		$author$project$Ram$Types$Slot$Slot,
		A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'inputText', $elm$json$Json$Decode$string),
		A2(
			$elm$json$Json$Decode$field,
			'inputTape',
			$elm$json$Json$Decode$array($elm$json$Json$Decode$int)));
	return $elm$core$Result$toMaybe(
		A2($elm$json$Json$Decode$decodeString, decodedSlot, str));
};
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$Basics$not = _Basics_not;
var $author$project$Am$Types$Instructions$Decrement = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Am$Types$Instructions$EndLoop = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $author$project$Am$Types$Instructions$Increment = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Am$Types$ErrorType$ReferencingNonExistingReg = 0;
var $author$project$Am$Types$Instructions$StartLoop = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $author$project$Am$Types$Instructions$UnknownInstruction = {$: 4};
var $author$project$Am$Types$ErrorType$UnmatchedEndLoop = 2;
var $author$project$Am$Types$ErrorType$UnmatchedStartLoop = 1;
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$String$fromList = _String_fromList;
var $author$project$Am$Utils$AbacusParser$getFirstDigits = function (chars) {
	if (!chars.b) {
		return _List_Nil;
	} else {
		var c = chars.a;
		var rest = chars.b;
		return $elm$core$Char$isDigit(c) ? A2(
			$elm$core$List$cons,
			c,
			$author$project$Am$Utils$AbacusParser$getFirstDigits(rest)) : _List_Nil;
	}
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Am$Utils$AbacusParser$isWhitespace = function (c) {
	return (c === ' ') || ((c === '\t') || ((c === '\n') || (c === '\r')));
};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Am$Utils$AbacusParser$parseInstructions = F6(
	function (input, instructions, stack, currentIndex, parsingComment, model) {
		parseInstructions:
		while (true) {
			if (parsingComment) {
				if (!input.b) {
					return instructions;
				} else {
					if ('\n' === input.a) {
						var rest = input.b;
						var $temp$input = rest,
							$temp$instructions = instructions,
							$temp$stack = stack,
							$temp$currentIndex = currentIndex,
							$temp$parsingComment = false,
							$temp$model = model;
						input = $temp$input;
						instructions = $temp$instructions;
						stack = $temp$stack;
						currentIndex = $temp$currentIndex;
						parsingComment = $temp$parsingComment;
						model = $temp$model;
						continue parseInstructions;
					} else {
						var rest = input.b;
						var $temp$input = rest,
							$temp$instructions = instructions,
							$temp$stack = stack,
							$temp$currentIndex = currentIndex,
							$temp$parsingComment = true,
							$temp$model = model;
						input = $temp$input;
						instructions = $temp$instructions;
						stack = $temp$stack;
						currentIndex = $temp$currentIndex;
						parsingComment = $temp$parsingComment;
						model = $temp$model;
						continue parseInstructions;
					}
				}
			} else {
				if (!input.b) {
					return $elm$core$List$isEmpty(stack) ? instructions : A2(
						$elm$core$List$map,
						function (instr) {
							if (instr.$ === 2) {
								var endLoopIndex = instr.a;
								var conditionIndex = instr.b;
								return (_Utils_eq(endLoopIndex, -1) && _Utils_eq(conditionIndex, -1)) ? A3(
									$author$project$Am$Types$Instructions$StartLoop,
									currentIndex,
									currentIndex,
									$elm$core$Maybe$Just(1)) : instr;
							} else {
								var other = instr;
								return other;
							}
						},
						instructions);
				} else {
					switch (input.a) {
						case 'a':
							var rest = input.b;
							var digits = $author$project$Am$Utils$AbacusParser$getFirstDigits(rest);
							var remaining = A2(
								$elm$core$List$drop,
								$elm$core$List$length(digits),
								rest);
							var value = A2(
								$elm$core$Maybe$withDefault,
								0,
								$elm$core$String$toInt(
									$elm$core$String$fromList(digits)));
							if (A2($elm$core$Dict$member, value, model.aV)) {
								var $temp$input = remaining,
									$temp$instructions = _Utils_ap(
									instructions,
									_List_fromArray(
										[
											A2($author$project$Am$Types$Instructions$Increment, value, $elm$core$Maybe$Nothing)
										])),
									$temp$stack = stack,
									$temp$currentIndex = currentIndex + 1,
									$temp$parsingComment = false,
									$temp$model = model;
								input = $temp$input;
								instructions = $temp$instructions;
								stack = $temp$stack;
								currentIndex = $temp$currentIndex;
								parsingComment = $temp$parsingComment;
								model = $temp$model;
								continue parseInstructions;
							} else {
								var $temp$input = remaining,
									$temp$instructions = _Utils_ap(
									instructions,
									_List_fromArray(
										[
											A2(
											$author$project$Am$Types$Instructions$Increment,
											value,
											$elm$core$Maybe$Just(0))
										])),
									$temp$stack = stack,
									$temp$currentIndex = currentIndex + 1,
									$temp$parsingComment = false,
									$temp$model = model;
								input = $temp$input;
								instructions = $temp$instructions;
								stack = $temp$stack;
								currentIndex = $temp$currentIndex;
								parsingComment = $temp$parsingComment;
								model = $temp$model;
								continue parseInstructions;
							}
						case 's':
							var rest = input.b;
							var digits = $author$project$Am$Utils$AbacusParser$getFirstDigits(rest);
							var remaining = A2(
								$elm$core$List$drop,
								$elm$core$List$length(digits),
								rest);
							var value = A2(
								$elm$core$Maybe$withDefault,
								0,
								$elm$core$String$toInt(
									$elm$core$String$fromList(digits)));
							if (A2($elm$core$Dict$member, value, model.aV)) {
								var $temp$input = remaining,
									$temp$instructions = _Utils_ap(
									instructions,
									_List_fromArray(
										[
											A2($author$project$Am$Types$Instructions$Decrement, value, $elm$core$Maybe$Nothing)
										])),
									$temp$stack = stack,
									$temp$currentIndex = currentIndex + 1,
									$temp$parsingComment = false,
									$temp$model = model;
								input = $temp$input;
								instructions = $temp$instructions;
								stack = $temp$stack;
								currentIndex = $temp$currentIndex;
								parsingComment = $temp$parsingComment;
								model = $temp$model;
								continue parseInstructions;
							} else {
								var $temp$input = remaining,
									$temp$instructions = _Utils_ap(
									instructions,
									_List_fromArray(
										[
											A2(
											$author$project$Am$Types$Instructions$Decrement,
											value,
											$elm$core$Maybe$Just(0))
										])),
									$temp$stack = stack,
									$temp$currentIndex = currentIndex + 1,
									$temp$parsingComment = false,
									$temp$model = model;
								input = $temp$input;
								instructions = $temp$instructions;
								stack = $temp$stack;
								currentIndex = $temp$currentIndex;
								parsingComment = $temp$parsingComment;
								model = $temp$model;
								continue parseInstructions;
							}
						case '(':
							var rest = input.b;
							var $temp$input = rest,
								$temp$instructions = _Utils_ap(
								instructions,
								_List_fromArray(
									[
										A3($author$project$Am$Types$Instructions$StartLoop, -1, -1, $elm$core$Maybe$Nothing)
									])),
								$temp$stack = A2($elm$core$List$cons, currentIndex, stack),
								$temp$currentIndex = currentIndex + 1,
								$temp$parsingComment = false,
								$temp$model = model;
							input = $temp$input;
							instructions = $temp$instructions;
							stack = $temp$stack;
							currentIndex = $temp$currentIndex;
							parsingComment = $temp$parsingComment;
							model = $temp$model;
							continue parseInstructions;
						case ')':
							var rest = input.b;
							var digits = $author$project$Am$Utils$AbacusParser$getFirstDigits(rest);
							var remaining = A2(
								$elm$core$List$drop,
								$elm$core$List$length(digits),
								rest);
							var conditionIndex = A2(
								$elm$core$Maybe$withDefault,
								0,
								$elm$core$String$toInt(
									$elm$core$String$fromList(digits)));
							if (!A2($elm$core$Dict$member, conditionIndex, model.aV)) {
								var $temp$input = remaining,
									$temp$instructions = _Utils_ap(
									instructions,
									_List_fromArray(
										[
											A3(
											$author$project$Am$Types$Instructions$EndLoop,
											-1,
											conditionIndex,
											$elm$core$Maybe$Just(0))
										])),
									$temp$stack = stack,
									$temp$currentIndex = currentIndex + 1,
									$temp$parsingComment = false,
									$temp$model = model;
								input = $temp$input;
								instructions = $temp$instructions;
								stack = $temp$stack;
								currentIndex = $temp$currentIndex;
								parsingComment = $temp$parsingComment;
								model = $temp$model;
								continue parseInstructions;
							} else {
								if (!stack.b) {
									var $temp$input = remaining,
										$temp$instructions = _Utils_ap(
										instructions,
										_List_fromArray(
											[
												A3(
												$author$project$Am$Types$Instructions$EndLoop,
												-1,
												conditionIndex,
												$elm$core$Maybe$Just(2))
											])),
										$temp$stack = stack,
										$temp$currentIndex = currentIndex + 1,
										$temp$parsingComment = false,
										$temp$model = model;
									input = $temp$input;
									instructions = $temp$instructions;
									stack = $temp$stack;
									currentIndex = $temp$currentIndex;
									parsingComment = $temp$parsingComment;
									model = $temp$model;
									continue parseInstructions;
								} else {
									var startLoopIndex = stack.a;
									var remainingStack = stack.b;
									var updatedInstructions = A2(
										$elm$core$List$indexedMap,
										F2(
											function (i, instr) {
												if (instr.$ === 2) {
													return _Utils_eq(i, startLoopIndex) ? A3($author$project$Am$Types$Instructions$StartLoop, currentIndex, conditionIndex, $elm$core$Maybe$Nothing) : instr;
												} else {
													return instr;
												}
											}),
										instructions);
									var $temp$input = remaining,
										$temp$instructions = _Utils_ap(
										updatedInstructions,
										_List_fromArray(
											[
												A3($author$project$Am$Types$Instructions$EndLoop, startLoopIndex, conditionIndex, $elm$core$Maybe$Nothing)
											])),
										$temp$stack = remainingStack,
										$temp$currentIndex = currentIndex + 1,
										$temp$parsingComment = false,
										$temp$model = model;
									input = $temp$input;
									instructions = $temp$instructions;
									stack = $temp$stack;
									currentIndex = $temp$currentIndex;
									parsingComment = $temp$parsingComment;
									model = $temp$model;
									continue parseInstructions;
								}
							}
						case '#':
							var rest = input.b;
							var $temp$input = rest,
								$temp$instructions = instructions,
								$temp$stack = stack,
								$temp$currentIndex = currentIndex,
								$temp$parsingComment = true,
								$temp$model = model;
							input = $temp$input;
							instructions = $temp$instructions;
							stack = $temp$stack;
							currentIndex = $temp$currentIndex;
							parsingComment = $temp$parsingComment;
							model = $temp$model;
							continue parseInstructions;
						default:
							var c = input.a;
							var rest = input.b;
							if ($author$project$Am$Utils$AbacusParser$isWhitespace(c)) {
								var $temp$input = rest,
									$temp$instructions = instructions,
									$temp$stack = stack,
									$temp$currentIndex = currentIndex,
									$temp$parsingComment = false,
									$temp$model = model;
								input = $temp$input;
								instructions = $temp$instructions;
								stack = $temp$stack;
								currentIndex = $temp$currentIndex;
								parsingComment = $temp$parsingComment;
								model = $temp$model;
								continue parseInstructions;
							} else {
								var $temp$input = rest,
									$temp$instructions = _Utils_ap(
									instructions,
									_List_fromArray(
										[$author$project$Am$Types$Instructions$UnknownInstruction])),
									$temp$stack = stack,
									$temp$currentIndex = currentIndex + 1,
									$temp$parsingComment = false,
									$temp$model = model;
								input = $temp$input;
								instructions = $temp$instructions;
								stack = $temp$stack;
								currentIndex = $temp$currentIndex;
								parsingComment = $temp$parsingComment;
								model = $temp$model;
								continue parseInstructions;
							}
					}
				}
			}
		}
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$Am$Utils$AbacusParser$parseAM = F2(
	function (input, model) {
		var inputToList = $elm$core$String$toList(input);
		var instructions = A6($author$project$Am$Utils$AbacusParser$parseInstructions, inputToList, _List_Nil, _List_Nil, 0, false, model);
		return instructions;
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$endsWith = _String_endsWith;
var $elm$core$String$toUpper = _String_toUpper;
var $elm$core$String$trim = _String_trim;
var $author$project$Ram$Utils$RamParser$findLabels = function (lines) {
	var updateLabelDict = F2(
		function (_v0, dict) {
			var idx = _v0.a;
			var line = _v0.b;
			var actualLine = $elm$core$String$toUpper(
				$elm$core$String$trim(line));
			if (A2($elm$core$String$endsWith, ':', actualLine)) {
				var label = $elm$core$String$trim(
					A2($elm$core$String$dropRight, 1, actualLine));
				return A3($elm$core$Dict$insert, label, idx, dict);
			} else {
				return dict;
			}
		});
	var indexedLines = A2(
		$elm$core$List$indexedMap,
		F2(
			function (i, line) {
				return _Utils_Tuple2(i, line);
			}),
		lines);
	return A3($elm$core$List$foldl, updateLabelDict, $elm$core$Dict$empty, indexedLines);
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Ram$Types$Instructions$Add = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $author$project$Ram$Types$Instructions$Direct = function (a) {
	return {$: 1, a: a};
};
var $author$project$Ram$Types$Instructions$Div = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var $author$project$Ram$Types$ErrorType$DivByZero = 0;
var $author$project$Ram$Types$ErrorType$DuplicatedLabel = 2;
var $author$project$Ram$Types$Instructions$Halt = function (a) {
	return {$: 11, a: a};
};
var $author$project$Ram$Types$ErrorType$InvalidInstruction = 4;
var $author$project$Ram$Types$Instructions$Label = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var $author$project$Ram$Types$Instructions$Load = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$Ram$Types$Instructions$Mul = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $author$project$Ram$Types$Instructions$Read = F3(
	function (a, b, c) {
		return {$: 6, a: a, b: b, c: c};
	});
var $author$project$Ram$Types$ErrorType$ReferencingNonExistingReg = 1;
var $author$project$Ram$Types$Instructions$Store = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $author$project$Ram$Types$Instructions$Sub = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $author$project$Ram$Types$Instructions$UnknownInstruction = {$: 13};
var $author$project$Ram$Types$Instructions$Write = F3(
	function (a, b, c) {
		return {$: 7, a: a, b: b, c: c};
	});
var $author$project$Ram$Types$Instructions$Constant = function (a) {
	return {$: 0, a: a};
};
var $author$project$Ram$Types$Instructions$Indirect = function (a) {
	return {$: 2, a: a};
};
var $author$project$Ram$Utils$RamParser$parseOperand = function (input) {
	var trimmedInput = $elm$core$String$trim(input);
	if (A2($elm$core$String$startsWith, '=', trimmedInput)) {
		var _v0 = $elm$core$String$toInt(
			A2($elm$core$String$dropLeft, 1, trimmedInput));
		if (!_v0.$) {
			var n = _v0.a;
			return $author$project$Ram$Types$Instructions$Constant(n);
		} else {
			return $author$project$Ram$Types$Instructions$Direct(-1);
		}
	} else {
		if (A2($elm$core$String$startsWith, '*', trimmedInput)) {
			var _v1 = $elm$core$String$toInt(
				A2($elm$core$String$dropLeft, 1, trimmedInput));
			if (!_v1.$) {
				var n = _v1.a;
				return $author$project$Ram$Types$Instructions$Indirect(n);
			} else {
				return $author$project$Ram$Types$Instructions$Direct(-1);
			}
		} else {
			var _v2 = $elm$core$String$toInt(trimmedInput);
			if (!_v2.$) {
				var n = _v2.a;
				return $author$project$Ram$Types$Instructions$Direct(n);
			} else {
				return $author$project$Ram$Types$Instructions$Direct(-1);
			}
		}
	}
};
var $author$project$Ram$Types$Instructions$Jgtz = F4(
	function (a, b, c, d) {
		return {$: 10, a: a, b: b, c: c, d: d};
	});
var $author$project$Ram$Types$Instructions$Jump = F4(
	function (a, b, c, d) {
		return {$: 8, a: a, b: b, c: c, d: d};
	});
var $author$project$Ram$Types$Instructions$Jzero = F4(
	function (a, b, c, d) {
		return {$: 9, a: a, b: b, c: c, d: d};
	});
var $author$project$Ram$Types$ErrorType$ReferencingNonExistingLabel = 3;
var $author$project$Ram$Utils$RamParser$resolveJump = F3(
	function (labels, labelName, instruction) {
		var _v0 = A2(
			$elm$core$Dict$get,
			$elm$core$String$toUpper(labelName),
			labels);
		if (!_v0.$) {
			var address = _v0.a;
			switch (instruction) {
				case 'Jump':
					return A4($author$project$Ram$Types$Instructions$Jump, address, labelName, $elm$core$Maybe$Nothing, 0);
				case 'Jzero':
					return A4($author$project$Ram$Types$Instructions$Jzero, address, labelName, $elm$core$Maybe$Nothing, 0);
				case 'Jgtz':
					return A4($author$project$Ram$Types$Instructions$Jgtz, address, labelName, $elm$core$Maybe$Nothing, 0);
				default:
					return $author$project$Ram$Types$Instructions$UnknownInstruction;
			}
		} else {
			switch (instruction) {
				case 'Jump':
					return A4(
						$author$project$Ram$Types$Instructions$Jump,
						0,
						labelName,
						$elm$core$Maybe$Just(3),
						0);
				case 'Jzero':
					return A4(
						$author$project$Ram$Types$Instructions$Jzero,
						0,
						labelName,
						$elm$core$Maybe$Just(3),
						0);
				case 'Jgtz':
					return A4(
						$author$project$Ram$Types$Instructions$Jgtz,
						0,
						labelName,
						$elm$core$Maybe$Just(3),
						0);
				default:
					return $author$project$Ram$Types$Instructions$UnknownInstruction;
			}
		}
	});
var $author$project$Ram$Utils$RamParser$parseInstruction = F4(
	function (labels, line, idx, model) {
		var parts = A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
			A2(
				$elm$core$String$split,
				' ',
				$elm$core$String$trim(line)));
		if (parts.b) {
			if (!parts.b.b) {
				var something = parts.a;
				var _v1 = $elm$core$String$toUpper(something);
				if (_v1 === 'HALT') {
					return $author$project$Ram$Types$Instructions$Halt(0);
				} else {
					return A2($elm$core$String$endsWith, ':', something) ? (($elm$core$String$length(something) > 1) ? (_Utils_eq(
						A2(
							$elm$core$Maybe$withDefault,
							-1,
							A2(
								$elm$core$Dict$get,
								$elm$core$String$toUpper(
									A2($elm$core$String$dropRight, 1, something)),
								labels)),
						idx) ? A2(
						$author$project$Ram$Types$Instructions$Label,
						A2($elm$core$String$dropRight, 1, something),
						$elm$core$Maybe$Nothing) : A2(
						$author$project$Ram$Types$Instructions$Label,
						A2($elm$core$String$dropRight, 1, something),
						$elm$core$Maybe$Just(2))) : $author$project$Ram$Types$Instructions$UnknownInstruction) : $author$project$Ram$Types$Instructions$UnknownInstruction;
				}
			} else {
				var instruction = parts.a;
				var rest = parts.b;
				var _v2 = $elm$core$String$toUpper(instruction);
				switch (_v2) {
					case 'JUMP':
						if (rest.b && (!rest.b.b)) {
							var label = rest.a;
							return A3($author$project$Ram$Utils$RamParser$resolveJump, labels, label, 'Jump');
						} else {
							return $author$project$Ram$Types$Instructions$UnknownInstruction;
						}
					case 'JZERO':
						if (rest.b && (!rest.b.b)) {
							var label = rest.a;
							return A3($author$project$Ram$Utils$RamParser$resolveJump, labels, label, 'Jzero');
						} else {
							return $author$project$Ram$Types$Instructions$UnknownInstruction;
						}
					case 'JGTZ':
						if (rest.b && (!rest.b.b)) {
							var label = rest.a;
							return A3($author$project$Ram$Utils$RamParser$resolveJump, labels, label, 'Jgtz');
						} else {
							return $author$project$Ram$Types$Instructions$UnknownInstruction;
						}
					default:
						var other = _v2;
						var operand = $author$project$Ram$Utils$RamParser$parseOperand(
							A2(
								$elm$core$String$join,
								' ',
								A2($elm$core$List$drop, 1, parts)));
						if (_Utils_eq(
							operand,
							$author$project$Ram$Types$Instructions$Direct(-1))) {
							return $author$project$Ram$Types$Instructions$UnknownInstruction;
						} else {
							var _v6 = $elm$core$String$toUpper(other);
							switch (_v6) {
								case 'LOAD':
									switch (operand.$) {
										case 0:
											return A3($author$project$Ram$Types$Instructions$Load, operand, $elm$core$Maybe$Nothing, 0);
										case 1:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Load, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Load,
												operand,
												$elm$core$Maybe$Just(1),
												0);
										default:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Load, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Load,
												operand,
												$elm$core$Maybe$Just(1),
												0);
									}
								case 'STORE':
									switch (operand.$) {
										case 0:
											return A3(
												$author$project$Ram$Types$Instructions$Store,
												operand,
												$elm$core$Maybe$Just(4),
												0);
										case 1:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Store, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Store,
												operand,
												$elm$core$Maybe$Just(1),
												0);
										default:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Store, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Store,
												operand,
												$elm$core$Maybe$Just(1),
												0);
									}
								case 'ADD':
									switch (operand.$) {
										case 0:
											return A3($author$project$Ram$Types$Instructions$Add, operand, $elm$core$Maybe$Nothing, 0);
										case 1:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Add, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Add,
												operand,
												$elm$core$Maybe$Just(1),
												0);
										default:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Add, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Add,
												operand,
												$elm$core$Maybe$Just(1),
												0);
									}
								case 'SUB':
									switch (operand.$) {
										case 0:
											return A3($author$project$Ram$Types$Instructions$Sub, operand, $elm$core$Maybe$Nothing, 0);
										case 1:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Sub, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Sub,
												operand,
												$elm$core$Maybe$Just(1),
												0);
										default:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Sub, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Sub,
												operand,
												$elm$core$Maybe$Just(1),
												0);
									}
								case 'MUL':
									switch (operand.$) {
										case 0:
											return A3($author$project$Ram$Types$Instructions$Mul, operand, $elm$core$Maybe$Nothing, 0);
										case 1:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Mul, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Mul,
												operand,
												$elm$core$Maybe$Just(1),
												0);
										default:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Mul, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Mul,
												operand,
												$elm$core$Maybe$Just(1),
												0);
									}
								case 'DIV':
									switch (operand.$) {
										case 0:
											var value = operand.a;
											return (!value) ? A3(
												$author$project$Ram$Types$Instructions$Div,
												operand,
												$elm$core$Maybe$Just(0),
												0) : A3($author$project$Ram$Types$Instructions$Div, operand, $elm$core$Maybe$Nothing, 0);
										case 1:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Div, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Div,
												operand,
												$elm$core$Maybe$Just(1),
												0);
										default:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Div, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Div,
												operand,
												$elm$core$Maybe$Just(1),
												0);
									}
								case 'READ':
									switch (operand.$) {
										case 0:
											return A3(
												$author$project$Ram$Types$Instructions$Read,
												operand,
												$elm$core$Maybe$Just(4),
												0);
										case 1:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Read, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Read,
												operand,
												$elm$core$Maybe$Just(1),
												0);
										default:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Read, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Read,
												operand,
												$elm$core$Maybe$Just(1),
												0);
									}
								case 'WRITE':
									switch (operand.$) {
										case 0:
											return A3(
												$author$project$Ram$Types$Instructions$Write,
												operand,
												$elm$core$Maybe$Just(4),
												0);
										case 1:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Write, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Write,
												operand,
												$elm$core$Maybe$Just(1),
												0);
										default:
											var n = operand.a;
											return A2($elm$core$Dict$member, n, model.aV) ? A3($author$project$Ram$Types$Instructions$Write, operand, $elm$core$Maybe$Nothing, 0) : A3(
												$author$project$Ram$Types$Instructions$Write,
												operand,
												$elm$core$Maybe$Just(1),
												0);
									}
								default:
									return $author$project$Ram$Types$Instructions$UnknownInstruction;
							}
						}
				}
			}
		} else {
			return $author$project$Ram$Types$Instructions$UnknownInstruction;
		}
	});
var $author$project$Ram$Utils$RamParser$parseRAM = F2(
	function (input, model) {
		var rawLines = A2($elm$core$String$split, '\n', input);
		var cleanedLines = A2(
			$elm$core$List$map,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$String$split('#'),
				A2(
					$elm$core$Basics$composeR,
					$elm$core$List$head,
					$elm$core$Maybe$withDefault(''))),
			rawLines);
		var nonEmptyLines = A2(
			$elm$core$List$filter,
			function (line) {
				return $elm$core$String$trim(line) !== '';
			},
			cleanedLines);
		var labels = $author$project$Ram$Utils$RamParser$findLabels(nonEmptyLines);
		var instructions = A2(
			$elm$core$List$indexedMap,
			F2(
				function (idx, line) {
					return A4($author$project$Ram$Utils$RamParser$parseInstruction, labels, line, idx, model);
				}),
			nonEmptyLines);
		return instructions;
	});
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $author$project$Shared$Ports$scrollToBottom = _Platform_outgoingPort('scrollToBottom', $elm$json$Json$Encode$string);
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_v0.$) {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $elm$core$Process$sleep = _Process_sleep;
var $author$project$Am$Types$Messages$ComputeAndPrintDuration = function (a) {
	return {$: 19, a: a};
};
var $author$project$Am$Types$Messages$SetStartTime = function (a) {
	return {$: 18, a: a};
};
var $author$project$Shared$Types$ConsoleMessage$SimStarted = 2;
var $author$project$Shared$Types$ConsoleMessage$SimStopped = 3;
var $author$project$Am$Types$Messages$StartInstantSimulation = function (a) {
	return {$: 20, a: a};
};
var $author$project$Shared$Types$ConsoleMessage$Warning = 4;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $author$project$Am$Utils$HelperFunctions$encodeSlot = function (slot) {
	return A2(
		$elm$json$Json$Encode$encode,
		0,
		$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string(slot.aQ)),
					_Utils_Tuple2(
					'inputText',
					$elm$json$Json$Encode$string(slot.aI))
				])));
};
var $author$project$Am$Types$Messages$RemoveHighlight = function (a) {
	return {$: 7, a: a};
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $author$project$Am$Utils$ExecuteInstruction$executeInstruction = F2(
	function (model, highlightDuration) {
		var nextInstructionPointer = model.aJ + 1;
		var currentInstruction = $elm$core$List$head(
			A2($elm$core$List$drop, model.aJ, model.aK));
		if (currentInstruction.$ === 1) {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{aL: false}),
				$elm$core$Platform$Cmd$none);
		} else {
			var instr = currentInstruction.a;
			var dontHighlight = ((model.a1 === 7) || (model.a1 === 6)) && model.aL;
			switch (instr.$) {
				case 0:
					var reg = instr.a;
					var isError = instr.b;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						var newRegisters = A3(
							$elm$core$Dict$update,
							reg,
							$elm$core$Maybe$map(
								function (_v4) {
									var val = _v4.a;
									return _Utils_Tuple2(val + 1, true);
								}),
							model.aV);
						if (dontHighlight) {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{ax: model.ax + 1, aJ: nextInstructionPointer, aV: newRegisters}),
								$elm$core$Platform$Cmd$none);
						} else {
							var updatedModel = _Utils_update(
								model,
								{
									ax: model.ax + 1,
									aB: A3($elm$core$Dict$insert, reg, 'bg-green-200', $elm$core$Dict$empty),
									aJ: nextInstructionPointer,
									aV: newRegisters
								});
							return _Utils_Tuple2(
								updatedModel,
								A2(
									$elm$core$Task$perform,
									function (_v3) {
										return $author$project$Am$Types$Messages$RemoveHighlight(reg);
									},
									$elm$core$Process$sleep(highlightDuration)));
						}
					}
				case 1:
					var reg = instr.a;
					var isError = instr.b;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						var newRegisters = A3(
							$elm$core$Dict$update,
							reg,
							$elm$core$Maybe$map(
								function (_v7) {
									var val = _v7.a;
									return _Utils_Tuple2(val - 1, true);
								}),
							model.aV);
						if (dontHighlight) {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{ax: model.ax + 1, aJ: nextInstructionPointer, aV: newRegisters}),
								$elm$core$Platform$Cmd$none);
						} else {
							var updatedModel = _Utils_update(
								model,
								{
									ax: model.ax + 1,
									aB: A3($elm$core$Dict$insert, reg, 'bg-yellow-200', $elm$core$Dict$empty),
									aJ: nextInstructionPointer,
									aV: newRegisters
								});
							return _Utils_Tuple2(
								updatedModel,
								A2(
									$elm$core$Task$perform,
									function (_v6) {
										return $author$project$Am$Types$Messages$RemoveHighlight(reg);
									},
									$elm$core$Process$sleep(highlightDuration)));
						}
					}
				case 2:
					var endLoopIndex = instr.a;
					var conditionIndex = instr.b;
					var isError = instr.c;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						var conditionValue = A2(
							$elm$core$Maybe$withDefault,
							0,
							A2(
								$elm$core$Maybe$map,
								$elm$core$Tuple$first,
								A2($elm$core$Dict$get, conditionIndex, model.aV)));
						return (!conditionValue) ? _Utils_Tuple2(
							_Utils_update(
								model,
								{ax: model.ax + 1, aJ: endLoopIndex}),
							$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
							_Utils_update(
								model,
								{ax: model.ax + 1, aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					}
				case 3:
					var startLoopIndex = instr.a;
					var conditionIndex = instr.b;
					var isError = instr.c;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						var conditionValue = A2(
							$elm$core$Maybe$withDefault,
							0,
							A2(
								$elm$core$Maybe$map,
								$elm$core$Tuple$first,
								A2($elm$core$Dict$get, conditionIndex, model.aV)));
						return (!conditionValue) ? _Utils_Tuple2(
							_Utils_update(
								model,
								{ax: model.ax + 1, aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
							_Utils_update(
								model,
								{ax: model.ax + 1, aJ: startLoopIndex}),
							$elm$core$Platform$Cmd$none);
					}
				default:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aJ: nextInstructionPointer}),
						$elm$core$Platform$Cmd$none);
			}
		}
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$core$Basics$pow = _Basics_pow;
var $author$project$Shared$Types$ConsoleMessage$ErrorMessage = 1;
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $author$project$Am$Utils$PrintErrors$checkForNonExistingRegisters = function (instructions) {
	var nEREPositions = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, instr) {
					switch (instr.$) {
						case 0:
							var isError = instr.b;
							if ((!isError.$) && (!isError.a)) {
								var _v2 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						case 1:
							var isError = instr.b;
							if ((!isError.$) && (!isError.a)) {
								var _v4 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						case 3:
							var isError = instr.c;
							if ((!isError.$) && (!isError.a)) {
								var _v6 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						default:
							return $elm$core$Maybe$Nothing;
					}
				}),
			instructions));
	var nERECount = $elm$core$List$length(nEREPositions);
	return (nERECount === 1) ? $elm$core$Maybe$Just(
		$author$project$Am$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(nERECount) + (' instruction that is attempting to access a non-existing register at position ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, nEREPositions)) + '.')))))) : ((nERECount > 1) ? $elm$core$Maybe$Just(
		$author$project$Am$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(nERECount) + (' instructions that are attempting to access a non-existing registers at positions: ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, nEREPositions)) + '.')))))) : $elm$core$Maybe$Nothing);
};
var $author$project$Am$Utils$PrintErrors$checkForUnknownInstructions = function (instructions) {
	var unknownPositions = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, instr) {
					return _Utils_eq(instr, $author$project$Am$Types$Instructions$UnknownInstruction) ? $elm$core$Maybe$Just(i + 1) : $elm$core$Maybe$Nothing;
				}),
			instructions));
	var unknownCount = $elm$core$List$length(unknownPositions);
	return (unknownCount === 1) ? $elm$core$Maybe$Just(
		$author$project$Am$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(unknownCount) + (' unknown instruction at position ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, unknownPositions)) + '.')))))) : ((unknownCount > 1) ? $elm$core$Maybe$Just(
		$author$project$Am$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(unknownCount) + (' unknown instructions at positions: ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, unknownPositions)) + '.')))))) : $elm$core$Maybe$Nothing);
};
var $author$project$Am$Utils$PrintErrors$checkForUnmatchedEndLoop = function (instructions) {
	var dbzPositions = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, instr) {
					if (instr.$ === 3) {
						var isError = instr.c;
						if ((!isError.$) && (isError.a === 2)) {
							var _v2 = isError.a;
							return $elm$core$Maybe$Just(i + 1);
						} else {
							return $elm$core$Maybe$Nothing;
						}
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}),
			instructions));
	var dbzCount = $elm$core$List$length(dbzPositions);
	return (dbzCount === 1) ? $elm$core$Maybe$Just(
		$author$project$Am$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(dbzCount) + (' unmatched end of the loop at position ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, dbzPositions)) + '.')))))) : ((dbzCount > 1) ? $elm$core$Maybe$Just(
		$author$project$Am$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(dbzCount) + (' unmatched ends of the loops at positions: ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, dbzPositions)) + '.')))))) : $elm$core$Maybe$Nothing);
};
var $author$project$Am$Utils$PrintErrors$checkForUnmatchedStartLoop = function (instructions) {
	var dbzPositions = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, instr) {
					if (instr.$ === 2) {
						var isError = instr.c;
						if ((!isError.$) && (isError.a === 1)) {
							var _v2 = isError.a;
							return $elm$core$Maybe$Just(i + 1);
						} else {
							return $elm$core$Maybe$Nothing;
						}
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}),
			instructions));
	var dbzCount = $elm$core$List$length(dbzPositions);
	return (dbzCount === 1) ? $elm$core$Maybe$Just(
		$author$project$Am$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(dbzCount) + (' unmatched start of the loop at position ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, dbzPositions)) + '.')))))) : ((dbzCount > 1) ? $elm$core$Maybe$Just(
		$author$project$Am$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(dbzCount) + (' unmatched starts of the loops at positions: ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, dbzPositions)) + '.')))))) : $elm$core$Maybe$Nothing);
};
var $author$project$Am$Utils$PrintErrors$printErrors = function (instructions) {
	var unknownInstructionsMsg = $author$project$Am$Utils$PrintErrors$checkForUnknownInstructions(instructions);
	var nonExistingRegErrorMsg = $author$project$Am$Utils$PrintErrors$checkForNonExistingRegisters(instructions);
	var checkForUnmatchedStartLoopMsg = $author$project$Am$Utils$PrintErrors$checkForUnmatchedStartLoop(instructions);
	var checkForUnmatchedEndLoopMsg = $author$project$Am$Utils$PrintErrors$checkForUnmatchedEndLoop(instructions);
	var cmds = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		_List_fromArray(
			[unknownInstructionsMsg, nonExistingRegErrorMsg, checkForUnmatchedStartLoopMsg, checkForUnmatchedEndLoopMsg]));
	return $elm$core$Platform$Cmd$batch(cmds);
};
var $elm$core$Basics$round = _Basics_round;
var $author$project$Am$Utils$ExecuteInstruction$runAllInstructions = function (model) {
	runAllInstructions:
	while (true) {
		if (_Utils_cmp(model.ax, model.a8) > -1) {
			return model;
		} else {
			if (_Utils_cmp(
				model.aJ,
				$elm$core$List$length(model.aK)) > -1) {
				return model;
			} else {
				var _v0 = A2($author$project$Am$Utils$ExecuteInstruction$executeInstruction, model, 0);
				var nextModel = _v0.a;
				var $temp$model = nextModel;
				model = $temp$model;
				continue runAllInstructions;
			}
		}
	}
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $author$project$Shared$Ports$setItem = _Platform_outgoingPort(
	'setItem',
	function ($) {
		var a = $.a;
		var b = $.b;
		return A2(
			$elm$json$Json$Encode$list,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$elm$json$Json$Encode$string(a),
					$elm$json$Json$Encode$string(b)
				]));
	});
var $author$project$Am$Utils$Update$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var newCode = msg.a;
				var newInstructions = A2($author$project$Am$Utils$AbacusParser$parseAM, newCode, model);
				var encodedSlot = $author$project$Am$Utils$HelperFunctions$encodeSlot(
					{aI: newCode, aQ: ''});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aI: newCode, aK: newInstructions}),
					$author$project$Shared$Ports$setItem(
						_Utils_Tuple2('am_current', encodedSlot)));
			case 2:
				if (!model.aL) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var speed = A2(
						$elm$core$Maybe$withDefault,
						1000,
						A2($elm$core$Array$get, model.a1 - 1, model.a2));
					var highlightDuration = (speed / 2) | 0;
					var _v1 = A2($author$project$Am$Utils$ExecuteInstruction$executeInstruction, model, highlightDuration);
					var updatedModel = _v1.a;
					var removalCmd = _v1.b;
					return (_Utils_cmp(
						updatedModel.aJ,
						$elm$core$List$length(updatedModel.aK)) > -1) ? _Utils_Tuple2(
						_Utils_update(
							updatedModel,
							{aL: false}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									removalCmd,
									A2($elm$core$Task$perform, $author$project$Am$Types$Messages$ComputeAndPrintDuration, $elm$time$Time$now)
								]))) : _Utils_Tuple2(updatedModel, removalCmd);
				}
			case 5:
				var highlightDuration = 350;
				var _v2 = A2($author$project$Am$Utils$ExecuteInstruction$executeInstruction, model, highlightDuration);
				var newModel = _v2.a;
				var removeHighlightCmd = _v2.b;
				return ((!model.a_) && (_Utils_cmp(
					newModel.aJ,
					$elm$core$List$length(newModel.aK)) > -1)) ? _Utils_Tuple2(
					_Utils_update(
						newModel,
						{a_: true}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Am$Utils$PrintErrors$printErrors(model.aK),
								removeHighlightCmd,
								$author$project$Am$Utils$HelperFunctions$requestAddMessage(
								_Utils_Tuple2(2, 'Simulation started')),
								A2($elm$core$Task$perform, $author$project$Am$Types$Messages$ComputeAndPrintDuration, $elm$time$Time$now),
								A2($elm$core$Task$perform, $author$project$Am$Types$Messages$SetStartTime, $elm$time$Time$now)
							]))) : ((!model.a_) ? _Utils_Tuple2(
					_Utils_update(
						newModel,
						{a_: true}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Am$Utils$PrintErrors$printErrors(model.aK),
								removeHighlightCmd,
								$author$project$Am$Utils$HelperFunctions$requestAddMessage(
								_Utils_Tuple2(2, 'Simulation started')),
								A2($elm$core$Task$perform, $author$project$Am$Types$Messages$SetStartTime, $elm$time$Time$now)
							]))) : ((_Utils_cmp(
					newModel.aJ,
					$elm$core$List$length(newModel.aK)) > -1) ? _Utils_Tuple2(
					_Utils_update(
						newModel,
						{aL: false}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								removeHighlightCmd,
								A2($elm$core$Task$perform, $author$project$Am$Types$Messages$ComputeAndPrintDuration, $elm$time$Time$now)
							]))) : (model.a_ ? _Utils_Tuple2(newModel, removeHighlightCmd) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none))));
			case 1:
				if ((model.a1 === 7) && (!model.a_)) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aL: true, a_: true}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Am$Utils$PrintErrors$printErrors(model.aK),
									A2(
									$elm$core$Task$perform,
									function (now) {
										return $author$project$Am$Types$Messages$StartInstantSimulation(now);
									},
									$elm$time$Time$now),
									$author$project$Am$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(2, 'Simulation started'))
								])));
				} else {
					if ((model.a1 === 7) && model.a_) {
						var finalModel = $author$project$Am$Utils$ExecuteInstruction$runAllInstructions(
							_Utils_update(
								model,
								{aL: true}));
						return (_Utils_cmp(finalModel.ax, model.a8) > -1) ? _Utils_Tuple2(
							_Utils_update(
								finalModel,
								{aL: false}),
							$author$project$Am$Utils$HelperFunctions$requestAddMessage(
								_Utils_Tuple2(
									4,
									'Warning: Maximum number of instant-speed instructions exceeded (' + ($elm$core$String$fromInt(finalModel.ax) + '). Your code may contain an infinite loop or be too complex. You can change this limit in settings, or continue with slower speed or step mode to debug.')))) : _Utils_Tuple2(
							finalModel,
							A2($elm$core$Task$perform, $author$project$Am$Types$Messages$ComputeAndPrintDuration, $elm$time$Time$now));
					} else {
						if (model.a_) {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{aL: true}),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{aL: true, a_: true}),
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[
											$author$project$Am$Utils$PrintErrors$printErrors(model.aK),
											$author$project$Am$Utils$HelperFunctions$requestAddMessage(
											_Utils_Tuple2(2, 'Simulation started')),
											A2($elm$core$Task$perform, $author$project$Am$Types$Messages$SetStartTime, $elm$time$Time$now)
										])));
						}
					}
				}
			case 20:
				var now = msg.a;
				var updatedModel = _Utils_update(
					model,
					{
						a$: $elm$core$Maybe$Just(now)
					});
				var finalModel = $author$project$Am$Utils$ExecuteInstruction$runAllInstructions(updatedModel);
				return (_Utils_cmp(finalModel.ax, model.a8) > -1) ? _Utils_Tuple2(
					_Utils_update(
						finalModel,
						{aL: false}),
					$author$project$Am$Utils$HelperFunctions$requestAddMessage(
						_Utils_Tuple2(
							4,
							'Warning: Maximum number of instant-speed instructions exceeded (' + ($elm$core$String$fromInt(finalModel.ax) + '). Your code may contain an infinite loop or be too complex. You can change this limit in settings, or continue with slower speed or step mode to debug.')))) : _Utils_Tuple2(
					finalModel,
					A2($elm$core$Task$perform, $author$project$Am$Types$Messages$ComputeAndPrintDuration, $elm$time$Time$now));
			case 18:
				var now = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a$: $elm$core$Maybe$Just(now)
						}),
					$elm$core$Platform$Cmd$none);
			case 19:
				var now = msg.a;
				var _v3 = model.a$;
				if (!_v3.$) {
					var startTime = _v3.a;
					var numOfInstructions = model.ax;
					var fromFloatWithDecimals = F2(
						function (decimals, no) {
							return $elm$core$String$fromFloat(
								function (n) {
									return n / A2($elm$core$Basics$pow, 10, decimals);
								}(
									$elm$core$Basics$round(
										no * A2($elm$core$Basics$pow, 10, decimals))));
						});
					var duration = $elm$time$Time$posixToMillis(now) - $elm$time$Time$posixToMillis(startTime);
					var speed = A2(fromFloatWithDecimals, 2, numOfInstructions / (duration * 0.001));
					return (!numOfInstructions) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{ax: 0, aL: false, a$: $elm$core$Maybe$Nothing}),
						$author$project$Am$Utils$HelperFunctions$requestAddMessage(
							_Utils_Tuple2(
								0,
								'Reached end of instructions. Duration: ' + ($elm$core$String$fromInt(duration) + (' ms. Number of executed instructions: ' + ($elm$core$String$fromInt(numOfInstructions) + '.')))))) : _Utils_Tuple2(
						_Utils_update(
							model,
							{ax: 0, aL: false, a$: $elm$core$Maybe$Nothing}),
						$author$project$Am$Utils$HelperFunctions$requestAddMessage(
							_Utils_Tuple2(
								0,
								'Reached end of instructions. Duration: ' + ($elm$core$String$fromInt(duration) + (' ms. Number of executed instructions: ' + ($elm$core$String$fromInt(numOfInstructions) + ('. Speed: ' + (speed + ' instructions/second.'))))))));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 3:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aB: $elm$core$Dict$empty, aL: false}),
					$elm$core$Platform$Cmd$none);
			case 4:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ax: 0,
							aB: $elm$core$Dict$empty,
							aJ: 0,
							aL: false,
							aV: $elm$core$Dict$fromList(
								A2(
									$elm$core$List$map,
									function (n) {
										return _Utils_Tuple2(
											n,
											_Utils_Tuple2(0, false));
									},
									A2($elm$core$List$range, 0, model.a9))),
							a_: false,
							a$: $elm$core$Maybe$Nothing
						}),
					$author$project$Am$Utils$HelperFunctions$requestAddMessage(
						_Utils_Tuple2(3, 'Simulation stopped')));
			case 6:
				var newSpeed = msg.a;
				if ((newSpeed === 7) && model.aL) {
					var finalModel = $author$project$Am$Utils$ExecuteInstruction$runAllInstructions(
						_Utils_update(
							model,
							{aL: true, a1: newSpeed}));
					return (_Utils_cmp(finalModel.ax, model.a8) > -1) ? _Utils_Tuple2(
						_Utils_update(
							finalModel,
							{aL: false}),
						$author$project$Am$Utils$HelperFunctions$requestAddMessage(
							_Utils_Tuple2(
								4,
								'Warning: Maximum number of instant-speed instructions exceeded (' + ($elm$core$String$fromInt(finalModel.ax) + '). Your code may contain an infinite loop or be too complex. You can change this limit in settings, or continue with slower speed or step mode to debug.')))) : _Utils_Tuple2(
						finalModel,
						A2($elm$core$Task$perform, $author$project$Am$Types$Messages$ComputeAndPrintDuration, $elm$time$Time$now));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a1: newSpeed}),
						$elm$core$Platform$Cmd$none);
				}
			case 7:
				var reg = msg.a;
				var newHighlighted = A2($elm$core$Dict$remove, reg, model.aB);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aB: newHighlighted}),
					$elm$core$Platform$Cmd$none);
			case 8:
				var messageType = msg.a;
				var posix = msg.b;
				var text = msg.c;
				var newConsoleMessage = {aP: messageType, a4: text, a5: posix};
				var updatedModel = _Utils_update(
					model,
					{
						au: _Utils_ap(
							model.au,
							_List_fromArray(
								[newConsoleMessage]))
					});
				return _Utils_Tuple2(
					updatedModel,
					$author$project$Shared$Ports$scrollToBottom('consoleContainer'));
			case 9:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aI: '',
							aJ: 0,
							aK: _List_Nil,
							aL: false,
							aV: $elm$core$Dict$fromList(
								A2(
									$elm$core$List$map,
									function (n) {
										return _Utils_Tuple2(
											n,
											_Utils_Tuple2(0, false));
									},
									A2($elm$core$List$range, 0, model.a9))),
							a_: false
						}),
					$author$project$Shared$Ports$setItem(
						_Utils_Tuple2(
							'am_current',
							$author$project$Am$Utils$HelperFunctions$encodeSlot(
								{aI: '', aQ: ''}))));
			case 10:
				var i = msg.a;
				var _v4 = A2($elm$core$Array$get, i, model.a0);
				if (!_v4.$) {
					var slot = _v4.a;
					var updatedSlot = _Utils_update(
						slot,
						{aI: model.aI});
					var encodedSlot = $author$project$Am$Utils$HelperFunctions$encodeSlot(updatedSlot);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a0: A3($elm$core$Array$set, i, updatedSlot, model.a0)
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Shared$Ports$setItem(
									_Utils_Tuple2(
										'am_slot_' + $elm$core$String$fromInt(i),
										encodedSlot)),
									$author$project$Am$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(
										0,
										'Current code saved to slot ' + ($elm$core$String$fromInt(i) + '.')))
								])));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 15:
				var i = msg.a;
				var _v5 = A2($elm$core$Array$get, i, model.a0);
				if (!_v5.$) {
					var slot = _v5.a;
					var updatedSlot = _Utils_update(
						slot,
						{aI: ''});
					var encodedSlot = $author$project$Am$Utils$HelperFunctions$encodeSlot(updatedSlot);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a0: A3($elm$core$Array$set, i, updatedSlot, model.a0)
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Shared$Ports$setItem(
									_Utils_Tuple2(
										'am_slot_' + $elm$core$String$fromInt(i),
										encodedSlot)),
									$author$project$Am$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(
										0,
										'Slot ' + ($elm$core$String$fromInt(i) + ' deleted.')))
								])));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 11:
				var i = msg.a;
				var _v6 = A2($elm$core$Array$get, i, model.a0);
				if (!_v6.$) {
					var slot = _v6.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ax: 0,
								aB: $elm$core$Dict$empty,
								aI: slot.aI,
								aJ: 0,
								aK: A2($author$project$Am$Utils$AbacusParser$parseAM, slot.aI, model),
								aL: false,
								aV: $elm$core$Dict$fromList(
									A2(
										$elm$core$List$map,
										function (n) {
											return _Utils_Tuple2(
												n,
												_Utils_Tuple2(0, false));
										},
										A2($elm$core$List$range, 0, 100))),
								a_: false,
								a$: $elm$core$Maybe$Nothing
							}),
						(i === 21) ? $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Shared$Ports$setItem(
									_Utils_Tuple2(
										'am_current',
										$author$project$Am$Utils$HelperFunctions$encodeSlot(
											{aI: slot.aI, aQ: ''}))),
									$author$project$Am$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(0, 'Example 1 loaded.'))
								])) : ((i === 22) ? $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Shared$Ports$setItem(
									_Utils_Tuple2(
										'am_current',
										$author$project$Am$Utils$HelperFunctions$encodeSlot(
											{aI: slot.aI, aQ: ''}))),
									$author$project$Am$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(0, 'Example 2 loaded.'))
								])) : ((i === 23) ? $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Shared$Ports$setItem(
									_Utils_Tuple2(
										'am_current',
										$author$project$Am$Utils$HelperFunctions$encodeSlot(
											{aI: slot.aI, aQ: ''}))),
									$author$project$Am$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(0, 'Example 3 loaded.'))
								])) : $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Shared$Ports$setItem(
									_Utils_Tuple2(
										'am_current',
										$author$project$Am$Utils$HelperFunctions$encodeSlot(
											{aI: slot.aI, aQ: ''}))),
									$author$project$Am$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(
										0,
										'Slot ' + ($elm$core$String$fromInt(i) + ' loaded.')))
								])))));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 17:
				var i = msg.a;
				var newName = msg.b;
				var _v7 = A2($elm$core$Array$get, i, model.a0);
				if (!_v7.$) {
					var slot = _v7.a;
					var updatedSlot = _Utils_update(
						slot,
						{aQ: newName});
					var encodedSlot = $author$project$Am$Utils$HelperFunctions$encodeSlot(updatedSlot);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a0: A3($elm$core$Array$set, i, updatedSlot, model.a0)
							}),
						$author$project$Shared$Ports$setItem(
							_Utils_Tuple2(
								'am_slot_' + $elm$core$String$fromInt(i),
								encodedSlot)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 12:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aZ: !model.aZ}),
					$elm$core$Platform$Cmd$none);
			case 13:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aX: !model.aX}),
					$elm$core$Platform$Cmd$none);
			case 14:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aY: !model.aY}),
					$elm$core$Platform$Cmd$none);
			case 16:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 21:
				var newNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aV: $elm$core$Dict$fromList(
								A2(
									$elm$core$List$map,
									function (n) {
										return _Utils_Tuple2(
											n,
											_Utils_Tuple2(0, false));
									},
									A2($elm$core$List$range, 0, newNum))),
							a9: newNum
						}),
					$elm$core$Platform$Cmd$none);
			case 22:
				var newNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a8: newNum}),
					$elm$core$Platform$Cmd$none);
			case 23:
				var newText = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bb: newText}),
					$elm$core$Platform$Cmd$none);
			case 24:
				var newText = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ba: newText}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Ram$Types$Messages$ComputeAndPrintDuration = F2(
	function (a, b) {
		return {$: 26, a: a, b: b};
	});
var $author$project$Ram$Types$Messages$RequestMathJaxUpdate = {$: 34};
var $author$project$Ram$Types$Messages$SetStartTime = function (a) {
	return {$: 25, a: a};
};
var $author$project$Ram$Types$Messages$StartInstantSimulation = function (a) {
	return {$: 27, a: a};
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Ram$Utils$HelperFunctions$encodeSlot = function (slot) {
	return A2(
		$elm$json$Json$Encode$encode,
		0,
		$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string(slot.aQ)),
					_Utils_Tuple2(
					'inputText',
					$elm$json$Json$Encode$string(slot.aI)),
					_Utils_Tuple2(
					'inputTape',
					A2(
						$elm$json$Json$Encode$list,
						$elm$json$Json$Encode$int,
						$elm$core$Array$toList(slot.J)))
				])));
};
var $author$project$Ram$Types$Messages$RemoveHighlightFromOutputTape = function (a) {
	return {$: 9, a: a};
};
var $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters = function (a) {
	return {$: 7, a: a};
};
var $author$project$Ram$Types$Messages$SwitchHighlight = F2(
	function (a, b) {
		return {$: 10, a: a, b: b};
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $author$project$Ram$Utils$ExecuteInstruction$calculateLogTime = F2(
	function (base, value) {
		var valueAbsolute = $elm$core$Basics$abs(value);
		return (valueAbsolute <= 0) ? 1 : ($elm$core$Basics$floor(
			A2($elm$core$Basics$logBase, base, valueAbsolute)) + 1);
	});
var $author$project$Ram$Utils$ExecuteInstruction$getRegisterValue = F2(
	function (regIndex, model) {
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$first,
			A2($elm$core$Dict$get, regIndex, model.aV));
	});
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!value.$) {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace = F4(
	function (regIdx, newVal, logBase, registers) {
		var _v0 = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(0, $elm$core$Maybe$Nothing),
			A2($elm$core$Dict$get, regIdx, registers));
		var oldVal = _v0.a;
		var maybeOldMax = _v0.b;
		var oldMaxVal = A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Basics$abs(oldVal),
			maybeOldMax);
		var newMaxVal = A2(
			$elm$core$Basics$max,
			oldMaxVal,
			$elm$core$Basics$abs(newVal));
		var updatedRegisters = A3(
			$elm$core$Dict$insert,
			regIdx,
			_Utils_Tuple2(
				newVal,
				$elm$core$Maybe$Just(newMaxVal)),
			registers);
		var newLogSpace = A3(
			$elm$core$Dict$foldl,
			F3(
				function (_v1, _v2, acc) {
					var maybeM = _v2.b;
					if (!maybeM.$) {
						var maxVal = maybeM.a;
						return acc + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, logBase, maxVal);
					} else {
						return acc;
					}
				}),
			0,
			updatedRegisters);
		return _Utils_Tuple2(updatedRegisters, newLogSpace);
	});
var $author$project$Ram$Utils$ExecuteInstruction$executeInstruction = F2(
	function (model, highlightDuration) {
		var updateInstructionAt = F3(
			function (index, newInstruction, instructions) {
				return A2(
					$elm$core$List$indexedMap,
					F2(
						function (i, instr) {
							return _Utils_eq(i, index) ? newInstruction : instr;
						}),
					instructions);
			});
		var nextInstructionPointer = model.aJ + 1;
		var currentInstruction = $elm$core$List$head(
			A2($elm$core$List$drop, model.aJ, model.aK));
		if (currentInstruction.$ === 1) {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{az: true, aL: false}),
				$elm$core$Platform$Cmd$none);
		} else {
			var instr = currentInstruction.a;
			var dontHighlight = ((model.a1 === 7) || (model.a1 === 6)) && model.aL;
			switch (instr.$) {
				case 0:
					var operand = instr.a;
					var isError = instr.b;
					var exeCount = instr.c;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						switch (operand.$) {
							case 0:
								var n = operand.a;
								var newLogTime = model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, n);
								var _v4 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, n, model.aM, model.aV);
								var newRegisters = _v4.a;
								var newLogSpace = _v4.b;
								return dontHighlight ? _Utils_Tuple2(
									_Utils_update(
										model,
										{
											ax: model.ax + 1,
											aJ: nextInstructionPointer,
											aK: A3(
												updateInstructionAt,
												model.aJ,
												A3(
													$author$project$Ram$Types$Instructions$Load,
													$author$project$Ram$Types$Instructions$Constant(n),
													$elm$core$Maybe$Nothing,
													exeCount + 1),
												model.aK),
											aN: newLogSpace,
											aO: newLogTime,
											aV: newRegisters
										}),
									$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
									_Utils_update(
										model,
										{
											ax: model.ax + 1,
											aE: A3($elm$core$Dict$insert, 0, 'bg-blue-200', $elm$core$Dict$empty),
											aJ: nextInstructionPointer,
											aK: A3(
												updateInstructionAt,
												model.aJ,
												A3(
													$author$project$Ram$Types$Instructions$Load,
													$author$project$Ram$Types$Instructions$Constant(n),
													$elm$core$Maybe$Nothing,
													exeCount + 1),
												model.aK),
											aN: newLogSpace,
											aO: newLogTime,
											aV: newRegisters
										}),
									A2(
										$elm$core$Task$perform,
										function (_v5) {
											return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
										},
										$elm$core$Process$sleep(highlightDuration)));
							case 1:
								var regIndex = operand.a;
								var maybeValue = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
								if (maybeValue.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{aJ: nextInstructionPointer}),
										$elm$core$Platform$Cmd$none);
								} else {
									var value = maybeValue.a;
									var newLogTime = (model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex);
									var _v7 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, value, model.aM, model.aV);
									var newRegisters = _v7.a;
									var newLogSpace = _v7.b;
									if (dontHighlight) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													ax: model.ax + 1,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Load,
															$author$project$Ram$Types$Instructions$Direct(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aN: newLogSpace,
													aO: newLogTime,
													aV: newRegisters
												}),
											$elm$core$Platform$Cmd$none);
									} else {
										var updatedModel = _Utils_update(
											model,
											{
												ax: model.ax + 1,
												aE: A3($elm$core$Dict$insert, regIndex, 'bg-blue-200', $elm$core$Dict$empty),
												aJ: nextInstructionPointer,
												aK: A3(
													updateInstructionAt,
													model.aJ,
													A3(
														$author$project$Ram$Types$Instructions$Load,
														$author$project$Ram$Types$Instructions$Direct(regIndex),
														$elm$core$Maybe$Nothing,
														exeCount + 1),
													model.aK),
												aN: newLogSpace,
												aO: newLogTime,
												aV: newRegisters
											});
										var switchHighlightCmd = A2(
											$elm$core$Task$perform,
											function (_v9) {
												return A2(
													$author$project$Ram$Types$Messages$SwitchHighlight,
													_Utils_Tuple2(1, regIndex),
													_Utils_Tuple3(1, 0, 'bg-blue-200'));
											},
											$elm$core$Process$sleep((highlightDuration / 2) | 0));
										var removeHighlightCmd = A2(
											$elm$core$Task$perform,
											function (_v8) {
												return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
											},
											$elm$core$Process$sleep(highlightDuration));
										return _Utils_Tuple2(
											updatedModel,
											$elm$core$Platform$Cmd$batch(
												_List_fromArray(
													[switchHighlightCmd, removeHighlightCmd])));
									}
								}
							default:
								var regIndex = operand.a;
								var maybePointer = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
								if (maybePointer.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{aJ: nextInstructionPointer}),
										$elm$core$Platform$Cmd$none);
								} else {
									var pointer = maybePointer.a;
									var maybeValue = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, pointer, model);
									if (maybeValue.$ === 1) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													ax: model.ax + 1,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Load,
															$author$project$Ram$Types$Instructions$Indirect(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aO: ((model.aO + A2(
														$author$project$Ram$Utils$ExecuteInstruction$calculateLogTime,
														model.aM,
														A2($elm$core$Maybe$withDefault, 0, maybeValue))) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex)
												}),
											$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
												_Utils_Tuple2(
													1,
													'Runtime Error: Instruction ' + ($elm$core$String$fromInt(model.aJ + 1) + ' attempted to access a non-existent register.'))));
									} else {
										var value = maybeValue.a;
										var newLogTime = ((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex);
										var _v12 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, value, model.aM, model.aV);
										var newRegisters = _v12.a;
										var newLogSpace = _v12.b;
										if (dontHighlight) {
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{
														ax: model.ax + 1,
														aJ: nextInstructionPointer,
														aK: A3(
															updateInstructionAt,
															model.aJ,
															A3(
																$author$project$Ram$Types$Instructions$Load,
																$author$project$Ram$Types$Instructions$Indirect(regIndex),
																$elm$core$Maybe$Nothing,
																exeCount + 1),
															model.aK),
														aN: newLogSpace,
														aO: newLogTime,
														aV: newRegisters
													}),
												$elm$core$Platform$Cmd$none);
										} else {
											var updatedModel = _Utils_update(
												model,
												{
													ax: model.ax + 1,
													aE: A3($elm$core$Dict$insert, pointer, 'bg-blue-200', $elm$core$Dict$empty),
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Load,
															$author$project$Ram$Types$Instructions$Indirect(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aN: newLogSpace,
													aO: newLogTime,
													aV: newRegisters
												});
											var switchHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v14) {
													return A2(
														$author$project$Ram$Types$Messages$SwitchHighlight,
														_Utils_Tuple2(1, pointer),
														_Utils_Tuple3(1, 0, 'bg-blue-200'));
												},
												$elm$core$Process$sleep((highlightDuration / 2) | 0));
											var removeHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v13) {
													return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
												},
												$elm$core$Process$sleep(highlightDuration));
											return _Utils_Tuple2(
												updatedModel,
												$elm$core$Platform$Cmd$batch(
													_List_fromArray(
														[switchHighlightCmd, removeHighlightCmd])));
										}
									}
								}
						}
					}
				case 1:
					var operand = instr.a;
					var isError = instr.b;
					var exeCount = instr.c;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						switch (operand.$) {
							case 0:
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{aJ: nextInstructionPointer}),
									$elm$core$Platform$Cmd$none);
							case 1:
								var regIndex = operand.a;
								var maybeAccVal = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model);
								if (maybeAccVal.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{aJ: nextInstructionPointer}),
										$elm$core$Platform$Cmd$none);
								} else {
									var accVal = maybeAccVal.a;
									var newLogTime = (model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex);
									var _v18 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, regIndex, accVal, model.aM, model.aV);
									var newRegisters = _v18.a;
									var newLogSpace = _v18.b;
									if (dontHighlight) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													ax: model.ax + 1,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Store,
															$author$project$Ram$Types$Instructions$Direct(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aN: newLogSpace,
													aO: newLogTime,
													aV: newRegisters
												}),
											$elm$core$Platform$Cmd$none);
									} else {
										var updatedModel = _Utils_update(
											model,
											{
												ax: model.ax + 1,
												aE: A3($elm$core$Dict$insert, 0, 'bg-blue-200', $elm$core$Dict$empty),
												aJ: nextInstructionPointer,
												aK: A3(
													updateInstructionAt,
													model.aJ,
													A3(
														$author$project$Ram$Types$Instructions$Store,
														$author$project$Ram$Types$Instructions$Direct(regIndex),
														$elm$core$Maybe$Nothing,
														exeCount + 1),
													model.aK),
												aN: newLogSpace,
												aO: newLogTime,
												aV: newRegisters
											});
										var switchHighlightCmd = A2(
											$elm$core$Task$perform,
											function (_v20) {
												return A2(
													$author$project$Ram$Types$Messages$SwitchHighlight,
													_Utils_Tuple2(1, 0),
													_Utils_Tuple3(1, regIndex, 'bg-blue-200'));
											},
											$elm$core$Process$sleep((highlightDuration / 2) | 0));
										var removeHighlightCmd = A2(
											$elm$core$Task$perform,
											function (_v19) {
												return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(regIndex);
											},
											$elm$core$Process$sleep(highlightDuration));
										return _Utils_Tuple2(
											updatedModel,
											$elm$core$Platform$Cmd$batch(
												_List_fromArray(
													[switchHighlightCmd, removeHighlightCmd])));
									}
								}
							default:
								var regIndex = operand.a;
								var maybePointer = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
								if (maybePointer.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{aJ: nextInstructionPointer}),
										$elm$core$Platform$Cmd$none);
								} else {
									var pointer = maybePointer.a;
									var maybeValue = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, pointer, model);
									var accVal = A2(
										$elm$core$Maybe$withDefault,
										0,
										A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
									if (maybeValue.$ === 1) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													ax: model.ax + 1,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Store,
															$author$project$Ram$Types$Instructions$Indirect(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aO: ((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex)
												}),
											$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
												_Utils_Tuple2(
													1,
													'Runtime Error: Instruction ' + ($elm$core$String$fromInt(model.aJ + 1) + ' attempted to access a non-existent register.'))));
									} else {
										var newLogTime = ((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex);
										var _v23 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, pointer, accVal, model.aM, model.aV);
										var newRegisters = _v23.a;
										var newLogSpace = _v23.b;
										if (dontHighlight) {
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{
														ax: model.ax + 1,
														aJ: nextInstructionPointer,
														aK: A3(
															updateInstructionAt,
															model.aJ,
															A3(
																$author$project$Ram$Types$Instructions$Store,
																$author$project$Ram$Types$Instructions$Indirect(regIndex),
																$elm$core$Maybe$Nothing,
																exeCount + 1),
															model.aK),
														aN: newLogSpace,
														aO: newLogTime,
														aV: newRegisters
													}),
												$elm$core$Platform$Cmd$none);
										} else {
											var updatedModel = _Utils_update(
												model,
												{
													ax: model.ax + 1,
													aE: A3($elm$core$Dict$insert, 0, 'bg-blue-200', $elm$core$Dict$empty),
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Store,
															$author$project$Ram$Types$Instructions$Indirect(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aN: newLogSpace,
													aO: newLogTime,
													aV: newRegisters
												});
											var switchHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v25) {
													return A2(
														$author$project$Ram$Types$Messages$SwitchHighlight,
														_Utils_Tuple2(1, 0),
														_Utils_Tuple3(1, pointer, 'bg-blue-200'));
												},
												$elm$core$Process$sleep((highlightDuration / 2) | 0));
											var removeHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v24) {
													return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(pointer);
												},
												$elm$core$Process$sleep(highlightDuration));
											return _Utils_Tuple2(
												updatedModel,
												$elm$core$Platform$Cmd$batch(
													_List_fromArray(
														[switchHighlightCmd, removeHighlightCmd])));
										}
									}
								}
						}
					}
				case 2:
					var operand = instr.a;
					var isError = instr.b;
					var exeCount = instr.c;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						switch (operand.$) {
							case 0:
								var value = operand.a;
								var accVal = A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
								var newLogTime = (model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value);
								var _v28 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, accVal + value, model.aM, model.aV);
								var newRegisters = _v28.a;
								var newLogSpace = _v28.b;
								if (dontHighlight) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												ax: model.ax + 1,
												aJ: nextInstructionPointer,
												aK: A3(
													updateInstructionAt,
													model.aJ,
													A3(
														$author$project$Ram$Types$Instructions$Add,
														$author$project$Ram$Types$Instructions$Constant(value),
														$elm$core$Maybe$Nothing,
														exeCount + 1),
													model.aK),
												aN: newLogSpace,
												aO: newLogTime,
												aV: newRegisters
											}),
										$elm$core$Platform$Cmd$none);
								} else {
									var updatedModel = _Utils_update(
										model,
										{
											ax: model.ax + 1,
											aE: A3($elm$core$Dict$insert, 0, 'bg-blue-200', $elm$core$Dict$empty),
											aJ: nextInstructionPointer,
											aK: A3(
												updateInstructionAt,
												model.aJ,
												A3(
													$author$project$Ram$Types$Instructions$Add,
													$author$project$Ram$Types$Instructions$Constant(value),
													$elm$core$Maybe$Nothing,
													exeCount + 1),
												model.aK),
											aN: newLogSpace,
											aO: newLogTime,
											aV: newRegisters
										});
									var removeHighlightCmd = A2(
										$elm$core$Task$perform,
										function (_v29) {
											return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
										},
										$elm$core$Process$sleep(highlightDuration));
									return _Utils_Tuple2(updatedModel, removeHighlightCmd);
								}
							case 1:
								var regIndex = operand.a;
								var maybeValue = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
								var accVal = A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
								if (maybeValue.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{aJ: nextInstructionPointer}),
										$elm$core$Platform$Cmd$none);
								} else {
									var value = maybeValue.a;
									var newLogTime = ((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex);
									var _v31 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, accVal + value, model.aM, model.aV);
									var newRegisters = _v31.a;
									var newLogSpace = _v31.b;
									if (dontHighlight) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													ax: model.ax + 1,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Add,
															$author$project$Ram$Types$Instructions$Direct(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aN: newLogSpace,
													aO: newLogTime,
													aV: newRegisters
												}),
											$elm$core$Platform$Cmd$none);
									} else {
										var updatedModel = _Utils_update(
											model,
											{
												ax: model.ax + 1,
												aE: A3($elm$core$Dict$insert, regIndex, 'bg-blue-200', $elm$core$Dict$empty),
												aJ: nextInstructionPointer,
												aK: A3(
													updateInstructionAt,
													model.aJ,
													A3(
														$author$project$Ram$Types$Instructions$Add,
														$author$project$Ram$Types$Instructions$Direct(regIndex),
														$elm$core$Maybe$Nothing,
														exeCount + 1),
													model.aK),
												aN: newLogSpace,
												aO: newLogTime,
												aV: newRegisters
											});
										var switchHighlightCmd = A2(
											$elm$core$Task$perform,
											function (_v33) {
												return A2(
													$author$project$Ram$Types$Messages$SwitchHighlight,
													_Utils_Tuple2(1, regIndex),
													_Utils_Tuple3(1, 0, 'bg-blue-200'));
											},
											$elm$core$Process$sleep((highlightDuration / 2) | 0));
										var removeHighlightCmd = A2(
											$elm$core$Task$perform,
											function (_v32) {
												return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
											},
											$elm$core$Process$sleep(highlightDuration));
										return _Utils_Tuple2(
											updatedModel,
											$elm$core$Platform$Cmd$batch(
												_List_fromArray(
													[switchHighlightCmd, removeHighlightCmd])));
									}
								}
							default:
								var regIndex = operand.a;
								var maybePointer = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
								var accVal = A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
								if (maybePointer.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{aJ: nextInstructionPointer}),
										$elm$core$Platform$Cmd$none);
								} else {
									var pointer = maybePointer.a;
									var maybeValue = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, pointer, model);
									if (maybeValue.$ === 1) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													ax: model.ax + 1,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Add,
															$author$project$Ram$Types$Instructions$Indirect(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aO: (((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2(
														$author$project$Ram$Utils$ExecuteInstruction$calculateLogTime,
														model.aM,
														A2($elm$core$Maybe$withDefault, 0, maybeValue))) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex)
												}),
											$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
												_Utils_Tuple2(
													1,
													'Runtime Error: Instruction ' + ($elm$core$String$fromInt(model.aJ + 1) + ' attempted to access a non-existent register.'))));
									} else {
										var value = maybeValue.a;
										var newLogTime = (((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex);
										var _v36 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, accVal + value, model.aM, model.aV);
										var newRegisters = _v36.a;
										var newLogSpace = _v36.b;
										if (dontHighlight) {
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{
														ax: model.ax + 1,
														aJ: nextInstructionPointer,
														aK: A3(
															updateInstructionAt,
															model.aJ,
															A3(
																$author$project$Ram$Types$Instructions$Add,
																$author$project$Ram$Types$Instructions$Indirect(regIndex),
																$elm$core$Maybe$Nothing,
																exeCount + 1),
															model.aK),
														aN: newLogSpace,
														aO: newLogTime,
														aV: newRegisters
													}),
												$elm$core$Platform$Cmd$none);
										} else {
											var updatedModel = _Utils_update(
												model,
												{
													ax: model.ax + 1,
													aE: A3($elm$core$Dict$insert, pointer, 'bg-blue-200', $elm$core$Dict$empty),
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Add,
															$author$project$Ram$Types$Instructions$Indirect(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aN: newLogSpace,
													aO: newLogTime,
													aV: newRegisters
												});
											var switchHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v38) {
													return A2(
														$author$project$Ram$Types$Messages$SwitchHighlight,
														_Utils_Tuple2(1, pointer),
														_Utils_Tuple3(1, 0, 'bg-blue-200'));
												},
												$elm$core$Process$sleep((highlightDuration / 2) | 0));
											var removeHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v37) {
													return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
												},
												$elm$core$Process$sleep(highlightDuration));
											return _Utils_Tuple2(
												updatedModel,
												$elm$core$Platform$Cmd$batch(
													_List_fromArray(
														[switchHighlightCmd, removeHighlightCmd])));
										}
									}
								}
						}
					}
				case 3:
					var operand = instr.a;
					var isError = instr.b;
					var exeCount = instr.c;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						switch (operand.$) {
							case 0:
								var value = operand.a;
								var accVal = A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
								var newLogTime = (model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value);
								var _v41 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, accVal - value, model.aM, model.aV);
								var newRegisters = _v41.a;
								var newLogSpace = _v41.b;
								if (dontHighlight) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												ax: model.ax + 1,
												aJ: nextInstructionPointer,
												aK: A3(
													updateInstructionAt,
													model.aJ,
													A3(
														$author$project$Ram$Types$Instructions$Sub,
														$author$project$Ram$Types$Instructions$Constant(value),
														$elm$core$Maybe$Nothing,
														exeCount + 1),
													model.aK),
												aN: newLogSpace,
												aO: newLogTime,
												aV: newRegisters
											}),
										$elm$core$Platform$Cmd$none);
								} else {
									var updatedModel = _Utils_update(
										model,
										{
											ax: model.ax + 1,
											aE: A3($elm$core$Dict$insert, 0, 'bg-blue-200', $elm$core$Dict$empty),
											aJ: nextInstructionPointer,
											aK: A3(
												updateInstructionAt,
												model.aJ,
												A3(
													$author$project$Ram$Types$Instructions$Sub,
													$author$project$Ram$Types$Instructions$Constant(value),
													$elm$core$Maybe$Nothing,
													exeCount + 1),
												model.aK),
											aN: newLogSpace,
											aO: newLogTime,
											aV: newRegisters
										});
									var removeHighlightCmd = A2(
										$elm$core$Task$perform,
										function (_v42) {
											return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
										},
										$elm$core$Process$sleep(highlightDuration));
									return _Utils_Tuple2(updatedModel, removeHighlightCmd);
								}
							case 1:
								var regIndex = operand.a;
								var maybeValue = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
								var accVal = A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
								if (maybeValue.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{aJ: nextInstructionPointer}),
										$elm$core$Platform$Cmd$none);
								} else {
									var value = maybeValue.a;
									var newLogTime = ((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex);
									var _v44 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, accVal - value, model.aM, model.aV);
									var newRegisters = _v44.a;
									var newLogSpace = _v44.b;
									if (dontHighlight) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													ax: model.ax + 1,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Sub,
															$author$project$Ram$Types$Instructions$Direct(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aN: newLogSpace,
													aO: newLogTime,
													aV: newRegisters
												}),
											$elm$core$Platform$Cmd$none);
									} else {
										var updatedModel = _Utils_update(
											model,
											{
												ax: model.ax + 1,
												aE: A3($elm$core$Dict$insert, regIndex, 'bg-blue-200', $elm$core$Dict$empty),
												aJ: nextInstructionPointer,
												aK: A3(
													updateInstructionAt,
													model.aJ,
													A3(
														$author$project$Ram$Types$Instructions$Sub,
														$author$project$Ram$Types$Instructions$Direct(regIndex),
														$elm$core$Maybe$Nothing,
														exeCount + 1),
													model.aK),
												aN: newLogSpace,
												aO: newLogTime,
												aV: newRegisters
											});
										var switchHighlightCmd = A2(
											$elm$core$Task$perform,
											function (_v46) {
												return A2(
													$author$project$Ram$Types$Messages$SwitchHighlight,
													_Utils_Tuple2(1, regIndex),
													_Utils_Tuple3(1, 0, 'bg-blue-200'));
											},
											$elm$core$Process$sleep((highlightDuration / 2) | 0));
										var removeHighlightCmd = A2(
											$elm$core$Task$perform,
											function (_v45) {
												return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
											},
											$elm$core$Process$sleep(highlightDuration));
										return _Utils_Tuple2(
											updatedModel,
											$elm$core$Platform$Cmd$batch(
												_List_fromArray(
													[switchHighlightCmd, removeHighlightCmd])));
									}
								}
							default:
								var regIndex = operand.a;
								var maybePointer = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
								var accVal = A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
								if (maybePointer.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{aJ: nextInstructionPointer}),
										$elm$core$Platform$Cmd$none);
								} else {
									var pointer = maybePointer.a;
									var maybeValue = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, pointer, model);
									if (maybeValue.$ === 1) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													ax: model.ax + 1,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Sub,
															$author$project$Ram$Types$Instructions$Indirect(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aO: (((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2(
														$author$project$Ram$Utils$ExecuteInstruction$calculateLogTime,
														model.aM,
														A2($elm$core$Maybe$withDefault, 0, maybeValue))) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex)
												}),
											$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
												_Utils_Tuple2(
													1,
													'Runtime Error: Instruction ' + ($elm$core$String$fromInt(model.aJ + 1) + ' attempted to access a non-existent register.'))));
									} else {
										var value = maybeValue.a;
										var newLogTime = (((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex);
										var _v49 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, accVal - value, model.aM, model.aV);
										var newRegisters = _v49.a;
										var newLogSpace = _v49.b;
										if (dontHighlight) {
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{
														ax: model.ax + 1,
														aJ: nextInstructionPointer,
														aK: A3(
															updateInstructionAt,
															model.aJ,
															A3(
																$author$project$Ram$Types$Instructions$Sub,
																$author$project$Ram$Types$Instructions$Indirect(regIndex),
																$elm$core$Maybe$Nothing,
																exeCount + 1),
															model.aK),
														aN: newLogSpace,
														aO: newLogTime,
														aV: newRegisters
													}),
												$elm$core$Platform$Cmd$none);
										} else {
											var updatedModel = _Utils_update(
												model,
												{
													ax: model.ax + 1,
													aE: A3($elm$core$Dict$insert, pointer, 'bg-blue-200', $elm$core$Dict$empty),
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Sub,
															$author$project$Ram$Types$Instructions$Indirect(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aN: newLogSpace,
													aO: newLogTime,
													aV: newRegisters
												});
											var switchHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v51) {
													return A2(
														$author$project$Ram$Types$Messages$SwitchHighlight,
														_Utils_Tuple2(1, pointer),
														_Utils_Tuple3(1, 0, 'bg-blue-200'));
												},
												$elm$core$Process$sleep((highlightDuration / 2) | 0));
											var removeHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v50) {
													return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
												},
												$elm$core$Process$sleep(highlightDuration));
											return _Utils_Tuple2(
												updatedModel,
												$elm$core$Platform$Cmd$batch(
													_List_fromArray(
														[switchHighlightCmd, removeHighlightCmd])));
										}
									}
								}
						}
					}
				case 4:
					var operand = instr.a;
					var isError = instr.b;
					var exeCount = instr.c;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						switch (operand.$) {
							case 0:
								var value = operand.a;
								var accVal = A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
								var newLogTime = (model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value);
								var _v54 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, accVal * value, model.aM, model.aV);
								var newRegisters = _v54.a;
								var newLogSpace = _v54.b;
								if (dontHighlight) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												ax: model.ax + 1,
												aJ: nextInstructionPointer,
												aK: A3(
													updateInstructionAt,
													model.aJ,
													A3(
														$author$project$Ram$Types$Instructions$Mul,
														$author$project$Ram$Types$Instructions$Constant(value),
														$elm$core$Maybe$Nothing,
														exeCount + 1),
													model.aK),
												aN: newLogSpace,
												aO: newLogTime,
												aV: newRegisters
											}),
										$elm$core$Platform$Cmd$none);
								} else {
									var updatedModel = _Utils_update(
										model,
										{
											ax: model.ax + 1,
											aE: A3($elm$core$Dict$insert, 0, 'bg-blue-200', $elm$core$Dict$empty),
											aJ: nextInstructionPointer,
											aK: A3(
												updateInstructionAt,
												model.aJ,
												A3(
													$author$project$Ram$Types$Instructions$Mul,
													$author$project$Ram$Types$Instructions$Constant(value),
													$elm$core$Maybe$Nothing,
													exeCount + 1),
												model.aK),
											aN: newLogSpace,
											aO: newLogTime,
											aV: newRegisters
										});
									var removeHighlightCmd = A2(
										$elm$core$Task$perform,
										function (_v55) {
											return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
										},
										$elm$core$Process$sleep(highlightDuration));
									return _Utils_Tuple2(updatedModel, removeHighlightCmd);
								}
							case 1:
								var regIndex = operand.a;
								var maybeValue = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
								var accVal = A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
								if (maybeValue.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{aJ: nextInstructionPointer}),
										$elm$core$Platform$Cmd$none);
								} else {
									var value = maybeValue.a;
									var newLogTime = ((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex);
									var _v57 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, accVal * value, model.aM, model.aV);
									var newRegisters = _v57.a;
									var newLogSpace = _v57.b;
									if (dontHighlight) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													ax: model.ax + 1,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Mul,
															$author$project$Ram$Types$Instructions$Direct(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aN: newLogSpace,
													aO: newLogTime,
													aV: newRegisters
												}),
											$elm$core$Platform$Cmd$none);
									} else {
										var updatedModel = _Utils_update(
											model,
											{
												ax: model.ax + 1,
												aE: A3($elm$core$Dict$insert, regIndex, 'bg-blue-200', $elm$core$Dict$empty),
												aJ: nextInstructionPointer,
												aK: A3(
													updateInstructionAt,
													model.aJ,
													A3(
														$author$project$Ram$Types$Instructions$Mul,
														$author$project$Ram$Types$Instructions$Direct(regIndex),
														$elm$core$Maybe$Nothing,
														exeCount + 1),
													model.aK),
												aN: newLogSpace,
												aO: newLogTime,
												aV: newRegisters
											});
										var switchHighlightCmd = A2(
											$elm$core$Task$perform,
											function (_v59) {
												return A2(
													$author$project$Ram$Types$Messages$SwitchHighlight,
													_Utils_Tuple2(1, regIndex),
													_Utils_Tuple3(1, 0, 'bg-blue-200'));
											},
											$elm$core$Process$sleep((highlightDuration / 2) | 0));
										var removeHighlightCmd = A2(
											$elm$core$Task$perform,
											function (_v58) {
												return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
											},
											$elm$core$Process$sleep(highlightDuration));
										return _Utils_Tuple2(
											updatedModel,
											$elm$core$Platform$Cmd$batch(
												_List_fromArray(
													[switchHighlightCmd, removeHighlightCmd])));
									}
								}
							default:
								var regIndex = operand.a;
								var maybePointer = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
								var accVal = A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
								if (maybePointer.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{aJ: nextInstructionPointer}),
										$elm$core$Platform$Cmd$none);
								} else {
									var pointer = maybePointer.a;
									var maybeValue = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, pointer, model);
									if (maybeValue.$ === 1) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													ax: model.ax + 1,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Mul,
															$author$project$Ram$Types$Instructions$Indirect(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aO: (((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2(
														$author$project$Ram$Utils$ExecuteInstruction$calculateLogTime,
														model.aM,
														A2($elm$core$Maybe$withDefault, 0, maybeValue))) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex)
												}),
											$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
												_Utils_Tuple2(
													1,
													'Runtime Error: Instruction ' + ($elm$core$String$fromInt(model.aJ + 1) + ' attempted to access a non-existent register.'))));
									} else {
										var value = maybeValue.a;
										var newLogTime = (((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex);
										var _v62 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, accVal * value, model.aM, model.aV);
										var newRegisters = _v62.a;
										var newLogSpace = _v62.b;
										if (dontHighlight) {
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{
														ax: model.ax + 1,
														aJ: nextInstructionPointer,
														aK: A3(
															updateInstructionAt,
															model.aJ,
															A3(
																$author$project$Ram$Types$Instructions$Mul,
																$author$project$Ram$Types$Instructions$Indirect(regIndex),
																$elm$core$Maybe$Nothing,
																exeCount + 1),
															model.aK),
														aN: newLogSpace,
														aO: newLogTime,
														aV: newRegisters
													}),
												$elm$core$Platform$Cmd$none);
										} else {
											var updatedModel = _Utils_update(
												model,
												{
													ax: model.ax + 1,
													aE: A3($elm$core$Dict$insert, pointer, 'bg-blue-200', $elm$core$Dict$empty),
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Mul,
															$author$project$Ram$Types$Instructions$Indirect(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aN: newLogSpace,
													aO: newLogTime,
													aV: newRegisters
												});
											var switchHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v64) {
													return A2(
														$author$project$Ram$Types$Messages$SwitchHighlight,
														_Utils_Tuple2(1, pointer),
														_Utils_Tuple3(1, 0, 'bg-blue-200'));
												},
												$elm$core$Process$sleep((highlightDuration / 2) | 0));
											var removeHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v63) {
													return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
												},
												$elm$core$Process$sleep(highlightDuration));
											return _Utils_Tuple2(
												updatedModel,
												$elm$core$Platform$Cmd$batch(
													_List_fromArray(
														[switchHighlightCmd, removeHighlightCmd])));
										}
									}
								}
						}
					}
				case 5:
					var operand = instr.a;
					var isError = instr.b;
					var exeCount = instr.c;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						switch (operand.$) {
							case 0:
								var value = operand.a;
								var accVal = A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
								var newLogTime = (model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value);
								var _v67 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, (accVal / value) | 0, model.aM, model.aV);
								var newRegisters = _v67.a;
								var newLogSpace = _v67.b;
								if (dontHighlight) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												ax: model.ax + 1,
												aJ: nextInstructionPointer,
												aK: A3(
													updateInstructionAt,
													model.aJ,
													A3(
														$author$project$Ram$Types$Instructions$Div,
														$author$project$Ram$Types$Instructions$Constant(value),
														$elm$core$Maybe$Nothing,
														exeCount + 1),
													model.aK),
												aN: newLogSpace,
												aO: newLogTime,
												aV: newRegisters
											}),
										$elm$core$Platform$Cmd$none);
								} else {
									var updatedModel = _Utils_update(
										model,
										{
											ax: model.ax + 1,
											aE: A3($elm$core$Dict$insert, 0, 'bg-blue-200', $elm$core$Dict$empty),
											aJ: nextInstructionPointer,
											aK: A3(
												updateInstructionAt,
												model.aJ,
												A3(
													$author$project$Ram$Types$Instructions$Div,
													$author$project$Ram$Types$Instructions$Constant(value),
													$elm$core$Maybe$Nothing,
													exeCount + 1),
												model.aK),
											aN: newLogSpace,
											aO: newLogTime,
											aV: newRegisters
										});
									var removeHighlightCmd = A2(
										$elm$core$Task$perform,
										function (_v68) {
											return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
										},
										$elm$core$Process$sleep(highlightDuration));
									return _Utils_Tuple2(updatedModel, removeHighlightCmd);
								}
							case 1:
								var regIndex = operand.a;
								var maybeValue = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
								var accVal = A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
								if (maybeValue.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{aJ: nextInstructionPointer}),
										$elm$core$Platform$Cmd$none);
								} else {
									var value = maybeValue.a;
									var newLogTime = ((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex);
									var _v70 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, (accVal / value) | 0, model.aM, model.aV);
									var newRegisters = _v70.a;
									var newLogSpace = _v70.b;
									if (dontHighlight && (!(!value))) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													ax: model.ax + 1,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Div,
															$author$project$Ram$Types$Instructions$Direct(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aN: newLogSpace,
													aO: newLogTime,
													aV: newRegisters
												}),
											$elm$core$Platform$Cmd$none);
									} else {
										if (dontHighlight && (!value)) {
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{
														ax: model.ax + 1,
														aJ: nextInstructionPointer,
														aK: A3(
															updateInstructionAt,
															model.aJ,
															A3(
																$author$project$Ram$Types$Instructions$Div,
																$author$project$Ram$Types$Instructions$Direct(regIndex),
																$elm$core$Maybe$Nothing,
																exeCount + 1),
															model.aK),
														aO: newLogTime
													}),
												$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
													_Utils_Tuple2(
														1,
														'Runtime Error: Instruction ' + ($elm$core$String$fromInt(model.aJ + 1) + ' attempted to divide by zero.'))));
										} else {
											var updatedModel = (!(!value)) ? _Utils_update(
												model,
												{
													ax: model.ax + 1,
													aE: A3($elm$core$Dict$insert, regIndex, 'bg-blue-200', $elm$core$Dict$empty),
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Div,
															$author$project$Ram$Types$Instructions$Direct(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aN: newLogSpace,
													aO: newLogTime,
													aV: newRegisters
												}) : _Utils_update(
												model,
												{
													ax: model.ax + 1,
													aE: A3($elm$core$Dict$insert, regIndex, 'bg-red-200', $elm$core$Dict$empty),
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Div,
															$author$project$Ram$Types$Instructions$Direct(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aO: newLogTime
												});
											var switchHighlightCmd = (!(!value)) ? A2(
												$elm$core$Task$perform,
												function (_v72) {
													return A2(
														$author$project$Ram$Types$Messages$SwitchHighlight,
														_Utils_Tuple2(1, regIndex),
														_Utils_Tuple3(1, 0, 'bg-blue-200'));
												},
												$elm$core$Process$sleep((highlightDuration / 2) | 0)) : A2(
												$elm$core$Task$perform,
												function (_v73) {
													return A2(
														$author$project$Ram$Types$Messages$SwitchHighlight,
														_Utils_Tuple2(1, regIndex),
														_Utils_Tuple3(1, 0, 'bg-red-200'));
												},
												$elm$core$Process$sleep((highlightDuration / 2) | 0));
											var removeHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v71) {
													return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
												},
												$elm$core$Process$sleep(highlightDuration));
											return (!value) ? _Utils_Tuple2(
												updatedModel,
												$elm$core$Platform$Cmd$batch(
													_List_fromArray(
														[
															$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
															_Utils_Tuple2(
																1,
																'Runtime Error: Instruction ' + ($elm$core$String$fromInt(model.aJ + 1) + ' attempted to divide by zero.'))),
															switchHighlightCmd,
															removeHighlightCmd
														]))) : _Utils_Tuple2(
												updatedModel,
												$elm$core$Platform$Cmd$batch(
													_List_fromArray(
														[switchHighlightCmd, removeHighlightCmd])));
										}
									}
								}
							default:
								var regIndex = operand.a;
								var maybePointer = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
								var accVal = A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
								if (maybePointer.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{aJ: nextInstructionPointer}),
										$elm$core$Platform$Cmd$none);
								} else {
									var pointer = maybePointer.a;
									var maybeValue = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, pointer, model);
									if (maybeValue.$ === 1) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													ax: model.ax + 1,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Div,
															$author$project$Ram$Types$Instructions$Indirect(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aO: (((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, 0)
												}),
											$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
												_Utils_Tuple2(
													1,
													'Runtime Error: Instruction ' + ($elm$core$String$fromInt(model.aJ + 1) + ' attempted to access a non-existent register.'))));
									} else {
										var value = maybeValue.a;
										var newLogTime = (((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex);
										var _v76 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, 0, (accVal / value) | 0, model.aM, model.aV);
										var newRegisters = _v76.a;
										var newLogSpace = _v76.b;
										if (dontHighlight && (!(!value))) {
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{
														ax: model.ax + 1,
														aJ: nextInstructionPointer,
														aK: A3(
															updateInstructionAt,
															model.aJ,
															A3(
																$author$project$Ram$Types$Instructions$Div,
																$author$project$Ram$Types$Instructions$Indirect(regIndex),
																$elm$core$Maybe$Nothing,
																exeCount + 1),
															model.aK),
														aN: newLogSpace,
														aO: newLogTime,
														aV: newRegisters
													}),
												$elm$core$Platform$Cmd$none);
										} else {
											if (dontHighlight && (!value)) {
												return _Utils_Tuple2(
													_Utils_update(
														model,
														{
															ax: model.ax + 1,
															aJ: nextInstructionPointer,
															aK: A3(
																updateInstructionAt,
																model.aJ,
																A3(
																	$author$project$Ram$Types$Instructions$Div,
																	$author$project$Ram$Types$Instructions$Indirect(regIndex),
																	$elm$core$Maybe$Nothing,
																	exeCount + 1),
																model.aK),
															aO: newLogTime
														}),
													$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
														_Utils_Tuple2(
															1,
															'Runtime Error: Instruction ' + ($elm$core$String$fromInt(model.aJ + 1) + ' attempted to divide by zero.'))));
											} else {
												var updatedModel = (!(!value)) ? _Utils_update(
													model,
													{
														ax: model.ax + 1,
														aE: A3($elm$core$Dict$insert, pointer, 'bg-blue-200', $elm$core$Dict$empty),
														aJ: nextInstructionPointer,
														aK: A3(
															updateInstructionAt,
															model.aJ,
															A3(
																$author$project$Ram$Types$Instructions$Div,
																$author$project$Ram$Types$Instructions$Indirect(regIndex),
																$elm$core$Maybe$Nothing,
																exeCount + 1),
															model.aK),
														aN: newLogSpace,
														aO: newLogTime,
														aV: newRegisters
													}) : _Utils_update(
													model,
													{
														ax: model.ax + 1,
														aE: A3($elm$core$Dict$insert, pointer, 'bg-red-200', $elm$core$Dict$empty),
														aJ: nextInstructionPointer,
														aK: A3(
															updateInstructionAt,
															model.aJ,
															A3(
																$author$project$Ram$Types$Instructions$Div,
																$author$project$Ram$Types$Instructions$Indirect(regIndex),
																$elm$core$Maybe$Nothing,
																exeCount + 1),
															model.aK),
														aO: newLogTime
													});
												var switchHighlightCmd = (!(!value)) ? A2(
													$elm$core$Task$perform,
													function (_v78) {
														return A2(
															$author$project$Ram$Types$Messages$SwitchHighlight,
															_Utils_Tuple2(1, pointer),
															_Utils_Tuple3(1, 0, 'bg-blue-200'));
													},
													$elm$core$Process$sleep((highlightDuration / 2) | 0)) : A2(
													$elm$core$Task$perform,
													function (_v79) {
														return A2(
															$author$project$Ram$Types$Messages$SwitchHighlight,
															_Utils_Tuple2(1, pointer),
															_Utils_Tuple3(1, 0, 'bg-red-200'));
													},
													$elm$core$Process$sleep((highlightDuration / 2) | 0));
												var removeHighlightCmd = A2(
													$elm$core$Task$perform,
													function (_v77) {
														return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(0);
													},
													$elm$core$Process$sleep(highlightDuration));
												return (!value) ? _Utils_Tuple2(
													updatedModel,
													$elm$core$Platform$Cmd$batch(
														_List_fromArray(
															[
																$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
																_Utils_Tuple2(
																	1,
																	'Runtime Error: Instruction ' + ($elm$core$String$fromInt(model.aJ + 1) + ' attempted to divide by zero.'))),
																switchHighlightCmd,
																removeHighlightCmd
															]))) : _Utils_Tuple2(
													updatedModel,
													$elm$core$Platform$Cmd$batch(
														_List_fromArray(
															[switchHighlightCmd, removeHighlightCmd])));
											}
										}
									}
								}
						}
					}
				case 8:
					var idx = instr.a;
					var jumpThere = instr.b;
					var isError = instr.c;
					var exeCount = instr.d;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									ax: model.ax + 1,
									aJ: idx,
									aK: A3(
										updateInstructionAt,
										model.aJ,
										A4($author$project$Ram$Types$Instructions$Jump, idx, jumpThere, $elm$core$Maybe$Nothing, exeCount + 1),
										model.aK),
									aO: model.aO + 1
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 9:
					var idx = instr.a;
					var jumpThere = instr.b;
					var isError = instr.c;
					var exeCount = instr.d;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						var accVal = A2(
							$elm$core$Maybe$withDefault,
							0,
							A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
						var newLogTime = model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal);
						return (!accVal) ? _Utils_Tuple2(
							_Utils_update(
								model,
								{
									ax: model.ax + 1,
									aJ: idx,
									aK: A3(
										updateInstructionAt,
										model.aJ,
										A4($author$project$Ram$Types$Instructions$Jzero, idx, jumpThere, $elm$core$Maybe$Nothing, exeCount + 1),
										model.aK),
									aO: newLogTime
								}),
							$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
							_Utils_update(
								model,
								{
									ax: model.ax + 1,
									aJ: nextInstructionPointer,
									aK: A3(
										updateInstructionAt,
										model.aJ,
										A4($author$project$Ram$Types$Instructions$Jzero, idx, jumpThere, $elm$core$Maybe$Nothing, exeCount + 1),
										model.aK),
									aO: newLogTime
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 10:
					var idx = instr.a;
					var jumpThere = instr.b;
					var isError = instr.c;
					var exeCount = instr.d;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						var accVal = A2(
							$elm$core$Maybe$withDefault,
							0,
							A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, 0, model));
						var newLogTime = model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, accVal);
						return (accVal > 0) ? _Utils_Tuple2(
							_Utils_update(
								model,
								{
									ax: model.ax + 1,
									aJ: idx,
									aK: A3(
										updateInstructionAt,
										model.aJ,
										A4($author$project$Ram$Types$Instructions$Jgtz, idx, jumpThere, $elm$core$Maybe$Nothing, exeCount + 1),
										model.aK),
									aO: newLogTime
								}),
							$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
							_Utils_update(
								model,
								{
									ax: model.ax + 1,
									aJ: nextInstructionPointer,
									aK: A3(
										updateInstructionAt,
										model.aJ,
										A4($author$project$Ram$Types$Instructions$Jgtz, idx, jumpThere, $elm$core$Maybe$Nothing, exeCount + 1),
										model.aK),
									aO: newLogTime
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 11:
					var exeCount = instr.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ax: model.ax + 1,
								az: true,
								aK: A3(
									updateInstructionAt,
									model.aJ,
									$author$project$Ram$Types$Instructions$Halt(exeCount + 1),
									model.aK),
								aL: false,
								aO: model.aO + 1
							}),
						A2(
							$elm$core$Task$perform,
							$author$project$Ram$Types$Messages$ComputeAndPrintDuration(true),
							$elm$time$Time$now));
				case 12:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aJ: nextInstructionPointer}),
						$elm$core$Platform$Cmd$none);
				case 13:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aJ: nextInstructionPointer}),
						$elm$core$Platform$Cmd$none);
				case 6:
					var operand = instr.a;
					var isError = instr.b;
					var exeCount = instr.c;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						switch (operand.$) {
							case 0:
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{aJ: nextInstructionPointer}),
									$elm$core$Platform$Cmd$none);
							case 1:
								var regIndex = operand.a;
								var _v85 = A2($elm$core$Array$get, model.aH, model.J);
								if (_v85.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												ax: model.ax + 1,
												aJ: nextInstructionPointer,
												aK: A3(
													updateInstructionAt,
													model.aJ,
													A3(
														$author$project$Ram$Types$Instructions$Read,
														$author$project$Ram$Types$Instructions$Direct(regIndex),
														$elm$core$Maybe$Nothing,
														exeCount + 1),
													model.aK),
												aO: (model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, 0)
											}),
										$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
											_Utils_Tuple2(
												1,
												'Runtime Error: Instruction ' + ($elm$core$String$fromInt(model.aJ + 1) + ' attempted to read from the input tape, while no more values are available.'))));
								} else {
									var val = _v85.a;
									var maybePointer = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
									if (maybePointer.$ === 1) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{aJ: nextInstructionPointer}),
											$elm$core$Platform$Cmd$none);
									} else {
										var newTapePointer = model.aH + 1;
										var newLogTime = (model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, val);
										var _v87 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, regIndex, val, model.aM, model.aV);
										var newRegisters = _v87.a;
										var newLogSpace = _v87.b;
										if (dontHighlight) {
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{
														ax: model.ax + 1,
														aH: newTapePointer,
														aJ: nextInstructionPointer,
														aK: A3(
															updateInstructionAt,
															model.aJ,
															A3(
																$author$project$Ram$Types$Instructions$Read,
																$author$project$Ram$Types$Instructions$Direct(regIndex),
																$elm$core$Maybe$Nothing,
																exeCount + 1),
															model.aK),
														aN: newLogSpace,
														aO: newLogTime,
														aV: newRegisters
													}),
												$elm$core$Platform$Cmd$none);
										} else {
											var updatedModel = _Utils_update(
												model,
												{
													ax: model.ax + 1,
													aC: A3($elm$core$Dict$insert, model.aH, 'bg-blue-200', $elm$core$Dict$empty),
													aH: newTapePointer,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Read,
															$author$project$Ram$Types$Instructions$Direct(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aN: newLogSpace,
													aO: newLogTime,
													aV: newRegisters
												});
											var switchHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v89) {
													return A2(
														$author$project$Ram$Types$Messages$SwitchHighlight,
														_Utils_Tuple2(0, model.aH),
														_Utils_Tuple3(1, regIndex, 'bg-blue-200'));
												},
												$elm$core$Process$sleep((highlightDuration / 2) | 0));
											var removeHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v88) {
													return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(regIndex);
												},
												$elm$core$Process$sleep(highlightDuration));
											return _Utils_Tuple2(
												updatedModel,
												$elm$core$Platform$Cmd$batch(
													_List_fromArray(
														[switchHighlightCmd, removeHighlightCmd])));
										}
									}
								}
							default:
								var regIndex = operand.a;
								var _v90 = A2($elm$core$Array$get, model.aH, model.J);
								if (_v90.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												ax: model.ax + 1,
												aJ: nextInstructionPointer,
												aK: A3(
													updateInstructionAt,
													model.aJ,
													A3(
														$author$project$Ram$Types$Instructions$Read,
														$author$project$Ram$Types$Instructions$Indirect(regIndex),
														$elm$core$Maybe$Nothing,
														exeCount + 1),
													model.aK),
												aO: ((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, 0)) + A2(
													$author$project$Ram$Utils$ExecuteInstruction$calculateLogTime,
													model.aM,
													A2(
														$elm$core$Maybe$withDefault,
														0,
														A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model)))
											}),
										$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
											_Utils_Tuple2(
												1,
												'Runtime Error: Instruction ' + ($elm$core$String$fromInt(model.aJ + 1) + ' attempted to read from the input tape, while no more values are available.'))));
								} else {
									var valueToRead = _v90.a;
									var maybePointer = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
									if (maybePointer.$ === 1) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{aJ: nextInstructionPointer}),
											$elm$core$Platform$Cmd$none);
									} else {
										var pointer = maybePointer.a;
										var maybeValue = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, pointer, model);
										if (maybeValue.$ === 1) {
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{
														ax: model.ax + 1,
														aJ: nextInstructionPointer,
														aK: A3(
															updateInstructionAt,
															model.aJ,
															A3(
																$author$project$Ram$Types$Instructions$Read,
																$author$project$Ram$Types$Instructions$Indirect(regIndex),
																$elm$core$Maybe$Nothing,
																exeCount + 1),
															model.aK),
														aO: ((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, valueToRead)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)
													}),
												$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
													_Utils_Tuple2(
														1,
														'Runtime Error: Instruction ' + ($elm$core$String$fromInt(model.aJ + 1) + ' attempted to access a non-existent register.'))));
										} else {
											var newTapePointer = model.aH + 1;
											var newLogTime = ((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, valueToRead)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer);
											var _v93 = A4($author$project$Ram$Utils$ExecuteInstruction$updateRegisterAndComputeLogSpace, pointer, valueToRead, model.aM, model.aV);
											var newRegisters = _v93.a;
											var newLogSpace = _v93.b;
											if (dontHighlight) {
												return _Utils_Tuple2(
													_Utils_update(
														model,
														{
															ax: model.ax + 1,
															aH: newTapePointer,
															aJ: nextInstructionPointer,
															aK: A3(
																updateInstructionAt,
																model.aJ,
																A3(
																	$author$project$Ram$Types$Instructions$Read,
																	$author$project$Ram$Types$Instructions$Indirect(regIndex),
																	$elm$core$Maybe$Nothing,
																	exeCount + 1),
																model.aK),
															aN: newLogSpace,
															aO: newLogTime,
															aV: newRegisters
														}),
													$elm$core$Platform$Cmd$none);
											} else {
												var updatedModel = _Utils_update(
													model,
													{
														ax: model.ax + 1,
														aC: A3($elm$core$Dict$insert, model.aH, 'bg-blue-200', $elm$core$Dict$empty),
														aH: newTapePointer,
														aJ: nextInstructionPointer,
														aK: A3(
															updateInstructionAt,
															model.aJ,
															A3(
																$author$project$Ram$Types$Instructions$Read,
																$author$project$Ram$Types$Instructions$Indirect(regIndex),
																$elm$core$Maybe$Nothing,
																exeCount + 1),
															model.aK),
														aN: newLogSpace,
														aO: newLogTime,
														aV: newRegisters
													});
												var switchHighlightCmd = A2(
													$elm$core$Task$perform,
													function (_v95) {
														return A2(
															$author$project$Ram$Types$Messages$SwitchHighlight,
															_Utils_Tuple2(0, model.aH),
															_Utils_Tuple3(1, pointer, 'bg-blue-200'));
													},
													$elm$core$Process$sleep((highlightDuration / 2) | 0));
												var removeHighlightCmd = A2(
													$elm$core$Task$perform,
													function (_v94) {
														return $author$project$Ram$Types$Messages$RemoveHighlightFromRegisters(pointer);
													},
													$elm$core$Process$sleep(highlightDuration));
												return _Utils_Tuple2(
													updatedModel,
													$elm$core$Platform$Cmd$batch(
														_List_fromArray(
															[switchHighlightCmd, removeHighlightCmd])));
											}
										}
									}
								}
						}
					}
				default:
					var operand = instr.a;
					var isError = instr.b;
					var exeCount = instr.c;
					if (!isError.$) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aJ: nextInstructionPointer}),
							$elm$core$Platform$Cmd$none);
					} else {
						switch (operand.$) {
							case 0:
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{aJ: nextInstructionPointer}),
									$elm$core$Platform$Cmd$none);
							case 1:
								var regIndex = operand.a;
								var maybeValue = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
								if (maybeValue.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{aJ: nextInstructionPointer}),
										$elm$core$Platform$Cmd$none);
								} else {
									var value = maybeValue.a;
									var updatedOutputTape = A2($elm$core$Array$push, value, model.aU);
									var newLogTime = (model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value);
									if (dontHighlight) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													ax: model.ax + 1,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Write,
															$author$project$Ram$Types$Instructions$Direct(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aO: newLogTime,
													aU: updatedOutputTape
												}),
											$elm$core$Platform$Cmd$none);
									} else {
										var updatedModel = _Utils_update(
											model,
											{
												ax: model.ax + 1,
												aE: A3($elm$core$Dict$insert, regIndex, 'bg-blue-200', $elm$core$Dict$empty),
												aJ: nextInstructionPointer,
												aK: A3(
													updateInstructionAt,
													model.aJ,
													A3(
														$author$project$Ram$Types$Instructions$Write,
														$author$project$Ram$Types$Instructions$Direct(regIndex),
														$elm$core$Maybe$Nothing,
														exeCount + 1),
													model.aK),
												aO: newLogTime,
												aU: updatedOutputTape
											});
										var lastIdx = $elm$core$List$length(
											$elm$core$Array$toList(updatedOutputTape)) - 1;
										var removeHighlightCmd = A2(
											$elm$core$Task$perform,
											function (_v100) {
												return $author$project$Ram$Types$Messages$RemoveHighlightFromOutputTape(lastIdx);
											},
											$elm$core$Process$sleep(highlightDuration));
										var switchHighlightCmd = A2(
											$elm$core$Task$perform,
											function (_v99) {
												return A2(
													$author$project$Ram$Types$Messages$SwitchHighlight,
													_Utils_Tuple2(1, regIndex),
													_Utils_Tuple3(2, lastIdx, 'bg-blue-200'));
											},
											$elm$core$Process$sleep((highlightDuration / 2) | 0));
										return _Utils_Tuple2(
											updatedModel,
											$elm$core$Platform$Cmd$batch(
												_List_fromArray(
													[switchHighlightCmd, removeHighlightCmd])));
									}
								}
							default:
								var regIndex = operand.a;
								var maybePointer = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, regIndex, model);
								if (maybePointer.$ === 1) {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{aJ: nextInstructionPointer}),
										$elm$core$Platform$Cmd$none);
								} else {
									var pointer = maybePointer.a;
									var maybeValue = A2($author$project$Ram$Utils$ExecuteInstruction$getRegisterValue, pointer, model);
									if (maybeValue.$ === 1) {
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{
													ax: model.ax + 1,
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Write,
															$author$project$Ram$Types$Instructions$Indirect(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aO: ((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, 0)
												}),
											$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
												_Utils_Tuple2(
													1,
													'Runtime Error: Instruction ' + ($elm$core$String$fromInt(model.aJ + 1) + ' attempted to access a non-existent register.'))));
									} else {
										var value = maybeValue.a;
										var updatedOutputTape = A2($elm$core$Array$push, value, model.aU);
										var newLogTime = ((model.aO + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, regIndex)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, pointer)) + A2($author$project$Ram$Utils$ExecuteInstruction$calculateLogTime, model.aM, value);
										if (dontHighlight) {
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{
														ax: model.ax + 1,
														aJ: nextInstructionPointer,
														aK: A3(
															updateInstructionAt,
															model.aJ,
															A3(
																$author$project$Ram$Types$Instructions$Write,
																$author$project$Ram$Types$Instructions$Indirect(regIndex),
																$elm$core$Maybe$Nothing,
																exeCount + 1),
															model.aK),
														aO: newLogTime,
														aU: updatedOutputTape
													}),
												$elm$core$Platform$Cmd$none);
										} else {
											var updatedModel = _Utils_update(
												model,
												{
													ax: model.ax + 1,
													aE: A3($elm$core$Dict$insert, pointer, 'bg-blue-200', $elm$core$Dict$empty),
													aJ: nextInstructionPointer,
													aK: A3(
														updateInstructionAt,
														model.aJ,
														A3(
															$author$project$Ram$Types$Instructions$Write,
															$author$project$Ram$Types$Instructions$Indirect(regIndex),
															$elm$core$Maybe$Nothing,
															exeCount + 1),
														model.aK),
													aO: newLogTime,
													aU: updatedOutputTape
												});
											var lastIdx = $elm$core$List$length(
												$elm$core$Array$toList(updatedOutputTape)) - 1;
											var removeHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v104) {
													return $author$project$Ram$Types$Messages$RemoveHighlightFromOutputTape(lastIdx);
												},
												$elm$core$Process$sleep(highlightDuration));
											var switchHighlightCmd = A2(
												$elm$core$Task$perform,
												function (_v103) {
													return A2(
														$author$project$Ram$Types$Messages$SwitchHighlight,
														_Utils_Tuple2(1, pointer),
														_Utils_Tuple3(2, lastIdx, 'bg-blue-200'));
												},
												$elm$core$Process$sleep((highlightDuration / 2) | 0));
											return _Utils_Tuple2(
												updatedModel,
												$elm$core$Platform$Cmd$batch(
													_List_fromArray(
														[switchHighlightCmd, removeHighlightCmd])));
										}
									}
								}
						}
					}
			}
		}
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $author$project$Ram$Utils$PrintErrors$checkForDividingByZero = function (instructions) {
	var dbzPositions = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, instr) {
					if (instr.$ === 5) {
						var isError = instr.b;
						if ((!isError.$) && (!isError.a)) {
							var _v2 = isError.a;
							return $elm$core$Maybe$Just(i + 1);
						} else {
							return $elm$core$Maybe$Nothing;
						}
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}),
			instructions));
	var dbzCount = $elm$core$List$length(dbzPositions);
	return (dbzCount === 1) ? $elm$core$Maybe$Just(
		$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(dbzCount) + (' instruction that is dividing by zero at position ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, dbzPositions)) + '.')))))) : ((dbzCount > 1) ? $elm$core$Maybe$Just(
		$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(dbzCount) + (' instructions that are dividing by zero at positions: ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, dbzPositions)) + '.')))))) : $elm$core$Maybe$Nothing);
};
var $author$project$Ram$Utils$PrintErrors$checkForDuplicatedLabels = function (instructions) {
	var duplicatedLabelsPositions = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, instr) {
					if (instr.$ === 12) {
						var isError = instr.b;
						if ((!isError.$) && (isError.a === 2)) {
							var _v2 = isError.a;
							return $elm$core$Maybe$Just(i + 1);
						} else {
							return $elm$core$Maybe$Nothing;
						}
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}),
			instructions));
	var duplicatedLabelsCount = $elm$core$List$length(duplicatedLabelsPositions);
	return (duplicatedLabelsCount === 1) ? $elm$core$Maybe$Just(
		$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(duplicatedLabelsCount) + (' duplicated label at position: ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, duplicatedLabelsPositions)) + '.')))))) : ((duplicatedLabelsCount > 1) ? $elm$core$Maybe$Just(
		$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(duplicatedLabelsCount) + (' duplicated labels at positions: ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, duplicatedLabelsPositions)) + '.')))))) : $elm$core$Maybe$Nothing);
};
var $author$project$Ram$Utils$PrintErrors$checkForInvalidInstructions = function (instructions) {
	var invalidPositions = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, instr) {
					switch (instr.$) {
						case 1:
							var isError = instr.b;
							if ((!isError.$) && (isError.a === 4)) {
								var _v2 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						case 6:
							var isError = instr.b;
							if ((!isError.$) && (isError.a === 4)) {
								var _v4 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						case 7:
							var isError = instr.b;
							if ((!isError.$) && (isError.a === 4)) {
								var _v6 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						default:
							return $elm$core$Maybe$Nothing;
					}
				}),
			instructions));
	var invalidCount = $elm$core$List$length(invalidPositions);
	return (invalidCount === 1) ? $elm$core$Maybe$Just(
		$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(invalidCount) + (' invalid instruction at position ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, invalidPositions)) + '.')))))) : ((invalidCount > 1) ? $elm$core$Maybe$Just(
		$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(invalidCount) + (' invalid instructions at positions: ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, invalidPositions)) + '.')))))) : $elm$core$Maybe$Nothing);
};
var $author$project$Ram$Utils$PrintErrors$checkForNonExistingRegisters = function (instructions) {
	var nEREPositions = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, instr) {
					switch (instr.$) {
						case 0:
							var isError = instr.b;
							if ((!isError.$) && (isError.a === 1)) {
								var _v2 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						case 1:
							var isError = instr.b;
							if ((!isError.$) && (isError.a === 1)) {
								var _v4 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						case 2:
							var isError = instr.b;
							if ((!isError.$) && (isError.a === 1)) {
								var _v6 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						case 3:
							var isError = instr.b;
							if ((!isError.$) && (isError.a === 1)) {
								var _v8 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						case 4:
							var isError = instr.b;
							if ((!isError.$) && (isError.a === 1)) {
								var _v10 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						case 5:
							var isError = instr.b;
							if ((!isError.$) && (isError.a === 1)) {
								var _v12 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						case 6:
							var isError = instr.b;
							if ((!isError.$) && (isError.a === 1)) {
								var _v14 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						case 7:
							var isError = instr.b;
							if ((!isError.$) && (isError.a === 1)) {
								var _v16 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						default:
							return $elm$core$Maybe$Nothing;
					}
				}),
			instructions));
	var nERECount = $elm$core$List$length(nEREPositions);
	return (nERECount === 1) ? $elm$core$Maybe$Just(
		$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(nERECount) + (' instruction that is attempting to access a non-existing register at position ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, nEREPositions)) + '.')))))) : ((nERECount > 1) ? $elm$core$Maybe$Just(
		$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(nERECount) + (' instructions that are attempting to access a non-existing registers at positions: ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, nEREPositions)) + '.')))))) : $elm$core$Maybe$Nothing);
};
var $author$project$Ram$Utils$PrintErrors$checkForReferencingNonExistingLabel = function (instructions) {
	var nERLPositions = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, instr) {
					switch (instr.$) {
						case 8:
							var isError = instr.c;
							if ((!isError.$) && (isError.a === 3)) {
								var _v2 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						case 9:
							var isError = instr.c;
							if ((!isError.$) && (isError.a === 3)) {
								var _v4 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						case 10:
							var isError = instr.c;
							if ((!isError.$) && (isError.a === 3)) {
								var _v6 = isError.a;
								return $elm$core$Maybe$Just(i + 1);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						default:
							return $elm$core$Maybe$Nothing;
					}
				}),
			instructions));
	var nERLCount = $elm$core$List$length(nERLPositions);
	return (nERLCount === 1) ? $elm$core$Maybe$Just(
		$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(nERLCount) + (' instruction that is referencing non-existing label at position ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, nERLPositions)) + '.')))))) : ((nERLCount > 1) ? $elm$core$Maybe$Just(
		$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(nERLCount) + (' instructions that are referencing non-existing labels at positions: ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, nERLPositions)) + '.')))))) : $elm$core$Maybe$Nothing);
};
var $author$project$Ram$Utils$PrintErrors$checkForUnknownInstructions = function (instructions) {
	var unknownPositions = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, instr) {
					return _Utils_eq(instr, $author$project$Ram$Types$Instructions$UnknownInstruction) ? $elm$core$Maybe$Just(i + 1) : $elm$core$Maybe$Nothing;
				}),
			instructions));
	var unknownCount = $elm$core$List$length(unknownPositions);
	return (unknownCount === 1) ? $elm$core$Maybe$Just(
		$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(unknownCount) + (' unknown instruction at position ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, unknownPositions)) + '.')))))) : ((unknownCount > 1) ? $elm$core$Maybe$Just(
		$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
			_Utils_Tuple2(
				1,
				'Parsing Error: Found ' + ($elm$core$String$fromInt(unknownCount) + (' unknown instructions at positions: ' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, $elm$core$String$fromInt, unknownPositions)) + '.')))))) : $elm$core$Maybe$Nothing);
};
var $author$project$Ram$Utils$PrintErrors$printErrors = function (instructions) {
	var unknownInstructionsMsg = $author$project$Ram$Utils$PrintErrors$checkForUnknownInstructions(instructions);
	var referencingNonExistingLabelMsg = $author$project$Ram$Utils$PrintErrors$checkForReferencingNonExistingLabel(instructions);
	var nonExistingRegErrorMsg = $author$project$Ram$Utils$PrintErrors$checkForNonExistingRegisters(instructions);
	var invalidInstructionsMsg = $author$project$Ram$Utils$PrintErrors$checkForInvalidInstructions(instructions);
	var duplicatedLabelsMsg = $author$project$Ram$Utils$PrintErrors$checkForDuplicatedLabels(instructions);
	var dbzMsg = $author$project$Ram$Utils$PrintErrors$checkForDividingByZero(instructions);
	var cmds = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		_List_fromArray(
			[unknownInstructionsMsg, nonExistingRegErrorMsg, dbzMsg, duplicatedLabelsMsg, referencingNonExistingLabelMsg, invalidInstructionsMsg]));
	return $elm$core$Platform$Cmd$batch(cmds);
};
var $author$project$Shared$Ports$requestMathJaxTypeset = _Platform_outgoingPort(
	'requestMathJaxTypeset',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Ram$Utils$ExecuteInstruction$runAllInstructions = function (_v0) {
	runAllInstructions:
	while (true) {
		var model = _v0.a;
		var someCmd = _v0.b;
		var numOfMsgs = _v0.c;
		if (_Utils_cmp(model.ax, model.a8) > -1) {
			return _Utils_Tuple3(model, someCmd, numOfMsgs);
		} else {
			if ((_Utils_cmp(
				model.aJ,
				$elm$core$List$length(model.aK)) > -1) || model.az) {
				return _Utils_Tuple3(model, someCmd, numOfMsgs);
			} else {
				if (numOfMsgs >= 100) {
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{a7: true}),
						someCmd,
						numOfMsgs);
				} else {
					var _v1 = A2($author$project$Ram$Utils$ExecuteInstruction$executeInstruction, model, 0);
					var nextModel = _v1.a;
					var someNewCmd = _v1.b;
					if (_Utils_eq(someNewCmd, $elm$core$Platform$Cmd$none)) {
						var $temp$_v0 = _Utils_Tuple3(nextModel, someCmd, numOfMsgs);
						_v0 = $temp$_v0;
						continue runAllInstructions;
					} else {
						var $temp$_v0 = _Utils_Tuple3(
							nextModel,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[someCmd, someNewCmd])),
							numOfMsgs + 1);
						_v0 = $temp$_v0;
						continue runAllInstructions;
					}
				}
			}
		}
	}
};
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.c)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.c, tail);
		return (notAppended < 0) ? {
			d: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.d),
			a: builder.a + 1,
			c: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			d: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.d),
			a: builder.a + 1,
			c: $elm$core$Elm$JsArray$empty
		} : {d: builder.d, a: builder.a, c: appended});
	});
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (!node.$) {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						d: _List_Nil,
						a: 0,
						c: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (!_v0.$) {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (!_v0.$) {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $author$project$Ram$Utils$Update$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var newCode = msg.a;
				var newInstructions = A2($author$project$Ram$Utils$RamParser$parseRAM, newCode, model);
				var encodedSlot = $author$project$Ram$Utils$HelperFunctions$encodeSlot(
					{J: model.J, aI: newCode, aQ: ''});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aI: newCode, aK: newInstructions}),
					$author$project$Shared$Ports$setItem(
						_Utils_Tuple2('ram_current', encodedSlot)));
			case 2:
				if (!model.aL) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var speed = A2(
						$elm$core$Maybe$withDefault,
						1000,
						A2($elm$core$Array$get, model.a1 - 1, model.a2));
					var highlightDuration = (speed / 2) | 0;
					var _v1 = A2($author$project$Ram$Utils$ExecuteInstruction$executeInstruction, model, highlightDuration);
					var updatedModel = _v1.a;
					var removalCmd = _v1.b;
					return (_Utils_cmp(
						updatedModel.aJ,
						$elm$core$List$length(updatedModel.aK)) > -1) ? _Utils_Tuple2(
						_Utils_update(
							updatedModel,
							{aL: false}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									removalCmd,
									A2(
									$elm$core$Task$perform,
									$author$project$Ram$Types$Messages$ComputeAndPrintDuration(false),
									$elm$time$Time$now)
								]))) : _Utils_Tuple2(updatedModel, removalCmd);
				}
			case 5:
				var highlightDuration = 600;
				var _v2 = A2($author$project$Ram$Utils$ExecuteInstruction$executeInstruction, model, highlightDuration);
				var newModel = _v2.a;
				var removeHighlightCmd = _v2.b;
				return ((!model.a_) && (_Utils_cmp(
					newModel.aJ,
					$elm$core$List$length(newModel.aK)) > -1)) ? _Utils_Tuple2(
					_Utils_update(
						newModel,
						{a_: true}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								removeHighlightCmd,
								A2(
								$elm$core$Task$perform,
								$author$project$Ram$Types$Messages$ComputeAndPrintDuration(false),
								$elm$time$Time$now),
								A2($elm$core$Task$perform, $author$project$Ram$Types$Messages$SetStartTime, $elm$time$Time$now),
								$author$project$Ram$Utils$PrintErrors$printErrors(model.aK),
								$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
								_Utils_Tuple2(2, 'Simulation started'))
							]))) : ((!model.a_) ? _Utils_Tuple2(
					_Utils_update(
						newModel,
						{a_: true}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								removeHighlightCmd,
								A2($elm$core$Task$perform, $author$project$Ram$Types$Messages$SetStartTime, $elm$time$Time$now),
								$author$project$Ram$Utils$PrintErrors$printErrors(model.aK),
								$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
								_Utils_Tuple2(2, 'Simulation started'))
							]))) : ((_Utils_cmp(
					newModel.aJ,
					$elm$core$List$length(newModel.aK)) > -1) ? _Utils_Tuple2(
					_Utils_update(
						newModel,
						{aL: false}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								removeHighlightCmd,
								A2(
								$elm$core$Task$perform,
								$author$project$Ram$Types$Messages$ComputeAndPrintDuration(false),
								$elm$time$Time$now)
							]))) : (model.a_ ? _Utils_Tuple2(newModel, removeHighlightCmd) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none))));
			case 1:
				if ((model.a1 === 7) && (!model.a_)) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aL: true, a_: true}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Ram$Utils$PrintErrors$printErrors(model.aK),
									A2(
									$elm$core$Task$perform,
									function (now) {
										return $author$project$Ram$Types$Messages$StartInstantSimulation(now);
									},
									$elm$time$Time$now),
									$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(2, 'Simulation started'))
								])));
				} else {
					if ((model.a1 === 7) && model.a_) {
						var _v3 = $author$project$Ram$Utils$ExecuteInstruction$runAllInstructions(
							_Utils_Tuple3(
								_Utils_update(
									model,
									{aL: true}),
								$elm$core$Platform$Cmd$none,
								0));
						var finalModel = _v3.a;
						var someCmds = _v3.b;
						return (_Utils_cmp(finalModel.ax, model.a8) > -1) ? _Utils_Tuple2(
							_Utils_update(
								finalModel,
								{aL: false}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
										_Utils_Tuple2(
											4,
											'Warning: Maximum number of instant-speed instructions exceeded (' + ($elm$core$String$fromInt(finalModel.ax) + '). Your code may contain an infinite loop or be too complex. You can change this limit in settings, or continue with slower speed or step mode to debug.'))),
										someCmds
									]))) : (finalModel.a7 ? _Utils_Tuple2(
							_Utils_update(
								finalModel,
								{aL: false}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
										_Utils_Tuple2(4, 'Warning: More than 100 runtime errors occurred while running at instant speed. Please debug your code (e.g., by stepping or lowering execution speed) to investigate the issue.')),
										someCmds
									]))) : (finalModel.az ? _Utils_Tuple2(
							finalModel,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										A2(
										$elm$core$Task$perform,
										$author$project$Ram$Types$Messages$ComputeAndPrintDuration(true),
										$elm$time$Time$now),
										someCmds
									]))) : _Utils_Tuple2(
							finalModel,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										A2(
										$elm$core$Task$perform,
										$author$project$Ram$Types$Messages$ComputeAndPrintDuration(false),
										$elm$time$Time$now),
										someCmds
									])))));
					} else {
						if (model.a_) {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{aL: true}),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{aL: true, a_: true}),
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[
											$author$project$Ram$Utils$PrintErrors$printErrors(model.aK),
											$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
											_Utils_Tuple2(2, 'Simulation started')),
											A2($elm$core$Task$perform, $author$project$Ram$Types$Messages$SetStartTime, $elm$time$Time$now)
										])));
						}
					}
				}
			case 27:
				var now = msg.a;
				var updatedModel = _Utils_update(
					model,
					{
						a$: $elm$core$Maybe$Just(now)
					});
				var _v4 = $author$project$Ram$Utils$ExecuteInstruction$runAllInstructions(
					_Utils_Tuple3(updatedModel, $elm$core$Platform$Cmd$none, 0));
				var finalModel = _v4.a;
				var someCmds = _v4.b;
				return (_Utils_cmp(finalModel.ax, model.a8) > -1) ? _Utils_Tuple2(
					_Utils_update(
						finalModel,
						{aL: false}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
								_Utils_Tuple2(
									4,
									'Warning: Maximum number of instant-speed instructions exceeded (' + ($elm$core$String$fromInt(finalModel.ax) + '). Your code may contain an infinite loop or be too complex. You can change this limit in settings, or continue with slower speed or step mode to debug.'))),
								someCmds
							]))) : (finalModel.a7 ? _Utils_Tuple2(
					_Utils_update(
						finalModel,
						{aL: false}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
								_Utils_Tuple2(4, 'Warning: More than 100 runtime errors occurred while running at instant speed. Please debug your code (e.g., by stepping or lowering execution speed) to investigate the issue.')),
								someCmds
							]))) : (finalModel.az ? _Utils_Tuple2(
					finalModel,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2(
								$elm$core$Task$perform,
								$author$project$Ram$Types$Messages$ComputeAndPrintDuration(true),
								$elm$time$Time$now),
								someCmds
							]))) : _Utils_Tuple2(
					finalModel,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2(
								$elm$core$Task$perform,
								$author$project$Ram$Types$Messages$ComputeAndPrintDuration(false),
								$elm$time$Time$now),
								someCmds
							])))));
			case 25:
				var now = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a$: $elm$core$Maybe$Just(now)
						}),
					$elm$core$Platform$Cmd$none);
			case 26:
				var byHalting = msg.a;
				var now = msg.b;
				var _v5 = model.a$;
				if (!_v5.$) {
					var startTime = _v5.a;
					var numOfInstructions = model.ax;
					var fromFloatWithDecimals = F2(
						function (decimals, no) {
							return $elm$core$String$fromFloat(
								function (n) {
									return n / A2($elm$core$Basics$pow, 10, decimals);
								}(
									$elm$core$Basics$round(
										no * A2($elm$core$Basics$pow, 10, decimals))));
						});
					var duration = $elm$time$Time$posixToMillis(now) - $elm$time$Time$posixToMillis(startTime);
					var speed = A2(fromFloatWithDecimals, 2, numOfInstructions / (duration * 0.001));
					return (!numOfInstructions) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{aL: false, a$: $elm$core$Maybe$Nothing}),
						$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
							_Utils_Tuple2(
								0,
								'Reached end of instructions. Duration: ' + ($elm$core$String$fromInt(duration) + (' ms. Number of executed instructions: ' + ($elm$core$String$fromInt(numOfInstructions) + '.')))))) : (byHalting ? _Utils_Tuple2(
						_Utils_update(
							model,
							{aL: false, a$: $elm$core$Maybe$Nothing}),
						$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
							_Utils_Tuple2(
								0,
								'Program halted. Duration: ' + ($elm$core$String$fromInt(duration) + (' ms. Number of executed instructions: ' + ($elm$core$String$fromInt(numOfInstructions) + ('. Speed: ' + (speed + ' instructions/second.')))))))) : _Utils_Tuple2(
						_Utils_update(
							model,
							{aL: false, a$: $elm$core$Maybe$Nothing}),
						$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
							_Utils_Tuple2(
								0,
								'Reached end of instructions. Duration: ' + ($elm$core$String$fromInt(duration) + (' ms. Number of executed instructions: ' + ($elm$core$String$fromInt(numOfInstructions) + ('. Speed: ' + (speed + ' instructions/second.')))))))));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 3:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aC: $elm$core$Dict$empty, aD: $elm$core$Dict$empty, aE: $elm$core$Dict$empty, aL: false}),
					$elm$core$Platform$Cmd$none);
			case 4:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ax: 0,
							az: false,
							aC: $elm$core$Dict$empty,
							aD: $elm$core$Dict$empty,
							aE: $elm$core$Dict$empty,
							aH: 0,
							aJ: 0,
							aK: A2($author$project$Ram$Utils$RamParser$parseRAM, model.aI, model),
							aL: false,
							aN: 0,
							aO: 0,
							aU: $elm$core$Array$empty,
							aV: $elm$core$Dict$fromList(
								A2(
									$elm$core$List$map,
									function (n) {
										return _Utils_Tuple2(
											n,
											_Utils_Tuple2(0, $elm$core$Maybe$Nothing));
									},
									A2($elm$core$List$range, 0, model.a9))),
							a_: false,
							a$: $elm$core$Maybe$Nothing,
							a7: false
						}),
					$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
						_Utils_Tuple2(3, 'Simulation stopped')));
			case 6:
				var newSpeed = msg.a;
				if ((newSpeed === 7) && model.aL) {
					var _v6 = $author$project$Ram$Utils$ExecuteInstruction$runAllInstructions(
						_Utils_Tuple3(
							_Utils_update(
								model,
								{aL: true, a1: newSpeed}),
							$elm$core$Platform$Cmd$none,
							0));
					var finalModel = _v6.a;
					var someCmds = _v6.b;
					return (_Utils_cmp(finalModel.ax, model.a8) > -1) ? _Utils_Tuple2(
						_Utils_update(
							finalModel,
							{aL: false}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(
										4,
										'Warning: Maximum number of instant-speed instructions exceeded (' + ($elm$core$String$fromInt(finalModel.ax) + '). Your code may contain an infinite loop or be too complex. You can change this limit in settings, or continue with slower speed or step mode to debug.'))),
									someCmds
								]))) : (finalModel.a7 ? _Utils_Tuple2(
						_Utils_update(
							finalModel,
							{aL: false}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(4, 'Warning: More than 100 runtime errors occurred while running at instant speed. Please debug your code (e.g., by stepping or lowering execution speed) to investigate the issue.')),
									someCmds
								]))) : (finalModel.az ? _Utils_Tuple2(
						finalModel,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2(
									$elm$core$Task$perform,
									$author$project$Ram$Types$Messages$ComputeAndPrintDuration(true),
									$elm$time$Time$now),
									someCmds
								]))) : _Utils_Tuple2(
						finalModel,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2(
									$elm$core$Task$perform,
									$author$project$Ram$Types$Messages$ComputeAndPrintDuration(false),
									$elm$time$Time$now),
									someCmds
								])))));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a1: newSpeed}),
						$elm$core$Platform$Cmd$none);
				}
			case 7:
				var reg = msg.a;
				var newHighlighted = A2($elm$core$Dict$remove, reg, model.aE);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aE: newHighlighted}),
					$elm$core$Platform$Cmd$none);
			case 8:
				var idx = msg.a;
				var newHighlighted = A2($elm$core$Dict$remove, idx, model.aC);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aC: newHighlighted}),
					$elm$core$Platform$Cmd$none);
			case 9:
				var idx = msg.a;
				var newHighlighted = A2($elm$core$Dict$remove, idx, model.aD);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aD: newHighlighted}),
					$elm$core$Platform$Cmd$none);
			case 10:
				var _v7 = msg.a;
				var typeSource = _v7.a;
				var source = _v7.b;
				var _v8 = msg.b;
				var typeDest = _v8.a;
				var dest = _v8.b;
				var style = _v8.c;
				var newHighlightedRegisters = (typeSource === 1) ? A2($elm$core$Dict$remove, source, model.aE) : model.aE;
				var newHighlightedOutputTape = (typeSource === 2) ? A2($elm$core$Dict$remove, source, model.aD) : model.aD;
				var newHighlightedInputTape = (!typeSource) ? A2($elm$core$Dict$remove, source, model.aC) : model.aC;
				var finalHighlightedRegisters = (typeDest === 1) ? A3($elm$core$Dict$insert, dest, style, $elm$core$Dict$empty) : newHighlightedRegisters;
				var finalHighlightedOutputTape = (typeDest === 2) ? A3($elm$core$Dict$insert, dest, style, $elm$core$Dict$empty) : newHighlightedOutputTape;
				var finalHighlightedInputTape = (!typeDest) ? A3($elm$core$Dict$insert, dest, style, $elm$core$Dict$empty) : newHighlightedInputTape;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aC: finalHighlightedInputTape, aD: finalHighlightedOutputTape, aE: finalHighlightedRegisters}),
					$elm$core$Platform$Cmd$none);
			case 11:
				var messageType = msg.a;
				var posix = msg.b;
				var text = msg.c;
				var newConsoleMessage = {aP: messageType, a4: text, a5: posix};
				var updatedModel = _Utils_update(
					model,
					{
						au: _Utils_ap(
							model.au,
							_List_fromArray(
								[newConsoleMessage]))
					});
				return _Utils_Tuple2(
					updatedModel,
					$author$project$Shared$Ports$scrollToBottom('consoleContainer'));
			case 12:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aI: '',
							aJ: 0,
							aK: _List_Nil,
							aL: false,
							aN: 0,
							aO: 0,
							aV: $elm$core$Dict$fromList(
								A2(
									$elm$core$List$map,
									function (n) {
										return _Utils_Tuple2(
											n,
											_Utils_Tuple2(0, $elm$core$Maybe$Nothing));
									},
									A2($elm$core$List$range, 0, model.a9))),
							a_: false
						}),
					$author$project$Shared$Ports$setItem(
						_Utils_Tuple2('ram_current', '')));
			case 13:
				var i = msg.a;
				var _v9 = A2($elm$core$Array$get, i, model.a0);
				if (!_v9.$) {
					var slot = _v9.a;
					var updatedSlot = _Utils_update(
						slot,
						{J: model.J, aI: model.aI});
					var encodedSlot = $author$project$Ram$Utils$HelperFunctions$encodeSlot(updatedSlot);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a0: A3($elm$core$Array$set, i, updatedSlot, model.a0)
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Shared$Ports$setItem(
									_Utils_Tuple2(
										'ram_slot_' + $elm$core$String$fromInt(i),
										encodedSlot)),
									$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(
										0,
										'Current code saved to slot ' + ($elm$core$String$fromInt(i) + '.')))
								])));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 18:
				var i = msg.a;
				var _v10 = A2($elm$core$Array$get, i, model.a0);
				if (!_v10.$) {
					var slot = _v10.a;
					var updatedSlot = _Utils_update(
						slot,
						{J: $elm$core$Array$empty, aI: ''});
					var encodedSlot = $author$project$Ram$Utils$HelperFunctions$encodeSlot(updatedSlot);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a0: A3($elm$core$Array$set, i, updatedSlot, model.a0)
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Shared$Ports$setItem(
									_Utils_Tuple2(
										'ram_slot_' + $elm$core$String$fromInt(i),
										encodedSlot)),
									$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(
										0,
										'Slot ' + ($elm$core$String$fromInt(i) + ' deleted.')))
								])));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 14:
				var i = msg.a;
				var _v11 = A2($elm$core$Array$get, i, model.a0);
				if (!_v11.$) {
					var slot = _v11.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ax: 0,
								az: false,
								aC: $elm$core$Dict$empty,
								aD: $elm$core$Dict$empty,
								aE: $elm$core$Dict$empty,
								J: slot.J,
								aH: 0,
								aI: slot.aI,
								aJ: 0,
								aK: A2($author$project$Ram$Utils$RamParser$parseRAM, slot.aI, model),
								aL: false,
								aN: 0,
								aO: 0,
								aU: $elm$core$Array$empty,
								aV: $elm$core$Dict$fromList(
									A2(
										$elm$core$List$map,
										function (n) {
											return _Utils_Tuple2(
												n,
												_Utils_Tuple2(0, $elm$core$Maybe$Nothing));
										},
										A2($elm$core$List$range, 0, 100))),
								a_: false,
								a$: $elm$core$Maybe$Nothing,
								a7: false
							}),
						(i === 21) ? $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Shared$Ports$setItem(
									_Utils_Tuple2(
										'ram_current',
										$author$project$Ram$Utils$HelperFunctions$encodeSlot(
											{J: slot.J, aI: slot.aI, aQ: ''}))),
									$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(0, 'Example 1 loaded.'))
								])) : ((i === 22) ? $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Shared$Ports$setItem(
									_Utils_Tuple2(
										'ram_current',
										$author$project$Ram$Utils$HelperFunctions$encodeSlot(
											{J: slot.J, aI: slot.aI, aQ: ''}))),
									$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(0, 'Example 2 loaded.'))
								])) : ((i === 23) ? $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Shared$Ports$setItem(
									_Utils_Tuple2(
										'ram_current',
										$author$project$Ram$Utils$HelperFunctions$encodeSlot(
											{J: slot.J, aI: slot.aI, aQ: ''}))),
									$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(0, 'Example 3 loaded.'))
								])) : $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Shared$Ports$setItem(
									_Utils_Tuple2(
										'ram_current',
										$author$project$Ram$Utils$HelperFunctions$encodeSlot(
											{J: slot.J, aI: slot.aI, aQ: ''}))),
									$author$project$Ram$Utils$HelperFunctions$requestAddMessage(
									_Utils_Tuple2(
										0,
										'Slot ' + ($elm$core$String$fromInt(i) + ' loaded.')))
								])))));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 15:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aZ: !model.aZ}),
					$elm$core$Platform$Cmd$none);
			case 19:
				var idx = msg.a;
				var value = msg.b;
				var updatedTape = A3($elm$core$Array$set, idx, value, model.J);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{J: updatedTape}),
					$author$project$Shared$Ports$setItem(
						_Utils_Tuple2(
							'ram_current',
							$author$project$Ram$Utils$HelperFunctions$encodeSlot(
								{J: updatedTape, aI: model.aI, aQ: ''}))));
			case 20:
				var updatedTape = A2($elm$core$Array$push, 0, model.J);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{J: updatedTape}),
					$author$project$Shared$Ports$setItem(
						_Utils_Tuple2(
							'ram_current',
							$author$project$Ram$Utils$HelperFunctions$encodeSlot(
								{J: updatedTape, aI: model.aI, aQ: ''}))));
			case 21:
				var len = $elm$core$Array$length(model.J);
				if (len > 0) {
					var updatedTape = A3($elm$core$Array$slice, 0, len - 1, model.J);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{J: updatedTape}),
						$author$project$Shared$Ports$setItem(
							_Utils_Tuple2(
								'ram_current',
								$author$project$Ram$Utils$HelperFunctions$encodeSlot(
									{J: updatedTape, aI: model.aI, aQ: ''}))));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 22:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 24:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 23:
				var i = msg.a;
				var newName = msg.b;
				var _v12 = A2($elm$core$Array$get, i, model.a0);
				if (!_v12.$) {
					var slot = _v12.a;
					var updatedSlot = _Utils_update(
						slot,
						{aQ: newName});
					var encodedSlot = $author$project$Ram$Utils$HelperFunctions$encodeSlot(updatedSlot);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a0: A3($elm$core$Array$set, i, updatedSlot, model.a0)
							}),
						$author$project$Shared$Ports$setItem(
							_Utils_Tuple2(
								'ram_slot_' + $elm$core$String$fromInt(i),
								encodedSlot)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 16:
				return model.aX ? _Utils_Tuple2(
					_Utils_update(
						model,
						{aX: !model.aX}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{aX: !model.aX}),
					A2(
						$elm$core$Task$perform,
						function (_v13) {
							return $author$project$Ram$Types$Messages$RequestMathJaxUpdate;
						},
						$elm$core$Process$sleep(20)));
			case 17:
				return model.aY ? _Utils_Tuple2(
					_Utils_update(
						model,
						{aY: !model.aY}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{aY: !model.aY}),
					A2(
						$elm$core$Task$perform,
						function (_v14) {
							return $author$project$Ram$Types$Messages$RequestMathJaxUpdate;
						},
						$elm$core$Process$sleep(20)));
			case 34:
				return _Utils_Tuple2(
					model,
					$author$project$Shared$Ports$requestMathJaxTypeset(0));
			case 28:
				var newNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aV: $elm$core$Dict$fromList(
								A2(
									$elm$core$List$map,
									function (n) {
										return _Utils_Tuple2(
											n,
											_Utils_Tuple2(0, $elm$core$Maybe$Nothing));
									},
									A2($elm$core$List$range, 0, newNum))),
							a9: newNum
						}),
					$elm$core$Platform$Cmd$none);
			case 29:
				var newNum = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a8: newNum}),
					$elm$core$Platform$Cmd$none);
			case 30:
				var newText = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bb: newText}),
					$elm$core$Platform$Cmd$none);
			case 31:
				var newText = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ba: newText}),
					$elm$core$Platform$Cmd$none);
			case 33:
				var newBase = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aM: newBase}),
					$elm$core$Platform$Cmd$none);
			default:
				var newText = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{al: newText}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var newPage = msg.a;
				var newUrl = function () {
					switch (newPage) {
						case 1:
							return '#abacus';
						case 2:
							return '#ram';
						default:
							return '#';
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{o: newPage}),
					A2($elm$browser$Browser$Navigation$pushUrl, model.D, newUrl));
			case 1:
				var subMsg = msg.a;
				if (subMsg.$ === 16) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{o: 0}),
						A2($elm$browser$Browser$Navigation$pushUrl, model.D, '#'));
				} else {
					var _v3 = A2($author$project$Am$Utils$Update$update, subMsg, model.f);
					var newAbacusModel = _v3.a;
					var cmd = _v3.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{f: newAbacusModel}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$AbacusMsg, cmd));
				}
			case 2:
				var subMsg = msg.a;
				if (subMsg.$ === 22) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{o: 0}),
						A2($elm$browser$Browser$Navigation$pushUrl, model.D, '#'));
				} else {
					var _v5 = A2($author$project$Ram$Utils$Update$update, subMsg, model.h);
					var newRamModel = _v5.a;
					var cmd = _v5.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{h: newRamModel}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$RamMsg, cmd));
				}
			case 3:
				var url = msg.a;
				var newPage = function () {
					var _v7 = url.V;
					_v7$2:
					while (true) {
						if (!_v7.$) {
							switch (_v7.a) {
								case 'abacus':
									return 1;
								case 'ram':
									return 2;
								default:
									break _v7$2;
							}
						} else {
							break _v7$2;
						}
					}
					return 0;
				}();
				var cmdToLoad = ((newPage === 1) || (newPage === 2)) ? $elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[
							A2(
							$elm$core$Task$perform,
							function (_v6) {
								return $author$project$Main$DelayedSubToTextArea;
							},
							$elm$core$Process$sleep(100)),
							$author$project$Shared$Ports$scrollToBottom('consoleContainer')
						])) : $elm$core$Platform$Cmd$none;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{o: newPage}),
					cmdToLoad);
			case 4:
				var _v8 = msg.a;
				var key = _v8.a;
				var code = _v8.b;
				if (A2($elm$core$String$startsWith, 'am_', key)) {
					var decodedSlot = $author$project$Main$decodeSlotAm(
						A2($elm$core$Maybe$withDefault, '', code));
					if (!decodedSlot.$) {
						var slot = decodedSlot.a;
						if (key === 'am_current') {
							var instructions = A2($author$project$Am$Utils$AbacusParser$parseAM, slot.aI, model.f);
							var innerAbacusModel = model.f;
							var updatedAbacusModel = _Utils_update(
								innerAbacusModel,
								{aI: slot.aI, aK: instructions});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{f: updatedAbacusModel}),
								$elm$core$Platform$Cmd$none);
						} else {
							var maybeSlotIndex = A2($elm$core$String$startsWith, 'am_slot_', key) ? $elm$core$String$toInt(
								A2($elm$core$String$dropLeft, 8, key)) : $elm$core$Maybe$Nothing;
							if (!maybeSlotIndex.$) {
								var i = maybeSlotIndex.a;
								var _v12 = A2($elm$core$Array$get, i, model.f.a0);
								if (!_v12.$) {
									var updatingThisSlot = _v12.a;
									var updatedSlot = _Utils_update(
										updatingThisSlot,
										{aI: slot.aI, aQ: slot.aQ});
									var innerAbacusModel = model.f;
									var updatedAbacusModel = _Utils_update(
										innerAbacusModel,
										{
											a0: A3($elm$core$Array$set, i, updatedSlot, model.f.a0)
										});
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{f: updatedAbacusModel}),
										$elm$core$Platform$Cmd$none);
								} else {
									return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
								}
							} else {
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							}
						}
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					if (A2($elm$core$String$startsWith, 'ram_', key)) {
						var decodedSlot = $author$project$Main$decodeSlotRam(
							A2($elm$core$Maybe$withDefault, '', code));
						if (!decodedSlot.$) {
							var slot = decodedSlot.a;
							if (key === 'ram_current') {
								var instructions = A2($author$project$Ram$Utils$RamParser$parseRAM, slot.aI, model.h);
								var innerRamModel = model.h;
								var updatedRamModel = _Utils_update(
									innerRamModel,
									{J: slot.J, aI: slot.aI, aK: instructions});
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{h: updatedRamModel}),
									$elm$core$Platform$Cmd$none);
							} else {
								var maybeSlotIndex = A2($elm$core$String$startsWith, 'ram_slot_', key) ? $elm$core$String$toInt(
									A2($elm$core$String$dropLeft, 9, key)) : $elm$core$Maybe$Nothing;
								if (!maybeSlotIndex.$) {
									var i = maybeSlotIndex.a;
									var _v16 = A2($elm$core$Array$get, i, model.h.a0);
									if (!_v16.$) {
										var updatingThisSlot = _v16.a;
										var updatedSlots = _Utils_update(
											updatingThisSlot,
											{J: slot.J, aI: slot.aI, aQ: slot.aQ});
										var innerRamModel = model.h;
										var updatedRamModel = _Utils_update(
											innerRamModel,
											{
												a0: A3($elm$core$Array$set, i, updatedSlots, model.h.a0)
											});
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{h: updatedRamModel}),
											$elm$core$Platform$Cmd$none);
									} else {
										return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
									}
								} else {
									return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
								}
							}
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				}
			case 7:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 5:
				return _Utils_Tuple2(
					model,
					$author$project$Shared$Ports$subToTextArea(0));
			default:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{B: !model.B}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$ChangePage = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$ToggleAboutModal = {$: 6};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $author$project$Main$documentMap = F2(
	function (f, doc) {
		return {
			as: A2(
				$elm$core$List$map,
				$elm$html$Html$map(f),
				doc.as),
			a6: doc.a6
		};
	});
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeLinecap = _VirtualDom_attribute('stroke-linecap');
var $elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$Shared$Icons$Bug$heroiconBug = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-6 w-6'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082')
				]),
			_List_Nil)
		]));
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $author$project$Shared$Icons$Github$heroiconGithub = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-6 w-6'),
			$elm$svg$Svg$Attributes$width('98'),
			$elm$svg$Svg$Attributes$height('96'),
			$elm$svg$Svg$Attributes$viewBox('0 0 98 96'),
			$elm$svg$Svg$Attributes$fill('currentColor'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z')
				]),
			_List_Nil)
		]));
var $author$project$Shared$Icons$Info$heroiconInfo = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-6 w-6'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z')
				]),
			_List_Nil)
		]));
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $author$project$Shared$Icons$Survey$survey = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-6 w-6'),
			$elm$svg$Svg$Attributes$viewBox('0 0 36 36'),
			$elm$svg$Svg$Attributes$fill('currentColor'),
			$elm$svg$Svg$Attributes$stroke('currentColor')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('\r\n                    M0 26.016v-20q0-2.496 1.76-4.256t4.256-1.76h20q2.464 0 4.224 1.76t1.76 4.256v20q0 2.496-1.76 4.224t-4.224 1.76h-20q-2.496 0-4.256-1.76t-1.76-4.224zM4 26.016q0 0.832 0.576 1.408t1.44 0.576h20q0.8 0 1.408-0.576t0.576-1.408v-20q0-0.832-0.576-1.408t-1.408-0.608h-20q-0.832 0-1.44 0.608t-0.576 1.408v20zM7.584 16q0-0.832 0.608-1.408t1.408-0.576 1.408 0.576l2.848 2.816 7.072-7.040q0.576-0.608 1.408-0.608t1.408 0.608 0.608 1.408-0.608 1.408l-8.48 8.48q-0.576 0.608-1.408 0.608t-1.408-0.608l-4.256-4.256q-0.608-0.576-0.608-1.408z\r\n                      ')
						]),
					_List_Nil)
				]))
		]));
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Am$Types$Messages$ChangeMaxExecutedInstructions = function (a) {
	return {$: 22, a: a};
};
var $author$project$Am$Types$Messages$ChangeNumOfRegisters = function (a) {
	return {$: 21, a: a};
};
var $author$project$Am$Types$Messages$ChangeSpeed = function (a) {
	return {$: 6, a: a};
};
var $author$project$Am$Types$Messages$DeleteInput = {$: 9};
var $author$project$Am$Types$Messages$DeleteSlot = function (a) {
	return {$: 15, a: a};
};
var $author$project$Am$Types$Messages$GoBackToMenu = {$: 16};
var $author$project$Am$Types$Messages$LoadSlot = function (a) {
	return {$: 11, a: a};
};
var $author$project$Am$Types$Messages$NoOp = {$: 25};
var $author$project$Am$Types$Messages$Pause = {$: 3};
var $author$project$Am$Types$Messages$Reset = {$: 4};
var $author$project$Am$Types$Messages$SaveSlot = function (a) {
	return {$: 10, a: a};
};
var $author$project$Am$Types$Messages$Start = {$: 1};
var $author$project$Am$Types$Messages$Step = {$: 5};
var $author$project$Am$Types$Messages$ToggleGuideModal = {$: 13};
var $author$project$Am$Types$Messages$ToggleSettingsModal = {$: 14};
var $author$project$Am$Types$Messages$ToggleSlotsModal = {$: 12};
var $author$project$Am$Types$Messages$TypedMaxExecutedInstructions = function (a) {
	return {$: 24, a: a};
};
var $author$project$Am$Types$Messages$TypedRegsNum = function (a) {
	return {$: 23, a: a};
};
var $author$project$Am$Types$Messages$UpdateCode = function (a) {
	return {$: 0, a: a};
};
var $author$project$Am$Types$Messages$UpdateSlotName = F2(
	function (a, b) {
		return {$: 17, a: a, b: b};
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $author$project$Shared$Icons$Pause$heroiconPause = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-6 w-6'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M15.75 5.25v13.5m-7.5-13.5v13.5')
				]),
			_List_Nil)
		]));
var $author$project$Shared$Icons$Play$heroiconPlay = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-6 w-6'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M5.25 5.25v13.5l10.5-6.75-10.5-6.75z')
				]),
			_List_Nil)
		]));
var $author$project$Shared$Icons$Reset$heroiconReset = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-6 w-6'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z')
				]),
			_List_Nil)
		]));
var $author$project$Shared$Icons$Step$heroiconStep = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-6 w-6'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5')
				]),
			_List_Nil)
		]));
var $author$project$Shared$Components$ControlButtons$controlButtons = F9(
	function (atEndOfInstructions, isRunning, halted, simStarted, onStart, onPause, onStep, onReset, startDisabled) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex gap-3 lg:w-1/3 font-mono text-lg order-3 lg:order-1 min-h-[3rem]')
				]),
			_List_fromArray(
				[
					isRunning ? A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-1/3 px-2 py-1 bg-blue-500 text-white flex items-center justify-center rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none'),
							$elm$html$Html$Events$onClick(onPause)
						]),
					_List_fromArray(
						[
							$author$project$Shared$Icons$Pause$heroiconPause,
							$elm$html$Html$text('Pause')
						])) : ((halted || (atEndOfInstructions || startDisabled)) ? A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-1/3 px-2 py-1 bg-gray-400 text-white flex items-center justify-center rounded cursor-not-allowed'),
							$elm$html$Html$Attributes$disabled(true)
						]),
					_List_fromArray(
						[
							$author$project$Shared$Icons$Play$heroiconPlay,
							$elm$html$Html$text('Start')
						])) : A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-1/3 px-2 py-1 bg-blue-500 text-white flex items-center justify-center rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none'),
							$elm$html$Html$Events$onClick(onStart)
						]),
					_List_fromArray(
						[
							$author$project$Shared$Icons$Play$heroiconPlay,
							$elm$html$Html$text('Start')
						]))),
					(halted || (isRunning || atEndOfInstructions)) ? A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-1/3 px-2 py-1 bg-gray-400 text-white flex items-center justify-center rounded cursor-not-allowed'),
							$elm$html$Html$Attributes$disabled(true)
						]),
					_List_fromArray(
						[
							$author$project$Shared$Icons$Step$heroiconStep,
							$elm$html$Html$text('Step')
						])) : A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-1/3 px-2 py-1 bg-blue-500 text-white flex items-center justify-center rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none'),
							$elm$html$Html$Events$onClick(onStep)
						]),
					_List_fromArray(
						[
							$author$project$Shared$Icons$Step$heroiconStep,
							$elm$html$Html$text('Step')
						])),
					(!simStarted) ? A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-1/3 px-2 py-1 bg-gray-400 text-white flex items-center justify-center rounded cursor-not-allowed'),
							$elm$html$Html$Attributes$disabled(true)
						]),
					_List_fromArray(
						[
							$author$project$Shared$Icons$Reset$heroiconReset,
							$elm$html$Html$text('Stop')
						])) : A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-1/3 px-2 py-1 bg-red-500 text-white flex items-center justify-center rounded hover:bg-red-600 transition-colors duration-200 focus:outline-none'),
							$elm$html$Html$Events$onClick(onReset)
						]),
					_List_fromArray(
						[
							$author$project$Shared$Icons$Reset$heroiconReset,
							$elm$html$Html$text('Stop')
						]))
				]));
	});
var $author$project$Shared$Icons$Trash$heroiconTrash = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-8 w-8'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0')
				]),
			_List_Nil)
		]));
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$rows = function (n) {
	return A2(
		_VirtualDom_attribute,
		'rows',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Shared$Components$InputTextArea$inputTextArea = F4(
	function (simStarted, inputText, onUpdateCode, onDeleteInput) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex flex-col md:w-1/3 bg-white p-2 shadow-lg rounded relative')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$textarea,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('textbox'),
								$elm$html$Html$Attributes$class(
								'flex-grow w-full h-full p-1.5 border rounded resize-none overflow-auto text-lg font-mono ' + (simStarted ? 'bg-gray-100 text-gray-700 cursor-not-allowed' : 'bg-white text-black')),
								$elm$html$Html$Attributes$placeholder('Enter your code here...'),
								$elm$html$Html$Events$onInput(onUpdateCode),
								$elm$html$Html$Attributes$value(inputText),
								$elm$html$Html$Attributes$rows(10)
							]),
						simStarted ? _List_fromArray(
							[
								$elm$html$Html$Attributes$disabled(true)
							]) : _List_Nil),
					_List_Nil),
					(!simStarted) ? A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('absolute bottom-6 right-7 text-gray-500 hover:text-red-500 transition-colors duration-200 focus:outline-none'),
							$elm$html$Html$Events$onClick(onDeleteInput)
						]),
					_List_fromArray(
						[$author$project$Shared$Icons$Trash$heroiconTrash])) : $elm$html$Html$text('')
				]));
	});
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (!node.$) {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $author$project$Shared$Icons$Guide$heroiconGuide = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-6 w-6'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5')
				]),
			_List_Nil)
		]));
var $author$project$Shared$Icons$Menu$heroiconMenu = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-6 w-6'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25')
				]),
			_List_Nil)
		]));
var $author$project$Shared$Icons$Save$heroiconSave = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-6 w-6'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M11 16h2m6.707-9.293-2.414-2.414A1 1 0 0 0 16.586 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7.414a1 1 0 0 0-.293-.707ZM16 20v-6a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v6h8ZM9 4h6v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4Z')
				]),
			_List_Nil)
		]));
var $author$project$Shared$Icons$Settings$heroiconSettings = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-6 w-6'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z')
				]),
			_List_Nil)
		]));
var $author$project$Shared$Components$MenuButtons$menuButtons = F5(
	function (onToggleSlotsModal, onGoBackToMenu, onToggleGuideModal, onToggleSettingsModal, simStarted) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex gap-3 lg:w-1/3 font-mono text-lg order-1 lg:order-3 min-h-[3rem]')
				]),
			_List_fromArray(
				[
					(!simStarted) ? A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-1/3 px-1 py-0 border border-blue-500 text-blue-500 bg-white flex items-center justify-center rounded gap-1 hover:bg-blue-50 transition-colors duration-200 focus:outline-none'),
							$elm$html$Html$Events$onClick(onToggleSlotsModal)
						]),
					_List_fromArray(
						[
							$author$project$Shared$Icons$Save$heroiconSave,
							$elm$html$Html$text('Save/Load')
						])) : A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-1/3 px-1 py-0 border border-gray-400 text-gray-400 bg-gray-100 flex items-center justify-center rounded gap-1 cursor-not-allowed'),
							$elm$html$Html$Attributes$disabled(true)
						]),
					_List_fromArray(
						[
							$author$project$Shared$Icons$Save$heroiconSave,
							$elm$html$Html$text('Save/Load')
						])),
					(!simStarted) ? A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-1/3 px-2 py-1 border border-blue-500 text-blue-500 bg-white flex items-center justify-center rounded gap-1 hover:bg-blue-50 transition-colors duration-200 focus:outline-none'),
							$elm$html$Html$Events$onClick(onToggleGuideModal)
						]),
					_List_fromArray(
						[
							$author$project$Shared$Icons$Guide$heroiconGuide,
							$elm$html$Html$text('Guide')
						])) : A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-1/3 px-2 py-1 border border-gray-400 text-gray-400 bg-gray-100 flex items-center justify-center rounded gap-1 cursor-not-allowed'),
							$elm$html$Html$Attributes$disabled(true)
						]),
					_List_fromArray(
						[
							$author$project$Shared$Icons$Guide$heroiconGuide,
							$elm$html$Html$text('Guide')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-1/3 flex gap-3')
						]),
					_List_fromArray(
						[
							(!simStarted) ? A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('w-1/2 px-2 py-1 border border-blue-500 text-blue-500 bg-white flex items-center justify-center rounded gap-1 hover:bg-blue-50 transition-colors duration-200 focus:outline-none'),
									$elm$html$Html$Events$onClick(onToggleSettingsModal)
								]),
							_List_fromArray(
								[$author$project$Shared$Icons$Settings$heroiconSettings])) : A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('w-1/2 px-2 py-1 border border-gray-400 text-gray-400 bg-gray-100 flex items-center justify-center rounded gap-1 cursor-not-allowed'),
									$elm$html$Html$Attributes$disabled(true)
								]),
							_List_fromArray(
								[$author$project$Shared$Icons$Settings$heroiconSettings])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('w-1/2 px-2 py-1 border border-blue-500 text-blue-500 bg-white flex items-center justify-center rounded gap-1 hover:bg-blue-50 transition-colors duration-200 focus:outline-none'),
									$elm$html$Html$Events$onClick(onGoBackToMenu)
								]),
							_List_fromArray(
								[$author$project$Shared$Icons$Menu$heroiconMenu]))
						]))
				]));
	});
var $author$project$Shared$Icons$Rocket$heroiconRocket = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-5 w-5'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z')
				]),
			_List_Nil)
		]));
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Shared$Components$SpeedSlider$sliderLabel = F2(
	function (index, ms) {
		var toOneDecimal = function (f) {
			return $elm$core$Basics$round(f * 10) / 10;
		};
		var inSeconds = toOneDecimal(ms / 1000);
		var label = (index === 6) ? 'Instant' : $elm$core$String$fromFloat(inSeconds);
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex justify-center relative')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('absolute')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						]))
				]));
	});
var $elm$html$Html$Attributes$step = function (n) {
	return A2($elm$html$Html$Attributes$stringProperty, 'step', n);
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Shared$Components$SpeedSlider$speedSlider = F3(
	function (currentValue, speeds, onChangeSpeed) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex flex-col lg:w-1/3 lg:mb-0 mb-6 lg:h-20 px-4 font-mono order-2 lg:order-2')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex items-center mt-1 gap-2 text-gray-700 text-xs sm:text-sm')
						]),
					_List_fromArray(
						[
							$author$project$Shared$Icons$Rocket$heroiconRocket,
							$elm$html$Html$text('Time between instructions (seconds)')
						])),
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('range'),
							$elm$html$Html$Attributes$class('w-full'),
							$elm$html$Html$Attributes$min('1'),
							$elm$html$Html$Attributes$max('7'),
							$elm$html$Html$Attributes$step('1'),
							$elm$html$Html$Attributes$value(
							$elm$core$String$fromInt(currentValue)),
							$elm$html$Html$Events$onInput(
							A2(
								$elm$core$Basics$composeR,
								$elm$core$String$toInt,
								A2(
									$elm$core$Basics$composeR,
									$elm$core$Maybe$withDefault(1),
									onChangeSpeed)))
						]),
					_List_Nil),
					A2(
					$elm$html$Html$ul,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex justify-between w-full px-[10px]')
						]),
					A2(
						$elm$core$List$indexedMap,
						$author$project$Shared$Components$SpeedSlider$sliderLabel,
						$elm$core$Array$toList(speeds)))
				]));
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.O, posixMinutes) < 0) {
					return posixMinutes + era.Z;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$time$Time$toHour = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			24,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60));
	});
var $elm$time$Time$toMinute = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2($elm$time$Time$toAdjustedMinutes, zone, time));
	});
var $elm$time$Time$toSecond = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				1000));
	});
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $author$project$Shared$Components$Console$formatTime = function (posix) {
	var twoDigits = function (n) {
		return A3(
			$elm$core$String$padLeft,
			2,
			'0',
			$elm$core$String$fromInt(n));
	};
	var ss = A2($elm$time$Time$toSecond, $elm$time$Time$utc, posix);
	var mm = A2($elm$time$Time$toMinute, $elm$time$Time$utc, posix);
	var hh = A2($elm$time$Time$toHour, $elm$time$Time$utc, posix) + 1;
	return twoDigits(hh) + (':' + (twoDigits(mm) + (':' + twoDigits(ss))));
};
var $author$project$Shared$Components$Console$viewConsole = function (consoleMessages) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('consoleContainer'),
				$elm$html$Html$Attributes$class('flex-none bg-gray-800 text-white p-3 rounded shadow-lg font-mono text-sm h-32 overflow-y-auto')
			]),
		A2(
			$elm$core$List$map,
			function (msg) {
				var _v0 = msg.aP;
				switch (_v0) {
					case 0:
						return A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									'[' + ($author$project$Shared$Components$Console$formatTime(msg.a5) + ('] ' + msg.a4)))
								]));
					case 1:
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-red-500')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'[' + ($author$project$Shared$Components$Console$formatTime(msg.a5) + ('] ' + msg.a4)))
								]));
					case 2:
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-green-300')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'[' + ($author$project$Shared$Components$Console$formatTime(msg.a5) + ('] ' + msg.a4)))
								]));
					case 3:
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-red-300')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'[' + ($author$project$Shared$Components$Console$formatTime(msg.a5) + ('] ' + msg.a4)))
								]));
					default:
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-yellow-300')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'[' + ($author$project$Shared$Components$Console$formatTime(msg.a5) + ('] ' + msg.a4)))
								]));
				}
			},
			consoleMessages));
};
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $author$project$Shared$Icons$X$heroiconX = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-10 w-10'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M6 18 18 6M6 6l12 12')
				]),
			_List_Nil)
		]));
var $elm$html$Html$i = _VirtualDom_node('i');
var $author$project$Am$Components$GuideModal$stopPropagationClick = function (noOpMsg) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'click',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(noOpMsg, true)));
};
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $author$project$Am$Components$GuideModal$viewGuideModal = F3(
	function (onToggleGuideModal, onLoadSlot, onNoOp) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'),
					$elm$html$Html$Events$onClick(onToggleGuideModal)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('bg-white p-4 rounded shadow-lg relative max-h-[80vh] max-w-[80vw] lg:max-w-[60vw] overflow-y-auto'),
							$author$project$Am$Components$GuideModal$stopPropagationClick(onNoOp)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none'),
									$elm$html$Html$Events$onClick(onToggleGuideModal)
								]),
							_List_fromArray(
								[$author$project$Shared$Icons$X$heroiconX])),
							A2(
							$elm$html$Html$h2,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-xl font-bold mb-2 flex items-center gap-1')
								]),
							_List_fromArray(
								[
									$author$project$Shared$Icons$Guide$heroiconGuide,
									$elm$html$Html$text('Abacus Machine Guide')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('my-1 text-sm')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('mb-2')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Abacus Machine is an abstract model of a simple computing device that operates with an unlimited number of registers, where each register can hold arbitrarily large natural numbers.')
										])),
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('mb-2')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('This simulator implements a computational model with all supported instructions and limited number of registers. It offers two modes: a '),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-green-500 font-semibold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('simulation mode')
												])),
											A2(
											$elm$html$Html$span,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(' and an ')
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-red-500 font-semibold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('editing mode')
												])),
											$elm$html$Html$text('. Once you press '),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-blue-500 font-semibold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Step')
												])),
											$elm$html$Html$text(' or '),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-blue-500 font-semibold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Start')
												])),
											$elm$html$Html$text(', the simulator switches to '),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-green-500 font-semibold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('simulation mode')
												])),
											$elm$html$Html$text(', and no further edits are allowed until you press '),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-red-500 font-semibold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Stop')
												])),
											$elm$html$Html$text('. You can write comments in the code by using the '),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('font-bold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('\'#\'')
												])),
											$elm$html$Html$text(' character. Simulators have responsive design, so feel free to use them on smaller devices.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('The simulation can be run step by step or continuously. When using instant speed, there is a risk of getting stuck in an infinite loop, so there is a configurable limit called'),
											A2(
											$elm$html$Html$i,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('font-semibold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(' \'Maximum number of executed instructions with instant speed\'')
												])),
											$elm$html$Html$text('. If your program is complex and needs more instructions, you can increase this limit in the settings.')
										]))
								])),
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-lg font-semibold mt-5')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Example codes:')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex flex-row gap-3 my-2')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('border p-2 rounded bg-white shadow-sm w-full')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('font-semibold text-gray-700')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Example 1: '),
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('font-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('a+b')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('flex flex-row-reverse gap-2 mt-2')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none'),
															$elm$html$Html$Events$onClick(
															onLoadSlot(21))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Load')
														]))
												]))
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('border p-2 rounded bg-white shadow-sm w-full')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('font-semibold text-gray-700')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Example 2: '),
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('font-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('a*b')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('flex flex-row-reverse  gap-2 mt-2')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none'),
															$elm$html$Html$Events$onClick(
															onLoadSlot(22))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Load')
														]))
												]))
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('border p-2 rounded bg-white shadow-sm w-full')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('font-semibold text-gray-700')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Example 3: '),
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('font-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('n!')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('flex flex-row-reverse gap-2 mt-2')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none'),
															$elm$html$Html$Events$onClick(
															onLoadSlot(23))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Load')
														]))
												]))
										]))
								])),
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-lg font-semibold mt-5')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Instructions:')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-2 text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Everything the parser recognizes is counted as an instruction (parsing errors are not included), including the closing bracket that ends a loop. If the instruction pointer lands on an end loop closing bracket, whose condition register is zero, it does not jump back to the start loop instruction of that loop but continues to the next one.')
								])),
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('min-w-full table-fixed my-2 text-sm')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$thead,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-1/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Instruction')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-1/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Example')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-4/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Description')
														]))
												]))
										])),
									A2(
									$elm$html$Html$tbody,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('bg-white divide-y divide-gray-300')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-green-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-green-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Increment')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('a1')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Adds 1 to the specified register. For example, a1 increments register R1 by 1, changing its value from x to x+1.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-yellow-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-yellow-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Decrement')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('s3')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Subtracts 1 from the specified register if it’s non-zero. For instance, s3 decrements R3 by 1, changing its value from x to x−1. If R3 is already 0, it remains unchanged.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-gray-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-gray-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Start loop')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('(')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Marks the beginning of a loop. Execution enters the loop body if the loop’s condition register is greater than zero. If it’s zero, the simulator jumps directly to the loop’s end.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-gray-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-gray-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('End loop')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(')8')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Marks the end of the loop. If the loop’s condition register is still greater than zero, execution jumps back to the loop’s start. Otherwise, the simulator continues with the next instruction after the loop.')
														]))
												]))
										]))
								])),
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-lg font-semibold mt-5')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Possible errors:')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-2 text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('This simulator includes four different errors and one warning. All errors are parsing errors, meaning they are detected during parsing which is performed on each input. If you start the simulation with any errors (shown in red), those errors are printed to the console.')
								])),
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('min-w-full table-fixed mt-2 text-sm')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$thead,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-1/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Type')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-1/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Error message')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-4/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Cause & Prevention')
														]))
												]))
										])),
									A2(
									$elm$html$Html$tbody,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('bg-white divide-y divide-gray-300')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-red-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-red-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Parsing error')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Found unknown instruction.')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This error occurs when the parser encounters an unrecognized instruction. To prevent it, verify that all instructions match the valid instruction set and check your code for typos.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-red-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-red-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Parsing error')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Found instruction that is attempting to access a non-existing register')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This error occurs when the parser encounters instruction that references a register index that doesn’t exist or is out of range. To prevent it, ensure all register references are within the valid range.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-red-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-red-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Parsing error')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Found unmatched start of the loop')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This error occurs when a loop is started without a corresponding end. To prevent it, make sure every loop instruction has a matching closing bracket.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-red-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-red-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Parsing error')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Found unmatched end of the loop.')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This error occurs when a loop is ended without a corresponding start. To prevent it, ensure that each loop end is paired with a start bracket.')
														]))
												]))
										])),
									A2(
									$elm$html$Html$tr,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('bg-yellow-50')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$td,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('text-yellow-500 font-semibold')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Warning')
														]))
												])),
											A2(
											$elm$html$Html$td,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Maximum number of instant-speed instructions exceeded.')
												])),
											A2(
											$elm$html$Html$td,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('This warning appears when your program exceeds the configured limit of instructions while running at instant speed. It helps prevent the simulator from getting stuck in infinite loops. If your program is complex and needs more instructions, you can raise this limit in the settings.')
												]))
										]))
								]))
						]))
				]));
	});
var $author$project$Am$Components$Instructions$viewInstructions = F3(
	function (instructions, pointer, simStarted) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					'md:w-1/3 p-1 shadow-lg rounded md:overflow-auto border-2 border-transparent' + (((_Utils_cmp(
						pointer,
						$elm$core$List$length(instructions)) > -1) && simStarted) ? ' bg-green-50 border-green-400' : ' bg-white'))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex flex-wrap flex-shrink-0 gap-1.5')
						]),
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (index, instruction) {
								var isActive = _Utils_eq(index, pointer);
								var baseClasses = 'p-0.5 border-4 border-solid rounded font-mono transition-colors';
								var activeClasses = isActive ? ' border-blue-500 font-bold' : ' border-transparent';
								var _v0 = function () {
									switch (instruction.$) {
										case 0:
											var n = instruction.a;
											var isError = instruction.b;
											if (!isError.$) {
												return _Utils_Tuple2(
													'Add ' + $elm$core$String$fromInt(n),
													' bg-red-200 text-red-800');
											} else {
												return _Utils_Tuple2(
													'Add ' + $elm$core$String$fromInt(n),
													' bg-green-200 text-green-800');
											}
										case 1:
											var n = instruction.a;
											var isError = instruction.b;
											if (!isError.$) {
												return _Utils_Tuple2(
													'Sub ' + $elm$core$String$fromInt(n),
													' bg-red-200 text-red-800');
											} else {
												return _Utils_Tuple2(
													'Sub ' + $elm$core$String$fromInt(n),
													' bg-yellow-200 text-yellow-800');
											}
										case 2:
											var isError = instruction.c;
											if (!isError.$) {
												return _Utils_Tuple2('(', ' bg-red-200 text-red-800');
											} else {
												return _Utils_Tuple2('(', ' bg-gray-200 text-gray-800');
											}
										case 3:
											var conditionIndex = instruction.b;
											var isError = instruction.c;
											if (!isError.$) {
												return _Utils_Tuple2(
													')' + $elm$core$String$fromInt(conditionIndex),
													' bg-red-200 text-red-800');
											} else {
												return _Utils_Tuple2(
													')' + $elm$core$String$fromInt(conditionIndex),
													' bg-gray-200 text-gray-800');
											}
										default:
											return _Utils_Tuple2('Unknown', ' bg-red-200 text-red-800');
									}
								}();
								var instructionText = _v0.a;
								var typeColorClasses = _v0.b;
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('flex items-center gap-2 font-mono ' + (baseClasses + (typeColorClasses + activeClasses)))
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-gray-400')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$core$String$fromInt(index + 1))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('h-5 w-px bg-gray-400')
												]),
											_List_Nil),
											A2(
											$elm$html$Html$div,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(instructionText)
												]))
										]));
							}),
						instructions))
				]));
	});
var $author$project$Am$Components$Registers$viewRegisters = F2(
	function (registers, highlighted) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex flex-col md:w-1/3 bg-white p-1 shadow-lg rounded md:overflow-auto')
				]),
			A2(
				$elm$core$List$map,
				function (_v0) {
					var regNum = _v0.a;
					var _v1 = _v0.b;
					var value = _v1.a;
					var wasUsed = _v1.b;
					var highlightClass = A2(
						$elm$core$Maybe$withDefault,
						'',
						A2($elm$core$Dict$get, regNum, highlighted));
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(
								wasUsed ? ('flex items-center gap-4 p-1 border-b last:border-none font-mono ' + highlightClass) : ('flex items-center gap-4 p-1 border-b last:border-none font-mono bg-gray-100 rounded ' + highlightClass))
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-gray-500 w-8 text-right')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(regNum))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('h-5 w-px bg-gray-300')
									]),
								_List_Nil),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex-1 text-left font-medium text-gray-900')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(value))
									]))
							]));
				},
				$elm$core$Dict$toList(registers)));
	});
var $author$project$Am$Components$SettingsModal$stopPropagationClick = function (noOpMsg) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'click',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(noOpMsg, true)));
};
var $author$project$Am$Components$SettingsModal$viewSettingsModal = function (currentNumRegs) {
	return function (currentMaxInstr) {
		return function (onClose) {
			return function (onChangeNumOfRegs) {
				return function (onChangeExeInstructions) {
					return function (onTypedNumRegs) {
						return function (onTypedMaxInstr) {
							return function (typedNumRegs) {
								return function (typedMaxInstr) {
									return function (onNoOp) {
										return A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'),
													$elm$html$Html$Events$onClick(onClose)
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('bg-white p-4 rounded shadow-lg relative max-h-[80vh] max-w-[80vw] lg:max-w-[60vw] overflow-y-auto'),
															$author$project$Am$Components$SettingsModal$stopPropagationClick(onNoOp)
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none'),
																	$elm$html$Html$Events$onClick(onClose)
																]),
															_List_fromArray(
																[$author$project$Shared$Icons$X$heroiconX])),
															A2(
															$elm$html$Html$h2,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-xl font-bold mb-2 flex items-center gap-1')
																]),
															_List_fromArray(
																[
																	$author$project$Shared$Icons$Settings$heroiconSettings,
																	$elm$html$Html$text('Settings')
																])),
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('mb-4')
																]),
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$h3,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('text-lg font-semibold')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Number of registers:')
																		])),
																	A2(
																	$elm$html$Html$p,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('text-red-500 text-sm ')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Warning: Changing this setting is not recommended as it may degrade performance because more elements must be rendered.')
																		])),
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('flex flex-col text-xs mb-2 mt-1 text-gray-600')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$div,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('flex gap-2 items-center')
																				]),
																			_List_fromArray(
																				[
																					A2(
																					$elm$html$Html$p,
																					_List_Nil,
																					_List_fromArray(
																						[
																							$elm$html$Html$text('min: 10')
																						])),
																					A2(
																					$elm$html$Html$div,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$class('h-4 w-px bg-gray-400')
																						]),
																					_List_Nil),
																					A2(
																					$elm$html$Html$p,
																					_List_Nil,
																					_List_fromArray(
																						[
																							A2(
																							$elm$html$Html$span,
																							_List_fromArray(
																								[
																									$elm$html$Html$Attributes$class('text-green-600 font-semibold')
																								]),
																							_List_fromArray(
																								[
																									$elm$html$Html$text('default: 100')
																								]))
																						])),
																					A2(
																					$elm$html$Html$div,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$class('h-4 w-px bg-gray-400')
																						]),
																					_List_Nil),
																					A2(
																					$elm$html$Html$p,
																					_List_Nil,
																					_List_fromArray(
																						[
																							$elm$html$Html$text('max: 10,000')
																						]))
																				])),
																			A2(
																			$elm$html$Html$p,
																			_List_Nil,
																			_List_fromArray(
																				[
																					A2(
																					$elm$html$Html$span,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$class('text-blue-600 font-semibold')
																						]),
																					_List_fromArray(
																						[
																							$elm$html$Html$text(
																							'current: ' + $elm$core$String$fromInt(currentNumRegs))
																						]))
																				]))
																		])),
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('flex gap-2 items-center')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$type_('number'),
																					$elm$html$Html$Attributes$min('10'),
																					$elm$html$Html$Attributes$max('10000'),
																					$elm$html$Html$Attributes$value(typedNumRegs),
																					$elm$html$Html$Events$onInput(onTypedNumRegs),
																					$elm$html$Html$Attributes$class('border rounded p-1 w-full'),
																					$elm$html$Html$Attributes$placeholder('Type here...')
																				]),
																			_List_Nil),
																			function () {
																			var parsed = A2(
																				$elm$core$Maybe$withDefault,
																				0,
																				$elm$core$String$toInt(typedNumRegs));
																			var isValid = (parsed >= 10) && (parsed <= 10000);
																			return A2(
																				$elm$html$Html$button,
																				_List_fromArray(
																					[
																						$elm$html$Html$Attributes$class(
																						isValid ? 'bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none' : 'bg-gray-400 text-white px-3 py-1 rounded opacity-50 cursor-not-allowed'),
																						$elm$html$Html$Attributes$disabled(!isValid),
																						$elm$html$Html$Events$onClick(
																						onChangeNumOfRegs(parsed))
																					]),
																				_List_fromArray(
																					[
																						$elm$html$Html$text('Set')
																					]));
																		}()
																		]))
																])),
															A2(
															$elm$html$Html$div,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$h3,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('text-lg font-semibold')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Maximum number of executed instructions with instant speed:')
																		])),
																	A2(
																	$elm$html$Html$p,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('text-sm')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('This setting is designed to prevent the program from getting stuck in an infinite loop. If your program is complex and requires more instructions, you can adjust this limit accordingly.')
																		])),
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('flex flex-col text-xs mb-2 mt-1 text-gray-600')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$div,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('flex gap-2 items-center')
																				]),
																			_List_fromArray(
																				[
																					A2(
																					$elm$html$Html$p,
																					_List_Nil,
																					_List_fromArray(
																						[
																							$elm$html$Html$text('min: 500,000')
																						])),
																					A2(
																					$elm$html$Html$div,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$class('h-4 w-px bg-gray-400')
																						]),
																					_List_Nil),
																					A2(
																					$elm$html$Html$p,
																					_List_Nil,
																					_List_fromArray(
																						[
																							A2(
																							$elm$html$Html$span,
																							_List_fromArray(
																								[
																									$elm$html$Html$Attributes$class('text-green-600 font-semibold')
																								]),
																							_List_fromArray(
																								[
																									$elm$html$Html$text('default: 1,000,000')
																								]))
																						])),
																					A2(
																					$elm$html$Html$div,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$class('h-4 w-px bg-gray-400')
																						]),
																					_List_Nil),
																					A2(
																					$elm$html$Html$p,
																					_List_Nil,
																					_List_fromArray(
																						[
																							$elm$html$Html$text('max: 100,000,000')
																						]))
																				])),
																			A2(
																			$elm$html$Html$p,
																			_List_Nil,
																			_List_fromArray(
																				[
																					A2(
																					$elm$html$Html$span,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$class('text-blue-600 font-semibold')
																						]),
																					_List_fromArray(
																						[
																							$elm$html$Html$text(
																							'current: ' + $elm$core$String$fromInt(currentMaxInstr))
																						]))
																				]))
																		])),
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('flex gap-2 items-center')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$type_('number'),
																					$elm$html$Html$Attributes$min('500000'),
																					$elm$html$Html$Attributes$max('100000000'),
																					$elm$html$Html$Attributes$value(typedMaxInstr),
																					$elm$html$Html$Events$onInput(onTypedMaxInstr),
																					$elm$html$Html$Attributes$class('border rounded p-1 w-full'),
																					$elm$html$Html$Attributes$placeholder('Type here...')
																				]),
																			_List_Nil),
																			function () {
																			var parsed = A2(
																				$elm$core$Maybe$withDefault,
																				0,
																				$elm$core$String$toInt(typedMaxInstr));
																			var isValid = (parsed >= 500000) && (parsed <= 100000000);
																			return A2(
																				$elm$html$Html$button,
																				_List_fromArray(
																					[
																						$elm$html$Html$Attributes$class(
																						isValid ? 'bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none' : 'bg-gray-400 text-white px-3 py-1 rounded opacity-50 cursor-not-allowed'),
																						$elm$html$Html$Attributes$disabled(!isValid),
																						$elm$html$Html$Events$onClick(
																						onChangeExeInstructions(parsed))
																					]),
																				_List_fromArray(
																					[
																						$elm$html$Html$text('Set')
																					]));
																		}()
																		]))
																]))
														]))
												]));
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Shared$Components$SlotsModal$stopPropagationClick = function (noOpMsg) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'click',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(noOpMsg, true)));
};
var $author$project$Shared$Icons$TrashSmall$heroiconTrashSmall = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-5 w-5'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0')
				]),
			_List_Nil)
		]));
var $author$project$Shared$Components$SlotsModal$viewSlots = F6(
	function (inputTextEmpty, arrayOfSlots, onSaveSlot, onLoadSlot, onDeleteSlot, onUpdateSlotName) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-3')
				]),
			A2(
				$elm$core$List$map,
				function (i) {
					var _v0 = A2(
						$elm$core$Maybe$withDefault,
						_Utils_Tuple2('', true),
						A2($elm$core$Array$get, i, arrayOfSlots));
					var slotName = _v0.a;
					var isEmpty = _v0.b;
					return A2(
						$elm$html$Html$div,
						isEmpty ? _List_fromArray(
							[
								$elm$html$Html$Attributes$class('border p-3 rounded bg-gray-100 shadow-sm w-full')
							]) : _List_fromArray(
							[
								$elm$html$Html$Attributes$class('border p-3 rounded bg-white shadow-sm w-full')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$class('font-bold text-gray-800 border border-gray-300 rounded p-1 w-full mb-1 focus:outline-none focus:ring focus:ring-blue-200'),
										$elm$html$Html$Attributes$value(slotName),
										$elm$html$Html$Events$onInput(
										function (newName) {
											return A2(onUpdateSlotName, i, newName);
										}),
										$elm$html$Html$Attributes$placeholder(
										'Slot ' + $elm$core$String$fromInt(i))
									]),
								_List_Nil),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex gap-2 mt-1')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class(
												inputTextEmpty ? 'w-full bg-gray-500 text-white px-2 py-1 rounded opacity-50 cursor-not-allowed' : 'w-full bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none'),
												$elm$html$Html$Events$onClick(
												onSaveSlot(i)),
												$elm$html$Html$Attributes$disabled(inputTextEmpty)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Save')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class(
												(!isEmpty) ? 'w-full bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none' : 'w-full bg-gray-500 text-white px-2 py-1 rounded opacity-50 cursor-not-allowed'),
												$elm$html$Html$Events$onClick(
												onLoadSlot(i)),
												$elm$html$Html$Attributes$disabled(isEmpty)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Load')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class(
												(!isEmpty) ? 'w-full bg-red-500 text-white px-2 py-1 rounded flex items-center justify-center hover:bg-red-600 transition-colors duration-200 focus:outline-none' : 'w-full bg-gray-500 text-white px-2 py-1 rounded flex items-center justify-center opacity-50 cursor-not-allowed'),
												$elm$html$Html$Events$onClick(
												onDeleteSlot(i)),
												$elm$html$Html$Attributes$disabled(isEmpty)
											]),
										_List_fromArray(
											[$author$project$Shared$Icons$TrashSmall$heroiconTrashSmall]))
									]))
							]));
				},
				A2($elm$core$List$range, 1, 20)));
	});
var $author$project$Shared$Components$SlotsModal$viewSlotsModal = F8(
	function (inputTextEmpty, arrayOfSlots, onToggleSlotsModal, onSaveSlot, onLoadSlot, onDeleteSlot, onUpdateSlotName, onNoOp) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'),
					$elm$html$Html$Events$onClick(onToggleSlotsModal)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('bg-white p-4 rounded shadow-lg relative max-h-[80vh] max-w-[80vw] overflow-y-auto'),
							$author$project$Shared$Components$SlotsModal$stopPropagationClick(onNoOp)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none'),
									$elm$html$Html$Events$onClick(onToggleSlotsModal)
								]),
							_List_fromArray(
								[$author$project$Shared$Icons$X$heroiconX])),
							A2(
							$elm$html$Html$h2,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-xl font-bold flex items-center gap-1')
								]),
							_List_fromArray(
								[
									$author$project$Shared$Icons$Save$heroiconSave,
									$elm$html$Html$text('Save/Load')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-sm mt-2')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('You can save and load code into separate slots. When you load a slot, its content is copied into your current workspace, so any edits only affect your workspace until you explicitly save them to a slot. In other words, your workspace is effectively its own slot as well. You can also rename your slots. After renaming, there\'s no need to press save, as changes are saved automatically.')
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-red-500 text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Warning: Everything is stored in your browser\'s local storage, so it\'s unique to this browser and won\'t carry over if you switch browsers or devices.')
								])),
							A6($author$project$Shared$Components$SlotsModal$viewSlots, inputTextEmpty, arrayOfSlots, onSaveSlot, onLoadSlot, onDeleteSlot, onUpdateSlotName)
						]))
				]));
	});
var $author$project$Am$View$view = function (model) {
	return {
		as: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex flex-col h-screen p-2 bg-gray-200')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex flex-col lg:flex-row lg:gap-3')
							]),
						_List_fromArray(
							[
								A9(
								$author$project$Shared$Components$ControlButtons$controlButtons,
								_Utils_cmp(
									model.aJ,
									$elm$core$List$length(model.aK)) > -1,
								model.aL,
								false,
								model.a_,
								$author$project$Am$Types$Messages$Start,
								$author$project$Am$Types$Messages$Pause,
								$author$project$Am$Types$Messages$Step,
								$author$project$Am$Types$Messages$Reset,
								(model.a1 === 7) && (_Utils_cmp(model.ax, model.a8) > -1)),
								A3($author$project$Shared$Components$SpeedSlider$speedSlider, model.a1, model.a2, $author$project$Am$Types$Messages$ChangeSpeed),
								A5($author$project$Shared$Components$MenuButtons$menuButtons, $author$project$Am$Types$Messages$ToggleSlotsModal, $author$project$Am$Types$Messages$GoBackToMenu, $author$project$Am$Types$Messages$ToggleGuideModal, $author$project$Am$Types$Messages$ToggleSettingsModal, model.a_)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex flex-col h-full overflow-y-auto md:flex-row gap-3 md:overflow-hidden my-3')
							]),
						_List_fromArray(
							[
								A4($author$project$Shared$Components$InputTextArea$inputTextArea, model.a_, model.aI, $author$project$Am$Types$Messages$UpdateCode, $author$project$Am$Types$Messages$DeleteInput),
								A3($author$project$Am$Components$Instructions$viewInstructions, model.aK, model.aJ, model.a_),
								A2($author$project$Am$Components$Registers$viewRegisters, model.aV, model.aB)
							])),
						$author$project$Shared$Components$Console$viewConsole(model.au),
						model.aZ ? A8(
						$author$project$Shared$Components$SlotsModal$viewSlotsModal,
						model.aI === '',
						A2(
							$elm$core$Array$map,
							function (slot) {
								return _Utils_Tuple2(slot.aQ, slot.aI === '');
							},
							model.a0),
						$author$project$Am$Types$Messages$ToggleSlotsModal,
						$author$project$Am$Types$Messages$SaveSlot,
						$author$project$Am$Types$Messages$LoadSlot,
						$author$project$Am$Types$Messages$DeleteSlot,
						$author$project$Am$Types$Messages$UpdateSlotName,
						$author$project$Am$Types$Messages$NoOp) : $elm$html$Html$text('')
					])),
				model.aX ? A3($author$project$Am$Components$GuideModal$viewGuideModal, $author$project$Am$Types$Messages$ToggleGuideModal, $author$project$Am$Types$Messages$LoadSlot, $author$project$Am$Types$Messages$NoOp) : $elm$html$Html$text(''),
				model.aY ? $author$project$Am$Components$SettingsModal$viewSettingsModal(model.a9)(model.a8)($author$project$Am$Types$Messages$ToggleSettingsModal)($author$project$Am$Types$Messages$ChangeNumOfRegisters)($author$project$Am$Types$Messages$ChangeMaxExecutedInstructions)($author$project$Am$Types$Messages$TypedRegsNum)($author$project$Am$Types$Messages$TypedMaxExecutedInstructions)(model.bb)(model.ba)($author$project$Am$Types$Messages$NoOp) : $elm$html$Html$text('')
			]),
		a6: 'HnatkoSim | AM'
	};
};
var $author$project$Ram$Types$Messages$ChangeSpeed = function (a) {
	return {$: 6, a: a};
};
var $author$project$Ram$Types$Messages$DeleteInput = {$: 12};
var $author$project$Ram$Types$Messages$DeleteSlot = function (a) {
	return {$: 18, a: a};
};
var $author$project$Ram$Types$Messages$GoBackToMenu = {$: 22};
var $author$project$Ram$Types$Messages$LoadSlot = function (a) {
	return {$: 14, a: a};
};
var $author$project$Ram$Types$Messages$NoOp = {$: 24};
var $author$project$Ram$Types$Messages$Pause = {$: 3};
var $author$project$Ram$Types$Messages$Reset = {$: 4};
var $author$project$Ram$Types$Messages$SaveSlot = function (a) {
	return {$: 13, a: a};
};
var $author$project$Ram$Types$Messages$Start = {$: 1};
var $author$project$Ram$Types$Messages$Step = {$: 5};
var $author$project$Ram$Types$Messages$ToggleGuideModal = {$: 16};
var $author$project$Ram$Types$Messages$ToggleSettingsModal = {$: 17};
var $author$project$Ram$Types$Messages$ToggleSlotsModal = {$: 15};
var $author$project$Ram$Types$Messages$UpdateCode = function (a) {
	return {$: 0, a: a};
};
var $author$project$Ram$Types$Messages$UpdateSlotName = F2(
	function (a, b) {
		return {$: 23, a: a, b: b};
	});
var $author$project$Ram$Components$GuideModal$stopPropagationClick = function (noOpMsg) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'click',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(noOpMsg, true)));
};
var $elm$html$Html$sub = _VirtualDom_node('sub');
var $author$project$Ram$Components$GuideModal$viewGuideModal = F3(
	function (onToggleGuideModal, onLoadSlot, onNoOp) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'),
					$elm$html$Html$Events$onClick(onToggleGuideModal)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('bg-white p-4 rounded shadow-lg relative max-h-[80vh] max-w-[80vw] lg:max-w-[60vw] overflow-y-auto'),
							$author$project$Ram$Components$GuideModal$stopPropagationClick(onNoOp)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none'),
									$elm$html$Html$Events$onClick(onToggleGuideModal)
								]),
							_List_fromArray(
								[$author$project$Shared$Icons$X$heroiconX])),
							A2(
							$elm$html$Html$h2,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-xl font-bold mb-2 flex items-center gap-1')
								]),
							_List_fromArray(
								[
									$author$project$Shared$Icons$Guide$heroiconGuide,
									$elm$html$Html$text('Random Access Machine Guide')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('my-1 text-sm')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('mb-2')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Random Access Machine is a computational model similar to conventional sequential computers. It consists of data memory (implemented as registers) and program memory containing instructions. An input/output unit interfaces with the environment, while an arithmetic-logic and control unit interprets and executes the program.')
										])),
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('mb-2')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('This simulator implements a computational model with all supported instructions and limited number of registers. It offers two modes: a '),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-green-500 font-semibold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('simulation mode')
												])),
											A2(
											$elm$html$Html$span,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(' and an ')
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-red-500 font-semibold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('editing mode')
												])),
											$elm$html$Html$text('. Once you press '),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-blue-500 font-semibold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Step')
												])),
											$elm$html$Html$text(' or '),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-blue-500 font-semibold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Start')
												])),
											$elm$html$Html$text(', the simulator switches to '),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-green-500 font-semibold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('simulation mode')
												])),
											$elm$html$Html$text(', and no further edits are allowed until you press '),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-red-500 font-semibold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Stop')
												])),
											$elm$html$Html$text('. You can write comments in the code by using the '),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('font-bold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('\'#\'')
												])),
											$elm$html$Html$text(' character. Simulators have responsive design, so feel free to use them on smaller devices.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('The simulation can be run step by step or continuously. When using instant speed, there is a risk of getting stuck in an infinite loop, so there is a configurable limit called'),
											A2(
											$elm$html$Html$i,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('font-semibold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(' \'Maximum number of executed instructions with instant speed\'')
												])),
											$elm$html$Html$text('. If your program is complex and needs more instructions, you can increase this limit in the settings.')
										]))
								])),
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-lg font-semibold mt-5')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Example codes:')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex flex-row gap-3 my-2')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('border p-2 rounded bg-white shadow-sm w-full')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('font-semibold text-gray-700')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Example 1: '),
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('font-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Avg of two numbers')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('flex flex-row-reverse gap-2 mt-2')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none'),
															$elm$html$Html$Events$onClick(
															onLoadSlot(21))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Load')
														]))
												]))
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('border p-2 rounded bg-white shadow-sm w-full')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('font-semibold text-gray-700')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Example 2: '),
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('font-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('a^n')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('flex flex-row-reverse gap-2 mt-2')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none'),
															$elm$html$Html$Events$onClick(
															onLoadSlot(22))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Load')
														]))
												]))
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('border p-2 rounded bg-white shadow-sm w-full')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('font-semibold text-gray-700')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Example 3: '),
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('font-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('n!')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('flex flex-row-reverse gap-2 mt-2')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none'),
															$elm$html$Html$Events$onClick(
															onLoadSlot(23))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Load')
														]))
												]))
										]))
								])),
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-lg font-semibold mt-5')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Instructions:')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-1 text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Program memory consists of numbered memory locations where instructions are stored. A label is a special marker in form of numeric constant, that the program uses to remember a specific location. Because labels are not executable commands, they do not count as instructions. For example, a label can be written as '),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold text-gray-600')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('jumpHere:')
										])),
									$elm$html$Html$text(' .')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-2 text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Parsing errors do not count as instructions. However, instructions that trigger a runtime error are counted (including their computational complexity) because the simulator expends effort to determine that they are invalid.')
								])),
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('min-w-full table-fixed my-2 text-sm')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$thead,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-1/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Instruction')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-1/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Example')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-4/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Description')
														]))
												]))
										])),
									A2(
									$elm$html$Html$tbody,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('bg-white divide-y divide-gray-300')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-blue-100/70')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-blue-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('LOAD operand')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('LOAD =10')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Operand is loaded into the accumulator.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-blue-100/70')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-blue-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('STORE operand')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('STORE 15')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Content of accumulator is stored into memory.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-blue-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-blue-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('ADD operand')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('ADD *5')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Operand is added to the accumulator.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-blue-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-blue-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('SUB operand')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('SUB =1')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Operand is subtracted from the accumulator.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-blue-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-blue-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('MUL operand')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('MUL 8')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Accumulator is multiplied by the operand.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-blue-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-blue-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('DIV operand')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('DIV =2')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Accumulator is divided by the operand.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-blue-100/70')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-blue-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('READ operand')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('READ 3')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Value from input tape is stored into operand.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-blue-100/70')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-blue-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('WRITE operand')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('WRITE *20')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Accumulator value is stored on the writing tape.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-gray-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-gray-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('JUMP label')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('JUMP loop')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Value of the instruction pointer (IP) is set according to the label.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-gray-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-gray-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('JZERO label')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('JZERO loop')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('If the accumulator is 0, IP is set according to the label.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-gray-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-gray-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('JGTZ label')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('JGTZ loop')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('If the accumulator is greater than 0, IP is set according to the label.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-yellow-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-yellow-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('HALT')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('HALT')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Program execution is halted.')
														]))
												]))
										]))
								])),
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-lg font-semibold mt-5')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Operands:')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-2 text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('')
								])),
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('min-w-full table-fixed my-2 text-sm')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$thead,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-1/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Operand')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-1/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Example')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-4/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Description')
														]))
												]))
										])),
									A2(
									$elm$html$Html$tbody,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('bg-white divide-y divide-gray-300')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-blue-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-bold text-blue-500')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('=i')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('ADD =-5')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Constant addressing. In this example, the constant -5 is added to the accumulator.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-blue-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-bold text-blue-500')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('i')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('ADD 4')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Direct addressing. The operand is evaluated as the content of register i. In this example, the value from register 4 is added to the accumulator.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-blue-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-bold text-blue-500')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('*i')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('ADD *7')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Indirect addressing. The content of register i determines the register whose content is used as the operand. In this example, the value from the register whose index is specified by the content of register 7 is added to the accumulator.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-gray-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold text-gray-500')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('label')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('jumpHere')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('A label is a special type of operand that serves as a numeric constant. Jump instructions use labels to specify the memory location number to which the instruction pointer should jump during execution.')
														]))
												]))
										]))
								])),
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-lg font-semibold mt-5')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Computational complexity:')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Time or space complexity is a significant criterion for evaluating the quality of a program. The RAM machine was designed so that a simulated computation on it corresponds to real-world computers. As a result, complexity measures defined for a RAM program can offer valuable insight, closely correlating with the complexities of real applications.')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('my-2 text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Time complexity refers to the computational cost of a program and indicates how much “time” is required for it to run. Meanwhile, space complexity determines the program\'s memory usage. For the RAM machine, there are two complexity measures: the '),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('unit cost')
										])),
									A2(
									$elm$html$Html$span,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(' measure and the ')
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('logarithmic cost')
										])),
									A2(
									$elm$html$Html$span,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(' measure.')
										]))
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-1 text-md font-semibold')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Unit cost')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-2 text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Under the unit cost measure, every instruction requires exactly 1 time unit to execute, and each register you use consumes 1 memory unit. So for any given input, the '),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('time complexity')
										])),
									A2(
									$elm$html$Html$span,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(' is simply the ')
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('total number of instructions executed')
										])),
									A2(
									$elm$html$Html$span,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(', and the ')
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('space complexity')
										])),
									A2(
									$elm$html$Html$span,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(' is the ')
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('total number of registers used')
										])),
									A2(
									$elm$html$Html$span,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('. The unit cost measure does not account for the size of the numbers being manipulated or stored in those registers.')
										]))
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-1 text-md font-semibold')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Logarithmic cost')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('The logarithmic cost measure can be more realistic in certain scenarios because it considers the limited capacity for storing numbers in a real computer\'s memory. The larger the number an instruction processes, the “more expensive” it becomes—requiring extra time and memory to store and handle that value. The cost grows '),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('logarithmically')
										])),
									A2(
									$elm$html$Html$span,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(' with the size of the number. The complexity of manipulating a number ')
										])),
									A2(
									$elm$html$Html$i,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('i')
										])),
									A2(
									$elm$html$Html$span,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(' is given by the following function:')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('$$ l(i) = \\begin{cases} \\lfloor \\log_{2}(\\lvert i \\rvert) \\rfloor + 1, & \\text{if } i \\neq 0,\\\\ 1, & \\text{if } i = 0 \\end{cases} $$')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-1 text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('By default a binary logarithm (base of logarithm is 2) is used, so that the function '),
									A2(
									$elm$html$Html$i,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('l(i)')
										])),
									$elm$html$Html$text(' corresponds to the number of bits needed to store the integer '),
									A2(
									$elm$html$Html$i,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('i')
										])),
									$elm$html$Html$text('. However, you can select any logarithm base in the simulator\'s settings if you prefer a different measure.')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-2 text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Using this function, we can define the time cost of working with an operand '),
									A2(
									$elm$html$Html$i,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('t(op)')
										])),
									$elm$html$Html$text(', as shown in the following table:')
								])),
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('min-w-full table-fixed mt-2 text-sm')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$thead,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-1/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Operand'),
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-xs text-gray-400 lowercase')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text(' op')
																]))
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-1/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Price'),
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-xs text-gray-400 lowercase')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text(' t(op)')
																]))
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-4/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Description')
														]))
												]))
										])),
									A2(
									$elm$html$Html$tbody,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('bg-white divide-y divide-gray-300')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-bold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('=i')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('l(i)')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('The cost is determined by how difficult it is to manipulate the number '),
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-bold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('i')
																])),
															$elm$html$Html$text('.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-bold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('i')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('l(i) + l(c(i))')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('The cost depends on the complexity of handling register index '),
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-bold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('i')
																])),
															$elm$html$Html$text(' (higher indices incur a higher access cost) and on the value stored in register '),
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-bold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('i')
																])),
															$elm$html$Html$text('.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-bold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('*i')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('l(i) + l(c(i)) + l(c(c(i)))')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('You must “pay” for accessing register '),
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-bold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('i')
																])),
															$elm$html$Html$text(', then for accessing register '),
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-bold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('c(i)')
																])),
															$elm$html$Html$text(' (which is determined by indirect addressing through '),
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-bold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('i')
																])),
															$elm$html$Html$text('), and finally for manipulating the number '),
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-bold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('c(c(i))')
																])),
															$elm$html$Html$text(' stored in register '),
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-bold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('c(i)')
																])),
															$elm$html$Html$text('.')
														]))
												]))
										]))
								])),
							A2(
							$elm$html$Html$i,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('font-semibold text-xs text-gray-400')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('c(i)')
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-gray-400 text-xs')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(' denotes the content of register ')
								])),
							A2(
							$elm$html$Html$i,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('font-semibold text-gray-400 text-xs')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('i')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mt-3 text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Now we can define instruction costs based on the type and size of their operands, as shown in the following table:')
								])),
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('min-w-full table-fixed mt-2 text-sm')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$thead,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-1/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Instruction')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-1/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Operand')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-4/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Price')
														]))
												]))
										])),
									A2(
									$elm$html$Html$tbody,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('bg-white divide-y divide-gray-300')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-100')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('LOAD')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('op')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('t(op)')
																]))
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-100')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('STORE')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('i')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('l(c(0)) + l(i)')
																]))
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-100')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('STORE')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('*i')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('l(c(0)) + l(i) + l(c(i))')
																]))
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('ADD')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('op')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('l(c(0)) + t(op)')
																]))
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('SUB')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('op')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('l(c(0)) + t(op)')
																]))
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('MUL')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('op')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('l(c(0)) + t(op)')
																]))
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('DIV')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('op')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('l(c(0)) + t(op)')
																]))
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-100')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('READ')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('i')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('l(input) + l(i)')
																]))
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-100')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('READ')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('*i')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('l(input) + l(i) + l(c(i))')
																]))
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-100')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('WRITE')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('op')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('t(op)')
																]))
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('JUMP')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('label')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('1')
																]))
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('JZERO')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('label')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('l(c(0))')
																]))
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('JGTZ')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('label')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('l(c(0))')
																]))
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-lime-100')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-lime-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('HALT')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(' ')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('1')
																]))
														]))
												]))
										]))
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mt-3 mb-1 text-sm')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Logarithmic time complexity')
										])),
									$elm$html$Html$text(' is '),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('the sum of the costs for all instructions')
										])),
									$elm$html$Html$text(' executed when processing a given input. If instructions are inside a loop, their costs are counted for each iteration. Because register contents may change during execution, the cost of an instruction in a loop can vary from one iteration to the next.')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-2 text-sm')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('The logarithmic space complexity')
										])),
									$elm$html$Html$text(' is defined as the '),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('sum of ')
										])),
									A2(
									$elm$html$Html$i,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('l(x'),
											A2(
											$elm$html$Html$sub,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-xs')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('i')
												])),
											$elm$html$Html$text(')')
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(' for all registers ')
										])),
									$elm$html$Html$text('(including the accumulator), where '),
									A2(
									$elm$html$Html$i,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('x'),
											A2(
											$elm$html$Html$sub,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-xs')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('i')
												]))
										])),
									$elm$html$Html$text(' is the number with the '),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('largest absolute value ever stored in register ')
										])),
									A2(
									$elm$html$Html$i,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('i')
										])),
									$elm$html$Html$text(' during the computation.')
								])),
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-lg font-semibold mt-5')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Possible errors:')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-2 text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Parsing errors are detected during parsing, which is done after each input. Instructions with parsing errors appear in red, and once the program is started, these errors are printed to the console. Runtime errors occur during execution because they cannot be predicted in advance; these are also logged to the console. Warnings are a special type of errors that arise in specific situations.')
								])),
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('min-w-full table-fixed mt-2 text-sm')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$thead,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-1/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Type')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-1/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Error message')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('w-4/6 px-3 py-1 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Cause & Prevention')
														]))
												]))
										])),
									A2(
									$elm$html$Html$tbody,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('bg-white divide-y divide-gray-300')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-red-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-red-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Parsing error')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Found unknown instruction.')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This error occurs when the parser encounters an unrecognized instruction. To prevent it, verify that all instructions match the valid instruction set and check your code for typos.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-red-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-red-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Parsing error')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Found instruction that is attempting to access a non-existing register.')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This error occurs when the parser detects a direct operand pointing to a register index that doesn\'t exist or is out of range. To prevent it, ensure all register references are within the valid range.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-red-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-red-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Parsing error')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Found duplicated label')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This error occurs when the parser encounters a label that has already been defined. To prevent it, ensure that each label is unique.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-red-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-red-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Parsing error')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Found instruction that is referencing non-existing label')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This error occurs when the parser encounters an instruction that references a label that doesn\'t exist. To prevent it, ensure that all labels are defined before they are referenced.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-red-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-red-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Parsing error')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Found instruction that is dividing by zero')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This error occurs when the parser detects a division instruction with a constant operand of zero (DIV =0). To prevent it, ensure all constant division operands are non-zero.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-red-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-red-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Parsing error')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Found invalid instruction')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This error occurs when the parser encounters an instruction that uses a constant operand in a context that doesn\'t make sense, such as STORE =5, READ =7, or WRITE =9. To prevent it, ensure that storing, reading, or writing references a valid register, with direct or indirect operands.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-red-100')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-red-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Runtime error')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Instruction attempted to read from the input tape, while no more values are available.')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This runtime error occurs when an instruction tries to read from the input tape, but no additional values remain. To avoid this, ensure your program provides enough input data or includes logic to handle cases where the tape might be empty before attempting another read.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-red-100')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-red-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Runtime error')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Instruction attempted to divide by zero.')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This runtime error occurs when a division instruction uses a direct operand referencing a register that contains 0, or an indirect operand that eventually leads to a register holding 0. To avoid this, ensure all registers involved in division are non-zero at runtime, or add logic to handle division by zero before the instruction is executed.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-red-100')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-red-600 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Runtime error')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Instruction attempted to access a non-existent register.')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This runtime error occurs when an indirect operand ultimately resolves to a register index that doesn\'t exist. To avoid it, ensure all indirect operands resolve to valid registers at runtime, or implement checks to prevent referencing out-of-range indices.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-yellow-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-yellow-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Warning')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Maximum number of instant-speed instructions exceeded.')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This warning appears when your program exceeds the configured limit of instructions while running at instant speed. It helps prevent the simulator from getting stuck in infinite loops. If your program is complex and needs more instructions, you can raise this limit in the settings.')
														]))
												])),
											A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bg-yellow-50')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-yellow-500 font-semibold')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Warning')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('More than 100 runtime errors occurred while running at instant speed.')
														])),
													A2(
													$elm$html$Html$td,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-1 whitespace-normal')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This warning appears when the simulator accumulates more than 100 runtime errors in instant-speed mode, usually indicating a potential infinite loop or recurring problem. To address it, lower the execution speed or step through your code to identify and fix the source of these repeated errors.')
														]))
												]))
										]))
								]))
						]))
				]));
	});
var $author$project$Ram$Types$Messages$AddCellToInputTape = {$: 20};
var $author$project$Shared$Icons$Plus$heroiconPlus = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-8 w-8'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M12 4.5v15m7.5-7.5h-15')
				]),
			_List_Nil)
		]));
var $author$project$Ram$Types$Messages$RemoveLastCell = {$: 21};
var $author$project$Ram$Types$Messages$UpdateInputTape = F2(
	function (a, b) {
		return {$: 19, a: a, b: b};
	});
var $author$project$Shared$Icons$XSmall$heroiconX = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-4 w-4'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M6 18 18 6M6 6l12 12')
				]),
			_List_Nil)
		]));
var $author$project$Ram$Components$InputTape$renderInputCell = F3(
	function (index, cell, model) {
		var isDisabled = model.a_ ? _List_fromArray(
			[
				$elm$html$Html$Attributes$disabled(true)
			]) : _List_Nil;
		var highlightClass = A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Dict$get, index, model.aC));
		var editableAttrs = _List_fromArray(
			[
				$elm$html$Html$Events$onInput(
				function (s) {
					var _v1 = $elm$core$String$toInt(s);
					if (!_v1.$) {
						var n = _v1.a;
						return A2($author$project$Ram$Types$Messages$UpdateInputTape, index, n);
					} else {
						return A2($author$project$Ram$Types$Messages$UpdateInputTape, index, 0);
					}
				})
			]);
		var _v0 = _Utils_Tuple2(
			$elm$core$String$fromInt(cell),
			(highlightClass !== '') ? (highlightClass + ' cursor-not-allowed text-gray-700') : (model.a_ ? 'cursor-not-allowed text-gray-700' : 'bg-white'));
		var displayValue = _v0.a;
		var bgClass = _v0.b;
		var commonAttrs = _List_fromArray(
			[
				$elm$html$Html$Attributes$type_('number'),
				$elm$html$Html$Attributes$class(
				'w-16 h-16 lg:w-20 lg:h-20 border rounded text-center appearance-none font-mono ' + (bgClass + (_Utils_eq(model.aH, index) ? ' border-blue-500 border-4 font-bold' : ''))),
				$elm$html$Html$Attributes$value(displayValue)
			]);
		var inputElement = A2(
			$elm$html$Html$input,
			_Utils_ap(
				commonAttrs,
				_Utils_ap(editableAttrs, isDisabled)),
			_List_Nil);
		return (_Utils_eq(
			index,
			$elm$core$Array$length(model.J) - 1) && (!model.a_)) ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('relative')
				]),
			_List_fromArray(
				[
					inputElement,
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('absolute top-0 right-0 w-5 h-5 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-200'),
							$elm$html$Html$Events$onClick($author$project$Ram$Types$Messages$RemoveLastCell)
						]),
					_List_fromArray(
						[$author$project$Shared$Icons$XSmall$heroiconX]))
				])) : inputElement;
	});
var $author$project$Ram$Components$InputTape$viewInputTape = function (model) {
	var cellsList = $elm$core$Array$toList(model.J);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex bg-white rounded space-x-1.5 p-1 lg:space-x-2 lg:p-2 overflow-x-auto')
			]),
		_Utils_ap(
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (index, cell) {
						return A3($author$project$Ram$Components$InputTape$renderInputCell, index, cell, model);
					}),
				cellsList),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							model.a_ ? 'w-16 h-16 lg:w-20 lg:h-20 text-transparent pointer-events-none flex items-center justify-center flex-shrink-0' : 'w-16 h-16 lg:w-20 lg:h-20 border rounded bg-green-200 text-green-800 flex items-center justify-center flex-shrink-0 hover:bg-green-300 hover:text-green-900 transition-colors duration-200'),
							$elm$html$Html$Events$onClick($author$project$Ram$Types$Messages$AddCellToInputTape)
						]),
					_List_fromArray(
						[$author$project$Shared$Icons$Plus$heroiconPlus]))
				])));
};
var $author$project$Ram$Components$Instructions$operandToString = function (operand) {
	switch (operand.$) {
		case 0:
			var n = operand.a;
			return '=' + $elm$core$String$fromInt(n);
		case 1:
			var n = operand.a;
			return $elm$core$String$fromInt(n);
		default:
			var n = operand.a;
			return '*' + $elm$core$String$fromInt(n);
	}
};
var $author$project$Ram$Components$Instructions$viewInstructions = F4(
	function (instructions, pointer, simStarted, halted) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					'flex flex-col gap-1 md:w-1/3 p-1 shadow-lg rounded md:overflow-auto border-2 border-transparent ' + ((((_Utils_cmp(
						pointer,
						$elm$core$List$length(instructions)) > -1) && simStarted) || halted) ? ' bg-green-50 border-green-400' : ' bg-white'))
				]),
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (index, instruction) {
						var isActive = _Utils_eq(index, pointer);
						var baseClasses = 'p-0.5 border-4 border-solid rounded font-mono transition-colors';
						var activeClasses = isActive ? ' border-blue-500 font-bold' : ' border-transparent';
						var _v0 = function () {
							switch (instruction.$) {
								case 0:
									var operand = instruction.a;
									var isError = instruction.b;
									var exeCount = instruction.c;
									if (!isError.$) {
										return _Utils_Tuple3(
											'Load ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-red-200 text-red-800',
											$elm$core$Maybe$Nothing);
									} else {
										return _Utils_Tuple3(
											'Load ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-blue-200 text-blue-800',
											$elm$core$Maybe$Just(exeCount));
									}
								case 1:
									var operand = instruction.a;
									var isError = instruction.b;
									var exeCount = instruction.c;
									if (!isError.$) {
										return _Utils_Tuple3(
											'Store ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-red-200 text-red-800',
											$elm$core$Maybe$Nothing);
									} else {
										return _Utils_Tuple3(
											'Store ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-blue-200 text-blue-800',
											$elm$core$Maybe$Just(exeCount));
									}
								case 2:
									var operand = instruction.a;
									var isError = instruction.b;
									var exeCount = instruction.c;
									if (!isError.$) {
										return _Utils_Tuple3(
											'Add ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-red-200 text-red-800',
											$elm$core$Maybe$Nothing);
									} else {
										return _Utils_Tuple3(
											'Add ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-blue-200 text-blue-800',
											$elm$core$Maybe$Just(exeCount));
									}
								case 3:
									var operand = instruction.a;
									var isError = instruction.b;
									var exeCount = instruction.c;
									if (!isError.$) {
										return _Utils_Tuple3(
											'Sub ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-red-200 text-red-800',
											$elm$core$Maybe$Nothing);
									} else {
										return _Utils_Tuple3(
											'Sub ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-blue-200 text-blue-800',
											$elm$core$Maybe$Just(exeCount));
									}
								case 4:
									var operand = instruction.a;
									var isError = instruction.b;
									var exeCount = instruction.c;
									if (!isError.$) {
										return _Utils_Tuple3(
											'Mul ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-red-200 text-red-800',
											$elm$core$Maybe$Nothing);
									} else {
										return _Utils_Tuple3(
											'Mul ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-blue-200 text-blue-800',
											$elm$core$Maybe$Just(exeCount));
									}
								case 5:
									var operand = instruction.a;
									var isError = instruction.b;
									var exeCount = instruction.c;
									if (!isError.$) {
										return _Utils_Tuple3(
											'Div ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-red-200 text-red-800',
											$elm$core$Maybe$Nothing);
									} else {
										return _Utils_Tuple3(
											'Div ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-blue-200 text-blue-800',
											$elm$core$Maybe$Just(exeCount));
									}
								case 6:
									var operand = instruction.a;
									var isError = instruction.b;
									var exeCount = instruction.c;
									if (!isError.$) {
										return _Utils_Tuple3(
											'Read ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-red-200 text-red-800',
											$elm$core$Maybe$Nothing);
									} else {
										return _Utils_Tuple3(
											'Read ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-blue-200 text-blue-800',
											$elm$core$Maybe$Just(exeCount));
									}
								case 7:
									var operand = instruction.a;
									var isError = instruction.b;
									var exeCount = instruction.c;
									if (!isError.$) {
										return _Utils_Tuple3(
											'Write ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-red-200 text-red-800',
											$elm$core$Maybe$Nothing);
									} else {
										return _Utils_Tuple3(
											'Write ' + $author$project$Ram$Components$Instructions$operandToString(operand),
											' bg-blue-200 text-blue-800',
											$elm$core$Maybe$Just(exeCount));
									}
								case 8:
									var label = instruction.b;
									var isError = instruction.c;
									var exeCount = instruction.d;
									if (!isError.$) {
										return _Utils_Tuple3('Jump ' + label, ' bg-red-200 text-red-800', $elm$core$Maybe$Nothing);
									} else {
										return _Utils_Tuple3(
											'Jump ' + label,
											' bg-gray-200 text-gray-800',
											$elm$core$Maybe$Just(exeCount));
									}
								case 9:
									var label = instruction.b;
									var isError = instruction.c;
									var exeCount = instruction.d;
									if (!isError.$) {
										return _Utils_Tuple3('Jzero ' + label, ' bg-red-200 text-red-800', $elm$core$Maybe$Nothing);
									} else {
										return _Utils_Tuple3(
											'Jzero ' + label,
											' bg-gray-200 text-gray-800',
											$elm$core$Maybe$Just(exeCount));
									}
								case 10:
									var label = instruction.b;
									var isError = instruction.c;
									var exeCount = instruction.d;
									if (!isError.$) {
										return _Utils_Tuple3('Jgtz ' + label, ' bg-red-200 text-red-800', $elm$core$Maybe$Nothing);
									} else {
										return _Utils_Tuple3(
											'Jgtz ' + label,
											' bg-gray-200 text-gray-800',
											$elm$core$Maybe$Just(exeCount));
									}
								case 11:
									var exeCount = instruction.a;
									return _Utils_Tuple3(
										'Halt',
										' bg-yellow-200 text-yellow-800',
										$elm$core$Maybe$Just(exeCount));
								case 12:
									var lbl = instruction.a;
									var isError = instruction.b;
									if (!isError.$) {
										return _Utils_Tuple3(lbl + ':', ' bg-red-200 text-red-800', $elm$core$Maybe$Nothing);
									} else {
										return _Utils_Tuple3(lbl + ':', ' bg-gray-200 text-gray-800', $elm$core$Maybe$Nothing);
									}
								default:
									return _Utils_Tuple3('Unknown', ' bg-red-200 text-red-800', $elm$core$Maybe$Nothing);
							}
						}();
						var instructionText = _v0.a;
						var typeColorClasses = _v0.b;
						var maybeExeCount = _v0.c;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex items-center gap-3 font-mono ' + (baseClasses + (typeColorClasses + activeClasses)))
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-gray-400 w-8 text-right')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromInt(index + 1))
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('h-6 w-px bg-gray-400')
										]),
									_List_Nil),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(instructionText)
										])),
									function () {
									if (!maybeExeCount.$) {
										var exeCount = maybeExeCount.a;
										return A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-gray-400 ml-auto mr-2')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$core$String$fromInt(exeCount) + 'x')
												]));
									} else {
										return A2($elm$html$Html$div, _List_Nil, _List_Nil);
									}
								}()
								]));
					}),
				instructions));
	});
var $author$project$Ram$Components$OutputTape$renderOutputCell = F3(
	function (index, cell, model) {
		var highlightClass = A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Dict$get, index, model.aD));
		var _v0 = _Utils_Tuple2(
			$elm$core$String$fromInt(cell),
			(highlightClass !== '') ? ('flex-none px-1 w-16 h-16 lg:w-20 lg:h-20 border overflow-x-auto rounded text-center flex items-center justify-center font-mono ' + highlightClass) : 'flex-none px-1 w-16 h-16 lg:w-20 lg:h-20 border overflow-x-auto rounded text-center flex items-center justify-center font-mono bg-white');
		var displayValue = _v0.a;
		var bgClass = _v0.b;
		var inputElement = A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(bgClass)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(displayValue)
				]));
		return inputElement;
	});
var $author$project$Ram$Components$OutputTape$viewOutputTape = function (model) {
	var cells = $elm$core$Array$toList(model.aU);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex rounded bg-white space-x-1.5 p-1 lg:space-x-2 lg:p-2 overflow-x-auto')
			]),
		$elm$core$List$isEmpty(cells) ? _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-16 h-16 lg:w-20 lg:h-20 border rounded invisible')
					]),
				_List_Nil)
			]) : A2(
			$elm$core$List$indexedMap,
			F2(
				function (index, cell) {
					return A3($author$project$Ram$Components$OutputTape$renderOutputCell, index, cell, model);
				}),
			cells));
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $author$project$Ram$Components$Registers$viewRegisters = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-col md:w-1/3 gap-3')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex w-full h-full overflow-auto bg-white rounded p-1 order-2 md:order-1')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex flex-col w-full p-1 rounded overflow-y-auto')
							]),
						A2(
							$elm$core$List$map,
							function (_v0) {
								var regNum = _v0.a;
								var _v1 = _v0.b;
								var value = _v1.a;
								var wasUsed = _v1.b;
								var highlightClass = A2(
									$elm$core$Maybe$withDefault,
									'',
									A2($elm$core$Dict$get, regNum, model.aE));
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class(
											function () {
												if (!wasUsed.$) {
													return 'flex items-center gap-4 p-1 border-b last:border-none font-mono ' + highlightClass;
												} else {
													return 'flex items-center gap-4 p-1 border-b last:border-none font-mono bg-gray-100 rounded ' + highlightClass;
												}
											}())
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											(!regNum) ? _List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-blue-500 w-8 text-right')
												]) : _List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-gray-500 w-8 text-right')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$core$String$fromInt(regNum))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('h-5 w-px bg-gray-300')
												]),
											_List_Nil),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('flex-1 text-left font-medium text-gray-900')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$core$String$fromInt(value))
												]))
										]));
							},
							$elm$core$Dict$toList(model.aV)))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex w-full max-h-[30%] bg-white rounded p-1.5 rounded gap-1.5 order-1 md:order-2')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('bg-white w-1/2 p-1 rounded border overflow-x-auto')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-md font-semibold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Time Complexity')
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-sm')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Logarithmic cost: '),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-green-600 font-semibold')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$core$String$fromInt(model.aO))
											]))
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-sm')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Unit cost: '),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-green-600 font-semibold')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$core$String$fromInt(model.ax))
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('bg-white w-1/2 p-1 rounded border overflow-x-auto')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-md font-semibold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Space Complexity')
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-sm')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Logarithmic cost: '),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-green-600 font-semibold')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$core$String$fromInt(model.aN))
											]))
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-sm')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Unit cost: '),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-green-600 font-semibold')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$core$String$fromInt(
													$elm$core$List$length(
														A2(
															$elm$core$List$map,
															$elm$core$Tuple$second,
															A2(
																$elm$core$List$filter,
																function (_v3) {
																	var wasUsed = _v3.b;
																	return !_Utils_eq(wasUsed, $elm$core$Maybe$Nothing);
																},
																$elm$core$Dict$values(model.aV))))))
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Ram$Types$Messages$ChangeLogBase = function (a) {
	return {$: 33, a: a};
};
var $author$project$Ram$Types$Messages$ChangeMaxExecutedInstructions = function (a) {
	return {$: 29, a: a};
};
var $author$project$Ram$Types$Messages$ChangeNumOfRegisters = function (a) {
	return {$: 28, a: a};
};
var $author$project$Ram$Types$Messages$TypedBase = function (a) {
	return {$: 32, a: a};
};
var $author$project$Ram$Types$Messages$TypedMaxExecutedInstructions = function (a) {
	return {$: 31, a: a};
};
var $author$project$Ram$Types$Messages$TypedRegsNum = function (a) {
	return {$: 30, a: a};
};
var $author$project$Ram$Components$SettingsModal$stopPropagationClick = function (noOpMsg) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'click',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(noOpMsg, true)));
};
var $author$project$Ram$Components$SettingsModal$viewSettingsModal = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'),
				$elm$html$Html$Events$onClick($author$project$Ram$Types$Messages$ToggleSettingsModal)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('bg-white p-4 rounded shadow-lg relative max-h-[80vh] max-w-[80vw] lg:max-w-[60vw] overflow-y-auto'),
						$author$project$Ram$Components$SettingsModal$stopPropagationClick($author$project$Ram$Types$Messages$NoOp)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none'),
								$elm$html$Html$Events$onClick($author$project$Ram$Types$Messages$ToggleSettingsModal)
							]),
						_List_fromArray(
							[$author$project$Shared$Icons$X$heroiconX])),
						A2(
						$elm$html$Html$h2,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-xl font-bold mb-2 flex items-center gap-1')
							]),
						_List_fromArray(
							[
								$author$project$Shared$Icons$Settings$heroiconSettings,
								$elm$html$Html$text('Settings')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mb-4')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-lg font-semibold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Number of registers:')
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-red-500 text-sm ')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Warning: Changing this setting is not recommended as it may degrade performance because more elements must be rendered.')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex flex-col text-xs mb-2 mt-1 text-gray-600')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('flex gap-2 items-center')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$p,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('min: 10')
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('h-4 w-px bg-gray-400')
													]),
												_List_Nil),
												A2(
												$elm$html$Html$p,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('text-green-600 font-semibold')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('default: 100')
															]))
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('h-4 w-px bg-gray-400')
													]),
												_List_Nil),
												A2(
												$elm$html$Html$p,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('max: 10,000')
													]))
											])),
										A2(
										$elm$html$Html$p,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('text-blue-600 font-semibold')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														'current: ' + $elm$core$String$fromInt(model.a9))
													]))
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex gap-2 items-center')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('number'),
												$elm$html$Html$Attributes$min('10'),
												$elm$html$Html$Attributes$max('10000'),
												$elm$html$Html$Attributes$value(model.bb),
												$elm$html$Html$Events$onInput($author$project$Ram$Types$Messages$TypedRegsNum),
												$elm$html$Html$Attributes$class('border rounded p-1 w-full'),
												$elm$html$Html$Attributes$placeholder('Type here...')
											]),
										_List_Nil),
										function () {
										var parsed = A2(
											$elm$core$Maybe$withDefault,
											0,
											$elm$core$String$toInt(model.bb));
										var isValid = (parsed >= 10) && (parsed <= 10000);
										return A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class(
													isValid ? 'bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none' : 'bg-gray-400 text-white px-3 py-1 rounded opacity-50 cursor-not-allowed'),
													$elm$html$Html$Attributes$disabled(!isValid),
													$elm$html$Html$Events$onClick(
													$author$project$Ram$Types$Messages$ChangeNumOfRegisters(parsed))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Set')
												]));
									}()
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mb-4')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-lg font-semibold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Maximum number of executed instructions with instant speed:')
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-sm')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('This setting is designed to prevent the program from getting stuck in an infinite loop. If your program is complex and requires more instructions, you can adjust this limit accordingly.')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex flex-col text-xs mb-2 mt-1 text-gray-600')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('flex gap-2 items-center')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$p,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('min: 1,000')
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('h-4 w-px bg-gray-400')
													]),
												_List_Nil),
												A2(
												$elm$html$Html$p,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('text-green-600 font-semibold')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('default: 100,000')
															]))
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('h-4 w-px bg-gray-400')
													]),
												_List_Nil),
												A2(
												$elm$html$Html$p,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('max: 100,000,000')
													]))
											])),
										A2(
										$elm$html$Html$p,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('text-blue-600 font-semibold')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														'current: ' + $elm$core$String$fromInt(model.a8))
													]))
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex gap-2 items-center')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('number'),
												$elm$html$Html$Attributes$min('1000'),
												$elm$html$Html$Attributes$max('100000000'),
												$elm$html$Html$Attributes$value(model.ba),
												$elm$html$Html$Events$onInput($author$project$Ram$Types$Messages$TypedMaxExecutedInstructions),
												$elm$html$Html$Attributes$class('border rounded p-1 w-full'),
												$elm$html$Html$Attributes$placeholder('Type here...')
											]),
										_List_Nil),
										function () {
										var parsed = A2(
											$elm$core$Maybe$withDefault,
											0,
											$elm$core$String$toInt(model.ba));
										var isValid = (parsed >= 1000) && (parsed <= 100000000);
										return A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class(
													isValid ? 'bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none' : 'bg-gray-400 text-white px-3 py-1 rounded opacity-50 cursor-not-allowed'),
													$elm$html$Html$Attributes$disabled(!isValid),
													$elm$html$Html$Events$onClick(
													$author$project$Ram$Types$Messages$ChangeMaxExecutedInstructions(parsed))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Set')
												]));
									}()
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-lg font-semibold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Logarithm base for computing the logarithmic complexity:')
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-sm')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('This setting changes the logarithm base in the formula used to compute logarithmic time and space complexity. The formula for an input integer '),
										A2(
										$elm$html$Html$i,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('i')
											])),
										$elm$html$Html$text(' is:')
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('$$ l(i) = \\begin{cases} \\lfloor \\log_{\\text{base}}(\\lvert i \\rvert) \\rfloor + 1, & \\text{if } i \\neq 0,\\\\ 1, & \\text{if } i = 0 \\end{cases} $$')
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-sm')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('By default, the base is set to 2 (binary logarithm), which reflects the number of bits needed to represent the input.')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex flex-col text-xs mb-2 mt-1 text-gray-600')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('flex gap-2 items-center')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$p,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('min: 2')
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('h-4 w-px bg-gray-400')
													]),
												_List_Nil),
												A2(
												$elm$html$Html$p,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('text-green-600 font-semibold')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('default: 2')
															]))
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('h-4 w-px bg-gray-400')
													]),
												_List_Nil),
												A2(
												$elm$html$Html$p,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('max: 100,000')
													]))
											])),
										A2(
										$elm$html$Html$p,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('text-blue-600 font-semibold')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														'current: ' + $elm$core$String$fromInt(model.aM))
													]))
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex gap-2 items-center')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('number'),
												$elm$html$Html$Attributes$min('2'),
												$elm$html$Html$Attributes$max('100000'),
												$elm$html$Html$Attributes$value(model.al),
												$elm$html$Html$Events$onInput($author$project$Ram$Types$Messages$TypedBase),
												$elm$html$Html$Attributes$class('border rounded p-1 w-full'),
												$elm$html$Html$Attributes$placeholder('Type here...')
											]),
										_List_Nil),
										function () {
										var parsed = A2(
											$elm$core$Maybe$withDefault,
											0,
											$elm$core$String$toInt(model.al));
										var isValid = (parsed >= 2) && (parsed <= 100000);
										return A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class(
													isValid ? 'bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none' : 'bg-gray-400 text-white px-3 py-1 rounded opacity-50 cursor-not-allowed'),
													$elm$html$Html$Attributes$disabled(!isValid),
													$elm$html$Html$Events$onClick(
													$author$project$Ram$Types$Messages$ChangeLogBase(parsed))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Set')
												]));
									}()
									]))
							]))
					]))
			]));
};
var $author$project$Ram$View$view = function (model) {
	return {
		as: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex flex-col h-screen p-2 bg-gray-200')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex flex-col lg:flex-row lg:gap-3')
							]),
						_List_fromArray(
							[
								A9(
								$author$project$Shared$Components$ControlButtons$controlButtons,
								_Utils_cmp(
									model.aJ,
									$elm$core$List$length(model.aK)) > -1,
								model.aL,
								model.az,
								model.a_,
								$author$project$Ram$Types$Messages$Start,
								$author$project$Ram$Types$Messages$Pause,
								$author$project$Ram$Types$Messages$Step,
								$author$project$Ram$Types$Messages$Reset,
								(model.a1 === 7) && ((_Utils_cmp(model.ax, model.a8) > -1) || model.a7)),
								A3($author$project$Shared$Components$SpeedSlider$speedSlider, model.a1, model.a2, $author$project$Ram$Types$Messages$ChangeSpeed),
								A5($author$project$Shared$Components$MenuButtons$menuButtons, $author$project$Ram$Types$Messages$ToggleSlotsModal, $author$project$Ram$Types$Messages$GoBackToMenu, $author$project$Ram$Types$Messages$ToggleGuideModal, $author$project$Ram$Types$Messages$ToggleSettingsModal, model.a_)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex flex-col h-full my-3 gap-3 overflow-hidden')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$Ram$Components$InputTape$viewInputTape(model)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex flex-col overflow-y-auto md:flex-row gap-3 md:overflow-hidden')
									]),
								_List_fromArray(
									[
										A4($author$project$Shared$Components$InputTextArea$inputTextArea, model.a_, model.aI, $author$project$Ram$Types$Messages$UpdateCode, $author$project$Ram$Types$Messages$DeleteInput),
										A4($author$project$Ram$Components$Instructions$viewInstructions, model.aK, model.aJ, model.a_, model.az),
										$author$project$Ram$Components$Registers$viewRegisters(model)
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$Ram$Components$OutputTape$viewOutputTape(model)
									]))
							])),
						$author$project$Shared$Components$Console$viewConsole(model.au),
						model.aZ ? A8(
						$author$project$Shared$Components$SlotsModal$viewSlotsModal,
						model.aI === '',
						A2(
							$elm$core$Array$map,
							function (slot) {
								return _Utils_Tuple2(slot.aQ, slot.aI === '');
							},
							model.a0),
						$author$project$Ram$Types$Messages$ToggleSlotsModal,
						$author$project$Ram$Types$Messages$SaveSlot,
						$author$project$Ram$Types$Messages$LoadSlot,
						$author$project$Ram$Types$Messages$DeleteSlot,
						$author$project$Ram$Types$Messages$UpdateSlotName,
						$author$project$Ram$Types$Messages$NoOp) : $elm$html$Html$text(''),
						model.aX ? A3($author$project$Ram$Components$GuideModal$viewGuideModal, $author$project$Ram$Types$Messages$ToggleGuideModal, $author$project$Ram$Types$Messages$LoadSlot, $author$project$Ram$Types$Messages$NoOp) : $elm$html$Html$text(''),
						model.aY ? $author$project$Ram$Components$SettingsModal$viewSettingsModal(model) : $elm$html$Html$text('')
					]))
			]),
		a6: 'HnatkoSim | RAM'
	};
};
var $elm$svg$Svg$Attributes$fillOpacity = _VirtualDom_attribute('fill-opacity');
var $elm$virtual_dom$VirtualDom$nodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_nodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm$svg$Svg$node = $elm$virtual_dom$VirtualDom$nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$polygon = $elm$svg$Svg$trustedNode('polygon');
var $elm$svg$Svg$Attributes$preserveAspectRatio = _VirtualDom_attribute('preserveAspectRatio');
var $elm$svg$Svg$Attributes$version = _VirtualDom_attribute('version');
var $author$project$Shared$Icons$ElmLogo$elmLogo = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$width('15px'),
			$elm$svg$Svg$Attributes$height('15px'),
			$elm$svg$Svg$Attributes$viewBox('0 0 256 256'),
			$elm$svg$Svg$Attributes$version('1.1'),
			$elm$svg$Svg$Attributes$preserveAspectRatio('xMidYMid')
		]),
	_List_fromArray(
		[
			A3(
			$elm$svg$Svg$node,
			'title',
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Elm')
				])),
			A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$points('8.52852758 256 127.927914 136.600614 247.3273 256'),
							$elm$svg$Svg$Attributes$fill('#1293D8')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$points('0 8.67270025 119.399386 128.072086 4.84790665e-14 247.471472'),
							$elm$svg$Svg$Attributes$fill('#1293D8')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fillOpacity('0.75'),
							$elm$svg$Svg$Attributes$points('136.594522 0 256 0 256 119.405478'),
							$elm$svg$Svg$Attributes$fill('#1293D8')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$points('136.456441 128.072086 191.89187 183.507516 247.3273 128.072086 191.89187 72.6366571'),
							$elm$svg$Svg$Attributes$fill('#1293D8')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fillOpacity('0.75'),
							$elm$svg$Svg$Attributes$points('8.52852758 0.144172676 119.399386 0.144172676 171.423404 52.1681909 60.5525458 52.1681909'),
							$elm$svg$Svg$Attributes$fill('#1293D8')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fillOpacity('0.75'),
							$elm$svg$Svg$Attributes$points('183.363343 64.1081295 127.927914 119.543559 72.4924844 64.1081295'),
							$elm$svg$Svg$Attributes$fill('#1293D8')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fillOpacity('0.75'),
							$elm$svg$Svg$Attributes$points('255.855827 247.471472 200.420398 192.036043 255.855827 136.600614'),
							$elm$svg$Svg$Attributes$fill('#1293D8')
						]),
					_List_Nil)
				]))
		]));
var $author$project$Shared$Icons$GithubSmall$heroiconGithubSmall = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-5 w-5'),
			$elm$svg$Svg$Attributes$width('98'),
			$elm$svg$Svg$Attributes$height('96'),
			$elm$svg$Svg$Attributes$viewBox('0 0 98 96'),
			$elm$svg$Svg$Attributes$fill('currentColor'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z')
				]),
			_List_Nil)
		]));
var $author$project$Shared$Icons$Mail$heroiconMail = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-5 w-5'),
			$elm$svg$Svg$Attributes$fill('none'),
			$elm$svg$Svg$Attributes$stroke('currentColor'),
			$elm$svg$Svg$Attributes$strokeWidth('1.5'),
			$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
			$elm$svg$Svg$Attributes$strokeLinecap('round'),
			$elm$svg$Svg$Attributes$strokeLinejoin('round')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75')
				]),
			_List_Nil)
		]));
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlJson(value));
	});
var $elm$html$Html$Attributes$property = $elm$virtual_dom$VirtualDom$property;
var $author$project$Main$stopPropagationClick = function (noOpMsg) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'click',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(noOpMsg, true)));
};
var $author$project$Main$viewAboutModal = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'),
			$elm$html$Html$Events$onClick($author$project$Main$ToggleAboutModal)
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('bg-white p-4 rounded shadow-lg relative max-h-[80vh] max-w-[80vw] md:max-w-[65vw] lg:max-w-[50vw] xl:max-w-[40vw] overflow-y-auto'),
					$author$project$Main$stopPropagationClick($author$project$Main$NoOp)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none'),
							$elm$html$Html$Events$onClick($author$project$Main$ToggleAboutModal)
						]),
					_List_fromArray(
						[$author$project$Shared$Icons$X$heroiconX])),
					A2(
					$elm$html$Html$h2,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-xl font-bold mb-2 flex items-center gap-1')
						]),
					_List_fromArray(
						[
							$author$project$Shared$Icons$Info$heroiconInfo,
							$elm$html$Html$text('About')
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mb-0.5 flex items-center gap-1')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Author: Martin Hnatko'),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('mailto:xhnatko@stuba.sk'),
									$elm$html$Html$Attributes$target('_blank'),
									$elm$html$Html$Attributes$rel('noopener noreferrer'),
									$elm$html$Html$Attributes$class('text-blue-500 hover:text-blue-600')
								]),
							_List_fromArray(
								[$author$project$Shared$Icons$Mail$heroiconMail])),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('https://github.com/martinhnatko'),
									$elm$html$Html$Attributes$target('_blank'),
									$elm$html$Html$Attributes$rel('noopener noreferrer'),
									$elm$html$Html$Attributes$class('flex items-center gap-1 text-blue-500 hover:text-blue-600')
								]),
							_List_fromArray(
								[$author$project$Shared$Icons$GithubSmall$heroiconGithubSmall]))
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex flex-row flex-wrap gap-1 items-center justify-start')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Built in'),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('https://elm-lang.org/'),
									$elm$html$Html$Attributes$target('_blank'),
									$elm$html$Html$Attributes$rel('noopener noreferrer'),
									$elm$html$Html$Attributes$class('flex items-center gap-1 text-blue-500 font-semibold hover:text-blue-600')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Elm'),
									$author$project$Shared$Icons$ElmLogo$elmLogo
								])),
							$elm$html$Html$text('as part of a bachelor\'s thesis project.')
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mt-3 text-center text-xs text-gray-500')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$Attributes$property,
									'innerHTML',
									$elm$json$Json$Encode$string('&nbsp;'))
								]),
							_List_Nil),
							$elm$html$Html$text(' HnatkoSim, 2025')
						]))
				]))
		]));
var $author$project$Main$view = function (model) {
	var _v0 = model.o;
	switch (_v0) {
		case 0:
			return {
				as: _List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('grid grid-rows-[auto-auto-auto] min-h-screen bg-gray-200 font-mono')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('grid grid-rows-2 h-full')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('flex items-start justify-left')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href('https://www.fiit.stuba.sk'),
														$elm$html$Html$Attributes$target('_blank'),
														$elm$html$Html$Attributes$rel('noopener noreferrer'),
														$elm$html$Html$Attributes$class('sm:m-6')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$img,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$src('assets\\fiit.png'),
																$elm$html$Html$Attributes$alt('fiit'),
																$elm$html$Html$Attributes$class('w-[20rem] lg:w-[27rem] hidden sm:block')
															]),
														_List_Nil)
													])),
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href('https://www.fiit.stuba.sk'),
														$elm$html$Html$Attributes$target('_blank'),
														$elm$html$Html$Attributes$rel('noopener noreferrer'),
														$elm$html$Html$Attributes$class('m-5 sm:m-0')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$img,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$src('assets\\fiitsmall.webp'),
																$elm$html$Html$Attributes$alt('fiit'),
																$elm$html$Html$Attributes$class('w-[10rem] block sm:hidden')
															]),
														_List_Nil)
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('flex items-start justify-center')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$img,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$src('assets\\hnatkosim.webp'),
														$elm$html$Html$Attributes$alt('HnatkoSim'),
														$elm$html$Html$Attributes$class('w-[20rem] sm:w-[26rem] md:w-[32rem] lg:w-[37rem] breathe')
													]),
												_List_Nil)
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex flex-col items-center justify-center')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('inline-grid w-fit grid-cols-1 gap-4')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Events$onClick(
														$author$project$Main$ChangePage(1)),
														$elm$html$Html$Attributes$class('px-2 sm:px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow-lg transition-colors duration-200')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Abacus Machine Simulator')
													])),
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Events$onClick(
														$author$project$Main$ChangePage(2)),
														$elm$html$Html$Attributes$class('px-2 sm:px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow-lg transition-colors duration-200')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Random Access Machine Simulator')
													])),
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Events$onClick($author$project$Main$NoOp),
														$elm$html$Html$Attributes$class('\r\n                                    px-2\r\n                                    sm:px-8 py-4\r\n                                    text-white \r\n                                    font-bold \r\n                                    \r\n                                    rounded\r\n                                    shadow-xl\r\n                                    bg-gradient-to-r from-red-500 via-blue-500 to-orange-500 \r\n                                    \r\n\r\n                                    hover:animate-none\r\n                                    helicopter-rotate\r\n                                    flex items-center justify-center gap-2\r\n\r\n                                    hover:bg-gradient-to-r hover:from-red-600 hover:via-blue-600 hover:to-orange-600\r\n                                    \r\n                                    \r\n                                    opacity-50\r\n                                    cursor-not-allowed\r\n                                    disabled\r\n                                    ')
													]),
												_List_fromArray(
													[
														$author$project$Shared$Icons$Survey$survey,
														$elm$html$Html$text('SHORT FEEDBACK SURVEY')
													])),
												A2(
												$elm$html$Html$p,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('\r\n                                        text-xs \r\n                                        text-gray-500 \r\n                                        text-center \r\n                                        whitespace-normal \r\n                                        break-words \r\n                                        sm:max-w-[50ch]\r\n                                        max-w-[40ch]\r\n                                    ')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('*Survey is being prepared and will be available soon. You\'ll be notified once it\'s ready!')
													]))
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('content-end m-5')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('flex flex-col sm:flex-row gap-4')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Events$onClick($author$project$Main$ToggleAboutModal),
														$elm$html$Html$Attributes$class('sm:w-1/3 px-4 py-2 font-semibold rounded shadow-lg transition-colors duration-200 border border-blue-500 text-blue-500 bg-white hover:bg-blue-50  focus:outline-none flex items-center justify-center gap-2')
													]),
												_List_fromArray(
													[
														$author$project$Shared$Icons$Info$heroiconInfo,
														$elm$html$Html$text('About')
													])),
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href('https://docs.google.com/forms/d/e/1FAIpQLSe4agj2hvxDIDLTRTOW5YYO4QNrZwihH4uf5q9CBlslGeUrAg/viewform?usp=dialog'),
														$elm$html$Html$Attributes$target('_blank'),
														$elm$html$Html$Attributes$rel('noopener noreferrer'),
														$elm$html$Html$Attributes$class('sm:w-1/3 px-4 py-2 font-semibold rounded shadow-lg transition-colors duration-200 border border-blue-500 text-blue-500 bg-white hover:bg-blue-50  focus:outline-none flex items-center justify-center gap-2')
													]),
												_List_fromArray(
													[
														$author$project$Shared$Icons$Bug$heroiconBug,
														$elm$html$Html$text('Report a bug')
													])),
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href('https://github.com/martinhnatko/am-ram-simulators'),
														$elm$html$Html$Attributes$target('_blank'),
														$elm$html$Html$Attributes$rel('noopener noreferrer'),
														$elm$html$Html$Attributes$class('sm:w-1/3 px-4 py-2 font-semibold rounded shadow-lg transition-colors duration-200 border border-blue-500 text-blue-500 bg-white hover:bg-blue-50  focus:outline-none flex items-center justify-center gap-2')
													]),
												_List_fromArray(
													[
														$author$project$Shared$Icons$Github$heroiconGithub,
														$elm$html$Html$text('Source code')
													]))
											]))
									]))
							])),
						model.B ? $author$project$Main$viewAboutModal : $elm$html$Html$text('')
					]),
				a6: 'HnatkoSim | Home'
			};
		case 1:
			return A2(
				$author$project$Main$documentMap,
				$author$project$Main$AbacusMsg,
				$author$project$Am$View$view(model.f));
		default:
			return A2(
				$author$project$Main$documentMap,
				$author$project$Main$RamMsg,
				$author$project$Ram$View$view(model.h));
	}
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{
		aG: $author$project$Main$init,
		aR: $author$project$Main$UrlChanged,
		aS: function (_v0) {
			return $author$project$Main$NoOp;
		},
		a3: $author$project$Main$subscriptions,
		bc: $author$project$Main$update,
		bd: $author$project$Main$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));