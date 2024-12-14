const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore();

const registrarCompra = async (req, res) => {
  const { usuarioId, productos, total } = req.body;

  const compraKey = datastore.key('Compra');
  const nuevaCompra = {
    usuarioId,
    productos,
    total,
    fecha: new Date().toISOString()
  };

  await datastore.save({
    key: compraKey,
    data: nuevaCompra
  });

  const usuarioKey = datastore.key(['Usuario', usuarioId]);
  const [usuario] = await datastore.get(usuarioKey);

  if (usuario) {
    const historialActualizado = usuario.historialDeCompras || [];
    historialActualizado.push(compraKey);

    await datastore.update({
      key: usuarioKey,
      data: {
        ...usuario,
        historialDeCompras: historialActualizado
      }
    });
  }

  res.json({
    ok: true,
    msg: 'Compra registrada exitosamente'
  });
};

module.exports = { registrarCompra };
