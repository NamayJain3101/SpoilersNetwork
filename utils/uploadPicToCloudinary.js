import axios from "axios"

export const uploadPic = async(media) => {
    try {
        const form = new FormData()
        form.append('file', media)
        form.append('upload_preset', "spoilersNetwork")
        form.append('cloud_name', "namay3101")

        const res = await axios.post(process.env.CLOUDINARY_URL, form)
        return { url: res.data.url, publicId: res.data.public_id }
    } catch (err) {
        console.log(err)
        return
    }
}