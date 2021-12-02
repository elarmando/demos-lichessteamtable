class Lichess
{
    baseUrl: string;

    constructor()
    {
        this.baseUrl = "https://lichess.org/api";
    }

    async getTeam(id: string)
    {
        return await this.get(this.baseUrl + "/team/" + id);
    }

    async getTeamUsers(id: string)
    {
        return await this.get(this.baseUrl + "/team/" + id +"/users");
    }

    async getTeamTournaments(id: string)
    {
        return await this.get(this.baseUrl + "/team/" + id + "/swiss");
    }

    async getTournamentResuls(idTournament: string)
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