import Lichess from './Lichess'

export default class TeamTable
{
    teamId: string;
    api: Lichess;

    constructor(teamid)
    {
        this.teamId = teamid;
        this.api = new Lichess();
    }

    async CreateTable()
    {
        var data = await this.GetData();
        var users = data.users;
        var tournaments = data.tournaments;

        var cols = [];
        var rows = [];

        var usersCol = new ColumnData();
        usersCol.id = "users";
        usersCol.name = "Users";

        var scoreCol = new ColumnData();
        scoreCol.name = "score";
        scoreCol.id = "score";

        cols.push(usersCol);
        cols.push(scoreCol);

        tournaments = tournaments.sort((t1, t2) => {
            var date1 = Date.parse(t1.startsAt);
            var date2 = Date.parse(t2.startsAt);

            return date1 - date2;

        });

        for(let tournament of tournaments)
        {
            var tournamentCol = new ColumnData();
            tournamentCol.id = tournament.id;
            tournamentCol.name = tournament.name;

            cols.push(tournamentCol);
        }

        for(let user of users)
        {
            var row = [];
            let userScore = 0;
            var cellsTournament = [];

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

            rows.push(concatRow);
        }

        //sort by score
        rows = rows.sort((row1, row2) => {
            let scoreIndex = 1;
            return row2[scoreIndex].value - row1[scoreIndex].value;
        });

        return {cols: cols, rows: rows};
    }


    async GetData() {
        let usuarios = await this.api.getTeamUsers(this.teamId);
        let tournaments = await this.api.getTeamTournaments(this.teamId);

        for (let i = 0; i < tournaments.length; i++)
            tournaments[i].results = await this.api.getTournamentResuls(tournaments[i].id);

        return {
            users: usuarios,
            tournaments: tournaments
        }
    }
}

class TableData
{
    
}

class ColumnData
{
    id: string;
    name: string;

    constructor()
    {
        this.id = undefined;
        this.name = undefined;
    }
}

class CellData
{
    value: any;

    constructor(value)
    {
        this.value = value;
    }
}