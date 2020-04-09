/**
 * @param {String} path wasm 文件路径
 * @param {Object} imports 传递到 wasm 代码中的变量
 */
function loadWebAssembly(path, imports = {}) {
    return fetch(path)
        .then((response) => response.arrayBuffer())
        .then((buffer) => WebAssembly.compile(buffer))
        .then((module) => {
            imports.env = imports.env || {};

            // 开辟内存空间
            imports.env.memoryBase = imports.env.memoryBase || 0;
            if (!imports.env.memory) {
                imports.env.memory = new WebAssembly.Memory({ initial: 256 });
            }

            // 创建变量映射表
            imports.env.tableBase = imports.env.tableBase || 0;
            if (!imports.env.table) {
                // 在 MVP 版本中 element 只能是 "anyfunc"
                imports.env.table = new WebAssembly.Table({
                    initial: 0,
                    element: "anyfunc",
                });
            }
            // 创建 WebAssembly 实例
            return new WebAssembly.Instance(module, imports);
        });
}

const addALLJs = (x, y) => {
    let res = 0;
    for (let i = x; i <= y; i++) {
        res += 1;
    }
    return res
};

loadWebAssembly("./math.wasm").then((instance) => {
    document.body.innerHTML=""
    let start;
    let end;
    const max = 2100000000
    const addAll = instance.exports.addAll;
    // const square = instance.exports.square;
    setTimeout(()=>{
        start = window.performance.now();
        const res = addAll(1, max);
        end = window.performance.now();
        document.body.innerHTML += res+"--"+(end-start)+"ms--wasm<br>"
        setTimeout(()=>{
            start = window.performance.now();
            const resJs = addALLJs(1, max);
            end = window.performance.now();
            document.body.innerHTML += resJs+"--"+(end-start)+"ms--js"
        },1000)
    },1000)
});




