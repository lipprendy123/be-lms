const globalController = {
    async getUser(req, res) {
        res.status(200).json({
            success: true,
            message: 'Get user success'
        })
    }
}

export default globalController