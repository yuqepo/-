// ==========================================
// 1. 화면 상태 제어 변수 
// ==========================================
let screenState = "TITLE"; // TITLE, LEVEL_SELECT, GAME_PLAY, ENDING
let popupState = "NONE";   // NONE, MANUAL, CUSTOM
let currentShape = "CIRCLE";
// ==========================================
// 2. 게임 플레이 엔진 변수
// ==========================================
let gameTimer = 0;          // deltaTime을 누적할 타이머 (초 단위)
let angle = 0;              // 플레이어의 현재 각도 (0 ~ 360도)
const ROTATE_SPEED = 120;   // 1초당 회전할 각도 (120도씩 회전)
const TRACK_RADIUS = 150;   // 원형 궤도의 반지름
const EDGE_OFFSET = 8;      // 궤도선(두께6) 위에 딱 밀착되게 보일 미세 오프셋 (억까 방지 비주얼)

let isOutside = false;      // 플레이어 위치 상태 (false: 안쪽선 밀착, true: 바깥쪽선 밀착)
let score = 0;
let lastSaveTime = 0;       // 사망 시 부활할 세이브포인트 시간

// [🔥 카운트다운 및 오디오 지연 랙 차단 시스템 변수]
let isCountingDown = false;    // 현재 카운트다운 중인지 여부
let countdownStartMillis = 0;  // 카운트다운이 시작된 실제 실시간(millis)
const COUNTDOWN_DURATION = 3000; // 카운트다운 총 시간 (3000ms = 3초)
let targetRespawnTime = 0;     // 부활할 목표 시간 저장용 임시 변수

// 공 커스텀 디자인용 색상 변수
let playerColor;

// bgm
let bgm;

// ==========================================
// 3. 박자 데이터
// ==========================================
const originalNotes = [
  3.50, 5.40, 6.61, 8.18, 9.84, 11.48, 14.83, 16.50, 18.27, 20.27, 21.54, 23.35, 24.99, 26.66, 28.34, 30.05, 31.81, 33.54, 34.45, 35.32, 37.03, 38.78, 40.45, 41.39, 42.29, 44.00, 45.60, 47.40, 49.12, 50.85, 52.57, 54.30, 56.00, 57.76, 59.43, 61.15, 62.07, 62.85, 64.53, 66.19, 67.92, 68.71, 69.59, 70.43, 71.27, 72.05, 72.91, 73.74, 74.54, 76.13, 77.77, 79.39, 80.97, 82.68, 84.31, 85.96, 87.68, 89.34, 90.91, 92.64, 94.23, 95.18, 95.99, 97.51, 99.26, 100.95, 102.64 
];

let obstacles = [];
const SPAWN_ADVANCE_TIME = 2.0; // 2초 전에 장애물이 미리 시야에 등장해 중심을 향해 좁혀옴

// ==========================================
// 4. 시스템 빌드 및 초기화
// ==========================================
function setup() {
  createCanvas(windowWidth, windowHeight); 
  playerColor = color(255, 100, 100);     // 기본 공 색상 (빨간색)
  initObstacles();                        // 억까 방지 배치 엔진 가동
}

function preload(){
  bgm = loadSound('assets/music_Audio Trimmer.mp3');
}

// 억까 방지 전처리 함수
function initObstacles() {
  obstacles = [];
  let currentLane = "OUTSIDE";
  
  for (let i = 0; i < originalNotes.length; i++) {
    let t = originalNotes[i];
    
    if (i > 0 && (t - originalNotes[i-1] >= 0.4)) {
      currentLane = (currentLane === "OUTSIDE") ? "INSIDE" : "OUTSIDE";
    }
    
    // 특정 노트 구간을 세이브포인트 보석으로 변경 (예: 47.40초, 74.54초 근처 노트)
    let isSave = (t === 47.40 || t === 74.54); 

    obstacles.push({
      hitTime: t,
      type: currentLane,
      isSavePoint: isSave,
      cleared: false
    });
  }
}

