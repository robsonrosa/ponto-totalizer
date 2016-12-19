class WorkDay {
    constructor(workTurns) {
        this.workTurns = workTurns;
        this.turns = this.workTurns ? this.workTurns.length : 0;
        this.valid = this.turns > 0;
        this.lunch = this.turns > 1;
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

class TimeField {
    constructor(identifier) {
        this.$field = $(`[name="ctl00$cphPrincipal$txt${identifier}Time"]`);
        this.watch();
    }

    getTime() {
        return new TimeHelper().parseTime(this.$field.val());
    }

    watch(callback) {
        this.$field.off('change').on('change', callback);
    }
}

class Totalizer {
    constructor() {
        this.identifier = '#hack-total';
        this.$container = $('.sixteen.columns.alpha:last');
    }

    show(total) {
        $(this.identifier).remove();
        this.$container.prepend(`<div id="hack-total"><label>Total</label><span>${new TimeHelper().format(total)}</span></div>`);
    }
}

class PontoTotalizerPlus {
    constructor(params) {
        this.loadFields(params.fields);
        this.loadValidation(params.rules);
        this.totalizer = new Totalizer();
    }

    loadValidation(rules) {
        this.validator = new Validator(rules);
    }

    loadFields(identifiers) {
        this.fields = [];
        identifiers.forEach(identifier => {
            this.fields.push(new TimeField(identifier));
        });
    }

    start() {
        this.fields.forEach(field => field.watch(() => this.calc()));
        this.calc();
    }

    calc() {
        let workDay = this.getWorkDay();
        this.totalizer.show(workDay.total());
        this.validator.validate(workDay).show();
    }

    getWorkDay() {
        let turns = [];

        for (let i = 0; i < this.fields.length; i += 2) {
            turns.push(new WorkTurn(this.fields[i].getTime(), this.fields[i + 1].getTime()));
        }

        return new WorkDay(turns);
    }
}