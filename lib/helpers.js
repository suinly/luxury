exports.compare = function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    operator = options.hash.operator || "==";

    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    }

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}

exports.format = function(context) {
    var date = new Date(parseInt(context) * 1000);
    var days = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    var horse = date.getHours() + 1 < 10 ? '0' + (date.getHours() + 1) : (date.getHours() + 1);
    var minutes = date.getMinutes() + 1 < 10 ? '0' + (date.getMinutes() + 1) : (date.getMinutes() + 1);

    return  days + '.' + month + '.' + date.getFullYear() + ' ' + horse + ':' + minutes;
}