// [수정된 파트] 게임 플레이 리셋 시스템 -> 카운트다운 유도형으로 리모델링
function resetGamePlay(targetTime) {
  targetRespawnTime = targetTime;
  gameTimer = targetTime;
  angle = (targetTime * ROTATE_SPEED) % 360;
  isOutside = false;
  
  // 타겟 시간 이후의 장애물들만 부활 처리
  for (let obs of obstacles) {
    if (obs.hitTime >= targetTime) {
      obs.cleared = false;
    }
  }
  
  if (bgm) bgm.stop(); // 일단 음악을 완전히 멈추고 안전하게 카운트다운 시작
  
  // 카운트다운 시스템 스위치 ON
  isCountingDown = true;
  countdownStartMillis = millis();
}

function draw() {
  background(253, 251, 241); // 크림색 배경

  if (screenState === "TITLE") {
    drawTitleScreen();
  } else if (screenState === "LEVEL_SELECT") {
    drawLevelSelectScreen();
    if (popupState === "MANUAL") drawManualPopup();
    else if (popupState === "CUSTOM") drawCustomPopup();
  } else if (screenState === "GAME_PLAY") {
    runGameEngine();
    resetMatrix(); 
    fill(0); // 검은색 텍스트
    textSize(20);
    textAlign(LEFT, TOP);
    text("SCORE: " + score, 30, 30);
    text("TIME: " + gameTimer.toFixed(2) + "s", 30, 60);
    textSize(14);
    text("부활 체크포인트: " + lastSaveTime.toFixed(2) + "s", 30, 90);
    textAlign(CENTER, BOTTOM);
    textSize(16);
    text("스페이스바: 안/밖 라인 변경  |  Esc: 선택 화면으로 이동", width / 2, height - 30);
  } else if (screenState === "ENDING") {
    drawEndingScreen();
  }
}

// ==========================================
// 5. 엔진 
// ==========================================
function runGameEngine() {
  if (isCountingDown) {
    gameTimer = targetRespawnTime;
    angle = (gameTimer * ROTATE_SPEED) % 360;
    if (millis() - countdownStartMillis >= COUNTDOWN_DURATION) {
      isCountingDown = false;
      if (bgm) { if (targetRespawnTime > 0) { bgm.jump(targetRespawnTime); } bgm.play(); }
    }
  } else {
    gameTimer += deltaTime / 1000;
    angle = (gameTimer * ROTATE_SPEED) % 360;
  }

  if (gameTimer > originalNotes[originalNotes.length - 1] + 2) {
    if (bgm) bgm.stop();
    screenState = "ENDING";
    return;
  }

  translate(width / 2, height / 2);
  
  // 궤도선
  noFill();
  stroke(50, 50, 50, 200);
  strokeWeight(6);
  if (currentShape === "CIRCLE") {
    ellipse(0, 0, TRACK_RADIUS * 2, TRACK_RADIUS * 2);
  } else {
    beginShape();
    for(let i = 0; i < 360; i += 1) { 
      let p = getPositionOnShape(i, false);
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
  }

  // 플레이어 및 장애물 
  let pos = getPositionOnShape(angle, isOutside);
  noStroke();
  fill(playerColor);
  ellipse(pos.x, pos.y, 22, 22);

  for (let obs of obstacles) {
    let timeLeft = obs.hitTime - gameTimer;
    if (timeLeft > -0.5 && timeLeft <= SPAWN_ADVANCE_TIME) {
      let obsAngle = angle + (timeLeft * ROTATE_SPEED);
      let obsPos = getPositionOnShape(obsAngle, obs.type === "OUTSIDE");
      if (obs.isSavePoint) {
        push(); translate(obsPos.x, obsPos.y); rotate(radians(45));
        fill(obs.cleared ? color(46, 204, 113, 80) : color(46, 204, 113));
        rectMode(CENTER); rect(0, 0, 16, 16); pop();
        if (!isCountingDown && abs(timeLeft) < 0.05 && !obs.cleared) { lastSaveTime = obs.hitTime; obs.cleared = true; score += 100; }
      } else {
        push(); translate(obsPos.x, obsPos.y); rotate(radians(obsAngle) + (obs.type === "OUTSIDE" ? -PI/2 : PI/2));
        fill(255, 230, 0); triangle(-8, 6, 8, 6, 0, -10); pop();
        if (!isCountingDown && abs(timeLeft) < 0.04 && !obs.cleared) {
          if ((isOutside ? "OUTSIDE" : "INSIDE") === obs.type) { resetGamePlay(lastSaveTime); break; }
          else { obs.cleared = true; score += 10; }
        }
      }
    }
  }
  if (isCountingDown) drawCountdownOverlay();
}

function drawCountdownOverlay() {
  push(); textAlign(CENTER, CENTER);
  let elapsed = millis() - countdownStartMillis;
  let remainingSec = ceil((COUNTDOWN_DURATION - elapsed) / 1000);
  let textBounce = 1 + ((elapsed % 1000) / 1000) * 0.4;
  if (remainingSec > 0) {
    textSize(50 * textBounce); fill(200, 50, 50); text(remainingSec, 0, -10);
  } else {
    textSize(55); fill(0, 150, 100); text("READY!", 0, -10);
  }
  pop();
}

// ==========================================
// 6. UI 화면 연출 파트 
// ==========================================
function drawTitleScreen() {
  textAlign(CENTER, CENTER);
  fill(0);
  textSize(80);
  text("Dodge of Edge", width / 2, height / 2 - 30);
  
  textSize(20);
  fill(100);
  text("- 클릭하여 시작 -", width / 2, height / 2 + 100);
  
  textSize(20);
  fill(100);
  text("20261532 강민지, 20261538 김유성, 20262743 이은재", width/2, height/2 + 150);
}

function drawLevelSelectScreen() {
  textAlign(CENTER, CENTER);
  textSize(24);
  fill(120);
  text("이동할 스테이지를 선택하세요", width/2, height/2 - 200);

  drawButton(width / 2 - 120, height / 2 - 140, 240, 60, "Level 1 (원)");
drawButton(width / 2 - 120, height / 2 - 60, 240, 60, "Level 2 (삼각형)");
drawButton(width / 2 - 120, height / 2 + 20, 240, 60, "Level 3 (사각형)");

  drawButton(width / 2 - 150, height - 100, 120, 50, "매뉴얼");
  drawButton(width / 2 + 30, height - 100, 120, 50, "커스텀");
}

function drawButton(x, y, w, h, label) {
  push();
  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(x, y, w, h, 10);
  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);
  pop();
}

