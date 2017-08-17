import * as THREE from 'three';

export function convertToPairs(source) {
    const pairs = [];
    for (let i=0; i < source.array.length; i += source.itemSize) {
        const pair = [];
        for (let j=0; j < source.itemSize; ++j) {
            pair.push(source.array[i + j]);
        }
        pairs.push(pair);
    }
    return pairs;
}

export function geometryFromBufferGeometry(geometry) {
    const scope = new THREE.Geometry();

    const indices = geometry.index !== null ? geometry.index.array : undefined;
    const attributes = geometry.attributes;
    const tempNormals = [];
    const tempUVs = [];
    const tempUVs2 = [];

    convertToPairs(attributes.position).forEach(pair => {
        scope.vertices.push(new THREE.Vector3(pair[0], pair[1], pair[3] || 0));
    });

    if (attributes.normals !== undefined) {
        convertToPairs(attributes.normals).forEach(pair => {
            tempNormals.push(new THREE.Vector3(pair[0], pair[1], pair[3]));
        });
    }

    if (attributes.colors !== undefined) {
        convertToPairs(attributes.colors).forEach(pair => {
            scope.colors.push(new THREE.Color(pair[0], pair[1], pair[3]));
        });
    }

    if (attributes.uv !== undefined) {
        convertToPairs(attributes.uv).forEach(pair => {
            tempUVs.push(new THREE.Vector2(pair[0], pair[1]));
        });
    }

    if (attributes.uv2 !== undefined) {
        scope.faceVertexUvs[ 1 ] = [];
        convertToPairs(attributes.uv2).forEach(pair => {
            tempUVs2.push(new THREE.Vector2(pair[0], pair[1]));
        });
    }

    function addFace(a, b, c, materialIndex) {
        const vertexNormals = attributes.normals !== undefined ? [ tempNormals[ a ].clone(), tempNormals[ b ].clone(), tempNormals[ c ].clone() ] : [];
        const vertexColors = attributes.colors !== undefined ? [ scope.colors[ a ].clone(), scope.colors[ b ].clone(), scope.colors[ c ].clone() ] : [];
        const face = new THREE.Face3(a, b, c, vertexNormals, vertexColors, materialIndex);

        scope.faces.push(face);
        if (attributes.uv !== undefined) {
            scope.faceVertexUvs[ 0 ].push( [ tempUVs[ a ].clone(), tempUVs[ b ].clone(), tempUVs[ c ].clone() ] );
        }

        if (attributes.uv2 !== undefined) {
            scope.faceVertexUvs[ 1 ].push( [ tempUVs2[ a ].clone(), tempUVs2[ b ].clone(), tempUVs2[ c ].clone() ] );
        }
    }

    const groups = geometry.groups;
    if (groups.length > 0) {
        for (let i = 0; i < groups.length; i ++ ) {
            const group = groups[ i ];
            const start = group.start;
            const count = group.count;

            for (let j = start, jl = start + count; j < jl; j += 3 ) {
                if (indices !== undefined) {
                    addFace( indices[ j ], indices[ j + 1 ], indices[ j + 2 ], group.materialIndex );
                } else {
                    addFace( j, j + 1, j + 2, group.materialIndex );
                }
            }
        }
    } else {
        if (indices !== undefined) {
            for (let i = 0; i < indices.length; i += 3 ) {
                addFace( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );
            }
        } else {
            for (let i = 0; i < attributes.positions.array.length / 3; i += 3 ) {
                addFace( i, i + 1, i + 2 );
            }
        }
    }

    scope.computeFaceNormals();

    if ( geometry.boundingBox !== null ) {
        scope.boundingBox = geometry.boundingBox.clone();
    }

    if ( geometry.boundingSphere !== null ) {
        scope.boundingSphere = geometry.boundingSphere.clone();
    }

    return scope;    
}

export function convertToGeometry(geometry) {
    if (geometry.isBufferGeometry) {
        return geometryFromBufferGeometry(geometry);
    }
    return geometry;
}

export function convertToBufferGeometry(geometry) {
    if (geometry.isGeometry) {
        return new THREE.BufferGeometry().fromGeometry(geometry);
    }
    return geometry;
}