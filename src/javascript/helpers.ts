import { BinaryExpression, Expression, GroupingExpression } from "./expression";
import { Location } from "./location";
import { Statement } from "./statement";
import { JSObject } from "./jsObjects";

export function formatJSObject(value?: any): string {
  if (value === undefined) {
    return "";
  }

  if (value instanceof JSObject) {
    return value.toString();
  }

  return JSON.stringify(value);
}

export function codeTag(code: string | JSObject, location: Location): string {
  let parsedCode: string;
  if (code instanceof JSObject) {
    parsedCode = code.toString();
  } else {
    parsedCode = code;
  }

  const from = location.absolute.begin;
  const to = location.absolute.end;
  return `<code data-hl-from="${from}" data-hl-to="${to}">${parsedCode}</code>`;
}
