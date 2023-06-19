import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import { Equibundle } from './items';

type SortStatus = {
    sortArray: number[];
    partStack: number[];
    lo: number;
    hi: number;
}

const currentSort = (): SortStatus => {
    const currID = parseInt(localStorage.getItem("currentID") || "0");
    if (currID === 0) return { sortArray: [], partStack: [], lo: 0, hi: -1 };
    const currSz = parseInt(localStorage.getItem("currentSortSize") || "0");
    const sortArrJSON = localStorage.getItem("sortArray");
    const partStackJSON = localStorage.getItem("partStack");
    if (currID !== currSz || !sortArrJSON || !partStackJSON) {
        localStorage.setItem("currentSortSize", currID.toString());
        const sortArray = Array<number>(currID);
        for (let j = 0; j < currID; j++) { sortArray[j] = j };
        var partStack = Array<number>();
        var initialValues: SortStatus = { sortArray: sortArray, partStack: partStack, lo: 0, hi: currID };
        return initialValues;
    }
    const sortArray = JSON.parse(sortArrJSON) as number[];
    var partStack = JSON.parse(partStackJSON) as number[];
    var hi = partStack.pop();
    var lo = partStack.pop();
    if (!hi || !lo) {
        lo = 0;
        hi = -1;
    }
    var initialValues: SortStatus = { sortArray: sortArray, partStack: partStack, lo: lo, hi: hi };
    return initialValues;
}
type setDispatch<T> = React.Dispatch<React.SetStateAction<T>>;
type setFamilyDispatch = React.Dispatch<React.SetStateAction<number>>;
type setSortDispatch = React.Dispatch<React.SetStateAction<SortStatus>>;

const quicksort = async (A: number[], lo: number, hi: number, setA: setDispatch<number[]>, setFamily1: setFamilyDispatch, setFamily2: setFamilyDispatch, setHandleClick: setDispatch<any>) => {
    // Create a stack to store the partition indices
    var stack = Array<number>();

    // Push initial partition indices to the stack
    stack.push(lo);
    stack.push(hi);

    // Iteratively sort partitions
    while (stack.length > 0) {
        // Pop partition indices from the stack
        hi = stack.pop()!;
        lo = stack.pop()!;

        // Perform partitioning
        const pivot_idx = await partition(A, lo, hi, setA, setFamily1, setFamily2, setHandleClick);

        // Push left partition indices to the stack
        if (pivot_idx - 1 > lo) {
            stack.push(lo);
            stack.push(pivot_idx - 1);
        }

        // Push right partition indices to the stack
        if (pivot_idx + 1 < hi) {
            stack.push(pivot_idx + 1);
            stack.push(hi);
        }
    }
}
const createSetACallback = (i: number, j: number) => {
    return (prevA: number[]) => {
        const newA = [...prevA];
        [newA[i], newA[j]] = [prevA[j], prevA[i]];
        return newA;
    };
};

const partition = async (A: number[], lo: number, hi: number,
    setA: setDispatch<number[]>, setFamily1: setFamilyDispatch, setFamily2: setFamilyDispatch, setHandleClick: setDispatch<any>) => {
    // Pivot value
    var pivot = A[Math.floor((hi - lo) / 2) + lo] // The value in the middle of the array
    setFamily1(pivot);

    // Left index
    var i = lo - 1

    // Right index
    var j = hi + 1

    while (true) {
        // Move the left index to the right at least once and while the element at
        // the left index is less than the pivot
        var Ai_less_pivot = false;
        do {
            i = i + 1;
            setFamily2(A[i]);
            const isFamily1 = await new Promise<boolean>((resolve) => {
                const handleClickWrapper = (selectedId: number) => {
                    resolve(selectedId === 1); // Resolve the promise with the result
                };
                setHandleClick(handleClickWrapper);
            });
            Ai_less_pivot = isFamily1;
        } while (Ai_less_pivot);

        // Move the right index to the left at least once and while the element at
        // the right index is greater than the pivot
        var Aj_greater_pivot = false;
        do {
            j = j - 1;
            setFamily2(A[j]);
            const isFamily1 = await new Promise<boolean>((resolve) => {
                const handleClickWrapper = (selectedId: number) => {
                    resolve(selectedId === 1); // Resolve the promise with the result
                };
                setHandleClick(handleClickWrapper);
            });
            Ai_less_pivot = !isFamily1;
        } while (Aj_greater_pivot);

        // If the indices crossed, return
        if (i >= j) return j;

        // Swap the elements at the left and right indices
        setA(createSetACallback(i, j));
    }
}

const CompareFamilies: React.FC = () => {
    var currSort_start = currentSort();
    const [currArr, setCurrArr] = useState(currSort_start.sortArray);
    const [family1, setFamily1] = useState(0);
    const [family2, setFamily2] = useState(1);
    const [handleClick, setHandleClick] = useState<(selectedId: number) => void>((selectedId) => {
        // Default click handler logic
        // You can replace this with your desired default behavior
        console.log(`Clicked on family ${selectedId}`);
    });

    const renderFamilyInfo = (family: number, side: string) => {
        console.log(family);
        const bundle = localStorage.getItem('bundle' + family);
        if (!bundle) return null;

        const familyInfo = JSON.parse(bundle) as Equibundle;
        const familyMembers = familyInfo.items.map((item) => { return item.member; }).join(", ");
        // Add more attributes of the family to display

        return (
            <Paper elevation={3} style={{ padding: 10 }}>
                <Typography variant="h6">Family {side}:</Typography>
                <Typography>Members: {familyMembers}</Typography>
                {/* Add more attributes of the family to display */}
            </Paper>
        );
    };

    useEffect(() => {
        // Call the quicksort function inside the useEffect hook
        const sortArray = [...currArr];
        const lo = 0;
        const hi = sortArray.length;
        quicksort(sortArray, lo, hi, setCurrArr, setFamily1, setFamily2, setHandleClick);
    }, [currArr, family1, family2, handleClick]);

    if (currArr.length < 1) {
        return <Paper>You finished!</Paper>;
    }
    return (
        <div>
            <Typography variant="h5">Compare Families</Typography>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20 }}>
                <div onClick={() => handleClick(family1)}>
                    {renderFamilyInfo(family1, '1')}
                </div>
                <div onClick={() => handleClick(family2)}>
                    {renderFamilyInfo(family2, '2')}
                </div>
            </div>
        </div>
    );
};

/* Pseudocode:
var sorted = false;
while(!sorted) {
    let [isComparisonEvaluated, setIsComparisonEvaluated] = useState(false);
    ...
    while(!isComparisonEvaluated) {
        // display family comparison
        renderComparison(family1, family2);
        timeout(500);
    }
    // handle comparison
    // quicksort_step
        // Takes in "current sorting state"
        // Returns [newFamily1, newFamily2]
    setFamily1(newFamily1);
    setFamily2(newFamily2);
    setIsComparisonEvaluated(true);
}
*/

/*
// Call useState for:
// currSortState, family1, family2
const handleClick = (isFamily1:boolean) => {
    let [newSortState, newFamily1, newFamily2] = quicksort_step(currSortState, isFamily1);
    setCurrSortState(newSortState);
    setFamily1(newFamily1);
    setFamily2(newFamily2);
}
// Render using family1, family2, and handleClick
*/

export default CompareFamilies;
