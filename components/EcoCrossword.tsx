"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";

interface CrosswordClue {
  id: string;
  number: number;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ecoFact: string;
  points: number;
}

interface CrosswordCell {
  letter: string;
  isBlocked: boolean;
  userInput: string;
  clueNumbers: number[];
  isCorrect: boolean;
  row: number;
  col: number;
}

interface CrosswordBadge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  requirement: number;
  type: 'words' | 'points' | 'level' | 'streak';
  unlocked: boolean;
}

interface GameStats {
  totalPoints: number;
  wordsCompleted: number;
  hintsUsed: number;
  gamesPlayed: number;
  currentStreak: number;
  badges: CrosswordBadge[];
  level: number;
}

const crosswordPuzzles = [
  // Level 1 - Easy
  {
    level: 1,
    title: "Basic Environmental Terms",
    difficulty: "easy",
    gridSize: 8,
    clues: [
      {
        id: "1a",
        number: 1,
        direction: "across" as const,
        clue: "Process of converting waste materials into new materials",
        answer: "RECYCLE",
        startRow: 2,
        startCol: 1,
        difficulty: "easy" as const,
        ecoFact: "Recycling one aluminum can saves enough energy to run a TV for 3 hours!",
        points: 50
      },
      {
        id: "2d",
        number: 2,
        direction: "down" as const,
        clue: "Colorless, odorless liquid essential for life",
        answer: "WATER",
        startRow: 1,
        startCol: 3,
        difficulty: "easy" as const,
        ecoFact: "The average person uses 80-100 gallons of water per day!",
        points: 40
      },
      {
        id: "3a",
        number: 3,
        direction: "across" as const,
        clue: "Large woody plant that produces oxygen",
        answer: "TREE",
        startRow: 4,
        startCol: 2,
        difficulty: "easy" as const,
        ecoFact: "A single tree can absorb 48 pounds of CO₂ per year!",
        points: 40
      },
      {
        id: "4d",
        number: 4,
        direction: "down" as const,
        clue: "Energy from the sun",
        answer: "SOLAR",
        startRow: 2,
        startCol: 6,
        difficulty: "easy" as const,
        ecoFact: "Solar energy could power the entire world with just 1% coverage of the Sahara Desert!",
        points: 50
      }
    ]
  },
  
  // Level 2 - Medium
  {
    level: 2,
    title: "Climate & Ecosystem",
    difficulty: "medium",
    gridSize: 10,
    clues: [
      {
        id: "1a",
        number: 1,
        direction: "across" as const,
        clue: "Long-term change in global or regional climate patterns",
        answer: "CLIMATE",
        startRow: 2,
        startCol: 2,
        difficulty: "medium" as const,
        ecoFact: "Global temperatures have risen by 1.1°C since the late 1800s!",
        points: 80
      },
      {
        id: "2d",
        number: 2,
        direction: "down" as const,
        clue: "Variety of plant and animal life in ecosystems",
        answer: "BIODIVERSITY",
        startRow: 1,
        startCol: 4,
        difficulty: "medium" as const,
        ecoFact: "Earth loses 24 species per day due to human activities!",
        points: 100
      },
      {
        id: "3a",
        number: 3,
        direction: "across" as const,
        clue: "Harmful substance released into the environment",
        answer: "POLLUTION",
        startRow: 5,
        startCol: 1,
        difficulty: "medium" as const,
        ecoFact: "Air pollution causes 7 million premature deaths annually worldwide!",
        points: 90
      },
      {
        id: "4d",
        number: 4,
        direction: "down" as const,
        clue: "Meeting needs without compromising future generations",
        answer: "SUSTAINABLE",
        startRow: 2,
        startCol: 8,
        difficulty: "medium" as const,
        ecoFact: "Sustainable practices can reduce carbon emissions by 50% by 2030!",
        points: 120
      }
    ]
  },

  // Level 3 - Hard
  {
    level: 3,
    title: "Advanced Environmental Science",
    difficulty: "hard",
    gridSize: 12,
    clues: [
      {
        id: "1a",
        number: 1,
        direction: "across" as const,
        clue: "Process by which plants convert CO₂ and sunlight into glucose",
        answer: "PHOTOSYNTHESIS",
        startRow: 2,
        startCol: 1,
        difficulty: "hard" as const,
        ecoFact: "Photosynthesis produces 330 billion tons of oxygen annually!",
        points: 150
      },
      {
        id: "2d",
        number: 2,
        direction: "down" as const,
        clue: "Gradual increase in Earth's average surface temperature",
        answer: "GREENHOUSE",
        startRow: 1,
        startCol: 5,
        difficulty: "hard" as const,
        ecoFact: "The greenhouse effect keeps Earth 33°C warmer than it would be without an atmosphere!",
        points: 140
      },
      {
        id: "3a",
        number: 3,
        direction: "across" as const,
        clue: "Natural process of nutrient cycling in ecosystems",
        answer: "DECOMPOSITION",
        startRow: 6,
        startCol: 2,
        difficulty: "hard" as const,
        ecoFact: "Decomposition returns 90% of nutrients back to the soil!",
        points: 160
      },
      {
        id: "4d",
        number: 4,
        direction: "down" as const,
        clue: "Layer of atmosphere that protects from UV radiation",
        answer: "OZONE",
        startRow: 4,
        startCol: 10,
        difficulty: "hard" as const,
        ecoFact: "The ozone hole over Antarctica has been shrinking since the Montreal Protocol!",
        points: 130
      }
    ]
  }
];

