import React, { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { Equibundle } from './items';
import { quicksortStep, SortPhase, loadSortState, storeSortState } from './sorting';

const printSort = (arr:number[]) => {
    const retrieveMembers = (j:number) => {
        const jsonBundle = localStorage.getItem("bundle" + j);
        if(!jsonBundle){
            throw new Error("Error retrieving ID " + j);
        }
        const bundle: Equibundle = JSON.parse(jsonBundle);
        if(!bundle){
            throw new Error("Error parsing ID " + j);
        }
        return bundle.items.map((j)=>{return j.member}).join(", ");
    }
    const members = arr.map(retrieveMembers);
    return members.join("\n");
}

const CompareFamilies: React.FC = () => {
    let startSort = loadSortState();
    // TODO: Check if there's anything to sort
    const [sortState, setSortState] = useState(startSort.newSortState);
    const [family1, setFamily1] = useState(startSort.left);
    const [family2, setFamily2] = useState(startSort.right);
    const [isDone, setDone] = useState(sortState.phase === SortPhase.DONE);

    const handleClick = (isFamily1:boolean) => {
        const quickStep = quicksortStep(sortState, isFamily1);
        const dirStr = isFamily1 ? "Left" : "Right";
        console.log("Clicked " + dirStr + "!");
        console.log("next step...");
        console.log(quickStep.newSortState);
        storeSortState(quickStep);
        const newSortState = quickStep.newSortState;
        if(newSortState.phase === SortPhase.DONE) {
            setDone(true);
            return;
        }
        const newFamily1 = quickStep.newSortState.sortArray[quickStep.left];
        const newFamily2 = quickStep.newSortState.sortArray[quickStep.right];
        setSortState(newSortState);
        setFamily1(newFamily1);
        setFamily2(newFamily2);
    }

    const renderFamilyInfo = (family: number, side: string) => {
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
    if (isDone) {
        console.log("Done!")
    }
    return isDone ?
    <div>
        <Paper> You Finished! </Paper>
        <Typography> Order: {printSort(sortState.sortArray)} </Typography>
    </div> :
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

export default CompareFamilies;
