export const COLORS = {
	primary: "#3AD037",
	red: "#E84040",
	gray: "#c4c4c4",
};
export const USER_TYPES = {
	ADMIN: "admin",
	USER: "user",
};

export const BASEURL = "http://d35b149dd53e.ngrok.io/api/";

export const STORAGE_USER_DETAILS_KEY = "userDetails";

export const getBorderColor = (decisionStatus) => {
	switch (decisionStatus) {
		case "REJECTED": {
			return COLORS.red;
		}
		case "ACCEPTED": {
			return COLORS.primary;
		}
		default: {
			return COLORS.gray;
		}
	}
};
