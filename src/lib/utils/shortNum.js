export function shortNum(points, score) {
	if (points) return points;
	score = parseInt(score.replaceAll(',', ''));
	if (score > 1000000) return (score / 1000000).toFixed(1) + 'M';
	else if (score > 1000) return (score / 1000).toFixed(1) + 'k';
	else return score;
}
