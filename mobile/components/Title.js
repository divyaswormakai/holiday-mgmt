import React from "react";
import { Text } from "react-native";

import { vw } from "../utils/viewport";

const Title = () => {
	return (
		<Text style={{ fontSize: 6 * vw, textAlign: "center" }}>
			Holiday Management App
		</Text>
	);
};

export default Title;
