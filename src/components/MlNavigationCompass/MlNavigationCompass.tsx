import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";


import { ReactComponent as CompassNeedle } from "./assets/CompassNeedle.svg";
import { ReactComponent as CompassBackground } from "./assets/CompassBackground.svg";

import styled from "@emotion/styled";
import { css } from "@emotion/css";
import useMap from "../../hooks/useMap";

const NeedleButton = styled.div`
	display: flex;
	align-items: center;
	zIndex: 1005;
	position: absolute;

	&:hover {
		cursor: pointer;
	}
	path {
		filter: drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.2));
	}
	&:hover path {
		filter: drop-shadow(0px 0px 13px rgba(255, 255, 255, 0.1));
	}
	path:nth-of-type(2) {
		fill: #D3DCE1;
	}
	&:hover path:nth-of-type(2) {
		fill: #434343;
	}
	path:nth-of-type(1) {
		fill: #CF003D;
	}
	&:hover path:nth-of-type(1) {
		fill: #fb4052;
	}
`;
const NeedleContainer = styled.div`
	pointer-events: none;
	display: flex;
	z-index: 1002;
	align-items: center;
	
	&:hover {
		cursor: pointer;
	}

	svg {
		z-index: 9990;
		transform: scale(5)
	}
`;
interface MlNavigationCompassProps {
	mapId?: string;
	insertBeforeLayer?: string;
	style?: any;
	backgroundStyle?: any;
	needleStyle?: any;
	rotateRightStyle?: any;
	rotateLeftStyle?: any;
}
/**
 * Navigation component that displays a compass component which indicates the current oriantation of the map it is registered for and offers controls to turn the bearing 90° left/right or reset north to point up.
 *
 * All style props are applied using @emotion/css to allow more complex css selectors.
 *
 * @component
 */
const MlNavigationCompass = (props: MlNavigationCompassProps) => {
	const mapHook = useMap({
		mapId: props.mapId,
		waitForLayer: props.insertBeforeLayer,
	});
	const [bearing, setBearing] = useState(0);

	useEffect(() => {
		if (!mapHook.map) return;

		let _updateBearing = () => {
			if (!mapHook.map?.map?.getBearing) return;
			setBearing(Math.round(mapHook.map.map.getBearing()));
		};

		mapHook.map.on("rotate", _updateBearing, mapHook.componentId);
		_updateBearing();

		return () => {
			mapHook.map?.map.off("rotate", _updateBearing);
		};
	}, [mapHook.map, props.mapId]);

	return (
		<>
			<div
				className={css({
					zIndex: 1000,
					top: 0,
					position: "absolute",
					...props.style,
				})}
			>
				<div
					className={css({
						position: "absolute",
						border: "10px solid #717171",
						backgroundColor: "#fff",
						//background: "radial-gradient(#717171, #414141)",
						height: "200px",
						width: "200px",
						borderRadius: "50%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						transform: "scale(0.2) translateX(-448px) translateY(-448px)",
						...props.backgroundStyle,
					})}
				>
					
					<NeedleButton
						className={css({ ...props.needleStyle })}
						onClick={() => {
							mapHook.map?.map.setBearing(0);
						}}
					>
						<NeedleContainer
							style={{
								transform: "rotate(" + (bearing>0?"-"+bearing:-1*bearing) + "deg)",
							}}
						>
							<CompassNeedle />
						</NeedleContainer>
					</NeedleButton>
					<CompassBackground style={{transform: "scale(4.6)", zIndex: 1000}} />
				</div>
			</div>
		</>
	);
};

MlNavigationCompass.propTypes = {
	/**
	 * Component id prefix
	 */
	idPrefix: PropTypes.string,
	/**
	 * Style object to adjust css definitions of the component.
	 */
	style: PropTypes.object,
	/**
	 * Style object to adjust css definitions of the background.
	 */
	backgroundStyle: PropTypes.object,
	/**
	 * Style object to adjust css definitions of the compass needle.
	 */
	needleStyle: PropTypes.object,
	};

export default MlNavigationCompass;


/*


import { ReactComponent as RotateRightIcon } from "./assets/rotate_right.svg";
import { ReactComponent as RotateLeftIcon } from "./assets/rotate_left.svg";

const RotateButton = styled.div`
	width: 30%;
	margin-top: 14px;
	z-index: 999;
	display: flex;

	svg:hover {
		cursor: pointer;
	}
	svg:hover path {
		fill: #ececec;
		filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.1));
	}
	path {
		fill: #bbb;
	}
	svg {
		transform: scale(0.6);
		z-index: 9990;
		height: 172px;
	}
`;

	<RotateButton className={css({ ...props.rotateLeftStyle })}>
						<RotateLeftIcon
							onClick={() => {
								if(!mapHook.map)return;

								let bearing = Math.round(mapHook.map.map.getBearing());
								let rest = Math.round(bearing % 90);
								if (bearing < 0) {
									rest = 90 + rest;
								}
								if (rest === 0) {
									rest = 90;
								}
								mapHook.map.map.setBearing(Math.round(bearing - Math.abs(rest)));
							}}
						></RotateLeftIcon>
					</RotateButton>


						<RotateButton className={css({ ...props.rotateRightStyle })}>
						<RotateRightIcon
							onClick={() => {
								if(!mapHook.map)return;

								let bearing = Math.round(mapHook.map.map.getBearing());
								let rest = Math.round(bearing % 90);
								if (bearing > 0) {
									rest = 90 - rest;
								}
								if (rest === 0) {
									rest = 90;
								}
								mapHook.map.map.setBearing(Math.round(bearing + Math.abs(rest)));
							}}
						></RotateRightIcon>
					</RotateButton>

*/