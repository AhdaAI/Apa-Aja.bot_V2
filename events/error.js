module.exports = {
    name: 'error',
    once: false,

    async execute(e) {
        console.log(
            `ERROR!
            Code: ${e.code}
            Message: ${e.message}`
        )
    }
}