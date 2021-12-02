import React from 'react';
import TeamTable from '../api/TeamTable'

function TeamTableComponent({idTeam})
{
    const [table, updateTable] = React.useState({cols: [], rows:[]});
    React.useEffect(fetchData, [idTeam]);

    async function fetchData()
    {
        var teamTable = new TeamTable(idTeam);
        var table = await teamTable.CreateTable();
        updateTable(table);
    }

    function renderRow(row)
    {
        debugger;
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