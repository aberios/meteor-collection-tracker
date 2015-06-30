String.prototype.scan = function (re) {
    if (!re.global) throw "ducks";
    var s = this;
    var m, r = [];
    while (m = re.exec(s)) {
        m.shift();
        r.push(m);
    }
    return r;
};
