// Calculate a normalized value between 0 and 1.
// Lower actual values receive a higher score.
const normalizeValue = (value, min, max) => {
  if (max === min) {
    return 1;
  }

  return 1 - (value - min) / (max - min);
};

// Calculate score for a single candidate
const calculateCandidateScore = (candidate, candidates, preference) => {
  const travelTimes = candidates.map((item) => item.travelTime);
  const fares = candidates.map((item) => item.fare);
  const walkingDistances = candidates.map(
    (item) =>
      item.walkingToOriginStop + item.walkingFromDestinationStop
  );
  const transfers = candidates.map((item) => item.transfers);

  const minTravelTime = Math.min(...travelTimes);
  const maxTravelTime = Math.max(...travelTimes);

  const minFare = Math.min(...fares);
  const maxFare = Math.max(...fares);

  const minWalking = Math.min(...walkingDistances);
  const maxWalking = Math.max(...walkingDistances);

  const minTransfers = Math.min(...transfers);
  const maxTransfers = Math.max(...transfers);

  const travelTimeScore = normalizeValue(
    candidate.travelTime,
    minTravelTime,
    maxTravelTime
  );

  const fareScore = normalizeValue(
    candidate.fare,
    minFare,
    maxFare
  );

  const walkingDistance =
    candidate.walkingToOriginStop +
    candidate.walkingFromDestinationStop;

  const walkingScore = normalizeValue(
    walkingDistance,
    minWalking,
    maxWalking
  );

  const transferScore = normalizeValue(
    candidate.transfers,
    minTransfers,
    maxTransfers
  );

  let score;

  switch (preference) {
    case "fastest":
      score = travelTimeScore;
      break;

    case "cheapest":
      score = fareScore;
      break;

    case "minimum_walking":
      score = walkingScore;
      break;

    case "minimum_transfers":
      score = transferScore;
      break;

    case "most_reliable":
      // Reliability will be implemented later.
      // For now, use a balanced score.
      score =
        travelTimeScore * 0.4 +
        fareScore * 0.2 +
        walkingScore * 0.2 +
        transferScore * 0.2;
      break;

    default:
      score =
        travelTimeScore * 0.4 +
        fareScore * 0.2 +
        walkingScore * 0.2 +
        transferScore * 0.2;
  }

  return Number(score.toFixed(4));
};

// Rank all candidates
const rankCandidates = (candidates, preference = "fastest") => {
  if (!candidates || candidates.length === 0) {
    return [];
  }

  const scoredCandidates = candidates.map((candidate) => ({
    ...candidate,
    score: calculateCandidateScore(
      candidate,
      candidates,
      preference
    ),
  }));

  return scoredCandidates.sort((a, b) => b.score - a.score);
};

module.exports = {
  calculateCandidateScore,
  rankCandidates,
};