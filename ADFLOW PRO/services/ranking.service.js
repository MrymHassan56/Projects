const calculateRankScore = ({
  isFeatured,
  packageWeight,
  publishAt,
  adminBoost = 0,
}) => {
  let score = 0;

  if (isFeatured) {
    score += 50;
  }

  score += packageWeight * 10;

  const hoursSincePublish =
    (Date.now() - new Date(publishAt)) /
    (1000 * 60 * 60);

  if (hoursSincePublish <= 24) {
    score += 20;
  }

  else if (hoursSincePublish <= 72) {
    score += 10;
  }

  else if (hoursSincePublish <= 168) {
    score += 5;
  }

  score += adminBoost;

  return score;
};

module.exports = {
  calculateRankScore,
};