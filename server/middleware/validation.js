
export function validatePassword(password) {
    var p = password;
    var errors = [];
    if (p.length < 8) {
        errors.push("Your password must be at least 8 characters"); 
    }
    if (!(/[a-z]/i).test(p)) {
        errors.push("Your password must contain at least one letter.");
    }
    if (!(/[0-9]/).test(p)) {
        errors.push("Your password must contain at least one digit."); 
    }
    if (errors.length > 0) {
        return errors.join("\n");
    }
    return "";
}