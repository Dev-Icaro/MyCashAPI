function formatMySqlDateTime(date) {
   return date.toISOString().slice(0, 19).replace('T', ' ');
}

module.exports = { formatMySqlDateTime }