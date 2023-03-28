
export function validatePassword(pass) {
  try{
    var errors = [];
    if (pass.length < 8) {
        errors.push("Your password must be at least 8 characters"); 
    }
    if (!(/[a-z]/i).test(pass)) {
        errors.push("Your password must contain at least one letter.");
    }
    if (!(/[0-9]/).test(pass)) {
        errors.push("Your password must contain at least one digit."); 
    }
    if (errors.length > 0) {
      return errors.join("<br><br>");
    }
  } catch (err) {
    return "Unknown error validating password!";
  }
  return "";
}
