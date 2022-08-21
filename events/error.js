module.exports = {
    name: 'error',
    once: false,

    async execute(e) {
        // console.error(e)
        console.log(
            `
            Name: ${e.name}
            Message: ${e.message}
            Code: ${e.code}
            ${e.stack}`
        )
    }
}