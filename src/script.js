var HOURS_TO_MILLI = 1000 * 60 * 60;
var WORKING_HOURS_LIMIT = 6;
var WORKING_MILLI_LIMIT = HOURS_TO_MILLI * WORKING_HOURS_LIMIT;
var LUNCH_HOURS_LIMIT = 1;
var LUNCH_MILLI_LIMIT = HOURS_TO_MILLI * LUNCH_HOURS_LIMIT;

function totalize() {
    var t1i = gf('FirstIn');
    var t1o = gf('FirstOut');
    var t2i = gf('SecondIn');
    var t2o = gf('SecondOut');
    var t3i = gf('ThirdIn');
    var t3o = gf('ThirdOut');
    var t4i = gf('ForthIn');
    var t4o = gf('ForthOut');

    var t1 = t1o - t1i;
    var t2 = t2o - t2i;
    var t3 = t3o - t3i;
    var t4 = t4o - t4i;
    var total = new Date(t1 + t2 + t3 + t4);
    $('#hack-total').remove();
    $('.sixteen.columns.alpha:last').prepend('<div id="hack-total"><label>Total</label><span>' + format(total) + '</span></div>');
    chk(t1, t2, t3, t4);
    lnch(t1o, t2i);
}

function chk(t1, t2, t3, t4) {
    $('#ctl00_cphPrincipal_ValidationSummary').show().html('');
    chkt(t1, '1');
    chkt(t4, '4');
    chkt(t2, '2');
    chkt(t3, '3');
}

function chkt(t, n) {
    if (t > WORKING_MILLI_LIMIT) {
        error('O turno ' + n + ' excede as ' + WORKING_HOURS_LIMIT + ' horas (' + format(new Date(t)) + ')');
    }
}

function lnch(o, i) {
    let diff = i - o;
    if (diff < LUNCH_MILLI_LIMIT) {
        error('O intervalo de almoço deve ser maior ou igual a ' + LUNCH_HOURS_LIMIT + ' hora (' + format(new Date(diff)) + ')');
    }
}

function error(message) {
    $('#ctl00_cphPrincipal_ValidationSummary').append('<div>' + message + '!</div>');
}

function format(d) {
    return '' + d.getUTCHours() + ':' + d.getUTCMinutes();
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