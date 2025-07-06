import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ToggleButtonGroup, ToggleButton, Box, Typography, Paper } from '@mui/material';
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
    const [currentStep, setCurrentStep] = useState<'batsman-entry' | 'scoring' | 'new-bowler' | 'dismissal-type' | 'new-batsman'>('batsman-entry');
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
    const [newBowler, setNewBowler] = useState<string>('');
    const [showNewBowlerInput, setShowNewBowlerInput] = useState<boolean>(false);
    const [dismissalType, setDismissalType] = useState<string>('');
    const [selectedDismissal, setSelectedDismissal] = useState<string>('');
    const [newBatsman, setNewBatsman] = useState<string>('');
    const [dismissedBatsman, setDismissedBatsman] = useState<'batsman1' | 'batsman2'>('batsman1');

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

    const handleNewBowlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewBowler(event.target.value);
    };

    const handleNewBowlerSubmit = () => {
        if (!newBowler.trim()) {
            alert('Please enter the new bowler name');
            return;
        }
        setBowler(newBowler);
        setBowlerStats({ runs: 0, balls: 0 }); // Reset bowler stats for new bowler
        setNewBowler('');
        setShowNewBowlerInput(false);
        setCurrentStep('scoring');
    };

    const handleOverComplete = () => {
        // Change striker after over completion
        setStriker(prev => prev === 'batsman1' ? 'batsman2' : 'batsman1');
        
        // Ask for new bowler
        setShowNewBowlerInput(true);
        setCurrentStep('new-bowler');
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
                
                // Change striker if 1 or 3 runs are scored
                if (runValue === 1 || runValue === 3) {
                    setStriker(prev => prev === 'batsman1' ? 'batsman2' : 'batsman1');
                }
                
                // Update balls and overs
                setBalls(prev => {
                    const newBalls = prev + 1;
                    if (newBalls === 6) {
                        // Over completed
                        setOvers(prevOvers => prevOvers + 1);
                        setTimeout(() => handleOverComplete(), 100); // Small delay to show the last ball
                        return 0;
                    }
                    return newBalls;
                });
            }
        }
        
        console.log(`Scored: ${score}`);
    };

    const handleOut = () => {
        setCurrentStep('dismissal-type');
    };

    const handleDismissalType = (type: string) => {
        setDismissalType(type);
        
        // Record the wicket with dismissal type
        const wicketRecord = `W (${type})`;
        setCurrentBall(wicketRecord);
        setBallHistory(prev => [...prev, wicketRecord]);
        setWickets(prev => prev + 1);
        
        // Store which batsman was dismissed
        setDismissedBatsman(striker);
        
        // Add 1 ball to striker and bowler
        updateBatsmanStats(striker, 0, 1);
        updateBowlerStats(0, 1);
        
        setBalls(prev => {
            const newBalls = prev + 1;
            if (newBalls === 6) {
                // Over completed
                setOvers(prevOvers => prevOvers + 1);
                setTimeout(() => handleOverComplete(), 100); // Small delay to show the last ball
                return 0;
            }
            return newBalls;
        });
        
        // Go to new batsman entry
        setCurrentStep('new-batsman');
        setSelectedDismissal(''); // Reset selection
        
        console.log(`Wicket! Dismissal type: ${type}`);
    };

    const handleDismissalSelection = (event: React.MouseEvent<HTMLElement>, newSelection: string) => {
        if (newSelection !== null) {
            setSelectedDismissal(newSelection);
        }
    };

    const handleConfirmDismissal = () => {
        if (selectedDismissal) {
            handleDismissalType(selectedDismissal);
        }
    };

    const handleNewBatsmanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewBatsman(event.target.value);
    };

    const handleNewBatsmanSubmit = () => {
        if (!newBatsman.trim()) {
            alert('Please enter the new batsman name');
            return;
        }
        
        // Replace the dismissed batsman with the new batsman
        if (dismissedBatsman === 'batsman1') {
            setBatsman1(newBatsman);
            setBatsman1Stats({ runs: 0, balls: 0 }); // Reset stats for new batsman
            setStriker('batsman1'); // Make the new batsman the striker
        } else {
            setBatsman2(newBatsman);
            setBatsman2Stats({ runs: 0, balls: 0 }); // Reset stats for new batsman
            setStriker('batsman2'); // Make the new batsman the striker
        }
        
        setNewBatsman('');
        setCurrentStep('scoring');
        
        console.log(`New batsman: ${newBatsman} replaces ${dismissedBatsman}`);
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
        
        // Check if this is the current striker (only for batsmen)
        const isCurrentStriker = (playerType === 'batsman1' && striker === 'batsman1') || 
                                (playerType === 'batsman2' && striker === 'batsman2');
        
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
                            {isCurrentStriker && <span className="striker-indicator">*</span>}
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
                ) : currentStep === 'new-bowler' ? (
                    <div className="new-bowler-section">
                        <h3>Over Complete!</h3>
                        <p>Current Over: {overs}.0</p>
                        <p>Striker has changed to: {striker === 'batsman1' ? batsman1 : batsman2}</p>
                        <div className="new-bowler-form">
                            <label className="form-label">
                                New Bowler: &nbsp;
                                <input 
                                    type="text" 
                                    placeholder="Enter new bowler name" 
                                    className="form-input"
                                    value={newBowler}
                                    onChange={handleNewBowlerChange}
                                />
                            </label>
                            <button className="next-button" onClick={handleNewBowlerSubmit}>
                                Continue
                            </button>
                        </div>
                    </div>
                ) : currentStep === 'dismissal-type' ? (
                    <div className="dismissal-type-section">
                        <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
                            <Typography variant="h4" component="h3" gutterBottom align="center" color="primary">
                                How was the batsman dismissed?
                            </Typography>
                            <Typography variant="h6" component="p" gutterBottom align="center" color="text.secondary">
                                Batsman: <strong>{striker === 'batsman1' ? batsman1 : batsman2}</strong>
                            </Typography>
                            
                            <Box sx={{ mt: 3, mb: 3 }}>
                                <ToggleButtonGroup
                                    value={selectedDismissal}
                                    exclusive
                                    onChange={handleDismissalSelection}
                                    aria-label="dismissal type"
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                        gap: 1,
                                        width: '100%'
                                    }}
                                >
                                    <ToggleButton 
                                        value="Bowled" 
                                        aria-label="bowled"
                                        sx={{
                                            py: 2,
                                            px: 2,
                                            fontWeight: 'bold',
                                            '&.Mui-selected': {
                                                backgroundColor: '#ff6b6b',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#ff5252'
                                                }
                                            }
                                        }}
                                    >
                                        Bowled
                                    </ToggleButton>
                                    <ToggleButton 
                                        value="Caught" 
                                        aria-label="caught"
                                        sx={{
                                            py: 2,
                                            px: 2,
                                            fontWeight: 'bold',
                                            '&.Mui-selected': {
                                                backgroundColor: '#4ecdc4',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#26a69a'
                                                }
                                            }
                                        }}
                                    >
                                        Caught
                                    </ToggleButton>
                                    <ToggleButton 
                                        value="LBW" 
                                        aria-label="lbw"
                                        sx={{
                                            py: 2,
                                            px: 2,
                                            fontWeight: 'bold',
                                            '&.Mui-selected': {
                                                backgroundColor: '#45b7d1',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#1976d2'
                                                }
                                            }
                                        }}
                                    >
                                        LBW
                                    </ToggleButton>
                                    <ToggleButton 
                                        value="Run Out" 
                                        aria-label="run out"
                                        sx={{
                                            py: 2,
                                            px: 2,
                                            fontWeight: 'bold',
                                            '&.Mui-selected': {
                                                backgroundColor: '#96ceb4',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#66bb6a'
                                                }
                                            }
                                        }}
                                    >
                                        Run Out
                                    </ToggleButton>
                                    <ToggleButton 
                                        value="Stumped" 
                                        aria-label="stumped"
                                        sx={{
                                            py: 2,
                                            px: 2,
                                            fontWeight: 'bold',
                                            '&.Mui-selected': {
                                                backgroundColor: '#feca57',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#ffa000'
                                                }
                                            }
                                        }}
                                    >
                                        Stumped
                                    </ToggleButton>
                                    <ToggleButton 
                                        value="Retired Out" 
                                        aria-label="retired out"
                                        sx={{
                                            py: 2,
                                            px: 2,
                                            fontWeight: 'bold',
                                            '&.Mui-selected': {
                                                backgroundColor: '#ff9ff3',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#e91e63'
                                                }
                                            }
                                        }}
                                    >
                                        Retired Out
                                    </ToggleButton>
                                    <ToggleButton 
                                        value="Other" 
                                        aria-label="other"
                                        sx={{
                                            py: 2,
                                            px: 2,
                                            fontWeight: 'bold',
                                            '&.Mui-selected': {
                                                backgroundColor: '#54a0ff',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#2196f3'
                                                }
                                            }
                                        }}
                                    >
                                        Other
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <button 
                                    className="confirm-button" 
                                    onClick={handleConfirmDismissal}
                                    disabled={!selectedDismissal}
                                    style={{
                                        padding: '12px 24px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        backgroundColor: selectedDismissal ? '#4caf50' : '#ccc',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: selectedDismissal ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Confirm Dismissal
                                </button>
                            </Box>
                        </Paper>
                    </div>
                ) : currentStep === 'new-batsman' ? (
                    <div className="new-batsman-section">
                        <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, margin: '0 auto' }}>
                            <Typography variant="h4" component="h3" gutterBottom align="center" color="primary">
                                New Batsman Required
                            </Typography>
                            <Typography variant="h6" component="p" gutterBottom align="center" color="text.secondary">
                                <strong>{dismissedBatsman === 'batsman1' ? batsman1 : batsman2}</strong> was dismissed
                            </Typography>
                            <Typography variant="body1" component="p" gutterBottom align="center" color="text.secondary">
                                Dismissal: <strong>{dismissalType}</strong>
                            </Typography>
                            
                            <Box sx={{ mt: 3 }}>
                                <label className="form-label">
                                    New Batsman: &nbsp;
                                    <input 
                                        type="text" 
                                        placeholder="Enter new batsman name" 
                                        className="form-input"
                                        value={newBatsman}
                                        onChange={handleNewBatsmanChange}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            fontSize: '16px',
                                            border: '2px solid #ddd',
                                            borderRadius: '8px',
                                            marginTop: '8px'
                                        }}
                                    />
                                </label>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <button 
                                    className="next-button" 
                                    onClick={handleNewBatsmanSubmit}
                                    style={{
                                        padding: '12px 24px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        backgroundColor: '#4caf50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Continue
                                </button>
                            </Box>
                        </Paper>
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
