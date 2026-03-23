"use client";

import { useReducer } from "react";

export interface SequencerState {
	// Step 1: Structure
	name: string;
	architecturalStyle: string;
	era: string;
	spatialDimensions: string;
	// Step 2: Environment
	formComplexity: number;
	thermalOutput: number;
	lightingExposure: number;
	// Step 3: Synthesis
	primaryMaterial: string;
	secondaryMaterial: string;
	colorPalette: string;
	texture: string;
	mood: string;
}

type SequencerAction =
	| { type: "SET_FIELD"; field: keyof SequencerState; value: string | number }
	| { type: "RESET" }
	| { type: "LOAD"; data: Partial<SequencerState> };

const initialState: SequencerState = {
	name: "",
	architecturalStyle: "MODERN",
	era: "CONTEMPORARY",
	spatialDimensions: "MEDIUM",
	formComplexity: 50,
	thermalOutput: 50,
	lightingExposure: 50,
	primaryMaterial: "",
	secondaryMaterial: "",
	colorPalette: "",
	texture: "",
	mood: "",
};

function reducer(
	state: SequencerState,
	action: SequencerAction,
): SequencerState {
	switch (action.type) {
		case "SET_FIELD":
			return { ...state, [action.field]: action.value };
		case "RESET":
			return initialState;
		case "LOAD":
			return { ...initialState, ...action.data };
	}
}

export function useSequencerForm(initial?: Partial<SequencerState>) {
	const [state, dispatch] = useReducer(
		reducer,
		initial ? { ...initialState, ...initial } : initialState,
	);

	const setField = (field: keyof SequencerState, value: string | number) => {
		dispatch({ type: "SET_FIELD", field, value });
	};

	const reset = () => dispatch({ type: "RESET" });
	const load = (data: Partial<SequencerState>) =>
		dispatch({ type: "LOAD", data });

	return { state, setField, reset, load };
}
