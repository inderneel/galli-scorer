import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import cricketBackground from '../../assets/cricket-bk.jpg';
import './Scoring.css';

interface MatchData {
    matchName: string;
    team1Name: string;
    team2Name: string;
    tossWinner: string;
    gameMode: string;
    numberOfOvers: number;
}

interface PlayerStats {
    runs: number;
    balls: number;
}

const Scoring: React.FC = () => {
    const location = useLocation();
    const matchData: MatchData | null = location.state as MatchData;
    const [batsman1, setBatsman1] = useState<string>('');
    const [batsman2, setBatsman2] = useState<string>('');
    const [bowler, setBowler] = useState<string>('');
    const [currentStep, setCurrentStep] = useState<'batsman-entry' | 'scoring'>('batsman-entry');
    const [editingPlayer, setEditingPlayer] = useState<'batsman1' | 'batsman2' | 'bowler' | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [currentBall, setCurrentBall] = useState<string>('');
    const [ballHistory, setBallHistory] = useState<string[]>([]);
    const [totalRuns, setTotalRuns] = useState<number>(0);
    const [wickets, setWickets] = useState<number>(0);
    const [overs, setOvers] = useState<number>(0);
    const [balls, setBalls] = useState<number>(0);
    const [striker, setStriker] = useState<'batsman1' | 'batsman2'>('batsman1');
    const [batsman1Stats, setBatsman1Stats] = useState<PlayerStats>({ runs: 0, balls: 0 });
    const [batsman2Stats, setBatsman2Stats] = useState<PlayerStats>({ runs: 0, balls: 0 });
    const [bowlerStats, setBowlerStats] = useState<PlayerStats>({ runs: 0, balls: 0 });

    // If no match data is available, redirect to create match
    if (!matchData) {
        return (
            <div className="scoring-container">
                <div className="scoring-content">
                    <h1>No Match Data Found</h1>
                    <p>Please create a match first to start scoring.</p>
                    <Link to="/create-match" className="back-link">Create Match</Link>
                </div>
            </div>
        );
    }

    const { matchName, team1Name, team2Name } = matchData;

    const handleBatsman1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBatsman1(event.target.value);
    };

    const handleBatsman2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBatsman2(event.target.value);
    };

    const handleBowlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBowler(event.target.value);
    };

    const handleNext = () => {
        if (!batsman1.trim()) {
            alert('Please enter Batsman 1 name');
            return;
        }
        if (!batsman2.trim()) {
            alert('Please enter Batsman 2 name');
            return;
        }
        if (!bowler.trim()) {
            alert('Please enter Bowler name');
            return;
        }
        setCurrentStep('scoring');
    };

    const handleBack = () => {
        setCurrentStep('batsman-entry');
    };

    const handleEditClick = (player: 'batsman1' | 'batsman2' | 'bowler') => {
        setEditingPlayer(player);
        switch (player) {
            case 'batsman1':
                setEditValue(batsman1);
                break;
            case 'batsman2':
                setEditValue(batsman2);
                break;
            case 'bowler':
                setEditValue(bowler);
                break;
        }
    };

    const handleSaveEdit = () => {
        if (!editValue.trim()) {
            alert('Name cannot be empty');
            return;
        }
        
        switch (editingPlayer) {
            case 'batsman1':
                setBatsman1(editValue);
                break;
            case 'batsman2':
                setBatsman2(editValue);
                break;
            case 'bowler':
                setBowler(editValue);
                break;
        }
        setEditingPlayer(null);
        setEditValue('');
    };

    const handleCancelEdit = () => {
        setEditingPlayer(null);
        setEditValue('');
    };

    const updateBatsmanStats = (batsman: 'batsman1' | 'batsman2', runs: number, balls: number) => {
        if (batsman === 'batsman1') {
            setBatsman1Stats(prev => ({
                runs: prev.runs + runs,
                balls: prev.balls + balls
            }));
        } else {
            setBatsman2Stats(prev => ({
                runs: prev.runs + runs,
                balls: prev.balls + balls
            }));
        }
    };

    const updateBowlerStats = (runs: number, balls: number) => {
        setBowlerStats(prev => ({
            runs: prev.runs + runs,
            balls: prev.balls + balls
        }));
    };

    const handleScoringButton = (score: string) => {
        setCurrentBall(score);
        setBallHistory(prev => [...prev, score]);
        
        if (score === 'Wide' || score === 'No Ball') {
            // Extras: Add 1 run to total and bowler, no ball to batsman
            setTotalRuns(prev => prev + 1);
            updateBowlerStats(1, 0); // 1 run conceded, no ball bowled
        } else {
            const runValue = parseInt(score);
            if (!isNaN(runValue)) {
                // Valid runs: Add to total, striker, and bowler
                setTotalRuns(prev => prev + runValue);
                updateBatsmanStats(striker, runValue, 1); // Add runs and 1 ball faced
                updateBowlerStats(runValue, 1); // Add runs conceded and 1 ball bowled
                
                // Update balls and overs
                setBalls(prev => {
                    if (prev === 5) {
                        setOvers(prevOvers => prevOvers + 1);
                        return 0;
                    }
                    return prev + 1;
                });
            }
        }
        
        console.log(`Scored: ${score}`);
    };

    const handleOut = () => {
        setCurrentBall('W');
        setBallHistory(prev => [...prev, 'W']);
        setWickets(prev => prev + 1);
        
        // Add 1 ball to striker and bowler
        updateBatsmanStats(striker, 0, 1);
        updateBowlerStats(0, 1);
        
        setBalls(prev => {
            if (prev === 5) {
                setOvers(prevOvers => prevOvers + 1);
                return 0;
            }
            return prev + 1;
        });
        
        console.log('Wicket!');
    };

    const formatOvers = () => {
        return `${overs}.${balls}`;
    };

    const renderPlayerDisplay = (playerType: 'batsman1' | 'batsman2' | 'bowler', value: string) => {
        const isEditing = editingPlayer === playerType;
        let stats: PlayerStats | null = null;
        
        if (playerType === 'batsman1') {
            stats = batsman1Stats;
        } else if (playerType === 'batsman2') {
            stats = batsman2Stats;
        } else if (playerType === 'bowler') {
            stats = bowlerStats;
        }
        
        return (
            <div className="player-item">
                {isEditing ? (
                    <div className="edit-container">
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="edit-input"
                            autoFocus
                        />
                        <button onClick={handleSaveEdit} className="save-button">✓</button>
                        <button onClick={handleCancelEdit} className="cancel-button">✕</button>
                    </div>
                ) : (
                    <div className="player-value-container">
                        <span 
                            className="clickable-player-label"
                            onClick={() => handleEditClick(playerType)}
                            title="Click to edit"
                        >
                            <strong>{value}</strong>
                        </span>
                        {stats && (
                            <div className="player-stats">
                                <span className="stat-item">
                                    {playerType === 'bowler' ? 'Runs Given:' : 'Runs:'} {stats.runs}
                                </span>
                                <span className="stat-item">
                                    {playerType === 'bowler' ? 'Balls Bowled:' : 'Balls:'} {stats.balls}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div 
            className="scoring-container"
            style={{ backgroundImage: `url(${cricketBackground})` }}
        >
            <div className="scoring-content">
                <h1>Match Scoring</h1>
                <Link to="/" className="back-link">Back to Home</Link>
                
                <div className="match-info">
                    <h2>{matchName}</h2>
                    <div className="teams-info">
                        <div className="team">
                            <h3>{team1Name}</h3>
                            <p>vs</p>
                            <h3>{team2Name}</h3>
                        </div>
                    </div>
                </div>

                {currentStep === 'batsman-entry' ? (
                    <div className="batsman-entry-section">
                        <h3>Enter Player Details</h3>
                        <div className="batsman-form">
                            <label className="form-label">
                                Batsman 1: &nbsp;
                                <input 
                                    type="text" 
                                    placeholder="Enter batsman 1 name" 
                                    className="form-input"
                                    value={batsman1}
                                    onChange={handleBatsman1Change}
                                />
                            </label>
                            <label className="form-label">
                                Batsman 2: &nbsp;
                                <input 
                                    type="text" 
                                    placeholder="Enter batsman 2 name" 
                                    className="form-input"
                                    value={batsman2}
                                    onChange={handleBatsman2Change}
                                />
                            </label>
                            <label className="form-label">
                                Bowler: &nbsp;
                                <input 
                                    type="text" 
                                    placeholder="Enter bowler name" 
                                    className="form-input"
                                    value={bowler}
                                    onChange={handleBowlerChange}
                                />
                            </label>
                            <button className="next-button" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="scoring-section">
                        <div className="score-header">
                            <div className="score-display">
                                <div className="score-item">
                                    <span className="score-label">Runs:</span>
                                    <span className="score-value">{totalRuns}</span>
                                </div>
                                <div className="score-item">
                                    <span className="score-label">Wickets:</span>
                                    <span className="score-value">{wickets}</span>
                                </div>
                                <div className="score-item">
                                    <span className="score-label">Overs:</span>
                                    <span className="score-value">{formatOvers()}</span>
                                </div>
                            </div>
                        </div>

                        <h3>Scoring Interface</h3>
                        <div className="players-display">
                            <div className="batsmen-display">
                                {renderPlayerDisplay('batsman1', batsman1)}
                                {renderPlayerDisplay('batsman2', batsman2)}
                            </div>
                            <div className="bowler-display">
                                {renderPlayerDisplay('bowler', bowler)}
                            </div>
                        </div>

                        <div className="current-ball-display">
                            <h4>Current Ball</h4>
                            <div className="ball-result">
                                {currentBall ? (
                                    <span className="ball-score">{currentBall}</span>
                                ) : (
                                    <span className="no-ball">No ball scored yet</span>
                                )}
                            </div>
                        </div>

                        <div className="ball-history">
                            <h4>Recent Balls</h4>
                            <div className="history-balls">
                                {ballHistory.slice(-6).reverse().map((ball, index) => (
                                    <span key={index} className="history-ball">
                                        {ball}
                                    </span>
                                ))}
                                {ballHistory.length === 0 && (
                                    <span className="no-history">No balls recorded yet</span>
                                )}
                            </div>
                        </div>
                        
                        <div className="scoring-buttons-container">
                            <h4>Scoring Buttons</h4>
                            <div className="scoring-buttons">
                                <button 
                                    className="scoring-button dot-ball" 
                                    onClick={() => handleScoringButton('0')}
                                >
                                    0
                                </button>
                                <button 
                                    className="scoring-button single" 
                                    onClick={() => handleScoringButton('1')}
                                >
                                    1
                                </button>
                                <button 
                                    className="scoring-button double" 
                                    onClick={() => handleScoringButton('2')}
                                >
                                    2
                                </button>
                                <button 
                                    className="scoring-button triple" 
                                    onClick={() => handleScoringButton('3')}
                                >
                                    3
                                </button>
                                <button 
                                    className="scoring-button four" 
                                    onClick={() => handleScoringButton('4')}
                                >
                                    4
                                </button>
                                <button 
                                    className="scoring-button six" 
                                    onClick={() => handleScoringButton('6')}
                                >
                                    6
                                </button>
                                <button 
                                    className="scoring-button out" 
                                    onClick={handleOut}
                                >
                                    Out
                                </button>
                                <button 
                                    className="scoring-button wide" 
                                    onClick={() => handleScoringButton('Wide')}
                                >
                                    Wide
                                </button>
                                <button 
                                    className="scoring-button no-ball" 
                                    onClick={() => handleScoringButton('No Ball')}
                                >
                                    No Ball
                                </button>
                            </div>
                        </div>

                        <button className="back-button" onClick={handleBack}>
                            Back to Player Entry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scoring;
