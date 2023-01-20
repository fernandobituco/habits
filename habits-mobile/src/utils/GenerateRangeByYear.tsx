import dayjs from "dayjs";

export function generateRange() {
    const yearStart = dayjs().startOf('year')
    const today = new Date()
    const minimum = 20*7

    const dates = []

    let compareDate = yearStart

    while (compareDate.isBefore(today)) {
        dates.push({"date": compareDate.toDate(), "past": true})
        compareDate = compareDate.add(1, 'day')
    }

    while (dates.length < minimum) {
        dates.push({"date": compareDate.toDate(), "past": false})
        compareDate = compareDate.add(1, 'day')
    }

    return dates
}