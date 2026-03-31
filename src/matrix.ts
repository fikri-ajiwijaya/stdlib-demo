import Float32Array from '@stdlib/array/float32'
import sgemm from '@stdlib/blas/base/sgemm'
import array from '@stdlib/ndarray/array'
import dataBuffer from '@stdlib/ndarray/data-buffer'
import flatten from '@stdlib/ndarray-flatten'
import zeros from '@stdlib/ndarray/zeros'
import { ndarray } from '@stdlib/types/ndarray'

function create_frustum(
	r : number, l : number,
	t : number, b : number,
	n : number, f : number
)
: ndarray
{
	return array(new Float32Array([
		2*n/(r-l),         0, (r+l)/(r-l),           0,
		        0, 2*n/(t-b), (t+b)/(t-b),           0,
		        0,         0, (f+n)/(n-f), 2*f*n/(n-f),
		        0,         0,          -1,           0
	]), {
		'dtype' : 'float32',
		'shape' : [4, 4]
	})
}

function create_scale(
	x : number, y : number, z : number
)
: ndarray
{
	return array(new Float32Array([
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1
	]), {
		'dtype' : 'float32',
		'shape' : [4, 4]
	})
}

function create_translate(
	x : number, y : number, z : number
)
: ndarray
{
	return array(new Float32Array([
		1, 0, 0, x,
		0, 1, 0, y,
		0, 0, 1, z,
		0, 0, 0, 1
	]), {
		'dtype' : 'float32',
		'shape' : [4, 4]
	})
}

function multiply(
	A : ndarray, B : ndarray
)
: ndarray
{
	if (A.ndims !== 2 || B.ndims !== 2)
		throw new Error('Inputs must be 2D matrices')

	const [m, r_1] = A.shape as [number, number]
	const [r_2, n] = B.shape as [number, number]

	if (r_1 !== r_2)
		throw new Error('Incompatible dimensions')

	const r = r_1
	const C = zeros([m, n], {'dtype' : 'float32'})

	const bufA = dataBuffer(A) as Float32Array
	const bufB = dataBuffer(B) as Float32Array
	const bufC = dataBuffer(C) as Float32Array

	const stA = A.strides as [number, number]
	const stB = B.strides as [number, number]
	const stC = C.strides as [number, number]

	sgemm.ndarray(
		'no-transpose', 'no-transpose',
		m, n, r,
		1.0,
		bufA, stA[0], stA[1], A.offset,
		bufB, stB[0], stB[1], B.offset,
		0.0,
		bufC, stC[0], stC[1], C.offset
	)

	return C
}

function serialize(
	A : ndarray,
	order : 'row-major' | 'column-major' | 'same' | 'any'
)
: Float32Array
{
	const B = flatten(A, {
		'dtype' : 'float32',
		'order' : order
	})
	const bufB = dataBuffer(B) as unknown as Float32Array
	return bufB
}

export {
	create_frustum,
	create_scale,
	create_translate,
	multiply,
	serialize
}
