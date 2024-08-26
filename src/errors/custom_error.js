
module.exports = class CustomError {
	constructor(err, code) {
		if (code == "1.000.000") {
			console.log('json file larga kimdur tekgan')
			// notification chiqarish kerak
			const { connect } = require("../service")
			const timeout = setTimeout(async () => {
				clearTimeout(timeout)
				await connect.error.create("0.012.000", {
					error_code: "1.000.000",
					error_body: "",
					error_operation: "",
					error_message: "",
					code_for_user: "",
					error_description: "",
					recommendations: ""
				})
			}, 1)

			this.error = err;
			this.code = code;
		} else if (err instanceof CustomError) {
			this.error = err.error;
			this.code = err.code;
		} else if (err instanceof Error) {
			this.error = err.message;
			this.code = code;
		} else {
			this.error = err;
			this.code = code;
		}
	}
}