function validate(user, NAME_LENGTH) {
  //Check that username is present
  let error = "";

  if (user.name.trim() === "") {
    error = "Name is a required field";
    return error;
  }

  if (user.name.trim().length > NAME_LENGTH) {
    error = "User names cannot exceed " + NAME_LENGTH + " characters";
    return error;
  }

  //Check that email is present
  if (!user.email) {
    error = "Email is a required field";
    return error;
  }

  //Check for valid email
  //(email regex sourced from week03 lectorial example 8)
  if (!/\S+@\S+\.\S+/.test(user.email)) {
    error = "Email is invalid";
    return error;
  }

  //Check that password is present
  if (!user.password) {
    error = "Password is a required field";
    return error;
  }

  //Check for strong password:
  //Requirements: at least 8 characters, and at least
  //one letter, number and symbol
  if (
    !/(?=.*[!@#$%^&*-])(?=.*[0-9])(?=.*[a-zA-Z])(?=.{8,})/.test(user.password)
  ) {
    error =
      "Password must be at least 8 characters long and contain at least one letter, number, and symbol (!, @, #. $, %, ^, &, *, -)";
    return error;
  }
  return error;
}
export { validate };
