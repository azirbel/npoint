export const LOG_IN = "LOG_IN";
export const LOG_OUT = "LOG_OUT";

export function logIn(user) {
  return {
    type: LOG_IN,
    user
  };
}

export function logOut() {
  return {
    type: LOG_OUT
  };
}
