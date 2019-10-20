import {CONSOLE_TYPE} from './lib/config';
import {MdReverse, TablePlugin} from "./lib/mdReverse";

MdReverse.TablePlugin = TablePlugin;

const consolee = window.console;

if (process.env.NODE_ENV === 'development') {
    window.clrConsole = Object.assign(
        {},
        window.console,
        {
        success: function (message) {
            const type = typeof message;
            if (type === 'string' || type === 'number' || type === 'boolean')
                consolee.log('%c' + message, CONSOLE_TYPE.success);
            else consolee.log(message);
        },
        error: function (message) {
            const type = typeof message;
            if (type === 'string' || type === 'number' || type === 'boolean')
                consolee.error('%c' + message, CONSOLE_TYPE.error);
            else consolee.error(message);
        },
        info: function (message) {
            const type = typeof message;
            if (type === 'string' || type === 'number' || type === 'boolean')
                consolee.info('%c' + message, CONSOLE_TYPE.info);
            else consolee.info(message);
        },
        warn: function (message) {
            const type = typeof message;
            if (type === 'string' || type === 'number' || type === 'boolean')
                consolee.warn('%c' + message, CONSOLE_TYPE.warn);
            else consolee.warn(message);
        }
    });
} else if (process.env.NODE_ENV === 'production') {
}

export default MdReverse;
