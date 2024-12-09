// JSON format for programs

// 8 keywords: "$func","$skip","$val","$expr","$op","$attr","$attr_set","$call"

globalThis.$expr = function $expr(expr) {
    if (expr[0] != "$expr") {
        console.error("mismatch in $expr :", expr[0])
        return null
    }
    var ip = 1
    var context = globalThis
    var attribute_id = null
    var operation_id = null
    var current_value = null
    while (ip < expr.length) {
        var current = expr[ip]
        var do_operation = false
        var new_value = false
        var previous_value = current_value
        if (current[0] == "$attr") {
            attribute_id = current[1]
            if (typeof context[attribute_id] == "undefined") {
                console.error("undefined context[attribute_id] :", attribute_id)
                return undefined
            }
            current_value = context[attribute_id]
            new_value = true
        } else if (current[0] == "$attr_set") {
            var attr_set = current
            current_value = context[attr_set[1]] = get(attr_set[2])
            new_value = true
        } else if (current[0] == "$op") {
            operation_id = current[1]
        } else if (current[0] == "$val") {
            current_value = current[1]
            new_value = true
        } else if (current[0] == "$expr") {
            current_value = $expr(current)
            new_value = true
        } else if (current[0] == "$call") {
            var arguments = []
            for (var index = 1; index < current.length; index += 1) {
                var argument = current[index]
                arguments.push(get(argument))
            }
            current_value = context(...arguments)
            new_value = true
        } else {
            console.error("unsupported in $expr :", current[0])
            return null
        }
        do_operation = new_value && operation_id != null
        if (do_operation) {
            if (operation_id == "+") {
                current_value = previous_value + current_value
            } else if (operation_id == "-") {
                current_value = previous_value - current_value
            } else if (operation_id == "*") {
                current_value = previous_value * current_value
            } else if (operation_id == "/") {
                current_value = previous_value / current_value
            } else if (operation_id == "**") {
                current_value = previous_value ** current_value
            } else {
                console.error("unsupported operation_id :", operation_id)
            }
            operation_id = null
        }

        context = current_value

        ip += 1
    }
    return current_value
}

globalThis.$attr_set = function $attr_set(attr_set) {
    return globalThis[attr_set[1]] = get(attr_set[2])
}

globalThis.$val = function $val(val) {
    return val[1]
}

globalThis.$attr = function $attr(attr) {
    var context = globalThis
    var result
    for (var index = 1; index < attr.length; index += 1) {
        var attribute_id = attr[index]

        if (typeof context[attribute_id] == "undefined") {
            console.error("undefined context[attribute_id] :", attribute_id)
            return undefined
        }
        result = context[attribute_id]

        context = result
    }
    return result
}

function get(json) {
    if (typeof globalThis[json[0]] == "function") {
        return globalThis[json[0]](json)
    } else {
        console.error("no function found for get() :", json[0])
        return null
    }
}
