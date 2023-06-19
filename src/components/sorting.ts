// Enum to describe the current sorting phase
export enum SortPhase {
    LEFT, RIGHT, DONE,
};

// Current state of the sort
export type SortState = {
    lo: number; // Lower bound for segment we sort
    hi: number; // Upper bound for segment we sort
    i: number; // Left index
    j: number; // Right index
    pivIdx: number; // Pivot index
    pivStack: number[]; // Stack of elements for calculating pivots/ lo and hi
    sortArray: number[]; // Partially sorted array
    phase: SortPhase; // Phase of sorting
};

/**
 * Return type for a step of quicksort.
 * sortState: New state of the sort
 * left: ID of element to display on left (generally pivot value)
 * right: ID of element to display on right
 */
export type QuicksortRet = {
    newSortState: SortState,
    left: number,
    right: number,
}


export function initializeSort(currID:number): QuicksortRet {
    const [lo, hi, i, j] = [0, currID-1, 0, currID-1];
    const pivIdx = Math.floor((hi-lo)/2)+lo;
    const sortArray = Array.from({length: currID}, (_,j) => j);
    const sortState:SortState = {lo: lo, hi: hi, i: i, j: j, pivIdx: pivIdx, pivStack: Array<number>(), sortArray: sortArray, phase:SortPhase.LEFT };
    return {newSortState:sortState, left:pivIdx, right:i};
}

export function loadSortState():QuicksortRet {
    const currID = parseInt(localStorage.getItem("currentID") || "0");
    // If there is nothing to sort
    if (currID === 0) {
        const sortState: SortState = { lo: -1, hi: -1, i: -1, j: -1, pivIdx: -1, pivStack: [], sortArray: [], phase: 0};
        return {newSortState:sortState, left: -1, right: -1};
    }
    
    const sortStateJSON = localStorage.getItem("sortState");
    if(!sortStateJSON) {
        return initializeSort(currID);
    }
    const sortState: QuicksortRet = JSON.parse(sortStateJSON);
    if(sortState.newSortState.sortArray.length !== currID) {
        return initializeSort(currID);
    }
    return sortState;
}

export function storeSortState(sortState:QuicksortRet) {
    const stateJSON = JSON.stringify(sortState);
    localStorage.setItem("sortState", stateJSON);
}

/**
 * Performs start of a quicksort step before calling partition.
 * @param sortState Current state of the sort
 * @returns New sort state with updated hi and lo
 */
function quicksortOuterStart(sortState: SortState): SortState {
    if (sortState.pivStack.length < 1) {
        // Return a SortState with DONE phase
        let newSortState: SortState = { ...sortState, phase: SortPhase.DONE };
        return newSortState;
    }
    let [lo, hi] = sortState.pivStack.slice(-2, -1);
    let newStack = sortState.pivStack.splice(-2);
    // Return new sortState with hi and lo popped
    let newSortState: SortState = { ...sortState, hi: hi, lo: lo, pivStack: newStack };
    return newSortState;
}

/**
 * Updates the stack after finishing one full call to partition during a step of quicksort
 * @param sortState Current sort state
 * @returns New state with updated stack
 */
function quicksortOuterEnd(sortState: SortState): SortState {
    let midIdx = sortState.j;
    let stack = [...sortState.pivStack];
    if (midIdx - 1 > sortState.lo) {
        stack.push(sortState.lo);
        stack.push(midIdx - 1);
    }
    if (midIdx + 1 < sortState.hi) {
        stack.push(midIdx + 1);
        stack.push(sortState.hi);
    }
    // Create new SortState with stack
    let newSortState: SortState = { ...sortState, pivStack: stack };
    return newSortState;
}

/**
 * Function to handle logic when iterating left index while partitioning during quicksort
 * @param sortState Current state of sort
 * @param isPivot Whether pivot element is greater than left element
 * @returns New sort state based on isPivot
 */
function quicksortStepLeft(sortState: SortState, isPivot: boolean): QuicksortRet {
    if (isPivot) {
        // Set sortState.i += 1 in new obj
        let newSortState: SortState = { ...sortState, i: sortState.i + 1 };
        return { newSortState: newSortState, left: newSortState.pivIdx, right: newSortState.i };
    }
    // Set sortState.j -= 1, sortState.phase = SortPhase.RIGHT in new obj
    let newSortState: SortState = { ...sortState, j: sortState.j - 1, phase: SortPhase.RIGHT };
    return { newSortState: newSortState, left: newSortState.pivIdx, right: newSortState.i };
};

/**
 * Function to handle logic when iterating over the right index during quicksort partitioning.
 * @param sortState Current state being partitioned on the right
 * @param isPivot Whether the pivot is greater than the jth element
 * @returns Updated SortState handling logic based on isPivot
 */
function quicksortStepRight(sortState: SortState, isPivot: boolean): QuicksortRet {
    if (!isPivot) {
        // Set sortState.j -= 1 in new obj
        let newSortState: SortState = { ...sortState, j: sortState.j - 1 };
        return { newSortState: newSortState, left: newSortState.pivIdx, right: newSortState.j };
    }
    if (sortState.i >= sortState.j) {
        let newSortState_outerEnd = quicksortOuterEnd(sortState);
        if (newSortState_outerEnd.phase === SortPhase.DONE) {
            return { newSortState: newSortState_outerEnd, left: -1, right: -1 };
        }
        let newSortState_outer = quicksortOuterStart(newSortState_outerEnd);
        // Calculate pivot, set i and j, set new phase
        let hi = newSortState_outer.hi;
        let lo = newSortState_outer.lo;
        let newPivIdx = Math.floor((hi - lo) / 2 + lo);
        let newSortState: SortState = {
            ...newSortState_outer,
            i: lo, j: hi,
            pivIdx: newPivIdx, phase: SortPhase.LEFT
        };
        return { newSortState: newSortState, left: newSortState.pivIdx, right: newSortState.i };
    }
    // Swap sortState.sortArray indices i and j in new obj and continue on the left
    let [i, j] = [sortState.i, sortState.j];
    let newSortArray = [...sortState.sortArray];
    newSortArray[i] = sortState.sortArray[j];
    newSortArray[j] = sortState.sortArray[i];
    let newSortState: SortState = { ...sortState, sortArray: newSortArray, phase: SortPhase.LEFT };
    return { newSortState: newSortState, left: newSortState.pivIdx, right: newSortState.i };
};

/**
 * 
 * @param currSortState Current state of sorting
 * @param isPivot Whether the pivot is greater than the element being checked
 * @returns New SortState regarding how sorted this is. Does not change old sort state
 */
export function quicksortStep(currSortState: SortState, isPivot: boolean): QuicksortRet {
    switch (currSortState.phase) {
        case SortPhase.LEFT: return quicksortStepLeft(currSortState, isPivot);
        case SortPhase.RIGHT: return quicksortStepRight(currSortState, isPivot);
        case SortPhase.DONE: return {newSortState:currSortState, left:-1, right:-1};
        default: throw Error("Cannot sort this phase!");
    }
}