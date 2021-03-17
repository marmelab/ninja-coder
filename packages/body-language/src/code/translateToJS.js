import {
    KEYWORD_CONSOLE,
    KEYWORD_LOG,
    SYNTAX_DOT,
    SYNTAX_LEFT_BRACKET,
    SYNTAX_RIGHT_BRACKET,
    SYNTAX_SEMICOLON,
    SYNTAX_STRING,
    TEXT_COUCOU,
} from './symbolsJS';

export function translateOneIntruction(instruction) {
    switch (instruction) {
        // Keywords
        case KEYWORD_CONSOLE:
            return 'console';
        case KEYWORD_LOG:
            return 'log';

        // Syntax
        case SYNTAX_DOT:
            return '.';
        case SYNTAX_LEFT_BRACKET:
            return '(';
        case SYNTAX_RIGHT_BRACKET:
            return ')';
        case SYNTAX_STRING:
            return "'";
        case SYNTAX_SEMICOLON:
            return ';';

        // Text
        case TEXT_COUCOU:
            return 'Hello World!';

        // Ignore errors
        default:
            return '';
    }
}

export function translate(instructions) {
    return instructions.reduce((code, instruction) => {
        return code.concat(translateOneIntruction(instruction));
    }, '');
}
