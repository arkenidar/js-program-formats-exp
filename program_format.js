// JSON format for programs
// 7 keywords: "$func","$skip","$val","$expr","$op","$attr","$call"

var main = ["$func","main",["arguments"], 

["$skip","console.log('output text', 'another output text')"],
["$expr",["$attr","console"],["$attr","log"],["$call",["$val","output text"],["$val","another output text"]]],

["$skip","document.querySelector('#site-navigation').style.backgroundColor='greenyellow'"],
["$expr",
["$attr","document"],
["$attr","querySelector"],
["$call",["$val","#site-navigation"]],
["$attr","style"],
["$attr","backgroundColor"],
["$op","="],
["$val","greenyellow"]
],

["$skip","y=3*(x-1)"],
["$expr",
    ["$attr","y"],
    ["$op","="],

    ["$expr",
        ["$val",3],
        ["$op","*"],
        ["$expr",
            ["$attr","x"],
            ["$op","-"],
            ["$val",1]
        ]
    ]
],

["$skip","..."],

["$skip",
    "$func","$skip","$val","$expr","$op","$attr","$call"]
]

// 7 keywords: "$func","$skip","$val","$expr","$op","$attr","$call"

var expr1 = ["$expr", // math expression
["$val",3],
["$op","*"],
["$expr",
    ["$attr","x"],
    ["$op","-"],
    ["$val",1]
]
]

var expr2 = ["$expr", // multiple assignment operation
["$attr","y"],
["$op","="],
["$expr",
    ["$attr","x"],
    ["$op","="],
    ["$val",1]
]
]
