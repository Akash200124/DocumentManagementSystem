import multer from "multer";
import path from "path";



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
})

const filterfiles = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true) // allow only pdf or doc files
    } else {
        cb(null, false)
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }

}

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },  // limit upload file 5 mb size
    fileFilter: filterfiles
})