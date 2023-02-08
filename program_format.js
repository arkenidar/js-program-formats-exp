// JSON format for programs

// *** FUTURE ***

///var main = ["$func","main",["arguments"], 

//["$skip","console.log('output text', 'another output text')"],
//["$expr",["$attr","console"],["$attr","log"],["$call",["$val","output text"],["$val","another output text"]]],

//["$skip","document.querySelector('#site-navigation').style.backgroundColor='greenyellow'"],
/*
["$expr",
["$attr","document"],
["$attr","querySelector"],
["$call",["$val","#site-navigation"]],
["$attr","style"],
["$attr_set","backgroundColor"],
["$op","="],
["$val","greenyellow"]
],
*/

// *** CURRENT

// 8 keywords: "$func","$skip","$val","$expr","$op","$attr","attr_set","$call"

globalThis. $expr = function $expr(expr){
    if(expr[0]!="$expr"){
        console.error("mismatch in $expr :",expr[0])
        return null
    }
    var ip = 1
    var context = globalThis // TO-DO
    var attribute_id = null // $attr
    var operation_id = null // $op
    var current_value = null
    while(ip < expr.length){
        var current = expr[ip]
        var do_operation = false
        var new_value = false
        var previous_value = current_value
        if(current[0]=="$attr"){
            attribute_id = current[1]
            if(typeof context[attribute_id]=="undefined"){
                console.error("undefined context[attribute_id] :", attribute_id)
                return undefined
            }
            current_value = context[attribute_id]
            new_value = true
        } else if(current[0]=="$op"){
            operation_id = current[1]
        } else if(current[0]=="$val"){
            current_value = current[1]
            new_value = true
        } else if(current[0]=="$expr"){
            current_value = $expr(current)
            new_value = true
        } else {
            console.error("unsupported in $expr :", current[0])
            return null
        }
        do_operation = new_value && operation_id!=null
        if(do_operation){
            if(operation_id=="+"){
                current_value = previous_value + current_value
            } else if(operation_id=="-"){
                current_value = previous_value - current_value
            } else if(operation_id=="*"){
                current_value = previous_value * current_value
            } else if(operation_id=="/"){
                current_value = previous_value / current_value
            } else if(operation_id=="**"){
                current_value = previous_value ** current_value
            } else {
                console.error("unsupported operation_id :", operation_id)
            }
            operation_id = null
        }
        ip += 1
    }
    return current_value
}

globalThis. $attr_set= function $attr_set(attr_set){
    return globalThis[attr_set[1]]=get(attr_set[2])
}

globalThis. $val= function $val(val){
    return val[1]
}

globalThis. $attr= function $attr(attr){
    var context = globalThis // TODO
    var result
    for(var index = 1; index<attr.length; index += 1){
        var attribute_id = attr[index]

        if(typeof context[attribute_id]=="undefined"){
            console.error("undefined context[attribute_id] :", attribute_id)
            return undefined
        }
        result = context[attribute_id]

        context = result
    }
    return result
}

function get(json){
    if(typeof globalThis[json[0]] == "function"){
        return globalThis[json[0]](json)
    } else {
        console.error("no function found for get() :",json[0])
        return null
    }
}

// =============================== TESTS =========================================

// y=x=1
console.log("## multiple assignment ##", get(["$attr_set","y",["$attr_set","x",["$val",1]]]),x,y)

// testing $op & $val
// (2+3)/2
console.log("## multiple ops ##", get(["$expr",["$val",2],["$op","+"],["$val",3],["$op","/"],["$val",2]]))

//["$skip","y=3*(x-2)"],
// y=3*(x-2)
var expr1 =
["$attr_set","y", 
    ["$expr", // math expression
        ["$val",3],
        ["$op","*"],

        ["$expr",
            ["$attr","x"], // variable x
            ["$op","-"],
            ["$val",2]
        ]
    ]
]
console.log("## nested expr ##", get(expr1), y)

// TO-DO, to be completed:

var arguments = [ "## access to attributes ##", true ]
globalThis["console"]["log"] ( ...  arguments)

globalThis.variable1=true
console.log( "get var", get(["$attr","variable1"]) )

globalThis.variable2={ variable3: { variable4: true}}
console.log( "get var, nested 1", get(["$attr","variable2","variable3","variable4"]) )

get( ["$attr","console","log"] ) ( ...  arguments)
