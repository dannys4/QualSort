
enum SortPhase {
    LEFT, RIGHT, DONE,
};

type SortState = {
    lo:number;
    hi:number;
    i:number;
    j:number;
    pivIdx:number;
    pivStack:number[];
    sortArray:number[];
    phase:SortPhase;
};

const quicksortOuterStart = (sortState:SortState) => {
    if(sortState.pivStack.length < 1) {
        // TODO: Figure out what to do when done
    }
    // hi = pop(stack); lo = pop(stack);
    // Return new sortState with hi and lo popped
    let newSortState = sortState;
    return newSortState;
}

const quicksortOuterEnd = (sortState:SortState) => {
    let midIdx = sortState.j;
    let stack = [...sortState.pivStack];
    if(midIdx - 1 > sortState.lo) {
        stack.push(sortState.lo);
        stack.push(midIdx - 1);
    }
    if(midIdx + 1 < sortState.hi) {
        stack.push(midIdx + 1);
        stack.push(sortState.hi);
    }
    // TODO: Create new SortState with stack
    let newSortState = sortState;
    return newSortState;
}

const quicksortStepLeft = (sortState:SortState, isPivot:boolean) => {
    if(isPivot) {
        // TODO: Set sortState.i += 1 in new obj
        let newSortState = sortState;
        return {sortState: newSortState, left:newSortState.pivIdx, right:newSortState.i};
    }
    // TODO: Set sortState.j -= 1, sortState.phase = SortPhase.RIGHT in new obj
    let newSortState = sortState;
    return {sortState: newSortState, left:newSortState.pivIdx, right:newSortState.i};
};

const quicksortStepRight = (sortState:SortState, isPivot:boolean) => {
    if(!isPivot) {
        // TODO: Set sortState.j -= 1 in new obj
        let newSortState = sortState;
        return {sortState: newSortState,left:newSortState.pivIdx,right:newSortState.j};
    }
    if(sortState.i >= sortState.j) {
        let newSortState_outerEnd = quicksortOuterEnd(sortState);
        if(newSortState_outerEnd.phase === SortPhase.DONE) {
            // TODO: Figure out what to do when done
        }
        let newSortState_outer = quicksortOuterStart(newSortState_outerEnd);
        // TODO: Calculate pivot, set i and j, set new phase
        let newSortState = newSortState_outer;
        return {sortState: newSortState, left:newSortState.pivIdx, right:newSortState.i};
    }
    // TODO: swap sortState.sortArray indices i and j in new obj and continue on the left
    let newSortState = sortState;
    return {sortState: newSortState, left:newSortState.pivIdx, right:newSortState.i};
};

const quicksortStep = (currSortState:SortState, isPivot:boolean) => {
    switch(currSortState.phase) {
        case SortPhase.LEFT: return quicksortStepLeft(currSortState, isPivot);
        case SortPhase.RIGHT: return quicksortStepRight(currSortState, isPivot);
        default: throw Error("Cannot sort this phase!");
    }
}

export default quicksortStep;