const PI2 = Math.PI * 2;
const PISCALE = Math.PI * 0.58;

class Projection {

    plane(scale) {
        return (x, y, z) => {
            const _x = x * scale,
                _y = y * scale,
                _z = z * scale;
            return [ _x, _y, _z ];
        };
    }

    column(radius, scale) {
        const range = radius * Math.PI;
        return (x, y, z) => {
            x *= scale;
            y *= scale;
            const r = x / range;
            x = r * PI2;
            y = y * PISCALE;
            const _radius = radius + z,
                _x = Math.sin(x) * _radius,
                _y = y,
                _z = Math.cos(x) * _radius;
            return [ _x, _y, _z ];
        };
    }

    sphere(radius, scale) {
        const start = Math.PI * 0.5;
        const range = radius * Math.PI;
        return (x, y, z) => {
            x *= scale;
            y *= scale;
            x = (x / range) * PI2 * scale;
            y = (y / range) * PI2 * scale;
            const xcos = Math.cos(y),
                xsin = Math.sin(y),
                ycos = Math.cos(x + start),
                ysin = Math.sin(x + start),
                height = z + radius,
                _x = -height * xcos * ycos,
                _y = height * xsin,
                _z = height * xcos * ysin;
            return [ _x, _y, _z ];
        };
    }

}

export default new Projection();
