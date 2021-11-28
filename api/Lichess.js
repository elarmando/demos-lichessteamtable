class Lichess
{
    constructor()
    {
        this.baseUrl = "https://lichess.org/api";
    }

    async getTeam(id)
    {
        return await this.get(this.baseUrl + "/team/" + id);
    }

    async getTeamUsers(id)
    {
        return await this.get(this.baseUrl + "/team/" + id +"/users");
    }

    async getTeamTournaments(id)
    {
        return await this.get(this.baseUrl + "/team/" + id + "/swiss");
    }

    async getTournamentResuls(idTournament)
    {
        return await this.get(this.baseUrl + "/swiss/" + idTournament + "/results");
    }

    async get(url)
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
            throw new Exception("Can't parse content type " + contentType);
    }


}

export default Lichess;