const defaultBadges: CrosswordBadge[] = [
  {
    id: "word_explorer",
    name: "Word Explorer",
    description: "Complete your first crossword puzzle",
    emoji: "🔍",
    requirement: 1,
    type: "words",
    unlocked: false
  },
  {
    id: "sustainability_solver",
    name: "Sustainability Solver",
    description: "Complete 10 words across all puzzles",
    emoji: "🌱",
    requirement: 10,
    type: "words",
    unlocked: false
  },
  {
    id: "eco_champion",
    name: "Eco Champion",
    description: "Earn 1000 total points",
    emoji: "🏆",
    requirement: 1000,
    type: "points",
    unlocked: false
  },
  {
    id: "puzzle_master",
    name: "Puzzle Master",
    description: "Complete Level 3 (Hard) puzzle",
    emoji: "🧩",
    requirement: 3,
    type: "level",
    unlocked: false
  },
  {
    id: "streak_keeper",
    name: "Streak Keeper",
    description: "Solve 5 words in a row without hints",
    emoji: "🔥",
    requirement: 5,
    type: "streak",
    unlocked: false
  }
];

interface EcoCrosswordProps {
  onBack: () => void;
  onPointsEarned: (points: number) => void;
}

export const EcoCrossword = ({ onBack, onPointsEarned }: EcoCrosswordProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [selectedClue, setSelectedClue] = useState<CrosswordClue | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalPoints: 0,
    wordsCompleted: 0,
    hintsUsed: 0,
    gamesPlayed: 0,
    currentStreak: 0,
    badges: defaultBadges,
    level: 1
  });
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showEcoFact, setShowEcoFact] = useState<{show: boolean, fact: string, word: string}>({
    show: false,
    fact: "",
    word: ""
  });

  const currentPuzzle = crosswordPuzzles.find(p => p.level === currentLevel) || crosswordPuzzles[0];

  // Initialize grid
  useEffect(() => {
    initializeGrid();
    loadGameStats();
  }, [currentLevel]);

  // Save game stats
  useEffect(() => {
    localStorage.setItem("eco-crossword-stats", JSON.stringify(gameStats));
  }, [gameStats]);

  const loadGameStats = () => {
    const saved = localStorage.getItem("eco-crossword-stats");
    if (saved) {
      setGameStats(JSON.parse(saved));
    }
  };

  const initializeGrid = () => {
    const size = currentPuzzle.gridSize;
    const newGrid: CrosswordCell[][] = [];
    
    // Initialize empty grid
    for (let row = 0; row < size; row++) {
      newGrid[row] = [];
      for (let col = 0; col < size; col++) {
        newGrid[row][col] = {
          letter: "",
          isBlocked: true,
          userInput: "",
          clueNumbers: [],
          isCorrect: false,
          row,
          col
        };
      }
    }

    // Place clues in grid
    currentPuzzle.clues.forEach(clue => {
      for (let i = 0; i < clue.answer.length; i++) {
        const row = clue.direction === 'across' ? clue.startRow : clue.startRow + i;
        const col = clue.direction === 'across' ? clue.startCol + i : clue.startCol;
        
        if (row < size && col < size) {
          newGrid[row][col].letter = clue.answer[i];
          newGrid[row][col].isBlocked = false;
          if (i === 0) {
            newGrid[row][col].clueNumbers.push(clue.number);
          }
        }
      }
    });

    setGrid(newGrid);
    setCompletedWords(new Set());
    setGameCompleted(false);
  };

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isBlocked) return;
    
    setSelectedCell({ row, col });
    
    // Find clue that starts at or includes this cell
    const clue = currentPuzzle.clues.find(c => {
      const wordCells = getWordCells(c);
      return wordCells.some(cell => cell.row === row && cell.col === col);
    });
    
    if (clue) {
      setSelectedClue(clue);
    }
  };

  const handleInputChange = (value: string, row: number, col: number) => {
    if (value.length > 1) return;
    
    const newGrid = [...grid];
    newGrid[row][col].userInput = value.toUpperCase();
    setGrid(newGrid);
    
    // Check if word is completed
    checkWordCompletion();
  };

  const getWordCells = (clue: CrosswordClue) => {
    const cells = [];
    for (let i = 0; i < clue.answer.length; i++) {
      const row = clue.direction === 'across' ? clue.startRow : clue.startRow + i;
      const col = clue.direction === 'across' ? clue.startCol + i : clue.startCol;
      cells.push({ row, col });
    }
    return cells;
  };

  const checkWordCompletion = () => {
    currentPuzzle.clues.forEach(clue => {
      if (completedWords.has(clue.id)) return;
      
      const cells = getWordCells(clue);
      const userWord = cells.map(cell => grid[cell.row][cell.col].userInput).join('');
      
      if (userWord === clue.answer) {
        // Word completed!
        setCompletedWords(prev => {
          const newSet = new Set(prev);
          newSet.add(clue.id);
          return newSet;
        });
        
        // Update stats
        setGameStats(prev => ({
          ...prev,
          totalPoints: prev.totalPoints + clue.points,
          wordsCompleted: prev.wordsCompleted + 1,
          currentStreak: prev.currentStreak + 1
        }));
        
        // Mark cells as correct
        const newGrid = [...grid];
        cells.forEach(cell => {
          newGrid[cell.row][cell.col].isCorrect = true;
        });
        setGrid(newGrid);
        
        // Show eco-fact
        setShowEcoFact({
          show: true,
          fact: clue.ecoFact,
          word: clue.answer
        });
        
        // Award points
        onPointsEarned(clue.points);
        
        // Check badges
        checkBadges();
        
        toast.success(`✅ Correct! "${clue.answer}" +${clue.points} points!`);
        
        // Check if puzzle completed
        if (completedWords.size + 1 === currentPuzzle.clues.length) {
          setGameCompleted(true);
          toast.success("🎉 Puzzle Complete! Amazing work!");
        }
      }
    });
  };

  const checkBadges = () => {
    const newBadges = gameStats.badges.map(badge => {
      if (badge.unlocked) return badge;
      
      let requirement = 0;
      switch (badge.type) {
        case 'words':
          requirement = gameStats.wordsCompleted + 1;
          break;
        case 'points':
          requirement = gameStats.totalPoints;
          break;
        case 'level':
          requirement = currentLevel;
          break;
        case 'streak':
          requirement = gameStats.currentStreak;
          break;
      }
      
      if (requirement >= badge.requirement) {
        toast.success(`🏆 Badge Unlocked: ${badge.name}!`);
        return { ...badge, unlocked: true };
      }
      
      return badge;
    });
    
    setGameStats(prev => ({ ...prev, badges: newBadges }));
  };

  const useHint = () => {
    if (!selectedClue) {
      toast.error("Please select a clue first!");
      return;
    }
    
    const cells = getWordCells(selectedClue);
    const emptyCell = cells.find(cell => !grid[cell.row][cell.col].userInput);
    
    if (emptyCell) {
      const newGrid = [...grid];
      newGrid[emptyCell.row][emptyCell.col].userInput = newGrid[emptyCell.row][emptyCell.col].letter;
      setGrid(newGrid);
      
      setGameStats(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
      toast("💡 Hint used! Letter revealed.", { icon: "💡" });
      checkWordCompletion();
    }
  };

  const nextLevel = () => {
    if (currentLevel < crosswordPuzzles.length) {
      setCurrentLevel(prev => prev + 1);
      setGameStats(prev => ({ ...prev, level: Math.max(prev.level, currentLevel + 1) }));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompletionPercentage = () => {
    return (completedWords.size / currentPuzzle.clues.length) * 100;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                🧩 Eco Crossword Puzzle
              </CardTitle>
              <p className="text-gray-600 mt-1">{currentPuzzle.title}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getDifficultyColor(currentPuzzle.difficulty)}>
                Level {currentLevel} - {currentPuzzle.difficulty.toUpperCase()}
              </Badge>
              <Button onClick={onBack} variant="outline">
                ← Back
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{gameStats.totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{gameStats.wordsCompleted}</div>
              <div className="text-sm text-gray-600">Words Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{completedWords.size}/{currentPuzzle.clues.length}</div>
              <div className="text-sm text-gray-600">This Puzzle</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{gameStats.currentStreak}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Puzzle Progress</span>
              <span>{Math.round(getCompletionPercentage())}%</span>
            </div>
            <Progress value={getCompletionPercentage()} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crossword Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>🎯 Crossword Grid</span>
                <Button onClick={useHint} disabled={!selectedClue} size="sm">
                  💡 Hint
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-1 bg-gray-100 p-4 rounded-lg" 
                   style={{ gridTemplateColumns: `repeat(${currentPuzzle.gridSize}, 1fr)` }}>
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        aspect-square border-2 flex items-center justify-center text-sm font-bold relative cursor-pointer
                        ${cell.isBlocked 
                          ? 'bg-gray-800 border-gray-800' 
                          : cell.isCorrect
                            ? 'bg-green-200 border-green-400'
                            : selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                              ? 'bg-blue-200 border-blue-400'
                              : 'bg-white border-gray-300 hover:bg-gray-50'
                        }
                      `}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {!cell.isBlocked && (
                        <>
                          {cell.clueNumbers.map(num => (
                            <span key={num} className="absolute top-0 left-1 text-xs text-blue-600">
                              {num}
                            </span>
                          ))}
                          <input
                            type="text"
                            value={cell.userInput}
                            onChange={(e) => handleInputChange(e.target.value, rowIndex, colIndex)}
                            className="w-full h-full text-center bg-transparent border-none outline-none text-lg font-bold"
                            maxLength={1}
                          />
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clues Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>📝 Clues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-gray-700 mb-2">ACROSS</h4>
                <div className="space-y-2">
                  {currentPuzzle.clues.filter(c => c.direction === 'across').map(clue => (
                    <div 
                      key={clue.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        completedWords.has(clue.id) 
                          ? 'bg-green-50 border-green-200' 
                          : selectedClue?.id === clue.id
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedClue(clue)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-600">{clue.number}.</span>
                        <span className="text-green-600 font-medium">+{clue.points}pts</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{clue.clue}</p>
                      {completedWords.has(clue.id) && (
                        <div className="mt-2 flex items-center text-green-600">
                          <span className="text-xs">✅ {clue.answer}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-gray-700 mb-2">DOWN</h4>
                <div className="space-y-2">
                  {currentPuzzle.clues.filter(c => c.direction === 'down').map(clue => (
                    <div 
                      key={clue.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        completedWords.has(clue.id) 
                          ? 'bg-green-50 border-green-200' 
                          : selectedClue?.id === clue.id
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedClue(clue)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-600">{clue.number}.</span>
                        <span className="text-green-600 font-medium">+{clue.points}pts</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{clue.clue}</p>
                      {completedWords.has(clue.id) && (
                        <div className="mt-2 flex items-center text-green-600">
                          <span className="text-xs">✅ {clue.answer}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>🏆 Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {gameStats.badges.map(badge => (
                  <div 
                    key={badge.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg ${
                      badge.unlocked ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                    }`}
                  >
                    <span className={`text-2xl ${badge.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {badge.emoji}
                    </span>
                    <div className="flex-1">
                      <div className={`font-medium ${badge.unlocked ? 'text-yellow-700' : 'text-gray-500'}`}>
                        {badge.name}
                      </div>
                      <div className="text-xs text-gray-600">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Game Complete Modal */}
      {gameCompleted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Puzzle Complete!</h3>
              <p className="text-gray-600 mb-4">
                Congratulations! You've completed the {currentPuzzle.title} puzzle!
              </p>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <div className="text-lg font-bold text-green-600">
                  Total Points Earned: {currentPuzzle.clues.reduce((sum, clue) => sum + clue.points, 0)}
                </div>
              </div>
              <div className="space-y-2">
                {currentLevel < crosswordPuzzles.length && (
                  <Button onClick={nextLevel} className="w-full">
                    🚀 Next Level
                  </Button>
                )}
                <Button onClick={() => setCurrentLevel(1)} variant="outline" className="w-full">
                  🔄 Play Again
                </Button>
                <Button onClick={onBack} variant="outline" className="w-full">
                  ← Back to Games
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Eco Fact Modal */}
      {showEcoFact.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-green-600 mb-2">Eco Fact: {showEcoFact.word}</h3>
              <p className="text-gray-700 mb-4">{showEcoFact.fact}</p>
              <Button 
                onClick={() => setShowEcoFact({ show: false, fact: "", word: "" })} 
                className="w-full"
              >
                Continue Playing 🎮
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};