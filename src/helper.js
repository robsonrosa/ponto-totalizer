class TimeHelper {
    format(date) {
        return this.lpad(date.getUTCHours()) + ':' + this.lpad(date.getUTCMinutes());
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