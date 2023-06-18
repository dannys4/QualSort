import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper, Typography, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Equibundle } from './items';
import { useNavigate } from 'react-router-dom';

const Families = () => {
    const navigate = useNavigate();
    const maxFamily = localStorage.getItem('currentID');
    if (!maxFamily) return <Paper><Typography variant="h4">No Families yet!</Typography></Paper>;
    const rows: Equibundle[] = [];
    for (let j = 0; j < parseInt(maxFamily); j++) {
        const bundle_j = localStorage.getItem('bundle' + j);
        if (bundle_j) {
            rows.push(JSON.parse(bundle_j) as Equibundle);
        }
    }
    const handleDelete = (index: number) => {
        // Remove the family from the array and update the localStorage
        rows.splice(index, 1);
        localStorage.setItem('currentID', (parseInt(maxFamily) - 1).toString());
        for (let j = index; j < rows.length; j++) {
            localStorage.setItem('bundle' + j, JSON.stringify(rows[j]));
        }

        // Navigate back to the "families" page
        navigate('/families');
    };

    const getMembers = (row: Equibundle) => row.items.map(item => item.member).join(', ');

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="current families">
                <TableHead>
                    <TableRow>
                        <TableCell>Families</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {getMembers(row)}
                            </TableCell>
                            <TableCell>
                                <IconButton aria-label="delete" onClick={() => handleDelete(index)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default Families;