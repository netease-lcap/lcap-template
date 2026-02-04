import { stringify as json_stringify } from './lib/stringify';
import json_parse from './lib/parse';

export default function (options) {
  return {
    parse: json_parse(options),
    stringify: json_stringify,
  };
}

// create the default method members with no options applied for backwards compatibility
export const parse = json_parse();
export const stringify = json_stringify;
