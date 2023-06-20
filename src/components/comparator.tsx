import React, { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { Equibundle } from './items';
import { quicksortStep, SortPhase, loadSortState, storeSortState } from './sorting';

const CompareFamilies: React.FC = () => {
    let startSort = loadSortState();
    // TODO: Check if there's anything to sort
    const [sortState, setSortState] = useState(startSort.newSortState);
    const [family1, setFamily1] = useState(startSort.left);
    const [family2, setFamily2] = useState(startSort.right);
    const [isDone, setDone] = useState(false);

    const handleClick = (isFamily1:boolean) => {
        const quickStep = quicksortStep(sortState, isFamily1);
        storeSortState(quickStep);
        const newSortState = quickStep.newSortState;
        if(newSortState.phase === SortPhase.DONE || quickStep.left < 0 || quickStep.right < 0) {
            setDone(true);
            return
        }
        setSortState(newSortState);
        setFamily1(quickStep.left);
        setFamily2(quickStep.right);
    }

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
    return isDone ?
        <Paper> You Finished! </Paper> :
    (
        <div>
            <Typography variant="h5">Compare Families</Typography>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20 }}>
                <div onClick={() => handleClick(true)}>
                    {renderFamilyInfo(family1, '1')}
                </div>
                <div onClick={() => handleClick(false)}>
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
