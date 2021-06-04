/* eslint-disable no-mixed-requires */
"use strict";
import { Dimensions } from 'react-native';

var units = {
	vw: Dimensions.get("window").width / 100,
	vh: Dimensions.get("window").height / 100,
};

module.exports = units;
