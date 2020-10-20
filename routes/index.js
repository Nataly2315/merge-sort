var express = require('express');
var router = express.Router();

function sort(array, key) {

    let middle = array.length / 2;
    if (array.length < 2) {
        return array;
    }
    let part = array.splice(0, middle);

    return merge(sort(part, key), sort(array, key));

    function merge(part1, part2) {
        let array = [];

        while (part1.length && part2.length) {
            if (typeof part1[0][key] === 'string') {

                let reA = /[^a-zA-Z]/g;
                let reN = /[^0-9]/g;

                let alfabetic_part1 = part1[0][key].replace(reA, "");
                let alfabetic_part2 = part2[0][key].replace(reA, "");
                if (alfabetic_part1 === alfabetic_part2) {
                    let number_part1 = parseInt(part1[0][key].replace(reN, ""), 10);
                    let number_part2 = parseInt(part2[0][key].replace(reN, ""), 10);
                    if (number_part1 > number_part2) {
                        array.push(part2.shift());
                    } else {
                        array.push(part1.shift());
                    }

                } else if (alfabetic_part1 < alfabetic_part2) {
                    array.push(part1.shift())
                } else {
                    array.push(part2.shift())
                }

            } else {
                if (part1[0][key] < part2[0][key]) {
                    array.push(part2.shift());
                } else {
                    array.push(part1.shift());
                }
            }
        }

        return [...array, ...part1, ...part2]
    };
}


router.post('/', function (req, res, next) {
    let {data, condition} = req.body

    data = data.filter(a => {
        for (let i in condition.include) {
            for (let [key, value] of Object.entries(condition.include[i])) {
                if (a.hasOwnProperty(key) && a[key] === value) return true;
            }
        }
    });

    let r = sort(data, condition.sort_by[0]);

    res.send(r);
});

module.exports = router;


