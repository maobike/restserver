const { response } = require("express")


const validarArchivoSubir = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            "errors": [
                {
                    "value": `file`,
                    "msg": "El archivo es requerido",
                    "param": "archivo",
                    "location": "Body form-data"
                }
            ]
        });
    }
    next();
}

module.exports = {
    validarArchivoSubir
}