class Lichess
{
    baseUrl: string;

    constructor()
    {
        this.baseUrl = "https://lichess.org/api";
    }

    async getTeam(id: string): Promise<Team>
    {
        return await this.get(this.baseUrl + "/team/" + id);
    }

    async getTeamUsers(id: string): Promise<User[]>
    {
        return await this.get(this.baseUrl + "/team/" + id +"/users");
    }

    async getTeamTournaments(id: string): Promise<Tournament[]>
    {
        return await this.get(this.baseUrl + "/team/" + id + "/swiss");
    }

    async getTournamentResults(idTournament: string): Promise<TournamentResult[]>
    {
        return await this.get(this.baseUrl + "/swiss/" + idTournament + "/results");
    }

    async get(url: string)
    {
        var res = await fetch(url);
        var contentType = res.headers.get("Content-type");

        if( contentType == "application/json" || contentType == "application/nd-json")
            return await res.json();
        else if(contentType == "application/x-ndjson")
        {
            var text = await res.text();
            var entriesText = text.split(/\n/);
            var entries = [];

            for(var i = 0; i < entriesText.length; i++)
            {
                var entry = entriesText[i];

                if(entry.length > 0)
                    entries.push(JSON.parse(entry));
            }

            return entries;
        }
        else
            throw new Error("Can't parse content type " + contentType);
    }


}

export default Lichess;

type Team = 
{
    id: string,
    name: string,
    description: string,
    open: boolean,
    leader: TeamLeader,
    leaders: TeamLeader[],
    nbMembers:number,
    location:string
}

type TeamLeader = 
{
    name: string;
    title: string;
    patron:boolean;
    id:string;
}

type User = 
{
    id:string;
    username:string;
    online:boolean;
    perfs:any;
    createdAt:number;
    disabled:boolean;
    tosViolation: boolean;
    profile:any;
    seenAt:number;
    patron:boolean;
    verified:boolean;
    playTime:any;
    title:string;
    url:string;
    playing:string;
    completionRate:97;
    count:any;
    streaming:boolean;
    followable:boolean;
    following:boolean;
    blocking:boolean;
    followsYou:false;
}

type Tournament = 
{
    rated:boolean;
    clock:any;
    createdBy:string;
    greayPlayer:any;
    id:string;
    name:string;
    nbOngoing:number;
    nbPlayers:number;
    nbRounds:number;
    nextRound:any;
    quote:any;
    round:number;
    startsAt:string;
    status:string;
    variant:string;
    results:TournamentResult[];
}

type TournamentResult = 
{
    rank: number;
    points: number;
    tieBreak: number;
    rating: number;
    username:string;
    title: string;
    performance: number;
}