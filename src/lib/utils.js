module.exports = {
    date(timestamp) {

        const date = new Date(timestamp);

        const year = date.getFullYear();
        const month = date.getMonth();
        const day = `0${date.getDate()}`.slice(-2);

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
        }
    }
}