import React from 'react';
import {TeamTable, TableData} from '../api/TeamTable'

type TeamTableComponentProps ={
    idTeam: string;
}

function TeamTableComponent({idTeam} : TeamTableComponentProps)
{
    const [table, updateTable] = React.useState(new TableData([], []));
    React.useEffect(() => {fetchData()}, [idTeam]);

    async function fetchData()
    {
        var teamTable = new TeamTable(idTeam);
        var table = await teamTable.CreateTable();
        updateTable(table);
    }

    function renderRow(row)
    {
        return (<tr>
                    { row.cells.map(e => <td>{e.value}</td>)}
                </tr>)
    }

    return <table>
                <tr>
                    {table.cols.map(e => <th> {e.name} </th>)}
                </tr>
                {table.rows.map(e => renderRow(e))}
            </table>;
}

export default TeamTableComponent;