function drawManualPopup() {
  drawPopupBg();
  fill(0);
  textSize(30);
  text("Manual", width / 2, height / 2 - 100);
  textSize(18);
  text("원형 레일 선 위를 도는 장애물을 피하세요!\n\n[SPACEBAR] 키를 누르면\n선 안쪽 ↔ 바깥쪽으로 순간이동합니다.", width / 2, height / 2);
  fill(150);
  text("[닫으려면 화면 클릭]", width / 2, height / 2 + 130);
}

function drawCustomPopup() {
  drawPopupBg();
  fill(0);
  textSize(30);
  text("Ball Custom", width / 2, height / 2 - 110);
  textSize(14);
  fill(100);
  text("원하는 공의 색상을 클릭해 변경하세요.", width/2, height/2 - 70);
  
  let colors = [color(255, 100, 100), color(255, 165, 0), color(46, 204, 113), color(52, 152, 219), color(155, 89, 182)];
  for(let i=0; i<5; i++) {
    fill(colors[i]);
    ellipse(width/2 - 100 + (i*50), height/2, 35, 35);
  }
  fill(150);
  textSize(16);
  text("[닫으려면 화면 클릭]", width / 2, height / 2 + 130);
}

function drawPopupBg() {
  push();
  fill(255, 245);
  stroke(0);
  strokeWeight(3);
  rectMode(CENTER);
  rect(width / 2, height / 2, 500, 400, 20);
  pop();
}

function drawEndingScreen() {
  textAlign(CENTER, CENTER);
  fill(46, 204, 113);
  textSize(50);
  text("STAGE CLEARED!", width / 2, height / 2 - 80);
  
  fill(0);
  textSize(24);
  text("최종 획득 점수: " + score + " 점", width / 2, height / 2);
  
  textSize(16);
  fill(100);
  text("제작자 명: [20261532 강민지, 20261538 김유성, 20262743 이은재]\n 게임명: Dodge of Edge\n\n- 아무 곳이나 클릭하면 처음 화면으로 이동합니다 -", width / 2, height / 2 + 100);
}

