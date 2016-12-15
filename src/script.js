var HOURS_TO_MILLI = 1000 * 60 * 60;
var WORKING_HOURS_LIMIT = 6;
var WORKING_MILLI_LIMIT = HOURS_TO_MILLI * WORKING_HOURS_LIMIT;
var LUNCH_HOURS_LIMIT = 1;
var LUNCH_MILLI_LIMIT = HOURS_TO_MILLI * LUNCH_HOURS_LIMIT;
var TOTAL_HOURS_LIMIT = 10;
var TOTAL_MILLI_LIMIT = HOURS_TO_MILLI * TOTAL_HOURS_LIMIT;
var timePadFormat = '00';

class WorkDay {
    constructor(workTurns) {
        this.workTurns = workTurns;
    }

    total() {
        return new Date(this.workTurns.map(this.duration).reduce(this.sum));
    }

    duration(workTurn) {
        return workTurn.duration();
    }

    sum(previous, next) {
        return previous + next;
    }
}

class WorkTurn {
    constructor(inTime, outTime) {
        this.inTime = inTime;
        this.outTime = outTime;
    }

    duration() {
        return this.outTime - this.inTime;
    }
}

class Validation {
    constructor(workDay) {
        this.workDay = workDay;
    }

    validate() {
        return {
            valid: true,
            message: 'fail'
        };
    }
}

class Validator {
    constructor(validations) {
        this.validations = validations;
        this.validationsResults = [];
        this.$errorContainer = $('#ctl00_cphPrincipal_ValidationSummary');
    }

    validate() {
        this.validations.forEach(validation => this.validationsResults.push(validation.validate()));
        return this;
    }

    errors() {
        return this.validationsResults.filter(result => result.valid === false);
    }

    show() {
        this.$errorContainer.html('');
        this.errors().forEach(error => this.$errorContainer.append(`<div>${error.message}!</div>`));
        this.$errorContainer.show();
    }
}

class TimeField {
    constructor(identifier) {
        this.helper = new TimeHelper();
        this.$field = $(`[name="ctl00$cphPrincipal$txt${identifier}Time"]`);
        this.watch();
    }

    getTime() {
        return this.helper.parseTime(this.$field.val());
    }

    watch() {
        this.$field.off('change').on('change', totalize);
    }
}

class TimeHelper {
    format(date) {
        return this.lpad(d.getUTCHours()) + ':' + this.lpad(d.getUTCMinutes());
    }

    lpad(number) {
        let text = number.toString();
        return this.getTimePadFormat().substring(0, this.getTimePadFormat().length - text.length) + text;
    }

    hoursToMilliseconds(hours) {
        return hours * this.getHoursToMillisecondsFactor();
    }

    getTimePadFormat() {
        return '00';
    }

    getHoursToMillisecondsFactor() {
        return 1000 * 60 * 60;
    }

    parseTime(timeString) {
        if (!timeString) return this.empty();

        let time = timeString.match(/(\d{1,2}):(\d{1,2})/i);
        if (time == null) return this.empty();

        let date = new Date();
        date.setHours(parseInt(time[1], 10));
        date.setMinutes(parseInt(time[2], 10));
        date.setSeconds(0, 0);
        return date;
    }

    empty() {
        return new Date(1970, 0, 1, 0, 0, 0, 0);
    }
}

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
    chktotal(total);
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

function chktotal(t) {
    if (t > TOTAL_MILLI_LIMIT) {
        error('A jornada de trabalho diária deve ser menor ou igual a ' + TOTAL_HOURS_LIMIT + ' horas (' + format(new Date(t)) + ')');
    }
}

function error(message) {
    $('#ctl00_cphPrincipal_ValidationSummary').append('<div>' + message + '!</div>');
}

function format(d) {
    return lpad(d.getUTCHours()) + ':' + lpad(d.getUTCMinutes());
}

function lpad(v) {
    let s = v.toString();
    return timePadFormat.substring(0, timePadFormat.length - s.length) + s;
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