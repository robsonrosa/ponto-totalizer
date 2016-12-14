function totalize() {
	var t1i = gf('FirstIn');
	var t1o = gf('FirstOut');
	var t2i = gf('SecondIn');
	var t2o = gf('SecondOut');
	var t3i = gf('ThirdIn');
	var t3o = gf('ThirdOut');
	var t4i = gf('ForthIn');
	var t4o = gf('ForthOut');

	var total = new Date((t1o - t1i) + (t2o - t2i) + (t3o - t3i) + (t4o - t4i));
	$('#hack-total').remove();
	$('.sixteen.columns.alpha:last').prepend('<div id="hack-total"><label>Total</label><span>' + total.getUTCHours() + ':' + total.getUTCMinutes() + '</span></div>');
}

function gf(i) {
	let f = $('[name="ctl00$cphPrincipal$txt' + i + 'Time"]');
	f.off('change').on('change', totalize);
	return parseTime(f.val());
}

function parseTime(ts) {
	var empty = new Date(1970, 0, 1, 0, 0, 0, 0);
	if (!ts) return empty;

	var t = ts.match(/(\d+)(:(\d\d))?\s*(p?)/i);
	if (t == null) return empty;

	var h = parseInt(t[1], 10);
	if (!(h == 12 && !t[4])) {
		h += (h < 12 && t[4]) ? 12 : 0;
	}
	var d = new Date();
	d.setHours(h);
	d.setMinutes(parseInt(t[3], 10) || 0);
	d.setSeconds(0, 0);
	return d;
}

totalize();