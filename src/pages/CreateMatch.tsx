import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CreateMatch.css';
import cricketBackground from '../assets/cricket-bk.jpg';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';

const CreateMatch: React.FC = () => {
    const [tossWinner, setTossWinner] = useState<string>('');
    const [gameMode, setGameMode] = useState('batting');
    const [matchName, setMatchName] = useState<string>('');
    const [team1Name, setTeam1Name] = useState<string>('');
    const [team2Name, setTeam2Name] = useState<string>('');
    const [numberOfOvers, setNumberOfOvers] = useState<number>(10);

    const handleGameModeChange = (
      event: React.MouseEvent<HTMLElement>,
      newGameMode: string,
    ) => {
      setGameMode(newGameMode);
    };

    const handleTossChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTossWinner(event.target.value);
    };

    const handleNumberOfOversChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (!isNaN(value) && value > 0) {
            setNumberOfOvers(value);
        }
    };

    const tossWinnerName = tossWinner === 'team1' ? team1Name || 'Team 1' : team2Name || 'Team 2';

    const handleMatchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMatchName(event.target.value);
    };

    const handleTeam1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeam1Name(event.target.value);
    };

    const handleTeam2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeam2Name(event.target.value);
    };

    return (
        <div 
            className="create-match-container"
            style={{ backgroundImage: `url(${cricketBackground})` }}
        >
            <div className="create-match-content">
                <h1>Create Match</h1>
                <Link to="/" className="back-link">Back to Home</Link>
                <div className="match-form">
                    <p className="date-display">Today's Date: {new Date().toLocaleDateString()}</p>
                    <label className="form-label">
                        Match Name: &nbsp;
                        <input 
                            type="text" 
                            placeholder="Enter match name" 
                            className="form-input"
                            value={matchName}
                            onChange={handleMatchNameChange}
                        />
                    </label><br />
                    <label className="form-label">
                        Team 1: &nbsp;
                        <input 
                            type="text" 
                            placeholder="Enter team 1 name" 
                            className="form-input"
                            value={team1Name}
                            onChange={handleTeam1Change}
                        />
                    </label><br />
                    <label className="form-label">
                        Team 2: &nbsp;
                        <input 
                            type="text" 
                            placeholder="Enter team 2 name" 
                            className="form-input"
                            value={team2Name}
                            onChange={handleTeam2Change}
                        />
                    </label><br />
                    <label className="form-label">
                        Toss win by: &nbsp;
                        <select className="form-input" value={tossWinner} onChange={handleTossChange}>
                            <option value="">Choose a team</option>
                            <option value="team1">{team1Name || 'Team 1'}</option>
                            <option value="team2">{team2Name || 'Team 2'}</option>
                        </select>
                    </label><br />
                    <label className="form-label">
                        Number of Overs: &nbsp;
                        <input 
                            type="number" 
                            min="1" 
                            max="50" 
                            placeholder="Enter number of overs" 
                            className="form-input"
                            value={numberOfOvers}
                            onChange={handleNumberOfOversChange}
                        />
                    </label>
                    {tossWinner && (
                        <div className="selected-team-display">
                            <p>Toss won by: <strong>{tossWinner === 'team1' ? team1Name || 'Team 1' : team2Name || 'Team 2'}</strong></p>
                        </div>
                    )}
                    <br />
                    <div>{tossWinnerName + ' chosen '} <ToggleButtonGroup
                    color="primary"
                    value={gameMode}
                    exclusive
                    onChange={handleGameModeChange}
                    aria-label="Game Mode"
                    >
                    <ToggleButton value="batting">Batting</ToggleButton>
                    <ToggleButton value="bowling">Bowling</ToggleButton>
                    </ToggleButtonGroup></div>
                </div>
            </div>
        </div>
    );
};

export default CreateMatch;