import multer from "multer";

export const fileStorageCourse = multer.diskStorage({
    destination: (req, file, cb) => {
        cb('public/uploads/courses')
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.')[1]
        const uniqId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, `${file.fieldname}-${uniqId}.${ext}`)
    }
})

export const fileFilter = (req, file, cb) => {
    if (file.mimeType === "images/jpeg" || file.mimeType === "images/jpg" || file.mimeType === "images/png") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}