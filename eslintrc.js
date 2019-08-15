module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
    },
    // add your custom rules here
    'rules': {
        // allow debugger during development
        // 在开发过程中允许debugger
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    }
}
