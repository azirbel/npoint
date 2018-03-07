import _ from "lodash";

const MATCH_UNEXPECTED_TOKEN = /^Unexpected token (.*) in JSON at position (.*)$/;
const MATCH_MISC_AT_POSITION = /^(.*) in JSON at position (.*)$/;
const MATCH_EVAL_UNEXPECTED_TOKEN = /^Unexpected token (.*)$/;
const MATCH_EVAL_UNDEFINED = /^(.*) is not defined$/;

let getLineAndColumn = (jsonStr, position) => {
  let partialJsonStr = jsonStr.slice(0, position);
  // Split into newlines, preserving character count
  let partialLines = partialJsonStr.split("\n").map(line => line.concat(" "));
  return {
    line: partialLines.length,
    column: _.last(partialLines).length
  };
};

export function readableParseError(jsonStr, e) {
  if (e.name !== "SyntaxError") {
    return e.message;
  }

  let match_token = e.message.match(MATCH_UNEXPECTED_TOKEN);
  if (match_token) {
    let badToken = match_token[1];
    let badPosition = match_token[2];
    let { line, column } = getLineAndColumn(jsonStr, badPosition);
    return `Unexpected token "${badToken}" on line ${line}, column ${column}`;
  }

  let match_newline = e.message
    .replace("\n", "N")
    .match(MATCH_UNEXPECTED_TOKEN);
  if (match_newline) {
    let badPosition = match_newline[1];
    let { line, column } = getLineAndColumn(jsonStr, badPosition);
    return `Unexpected newline on line ${line}, column ${column}`;
  }

  let match_misc = e.message.match(MATCH_MISC_AT_POSITION);
  if (match_misc) {
    let message = match_misc[1];
    let badPosition = match_misc[2];
    let { line, column } = getLineAndColumn(jsonStr, badPosition);
    return `${message} on line ${line}, column ${column}`;
  }

  return e.message;
}

export function readableEvalError(evalErrorMessage) {
  let match_token = evalErrorMessage.match(MATCH_EVAL_UNEXPECTED_TOKEN);
  if (match_token) {
    let badToken = match_token[1];
    return `Unexpected token "${badToken}"`;
  }

  let match_undefined = evalErrorMessage.match(MATCH_EVAL_UNDEFINED);
  if (match_undefined) {
    let badToken = match_undefined[1];
    return `"${badToken}" is not defined`;
  }

  return evalErrorMessage;
}
