// function that checks for required fields
function checkForRequiredFields (requiredFields, req) {

  // loop through fields
  for (let i=0; i<requiredFields.length; i++) {

    // isolate field
    const field = requiredFields[i];

    // if field not found in request
    if (!(field in req.body)) {

      // return name of missing field
      return `Missing \`${field}\` in request body`;

    }

  }

  // if here, then all fields passed in
  return 'success';

}

// function that makes sure id in params and body match
function idsCheck (paramId, bodyId) {

  // if they don't match
  if (paramId !== bodyId) {
    return `Request path id (${paramId}) and request body id (${bodyId}) must match`;
  }

  // they do match
  return 'success';

}

module.exports = {checkForRequiredFields, idsCheck}
