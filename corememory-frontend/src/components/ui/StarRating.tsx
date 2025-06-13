import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const maxStars = 5;
  const stars: React.ReactNode[] = [];

  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="star filled" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="star half-filled" />);
    } else {
      stars.push(<FaRegStar key={i} className="star empty" />);
    }
  }

  return (
    <div className="star-rating">
      {stars}
      <span className="rating-number">{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
