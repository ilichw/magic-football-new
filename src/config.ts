export const constants = {
  // настройки экрана
  screenWidth: 800,
  screenHeight: 600,

  // настройки карты
  mapWidth: 640,
  mapHeight: 480,
  tileSize: 8,

  // настройки ворот
  goalAreaOffset: 8, // один тайл карты
  goalAreaWidth: 32, // 4 тайла
  goalAreaHeight: 112, // 7 + 7 тайлов 56+56
  goalTriggerCooldown: 150, // время реагирования на гол, мс
};

export const initials = {
  playerX: 200,
  botX: 600,
  playerSpeed: 200,
  ballBounceStrength: 320,
  ballSlowdownRatio: 0.995,
};
