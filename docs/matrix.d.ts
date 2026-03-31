import Float32Array from '@stdlib/array/float32';
import { ndarray } from '@stdlib/types/ndarray';
declare function create_frustum(r: number, l: number, t: number, b: number, n: number, f: number): ndarray;
declare function create_scale(x: number, y: number, z: number): ndarray;
declare function create_rotate(by: 'x' | 'y' | 'z', t: number): ndarray;
declare function create_translate(x: number, y: number, z: number): ndarray;
declare function multiply(A: ndarray, B: ndarray): ndarray;
declare function serialize(A: ndarray, order: 'row-major' | 'column-major' | 'same' | 'any'): Float32Array;
export { create_frustum, create_scale, create_rotate, create_translate, multiply, serialize };
