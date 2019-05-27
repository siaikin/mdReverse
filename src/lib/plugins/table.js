function TablePlugin(EL_TYPE, TOKEN_RULE) {
    EL_TYPE['td'] = 14;
    EL_TYPE['th'] = 16;
    EL_TYPE['tr'] = 18;
    EL_TYPE['table'] = 34;
    EL_TYPE['thead'] = 36;
    EL_TYPE['tbody'] = 38;

    TOKEN_RULE[EL_TYPE['td']] = {
        filterRule: [],
        convertRule: function (node) {
            return ' ';
        },
        endRule: function (node) {
            return ` |`;
        }
    };
    TOKEN_RULE[EL_TYPE['th']] = TOKEN_RULE[EL_TYPE['td']];
    TOKEN_RULE[EL_TYPE['tr']] = {
        filterRule: [],
        convertRule: function (node) {
            return ' ';
        },
        endRule: function (node) {
            return '\n';
        }
    };
    TOKEN_RULE[EL_TYPE['table']] = TOKEN_RULE[EL_TYPE['tr']];
    TOKEN_RULE[EL_TYPE['thead']] = {
        filterRule: [],
        convertRule: function (node) {
            return '';
        },
        endRule: function (node) {
            return `| ------ | ------ |`;
        }
    };
    TOKEN_RULE[EL_TYPE['tbody']] = TOKEN_RULE[EL_TYPE['tr']];
}

export {
    TablePlugin
}
