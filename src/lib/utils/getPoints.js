export function getPoints(points, score) {
  if (points) return points +" points";
  if (score > 1000000)
    return (score / 1000000).toFixed(1) + "M points";
  else if (score > 1000)
    return (score / 1000).toFixed(1) + "k points";
  else return score+" points";

}
