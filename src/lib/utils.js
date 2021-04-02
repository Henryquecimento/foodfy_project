module.exports = {
    date(timestamp) {

        const date = new Date(timestamp);

        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = `0${date.getUTCDate()}`.slice(-2);

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
        }
    }
}