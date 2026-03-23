const db = require('../config/db');

exports.getDashboardData = async (req, res) => {
  const userId = req.user.id;

  try {
    /* ============================
       1️⃣ QUIZ STATISTICS
    ============================ */
    const [[quizStats]] = await db.query(
      `
      SELECT
        COUNT(*) AS total_quizzes,
        AVG(score) AS average_quiz_score
      FROM quiz_results
      WHERE user_id = ?
      `,
      [userId]
    );

    /* ============================
       2️⃣ RECENT QUIZZES
    ============================ */
    const [recentQuizzes] = await db.query(
      `
      SELECT difficulty, score, created_at
      FROM quiz_results
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 5
      `,
      [userId]
    );

    /* ============================
       3️⃣ ESSAY STATISTICS
    ============================ */
    const [[essayStats]] = await db.query(
      `
      SELECT
        COUNT(*) AS total_essays,
        AVG(JSON_EXTRACT(evaluation, '$.score')) AS average_essay_score
      FROM essays
      WHERE user_id = ?
      `,
      [userId]
    );

    /* ============================
       4️⃣ RECENT ESSAYS
    ============================ */
    const [recentEssays] = await db.query(
      `
      SELECT title, difficulty, created_at
      FROM essays
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 5
      `,
      [userId]
    );

    /* ============================
       5️⃣ FINAL RESPONSE
    ============================ */
    res.json({
      progress: {
        total_quizzes: quizStats.total_quizzes || 0,
        total_essays: essayStats.total_essays || 0,
        average_quiz_score: quizStats.average_quiz_score || 0,
        average_essay_score: essayStats.average_essay_score || 0,
        streak_days: 0,
        last_activity:
          recentQuizzes[0]?.created_at ||
          recentEssays[0]?.created_at ||
          null
      },
      recentQuizzes,
      recentEssays
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Dashboard fetch failed' });
  }
};
