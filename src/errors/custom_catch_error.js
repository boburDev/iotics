const { errorMessage } = require("./error");
const { connect } = require("../service");
const CustomError = require("./custom_error");

module.exports = class CustomCatchError {
	constructor(err, code) {
		if (err instanceof CustomError) {
			this.body = JSON.stringify(err.error);
			this.code = err.code;
		} else if (err instanceof Error) {
			this.body = JSON.stringify(err.message);
			this.code = code;
		} else {
			this.body = JSON.stringify(err);
			this.code = code;
		}
		this.create()
	}

	async create() {
		const error = errorMessage(this.code)

		this.clientMessage = error.message
		this.codeForUser = error.codeForUser
		this.status = error.status

		const newLog = await connect.error.create("0.012.000", {
			error_code: this.code,
			error_body: this.body,
			error_operation: error.operation,
			error_message: error.message,
			code_for_user: error.codeForUser,
			error_description: error.description,
			recommendations: error.recommendations
		})

		// console.log(newLog)
		// clientga notification chiqarish
	}
}
