String.prototype.scan = function (re) {
    if (!re.global) throw "RegExp should be global";
    var s = this;
    var m, r = [];
    while (m = re.exec(s)) {
        m.shift();
        r.push(m);
    }
    return r;
};
