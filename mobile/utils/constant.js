export const COLORS = {
	primary: "#3AD037",
	red: "#E84040",
	gray: "#c4c4c4",
};
export const USER_TYPES = {
	ADMIN: "admin",
	USER: "user",
};

export const BASEURL = "https://holiday-mgmt.herokuapp.com/api/";
// export const BASEURL = "https://d07735abdd36.ngrok.io /api/";

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
