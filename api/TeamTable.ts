import Lichess from './Lichess'

export class TeamTable
{
    teamId: string;
    api: Lichess;

    constructor(teamid)
    {
        this.teamId = teamid;
        this.api = new Lichess();
    }

    async CreateTable(): Promise<TableData>
    {
        
        var data = await this.GetData();
        var users = data.users;
        var tournaments = data.tournaments;

        var cols : ColumnData[] = [];
        var rows : RowData[] = [];

        var usersCol = new ColumnData("users", "Users");
        var scoreCol = new ColumnData("score", "score");

        cols.push(usersCol);
        cols.push(scoreCol);

        tournaments = tournaments.sort((t1, t2) => {
            var date1 = Date.parse(t1.startsAt);
            var date2 = Date.parse(t2.startsAt);

            return date1 - date2;

        });

        
        for(let tournament of tournaments)
            cols.push(new ColumnData(tournament.id, tournament.name));

        for(let user of users)
        {
            var row : CellData[] = [];
            let userScore = 0;
            var cellsTournament: CellData[] = [];

            for(let tournament of tournaments)
            {
                let results = tournament.results;
                let userResult = results.find(u => user.username == u.username);
                let userTournamentPoints = userResult? userResult.points:0;
                let userResultValue = userResult?userResult.points: "NA";

                userScore += userTournamentPoints;

                cellsTournament.push(new CellData(userResultValue));
            }

            row.push(new CellData(user.username));
            row.push(new CellData(userScore));

            var concatRow = row.concat(cellsTournament);

            rows.push(new RowData(concatRow));
        }

        //sort by score
        rows = rows.sort((row1, row2) => {
            let scoreIndex = 1;
            return row2.cells[scoreIndex].value - row1.cells[scoreIndex].value;
        });

        return new TableData(cols, rows);
    }


    async GetData() {
        let usuarios = await this.api.getTeamUsers(this.teamId);
        let tournaments = await this.api.getTeamTournaments(this.teamId);

        for (let i = 0; i < tournaments.length; i++)
            tournaments[i].results = await this.api.getTournamentResults(tournaments[i].id);

        return {
            users: usuarios,
            tournaments: tournaments
        }
    }
}

export class TableData
{
    cols: ColumnData[];
    rows: RowData[];

    constructor(cols: ColumnData[], rows: RowData[])
    {
        this.cols = cols;
        this.rows = rows;
    }

}

export class ColumnData
{
    id: string;
    name: string;

    constructor(id: string, name: string)
    {
        this.id = id;
        this.name = name;
    }
}

export class RowData
{
    cells: CellData[];

    constructor(cells: CellData[])
    {
        this.cells = cells;
    }
}

export class CellData
{
    value: any;

    constructor(value)
    {
        this.value = value;
    }
}