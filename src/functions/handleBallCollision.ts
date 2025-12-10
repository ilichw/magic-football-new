import { initials } from '../config';

export function handleBallCollision(player: any, ball: any) {
  // Задайте направление отскока мяча
  const bounceStrength = initials.ballBounceStrength;

  // Начавшаяся скорость мяча
  const dx = ball.x - player.x;
  const dy = ball.y - player.y;

  // Нормализовать вектор
  const length = Math.sqrt(dx * dx + dy * dy);
  const normalizedX = dx / length;
  const normalizedY = dy / length;

  // Задаем новую скорость мяча
  ball.setVelocity(bounceStrength * normalizedX, bounceStrength * normalizedY);
}
