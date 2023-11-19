/**
 * @description 랜덤한 색상을 반환해주는 함수
 * @param {number} alpha
 */
export function getRandomColor(alpha = 1) {
  const randomNumbers = Array.from({ length: 3 }, () => Math.floor(Math.random() * 50) + 150);
  return `rgba(${randomNumbers[0]}, ${randomNumbers[1]}, ${randomNumbers[2]}, ${alpha})`;
}
