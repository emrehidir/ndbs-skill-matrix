using TIMEZONES from './value-help-list';
entity Countries {
    key code     : String(2);
        name     : String(80);
        timezone : TIMEZONES:TIMEZONE_NAME;
};