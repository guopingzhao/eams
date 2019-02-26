export default function time(date = new Date()) {
    time.Date = new Date(date)
    time.year = time.Date.getFullYear()
    time.month = `${time.Date.getMonth() + 1}`.padStart(2, 0)
    time.date = `${time.Date.getDate()}`.padStart(2, 0)
    time.hours = `${time.Date.getHours()}`.padStart(2, 0)
    time.minutes = `${time.Date.getMinutes()}`.padStart(2, 0)
    time.seconds = `${time.Date.getSeconds()}`.padStart(2, 0)
    return time
}

time.format = function(format) {
    let twelve = `${(this.hours > 12 ? this.hours - 12 : this.hours)}`.padStart(2, 0)
    return format
        .replace(/YYYY/g, this.year)
        .replace(/MM/g, this.month)
        .replace(/DD/g, this.date)
        .replace(/HH/g, this.hours)
        .replace(/hh/g, twelve)
        .replace(/mm/g, this.minutes)
        .replace(/ss/g, this.seconds)
}