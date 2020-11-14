import isNil from 'lodash/isNil';


//
// LOCALE / TIMEZONE
//

const LOCALE = 'ru';
const TIMEZONE = 'UTC';


//
// formats / raw formatters
//

const STRING_FORMAT = 'string';
const TEXT_FORMAT = 'text';
const MULTIPICKLIST_FORMAT = 'multipicklist';

const NUMBER_FORMAT = 'number';
const NUMBER_FORMATTER = new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
    style: 'decimal'
});

const CURRENCY_FORMAT = 'currency';
const CURRENCY_FORMATTER = new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'currency',
    currencyDisplay: 'symbol',
    currency: 'USD'
});

const PERCENT_FORMAT = 'percent';
const PERCENT_FORMATTER = new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    style: 'percent'
});

const DATE_FORMAT = 'date';
const DATE_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
});

const DATETIME_FORMAT = 'datetime';
const DATETIME_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
});

const TIME_FORMAT = 'time';
const TIME_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
});

const SECOND_FORMAT = 'second';
const SECOND_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
});

const MINUTE_FORMAT = 'minute';
const MINUTE_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: '2-digit'
});

const HOUR_FORMAT = 'hour';
const HOUR_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    hour: 'numeric'
});

const DAY_FORMAT = 'day';
const DAY_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    day: 'numeric',
    month: 'short'
});

const MONTH_FORMAT = 'month';
const MONTH_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    month: 'short',
    year: 'numeric'
});

const YEAR_FORMAT = 'year';
const YEAR_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    year: 'numeric'
});


// formatters map

const formatters = {
    [STRING_FORMAT]: v => String(v).trim(),
    [TEXT_FORMAT]: v => String(v).trim(),
    [MULTIPICKLIST_FORMAT]: v => String(v).trim().split(';').join(', '),

    [NUMBER_FORMAT]: v => NUMBER_FORMATTER.format(parseFloat(v) || 0),
    [CURRENCY_FORMAT]: v => CURRENCY_FORMATTER.format(parseFloat(v) || 0),
    [PERCENT_FORMAT]: v => PERCENT_FORMATTER.format(parseFloat(v) || 0),

    [DATE_FORMAT]: v => DATE_FORMATTER.format(new Date(v)),
    [DATETIME_FORMAT]: v => DATETIME_FORMATTER.format(new Date(v)).replace(', ', ' @ '),
    [TIME_FORMAT]: v => '@ '+ TIME_FORMATTER.format(new Date(v)),

    [SECOND_FORMAT]: v => SECOND_FORMATTER.format(new Date(v)),
    [MINUTE_FORMAT]: v => MINUTE_FORMATTER.format(new Date(v)),
    [HOUR_FORMAT]: v => HOUR_FORMATTER.format(new Date(v)),
    [DAY_FORMAT]: v => DAY_FORMATTER.format(new Date(v)),
    [MONTH_FORMAT]: v => MONTH_FORMATTER.format(new Date(v)),
    [YEAR_FORMAT]: v => YEAR_FORMATTER.format(new Date(v))
}


//
// format() method
//

const format = (formatName, v) => (isNil(v) ? '' : (!formatters[formatName] ? v : formatters[formatName](v)));


export {
    STRING_FORMAT,
    TEXT_FORMAT,
    MULTIPICKLIST_FORMAT,
    NUMBER_FORMAT,
    CURRENCY_FORMAT,
    PERCENT_FORMAT,
    DATE_FORMAT,
    DATETIME_FORMAT,
    TIME_FORMAT,
    SECOND_FORMAT,
    MINUTE_FORMAT,
    HOUR_FORMAT,
    DAY_FORMAT,
    MONTH_FORMAT,
    YEAR_FORMAT,

    format
}