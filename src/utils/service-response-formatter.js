function formatInvalidDataResponse(invalidDataMessage, errorsArr) {
   let errorString = errorsArr.join(', ');

   return `${invalidDataMessage}: ${errorString}`;
}

module.exports = { formatInvalidDataResponse };