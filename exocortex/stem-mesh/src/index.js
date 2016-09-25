
import seneca from 'seneca';
import senecaMesh from 'seneca-mesh';

const opts = {
    seneca: {
        tag: process.env.STEM_MESH_TAG || 'stem-mesh',
    },
    mesh: {
        isbase: true,
        host: process.env.STEM_MESH_HOST || '127.0.0.1',
        port: process.env.STEM_MESH_PORT || 39000,
        bases: (process.env.STEM_MESH_BASES || '').split(','),
    }
};

seneca(opts.seneca).use(senecaMesh, opts.mesh);
