class ValidationRule {
    constructor(params) {
        this.hoursLimit = params.limitInHours;
        this.millisecondsLimit = new TimeHelper().hoursToMilliseconds(params.limitInHours);
    }

    clear() {
        this.errors = [];
    }

    valid() {
        return [{ valid: true }];
    }

    invalid(message, current) {
        this.errors.push({
            valid: false,
            message: message.concat(`! (${this.format(current)})`)
        });

        return this.errors;
    }

    format(milliseconds) {
        return new TimeHelper().format(new Date(milliseconds));
    }
}

class MinLunchIntervalValidationRule extends ValidationRule {
    validate(workDay) {
        this.clear();
        let lunchInterval = this.getLunchInterval(workDay);
        if (lunchInterval && lunchInterval < this.millisecondsLimit) {
            return this.invalid(`O intervalo de almoço deve ser maior ou igual a ${this.hoursLimit} hora`, lunchInterval);
        } else {
            return this.valid();
        }
    }

    getLunchInterval(workDay) {
        return workDay.lunch ? workDay.workTurns[1].inTime - workDay.workTurns[0].outTime : null;
    }
}

class MaxWorkTurnDurationValidationRule extends ValidationRule {
    validate(workDay) {
        this.clear();
        workDay.workTurns.forEach((turn, index) => {
            if (turn.duration() > this.millisecondsLimit) {
                this.invalid(`O turno ${index + 1} deve ser menor ou igual a ${this.hoursLimit} horas`, turn.duration());
            }
        });

        if (this.errors) {
            return this.errors;
        } else {
            return this.valid();
        }
    }
}

class MaxWorkDayDurationValidationRule extends ValidationRule {
    validate(workDay) {
        this.clear();
        let total = workDay.total();
        if (total > this.millisecondsLimit) {
            return this.invalid(`A jornada de trabalho diária deve ser menor ou igual a ${this.hoursLimit} horas`, total);
        } else {
            return this.valid();
        }
    }
}

class Validator {
    constructor(rules) {
        this.rules = rules;
        this.$errorContainer = $('#ctl00_cphPrincipal_ValidationSummary');
    }

    validate(workDay) {
        this.clear();
        this.rules.forEach(rule => this.validationsResults = this.validationsResults.concat(rule.validate(workDay)));
        return this;
    }

    clear() {
        this.validationsResults = [];
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