import React from 'react';
import Lichess from '../api/Lichess';
import TeamTableComponent from '../components/TeamTableComponent';
function Home()
{
    var id = "dragons-chess-club";
    const [values, setValues] = React.useState([]);
    const [users, setUsers] = React.useState([]);

    React.useEffect(()=>{
        updateValues();
    },[id]);


    const fetchValues = async () => 
    {
        var lichess = new Lichess();
        var team = await lichess.getTeam(id);
        var keys = Object.keys(team);

        var newValues = keys.map(e => {
                return {name:e, value: team[e]};
        });

        return newValues;
    }

     const fetchUsers = async () =>
    {
        var lichess = new Lichess();
        var users = await lichess.getTeamUsers(id);
        
        return users;
    } 

    const updateValues = async ()=> 
    {
        var newValues = await fetchValues();
        var newUsers = await fetchUsers(); 

        setValues(newValues);
        setUsers(newUsers); 
    }


    return (<div>
        Team data:
        <TeamView values={values}></TeamView>
        <br></br>
        users:
        <TeamUsersView values={users}></TeamUsersView> 
        <TeamTableComponent idTeam={id}></TeamTableComponent>
    </div>);
}

function TeamView(props)
{
    return (
        <ul>
            {props.values.map(e => <li>{e.name + ": " + e.value}</li>)}
        </ul>
    );
}

function TeamUsersView(props)
{
    return (
        <ul>
            {props.values.map(e => <li>{e.username}</li>)}
        </ul>
    );
}

export default Home;