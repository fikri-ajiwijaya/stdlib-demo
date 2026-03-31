import Float32Array from '@stdlib/array/float32';
import sgemm from '@stdlib/blas/base/sgemm';
import array from '@stdlib/ndarray/array';
import dataBuffer from '@stdlib/ndarray/data-buffer';
import flatten from '@stdlib/ndarray-flatten';
import zeros from '@stdlib/ndarray/zeros';
function create_frustum(r, l, t, b, n, f) {
    return array(new Float32Array([
        2 * n / (r - l), 0, (r + l) / (r - l), 0,
        0, 2 * n / (t - b), (t + b) / (t - b), 0,
        0, 0, (f + n) / (n - f), 2 * f * n / (n - f),
        0, 0, -1, 0
    ]), {
        'dtype': 'float32',
        'shape': [4, 4]
    });
}
function create_scale(x, y, z) {
    return array(new Float32Array([
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, z, 0,
        0, 0, 0, 1
    ]), {
        'dtype': 'float32',
        'shape': [4, 4]
    });
}
function create_rotate(by, t) {
    const sin_t = Math.sin(t);
    const cos_t = Math.cos(t);
    const buf = (() => {
        switch (by) {
            case 'x': return new Float32Array([
                1, 0, 0, 0,
                0, cos_t, -sin_t, 0,
                0, sin_t, cos_t, 0,
                0, 0, 0, 1
            ]);
            case 'y': return new Float32Array([
                cos_t, 0, sin_t, 0,
                0, 1, 0, 0,
                -sin_t, 0, cos_t, 0,
                0, 0, 0, 1
            ]);
            case 'z': return new Float32Array([
                cos_t, -sin_t, 0, 0,
                sin_t, cos_t, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        }
    })();
    return array(buf, {
        'dtype': 'float32',
        'shape': [4, 4]
    });
}
function create_translate(x, y, z) {
    return array(new Float32Array([
        1, 0, 0, x,
        0, 1, 0, y,
        0, 0, 1, z,
        0, 0, 0, 1
    ]), {
        'dtype': 'float32',
        'shape': [4, 4]
    });
}
function multiply(A, B) {
    if (A.ndims !== 2 || B.ndims !== 2)
        throw new Error('Inputs must be 2D matrices');
    const [m, r_1] = A.shape;
    const [r_2, n] = B.shape;
    if (r_1 !== r_2)
        throw new Error('Incompatible dimensions');
    const r = r_1;
    const C = zeros([m, n], { 'dtype': 'float32' });
    const bufA = dataBuffer(A);
    const bufB = dataBuffer(B);
    const bufC = dataBuffer(C);
    const stA = A.strides;
    const stB = B.strides;
    const stC = C.strides;
    sgemm.ndarray('no-transpose', 'no-transpose', m, n, r, 1.0, bufA, stA[0], stA[1], A.offset, bufB, stB[0], stB[1], B.offset, 0.0, bufC, stC[0], stC[1], C.offset);
    return C;
}
function serialize(A, order) {
    const B = flatten(A, {
        'dtype': 'float32',
        'order': order
    });
    const bufB = dataBuffer(B);
    return bufB;
}
export { create_frustum, create_scale, create_rotate, create_translate, multiply, serialize };