// ==========================================
// 7. 통합 이벤트 핸들러 파트 (마우스 & 키보드)
// ==========================================
function isMouseInRect(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

function mouseClicked() {
  if (screenState === "TITLE") {
    screenState = "LEVEL_SELECT";
  } else if (screenState === "LEVEL_SELECT") {
    // 1. 팝업이 떠 있을 때
    if (popupState !== "NONE") {
      // 팝업 안의 색상 선택 로직 (커스텀 팝업인 경우만)
      if (popupState === "CUSTOM") {
        let colors = [color(255, 100, 100), color(255, 165, 0), color(46, 204, 113), color(52, 152, 219), color(155, 89, 182)];
        for(let i=0; i<5; i++) {
          if (isMouseInRect(width/2 - 117 + (i*50), height/2 - 20, 40, 40)) {
            playerColor = colors[i];
          }
        }
      }
      // 어디를 클릭하든 팝업은 닫힘
      popupState = "NONE";
    } 
    // 2. 팝업이 없을 때 (메인 버튼들)
    else {
      // 레벨 선택 버튼
      if (isMouseInRect(width/2 - 120, height/2 - 140, 240, 60)) { currentShape = "CIRCLE"; startGame(); }
      else if (isMouseInRect(width/2 - 120, height/2 - 60, 240, 60)) { currentShape = "TRIANGLE"; startGame(); }
      else if (isMouseInRect(width/2 - 120, height/2 + 20, 240, 60)) { currentShape = "SQUARE"; startGame(); }
      // 하단 메뉴 버튼
      else if (isMouseInRect(width/2 - 150, height - 100, 120, 50)) { popupState = "MANUAL"; }
      else if (isMouseInRect(width/2 + 30, height - 100, 120, 50)) { popupState = "CUSTOM"; }
    }
  } else if (screenState === "ENDING") {
    screenState = "TITLE";
  }
}

function startGame() {
  score = 0;
  lastSaveTime = 0;
  initObstacles();
  resetGamePlay(0);
  screenState = "GAME_PLAY";
}

function keyPressed() {
  // 카운트다운 대기 상태 중에는 오조작 방지를 위해 입력을 일시 제한
  if (screenState === "GAME_PLAY" && !isCountingDown) {
    if (key === ' ') {
      isOutside = !isOutside;
    }
    if (keyCode === ESCAPE) {
      if (bgm) bgm.stop();
      screenState = "LEVEL_SELECT";
    }
  }
}
function getPositionOnShape(angle, isOutside) {
  let r = isOutside ? TRACK_RADIUS + EDGE_OFFSET : TRACK_RADIUS - EDGE_OFFSET;
  let a = (angle % 360 + 360) % 360; // 0~360도 보정

  if (currentShape === "CIRCLE") {
    return { x: r * cos(radians(a)), y: r * sin(radians(a)) };
  } 
  else if (currentShape === "TRIANGLE") {
    // 정삼각형: 120도마다 꺾임
    let segment = floor(a / 120);
    let localA = (a % 120) - 60; // -60 ~ 60 범위로 정규화
    let dist = r / cos(radians(60)); // 삼각형 변까지의 거리 (중심에서 수직)
    let x = dist * cos(radians(localA));
    let y = dist * sin(radians(localA));
    // 회전 행렬 적용
    let rot = segment * 120;
    return {
      x: x * cos(radians(rot)) - y * sin(radians(rot)),
      y: x * sin(radians(rot)) + y * cos(radians(rot))
    };
  } 
  else if (currentShape === "SQUARE") {
    // 정사각형: 90도마다 꺾임
    let segment = floor(a / 90);
    let localA = (a % 90) - 45; // -45 ~ 45 범위로 정규화
    let dist = r; // 정사각형은 반경이 곧 변까지의 거리
    let x = dist;
    let y = dist * tan(radians(localA));
    // 회전 행렬 적용
    let rot = segment * 90;
    return {
      x: x * cos(radians(rot)) - y * sin(radians(rot)),
      y: x * sin(radians(rot)) + y * cos(radians(rot))
    };
  }
}