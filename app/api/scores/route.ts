import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, course, score, totalQuestions, completedAt } = body;

    // Validate required fields
    if (!username || !course || score === undefined || !totalQuestions) {
      return NextResponse.json(
        { error: 'Missing required fields: username, course, score, totalQuestions' },
        { status: 400 }
      );
    }

    // Calculate percentage and determine medal
    const percentage = (score / totalQuestions) * 100;
    let medal = 'bronze';
    
    if (percentage > 70) {
      medal = 'gold';
    } else if (percentage > 40) {
      medal = 'silver';
    }

    // Create score entry
    const scoreEntry = {
      id: `${username}_${course}_${Date.now()}`,
      username,
      course,
      score: parseInt(score),
      totalQuestions: parseInt(totalQuestions),
      percentage,
      medal,
      completedAt: completedAt || new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: scoreEntry,
      message: `Score saved successfully! You earned a ${medal} medal with ${percentage.toFixed(1)}%`
    });

  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json(
      { error: 'Failed to save score' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Score API endpoint',
    endpoints: {
      POST: '/api/scores - Save a new score',
      GET: '/api/scores - Get this help message'
    }
  });
}