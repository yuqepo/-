// ==========================================
//  화면 상태 제어 변수
// ==========================================
let screenState = "TITLE"; // TITLE, LEVEL_SELECT, GAME_PLAY, ENDING, GAMEOVER
let popupState = "NONE";   // NONE, MANUAL, CUSTOM, RECORD, NEW_FEATURES, REVIEW (소감 추가)
let currentShape = "CIRCLE";
let deathCount = 0;
let savePointScore = 0;    

let isCountingDown = false;
let countdownTimer = 3;

let currentPosFunction; 
let currentNickname = "PLAYER";
let gameRecords = []; 
let realPlayTimer = 0; 

let particles = [];
const noteSymbols = ['♪', '♫', '♩', '♬', '♭', '♮', '♯'];
let deathParticles = []; 

// 스테이지별 캐릭터 이미지 변수 선언
let imgCircle1, imgCircle2;
let imgTriangle1, imgTriangle2;
let imgSquare1, imgSquare2;

// 애니메이션 제어 변수
let charAnimTimerOrder = 0;
let charAnimSpeed = 0.5;
let currentFrameIdxOrder = 0;

// ==========================================
//  게임 플레이 엔진 변수
// ==========================================
let gameTimer = 0;          
let angle = 0;              
const ROTATE_SPEED = 150;   
let TRACK_RADIUS;           

let nextLane = "INSIDE";
let isOutside = false;      

let score = 0;
let lastSaveTime = 0;       
let playerColor;            
let bgm;

let shakeAmount = 0;        
let shakeDecay = 0.9;       

let beatScale = 1.0;        
let beatWeight = 6;         

let uiDarkColor;

// ==========================================
//  박자 데이터
// ==========================================
let musics = {};
const originalNotes = [2.32, 4.07, 5.62, 6.39, 7.20, 7.96, 8.77, 9.61, 10.01, 10.44, 10.86, 11.30, 11.70, 12.15, 12.55, 12.94, 13.70, 14.54, 14.96, 15.86, 16.69, 17.55, 17.94, 18.35, 19.05, 19.22, 20.06, 20.91, 21.37, 21.57, 21.79, 22.59, 23.06, 23.51, 24.29, 24.70, 25.19, 25.82, 26.05, 26.87, 27.29, 27.72, 28.14, 28.56, 29.02, 29.44, 30.27, 31.09, 31.49, 31.95, 32.64, 32.91, 33.74, 34.20, 34.61, 35.04, 35.42, 35.87, 36.34, 36.76, 37.20, 38.06, 38.49, 38.92, 39.62, 39.81, 40.61, 41.04, 41.22, 41.49, 41.91, 42.34, 43.26, 44.15, 44.56, 44.99, 45.41, 45.80, 46.49, 46.70, 47.54, 47.97, 48.45, 48.85, 49.04, 49.30, 49.72, 50.15, 50.62, 51.02, 51.86, 52.30, 52.67, 53.37, 53.65, 54.46, 55.35, 55.76, 55.99];

const originalNotes2 = [0.98, 1.75, 2.1, 2.9, 3.17, 4.06, 4.17, 4.88, 5.55, 6.32, 
  6.65, 7.04, 7.93, 8.53, 8.75, 9.31, 9.53, 10.18, 11.1, 11.49, 
  12.07, 12.64, 13.29, 14.67, 15.44, 15.68, 16.46, 16.66, 17.36, 18.28, 
  19.06, 19.87, 20.06, 20.29, 20.61, 21.45, 22.2, 23.02, 23.26, 23.91, 
  24.82, 25.66, 26.5, 26.89, 27.33, 28.58, 28.91, 29.3, 29.86, 30.31, 
  30.85, 31.31, 31.61, 31.89, 32.19, 32.88, 33.36, 33.48, 33.94, 34.28, 
  35.13, 35.93, 36.56, 36.89, 38.05, 38.91, 39.66, 40.36, 40.9, 42.02, 
  42.86, 43.08, 43.37, 43.76, 43.92, 44.54, 45.28, 45.73, 46.09, 46.64, 
  47.09, 47.65, 47.92, 48.31, 48.68, 48.98, 49.51, 50.09, 50.35, 50.58, 
  50.76, 51.1, 52.19, 52.77, 53.51, 53.8, 54.68, 55.42, 55.95, 56.66, 
  57.15, 57.48];

const originalNotes3 = [1.44, 1.65, 1.95, 2.51, 2.99, 3.50, 4.06, 4.60, 5.12, 5.62,
    5.85, 6.14, 6.61, 7.12, 7.84, 8.12, 8.65, 9.15, 9.65, 10.15,
    10.64, 10.89, 11.40, 11.66, 12.19, 12.76, 13.25, 13.74, 13.99, 14.25,
    14.72, 15.22, 15.74, 15.97, 16.22, 16.69, 17.22, 17.80, 18.30, 19.91,
    20.16, 20.97, 21.47, 21.92, 22.24, 22.49, 23.02, 23.51, 24.02, 24.26,
    24.52, 24.81, 25.06, 25.59, 25.85, 26.12, 26.65, 26.91, 27.17, 27.69,
    28.17, 28.66, 29.17, 29.69, 30.22, 30.76, 31.26, 31.75, 32.25, 32.75,
    33.26, 33.49, 33.77, 34.27, 35.27, 35.80, 36.40, 36.89, 37.39, 37.90,
    38.44, 38.66, 38.95, 39.42, 39.94, 40.41, 40.65, 40.90, 41.46, 41.70,
    42.27, 42.49, 42.76, 43.27, 43.51, 43.77, 44.26, 44.79, 46.11, 46.62,
    46.89, 47.12, 47.65, 48.12, 48.61, 48.85, 49.65, 49.89, 50.25, 50.75,
    50.96, 51.29, 51.81, 52.39, 52.87, 53.11, 53.37 ];

const GAME_DATA = {
  CIRCLE: {
    music: 'assets/DOE_music.mp3',
    notes: originalNotes,
    savePoints: [20.91, 40.61],
    frames: [],
    charWidth: 500,
    charHeight: 750
  },
  TRIANGLE: {
    music: 'assets/DOE_music_2.mp3',
    notes: originalNotes2,
    savePoints: [20.71, 40.41],
    frames: [],
    charWidth: 300,
    charHeight: 450
  },
  SQUARE: {
    music: 'assets/DOE_music_3.mp3',
    notes: originalNotes3,
    savePoints: [21.47, 42.27],
    frames: [],
    charWidth: 340,
    charHeight: 510
  }
};

let obstacles = [];
const SPAWN_ADVANCE_TIME = 2.0; 

// ==========================================
//  시스템 빌드 및 초기화
// ==========================================
function setup() {
  createCanvas(windowWidth, windowHeight); 
  TRACK_RADIUS = height * 0.35; 
  playerColor = color(255, 100, 100);     
  currentPosFunction = getCirclePos; 
  
  uiDarkColor = color(70, 60, 55); 

  // 로컬 스토리지 데이터 불러오기
  let savedName = localStorage.getItem("dodge_nickname");
  if (savedName) {
    currentNickname = savedName;
  }
  
  let savedColor = localStorage.getItem("dodge_player_color");
  if (savedColor) {
    let cObj = JSON.parse(savedColor);
    playerColor = color(cObj.r, cObj.g, cObj.b);
  }

  let savedRecords = localStorage.getItem("dodge_records");
  if (savedRecords) {
    gameRecords = JSON.parse(savedRecords);
  }
  
  // 스테이지 별 이미지 배열 매칭
  GAME_DATA.CIRCLE.frames = [imgCircle1, imgCircle2];
  GAME_DATA.TRIANGLE.frames = [imgTriangle1, imgTriangle2];
  GAME_DATA.SQUARE.frames = [imgSquare1, imgSquare2];
}

function saveCustomState() {
  localStorage.setItem("dodge_nickname", currentNickname);
  let cObj = {
    r: red(playerColor),
    g: green(playerColor),
    b: blue(playerColor)
  };
  localStorage.setItem("dodge_player_color", JSON.stringify(cObj));
}


function preload() {
  // 배경음악 로드
  musics.CIRCLE = loadSound('assets/DOE_music.mp3');
  musics.TRIANGLE = loadSound('assets/DOE_music_2.mp3');
  musics.SQUARE = loadSound('assets/DOE_music_3.mp3'); 

  // 원 스테이지 이미지
  imgCircle1 = loadImage('assets/Dvorak_1.png');
  imgCircle2 = loadImage('assets/Dvorak_2.png');

  // 삼각형 스테이지 이미지
  imgTriangle1 = loadImage('assets/Brahms_1.png');
  imgTriangle2 = loadImage('assets/Brahms_2.png');

  // 사각형 스테이지 이미지
  imgSquare1 = loadImage('assets/Strauss_1.png');
  imgSquare2 = loadImage('assets/Strauss_2.png');
}

function selectLevel(shape) {
  currentShape = shape; // CIRCLE, TRIANGLE, SQUARE 중 하나
  
  // 도형별 좌표 함수 매핑
  if (shape === "CIRCLE") currentPosFunction = getCirclePos;
  else if (shape === "TRIANGLE") currentPosFunction = getTrianglePos;
  else if (shape === "SQUARE") currentPosFunction = getSquarePos;
  
  // 음악 객체에서 현재 모양에 맞는 음악 선택
  bgm = musics[shape];
  
  startGame();
}
function initObstacles() {
  obstacles = [];
  let data = GAME_DATA[currentShape];
  let allTimes = [...data.notes]; // 기본 노트 배열 복사

  // 현재 선택된 도형(레벨)의 세이브포인트 시간 목록 가져오기
  let currentSavePoints = data.savePoints || [];

  // 박자데이터보다 느리게 장애물이 나타나도록 설정 (리듬맞추기)
  let delayTime = 0.24; 
  let delayedTimes = allTimes.map(t => t + delayTime);
  
  delayedTimes.sort((a, b) => a - b);

  let laneToggle = "INSIDE"; 
  for (let t of allTimes) {
    let isSave = false;
    for (let sp of currentSavePoints) {
      if (Math.abs(t - sp) < 0.05) { isSave = true; break; }
    }
    
    obstacles.push({ 
      hitTime: t,           // 장애물이 나타날 시간
      type: laneToggle,     // 안쪽/바깥쪽 설정
      isSavePoint: isSave,  // 세이브 포인트인지 여부
      cleared: false        // 아직 통과하지 않았으므로 false로 설정
    });

    if (!isSave) {
      laneToggle = (laneToggle === "INSIDE") ? "OUTSIDE" : "INSIDE";
    }
  }
}

function isOverlap(time, notes) {
  for (let note of notes) {
    if (Math.abs(note - time) < 0.2) return true;
  }
  return false;
}

function resetGamePlay(targetTime, isInitial = false) {
  if (!isInitial) {
    let currentPos = currentPosFunction(angle, isOutside);
    spawnDeathParticles(currentPos.x, currentPos.y);
    deathCount++;
    score = savePointScore - (deathCount * 30); 
  }
    
  gameTimer = targetTime;
  angle = (targetTime * ROTATE_SPEED) % 360;
  isOutside = false;
  particles = [];
    
  for (let obs of obstacles) {
    if (obs.hitTime >= targetTime) {
      if (!obs.isSavePoint) {
        obs.cleared = false;
      }
    }
  }
    
  if (bgm) {
    bgm.stop();
  }
  
  isCountingDown = true;
  countdownTimer = 3.0;
}


function draw() {
  background(251, 248, 238); 
  
  if (screenState === "TITLE") {
    drawTitleScreen();
    if (popupState === "NEW_FEATURES") {
      drawNewFeaturesPopup();
    }
  } else if (screenState === "LEVEL_SELECT") {
    drawLevelSelectScreen();
    if (popupState === "MANUAL") {
      drawManualPopup();
    } else if (popupState === "CUSTOM") {
      drawCustomPopup();
    } else if (popupState === "RECORD") {
      drawRecordPopup(); 
    }
  } else if (screenState === "GAME_PLAY") {
    runGameEngine();
    resetMatrix(); 
    
    fill(uiDarkColor);
    noStroke();
    textStyle(BOLD);
    textSize(20);
    textAlign(LEFT, TOP);
    text("SCORE: " + score, 30, 30);
    text("TIME: " + realPlayTimer.toFixed(2) + "s", 30, 60); 
    
    textAlign(CENTER, BOTTOM);
    textSize(16);
    text("스페이스바: 안/밖 라인 변경  |  Esc: 레벨 선택화면으로 돌아가기", width / 2, height - 30);
  } else if (screenState === "GAMEOVER") {
    drawGameOverScreen();
  } else if (screenState === "ENDING") {
    drawEndingScreen();
    if (popupState === "REVIEW") {
      drawReviewPopup();
    }
  }
}

// ==========================================
//  게임 메인 루프 엔진
// ==========================================
function runGameEngine() {
  
  // 애니메이션 타이머 계산
  charAnimTimerOrder += deltaTime / 1000;
  if (charAnimTimerOrder >= charAnimSpeed) {
    charAnimTimerOrder = 0;
    currentFrameIdxOrder = (currentFrameIdxOrder + 1) % 2;
  }

  // 현재 스테이지 데이터 및 커스텀 크기 정의
  let currentStageData = GAME_DATA[currentShape]; 
  let currentImg = null;
  
  // 기본 크기 400, 600
  let cWidth = 400;  
  let cHeight = 600; 

  if (currentStageData) {
    // 이미지 배열 가져오기
    if (currentStageData.frames && currentStageData.frames.length > 0) {
      currentImg = currentStageData.frames[currentFrameIdxOrder];
    }
    // GAME_DATA에서 스테이지 별 캐릭터 크기 가져오기
    if (currentStageData.charWidth)  cWidth = currentStageData.charWidth;
    if (currentStageData.charHeight) cHeight = currentStageData.charHeight;
  }

  // 캐릭터 그리기 시작
  push();
  translate(width / 2, height / 2); // 화면 중심 기준 좌표 설정
  imageMode(CENTER);

  // 왼쪽 캐릭터 그리기
  let charOrderPos = { x: -width * 0.3, y: 0 };
  if (currentImg) {
     image(currentImg, charOrderPos.x, charOrderPos.y, cWidth, cHeight); 
  } else {
     // 이미지 로딩 실패 시 예외 처리 사각형
     noStroke();
     fill(100, 150, 255, 150); 
     rect(charOrderPos.x - cWidth / 2, charOrderPos.y - cHeight / 2, cWidth, cHeight);
  }

  // 오른쪽 캐릭터 그리기
  let charChaosPos = { x: width * 0.3, y: 0 };
  if (currentImg) {
     image(currentImg, charChaosPos.x, charChaosPos.y, cWidth, cHeight); 
  } else {
     // 이미지 로딩 실패 시 예외 처리 사각형
     noStroke();
     fill(255, 100, 150, 150); 
     rect(charChaosPos.x - cWidth / 2, charChaosPos.y - cHeight / 2, cWidth, cHeight);
  }
  
  pop();
  
  if (isCountingDown) {
    countdownTimer -= deltaTime / 1000;
    if (countdownTimer <= 0) {
      isCountingDown = false;
      if (bgm) {
        bgm.play(0, 1, 1, gameTimer); //(시작시간, 재생속도, 볼륨, 타임스탬프)
      }
    }
  } else {
    gameTimer += deltaTime / 1000;
    realPlayTimer += deltaTime / 1000; 
    angle = (gameTimer * ROTATE_SPEED) % 360; // 시간에 따라 회전 각도 계산
  }
  let data = GAME_DATA[currentShape];
  let lastNote = data.notes[data.notes.length - 1];

  if (gameTimer > lastNote + 2) { // 해당 레벨의 마지막 노트 기준
    if (bgm && bgm.isPlaying()) bgm.stop();
    saveCurrentGameRecord();
    screenState = "ENDING";
    return;
  }

  push(); 
  //바운스
  let currentShakeX = random(-shakeAmount, shakeAmount);
  let currentShakeY = random(-shakeAmount, shakeAmount);
  translate(width / 2 + currentShakeX, height / 2 + currentShakeY);

  shakeAmount *= shakeDecay;
  if (shakeAmount < 0.1) {
    shakeAmount = 0;
  }
  
  //lerp(현재값, 목표값, 비율)
  if (!isCountingDown) {
    beatScale = lerp(beatScale, 1.0, 0.15); // 현재 크기를 1.0으로 15%씩 부드럽게 복구
    beatWeight = lerp(beatWeight, 6, 0.15); // 현재 선 굵기를 6으로 15%씩 부드럽게 복구
  }

  push();
  scale(beatScale); // 위에서 연산한 크기로 확대/축소
  noFill();
  stroke(70, 65, 60, 180); 
  strokeWeight(beatWeight / beatScale); // 비트에 맞춰 선 굵기 조절

  if (currentShape === "CIRCLE") {
    ellipse(0, 0, TRACK_RADIUS * 2, TRACK_RADIUS * 2);
  } else {
    beginShape();
    for (let i = 0; i < 360; i += 2) { 
      let p = currentPosFunction(i, "TRACK"); 
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
  }

  let pos = currentPosFunction(angle, isOutside);
  noStroke();
  fill(playerColor);
  ellipse(pos.x, pos.y, 22, 22);

    if (!isCountingDown) {
    for (let obs of obstacles) {
      let timeLeft = obs.hitTime - gameTimer; // 장애물까지 남은 시간 계산

      if (timeLeft > -0.5 && timeLeft <= SPAWN_ADVANCE_TIME) {
        let obsAngle = angle + (timeLeft * ROTATE_SPEED); // 장애물의 현재 각도 계산

        //  세이브포인트 랜더링
        if (obs.isSavePoint) {
          let obsPos = currentPosFunction(obsAngle, "TRACK");

          push();
          translate(obsPos.x, obsPos.y);
          rotate(obsPos.angle + radians(45)); // 45도 회전(마름모)

          // 세이브포인트 색상
          stroke(uiDarkColor);
          strokeWeight(2.5);
          fill("#1DD1A1"); 
          rectMode(CENTER);

          // 비트에 맞춰 바운스
          let saveSize = 18 * beatScale;
          rect(0, 0, saveSize, saveSize, 2); 

          // 내부 사각형
          noStroke();
          fill(255);
          rect(0, 0, saveSize * 0.4, saveSize * 0.4);
          pop();

          if (!isCountingDown && abs(timeLeft) < 0.05 && !obs.cleared) {
            lastSaveTime = obs.hitTime;
            score += 100;           
            savePointScore = score; 
            deathCount = 0;         
            obs.cleared = true;
            shakeAmount = 8; 
          }
        } 
        else {
          let obsPos = currentPosFunction(obsAngle, obs.type === "OUTSIDE");

          push();
          translate(obsPos.x, obsPos.y);

          if (obs.type === "OUTSIDE") {
            rotate(obsPos.angle); 
          } else {
            rotate(obsPos.angle + PI); 
          }

          translate(0, 8); 
          fill(obs.type === "INSIDE" ? color(231, 76, 60) : color(52, 152, 219));
          noStroke();
          // 장애물 그리기
          triangle(-12, 0, 12, 0, 0, -21); 
          pop();

          if (!isCountingDown && !obs.cleared && timeLeft <= 0.02) { 

            if (timeLeft < -0.1) {
              obs.cleared = true; 
              continue;
            }

            let playerCurrentLane = isOutside ? "OUTSIDE" : "INSIDE";

            if (playerCurrentLane === obs.type) {
              shakeAmount = 35; // 화면 흔들기
              resetGamePlay(lastSaveTime); 
              break; 
            } else { //피했을 경우
              obs.cleared = true;
              score += 10;
              beatScale = 1.08;  
              beatWeight = 14;   

              let pPos = currentPosFunction(angle, isOutside);
              let noteCount = floor(random(1, 3)); 

              for (let i = 0; i < noteCount; i++) {
                particles.push({
                  x: pPos.x, 
                  y: pPos.y,
                  vx: random(-2.5, 2.5), 
                  vy: random(-4, -1),    
                  alpha: 255, 
                  symbol: random(noteSymbols), 
                  //음표 그리기
                  size: random(35, 50),
                  // 음표 색상
                  color: uiDarkColor 
                });
              }
            }
          }
        }
      }
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    p.x += p.vx; 
    p.y += p.vy; 
    p.alpha -= 7; 
    
    push();
    fill(red(p.color), green(p.color), blue(p.color), p.alpha);
    noStroke(); 
    textSize(p.size); 
    textAlign(CENTER, CENTER);
    text(p.symbol, p.x, p.y);
    pop();
    
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  updateAndDrawParticles();
  
  pop(); 
  pop(); 

  // 카운트다운
  if (isCountingDown) {
    push(); 
    resetMatrix(); 
    textAlign(CENTER, CENTER);
    
    let progress = countdownTimer - floor(countdownTimer); 
    let dynamicSize = map(progress, 1, 0, 130, 85);       
    let alpha = map(progress, 1, 0, 255, 130);             
    
    textSize(dynamicSize); 
    textStyle(BOLD); 
    
    // 1. 그림자 연출
    noStroke();
    fill(70, 60, 55, alpha * 0.15); 
    text(ceil(countdownTimer), width / 2 + 4, height / 2 + 4); 
    
    // 2. 메인 글자
    fill(70, 60, 55, alpha); 
    text(ceil(countdownTimer), width / 2, height / 2);
    pop();
  }
}

// ==========================================
//  죽음 이펙트 파티클 연산
// ==========================================
function spawnDeathParticles(startX, startY) {
  for (let i = 0; i < 25; i++) {
    let pAngle = random(TWO_PI);         
    let pSpeed = random(3, 8);           
    deathParticles.push({
      x: startX, 
      y: startY,
      vx: cos(pAngle) * pSpeed, 
      vy: sin(pAngle) * pSpeed,
      size: random(6, 12), 
      alpha: 255, 
      color: playerColor                 
    });
  }
}

function updateAndDrawParticles() {
  for (let i = deathParticles.length - 1; i >= 0; i--) {
    let p = deathParticles[i];
    
    p.x += p.vx; 
    p.y += p.vy;
    p.vx *= 0.95; 
    p.vy *= 0.95;
    p.alpha -= 5; 
    p.size *= 0.96;
    
    push(); 
    noStroke();
    fill(red(p.color), green(p.color), blue(p.color), p.alpha);
    ellipse(p.x, p.y, p.size, p.size);
    pop();
    
    if (p.alpha <= 0 || p.size < 0.5) {
      deathParticles.splice(i, 1);
    }
  }
}

// ==========================================
//  UI 화면
// ==========================================
function drawTitleScreen() {
  let t = frameCount * 0.03;

  noFill();
  stroke(110, 100, 95, 80); 
  strokeWeight(2.5);
  
  // 원
  let circleY = (height * 0.28) + sin(t * 1.2) * 15;
  stroke("#990000");
  ellipse(width * 0.22, circleY, height * 0.32, height * 0.32);
  
  // 사각형
  push();
  let squareY = (height * 0.32) + cos(t * 0.9) * 12;
  translate(width * 0.76, squareY);
  rotate(t * 0.2); 
  rectMode(CENTER);
  stroke("#004C99");
  rect(0, 0, height * 0.36, height * 0.36);
  pop();
  
  // 삼각형
  push();
  let triY = (height * 0.72) + sin(t * 1.5) * 10;
  translate(width * 0.26, triY);
  rotate(-t * 0.15); 
  
  let triSize = height * 0.18;
  let x1 = 0, y1 = -triSize;
  let x2 = triSize * cos(radians(30)), y2 = triSize * sin(radians(30));
  let x3 = -triSize * cos(radians(30)), y3 = triSize * sin(radians(30));
  stroke("#004C00");
  triangle(x1, y1, x2, y2, x3, y3);
  pop();

  // 시작 화면 구성
  textAlign(CENTER, CENTER);
  
  noStroke();
  fill(uiDarkColor); 
  textStyle(BOLD); 
  textSize(85);
  text("Dodge of Edge", width / 2, height / 2 - 40);
  
  // -------------------------------------------------------------
  // [수정 및 추가] '클릭하여 시작하기' 진하게 & 부드러운 깜빡임 효과
  // -------------------------------------------------------------
  push();
  // 밀리초(millis) 단위를 라디안으로 변환하여 0~255 사이의 알파(투명도) 값 계산 (속도 조절 가능)
  let blinkAlpha = map(sin(millis() * 0.004), -1, 1, 40, 255); 
  
  // 메인 테마의 진한 색상(uiDarkColor)에 계산된 투명도 적용
  fill(red(uiDarkColor), green(uiDarkColor), blue(uiDarkColor), blinkAlpha);
  textStyle(BOLD); // 글씨체도 조금 더 두껍고 명확하게 변경
  textSize(24);    // 시인성을 위해 크기도 기존 22에서 24로 살짝 키웠습니다.
  text("클릭하여 시작하기", width / 2, height / 2 + 90);
  pop();
  // -------------------------------------------------------------
  
  textSize(16); 
  fill(150, 140, 130);
  textStyle(NORMAL);
  text("20261532 강민지, 20261538 김유성, 20262743 이은재", width / 2, height / 2 + 160);
  
  push();
  let featX = width - 220;
  let featY = height - 80;
  drawDesignButton(featX, featY, 170, 42, "추가된 기능", 15);
  pop();
}

// 추가된 기능 소개 팝업 구성
function drawNewFeaturesPopup() {
  drawPopupBg(); 
  
  fill(uiDarkColor);
  textStyle(BOLD); 
  textSize(32);
  textAlign(CENTER, CENTER);
  text("추가된 기능", width / 2, height / 2 - 150);
  
  fill(90, 80, 75);
  textStyle(NORMAL); 
  textAlign(LEFT, TOP);
  textSize(20);
  
  let startY = height / 2 - 70;
  let gap = 46;
  
  text("1. 원, 삼각형, 사각형 궤도 선택 기능", width / 2 - 180, startY);
  text("2. 공 색상 변경 기능", width / 2 - 180, startY + gap);
  text("3. 플레이 닉네임 설정 & 변경 기능", width / 2 - 180, startY + gap * 2);
  text("4. 기록 저장(최신순으로 5번째까지 저장)", width / 2 - 180, startY + gap * 3);
  
  drawCloseButton();
}

// [개선 완료] 메인 버튼 디자인: 입체적인 3D 스타일 및 그림자 연출
function drawDesignButton(x, y, w, h, label, textSizeValue = 16) {
  push();
  rectMode(CORNER);
  
  // 마우스 호버(Hover) 상태 체크
  let isHover = isMouseInRect(x, y, w, h);
  
  // 1. 하단 드롭 그림자 (Drop Shadow)
  noStroke();
  fill(40, 35, 30, 40); // 부드러운 반투명 검은색 그림자
  rect(x + 4, y + 5, w, h, 12); 
  
  // 2. 입체감을 주기 위한 버튼 본체 주 표면 처리
  stroke(30);         
  strokeWeight(2.5);  
  
  if (isHover) {
    fill(245, 240, 230); // 마우스가 위에 올라갔을 때는 미세하게 강조 처리
    rect(x + 1, y + 1, w, h, 12); // 버튼이 살짝 눌리는 듯한 시각적 효과
  } else {
    fill(255);           // 기본 하얀색 버튼 본체
    rect(x, y, w, h, 12);
  }

  // 3. 텍스트 배치
  fill(30);
  noStroke();
  textStyle(BOLD); // 가독성을 위해 BOLD 처리
  textSize(textSizeValue);
  textAlign(CENTER, CENTER);
  
  if (isHover) {
    text(label, x + w / 2 + 1, y + h / 2 + 1);
  } else {
    text(label, x + w / 2, y + h / 2);
  }
  pop();
}

// 레벨 선택 화면 구성
function drawLevelSelectScreen() {
  textAlign(CENTER, CENTER);

  push();
  textAlign(LEFT, TOP);
  textSize(28); 
  textStyle(BOLD);
  if (isMouseInRect(40, 40, 40, 40)) { 
    fill(200, 50, 50); 
  } else {
    fill(uiDarkColor);
  }
  noStroke();
  text("←", 40, 40);
  pop();

  fill(50);
  textStyle(BOLD);
  textSize(28);
  text("환영합니다, " + currentNickname + "님!", width / 2, height / 2 - 240);

  drawDesignButton(width / 2 - 60, height / 2 - 190, 120, 35, "닉네임 설정", 14);

  fill(120, 115, 110);
  textStyle(NORMAL);
  textSize(20);
  text("이동할 스테이지를 선택하세요", width / 2, height / 2 - 110);

  let btnW = 300;
  let btnH = 60;
  drawDesignButton(width / 2 - btnW / 2, height / 2 - 50, btnW, btnH, "Level 1 (원)", 18);
  drawDesignButton(width / 2 - btnW / 2, height / 2 + 35, btnW, btnH, "Level 2 (삼각형)", 18);
  drawDesignButton(width / 2 - btnW / 2, height / 2 + 120, btnW, btnH, "Level 3 (사각형)", 18);

  let botW = 120;
  let botH = 50;
  let botY = height / 2 + 220;
  drawDesignButton(width / 2 - 200, botY, botW, botH, "매뉴얼", 16);
  drawDesignButton(width / 2 - 60, botY, botW, botH, "커스텀", 16);
  drawDesignButton(width / 2 + 80, botY, botW, botH, "기록저장", 16);
}

// ==========================================
//  팝업 디자인
// ==========================================
function drawPopupBg() { 
  push(); 
  fill(0, 0, 0, 50); 
  noStroke(); 
  rectMode(CENTER);
  rect(width / 2 + 6, height / 2 + 7, 600, 480, 20); // 메인 팝업 레이어의 입체 그림자 강화 

  fill(255); 
  stroke(0); 
  strokeWeight(3); 
  rect(width / 2, height / 2, 600, 480, 20); 
  pop(); 
}

// [개선 완료] 팝업 닫기 버튼: 기존 평면형 스타일에서 입체 그림자형 디자인으로 리뉴얼
function drawCloseButton() { 
  let bx = width / 2 + 215; 
  let by = height / 2 - 220; 
  
  push(); 
  rectMode(CORNER);
  let isHover = isMouseInRect(bx, by, 65, 32);
  
  // 하단 미세 그림자
  noStroke();
  fill(40, 30, 30, 40);
  rect(bx + 2, by + 3, 65, 32, 8);
  
  // 버튼 본체
  stroke(0); 
  strokeWeight(2.5);
  if (isHover) {
    fill("#E52E2E"); // 호버 시 좀 더 밝은 레드
    rect(bx + 1, by + 1, 65, 32, 8);
  } else {
    fill("#CC0000"); 
    rect(bx, by, 65, 32, 8); 
  }
  
  fill(255); // 검은 글씨에서 가독성을 위해 흰색 스타일로 변경
  noStroke(); 
  textStyle(BOLD); 
  textAlign(CENTER, CENTER); 
  textSize(14); 
  if (isHover) {
    text("닫기", bx + 33.5, by + 17);
  } else {
    text("닫기", bx + 32.5, by + 16); 
  }
  pop(); 
}

function isCloseButtonClicked() { 
  return isMouseInRect(width / 2 + 215, height / 2 - 220, 65, 32); 
}

// 게임 매뉴얼 팝업
function drawManualPopup() { 
  drawPopupBg(); 
  
  fill(uiDarkColor); 
  textStyle(BOLD); 
  textSize(32); 
  textAlign(CENTER, CENTER);
  text("게임 매뉴얼", width / 2, height / 2 - 170); 
  
  textSize(15); 
  textStyle(NORMAL); 
  fill(90, 80, 75);
  
  let manualText = 
    "■ 기본 조작 및 규칙\n" +
    "도형 레일 위를 도는 장애물을 타이밍에 맞춰 피해야 합니다.\n" +
    "[ SPACEBAR ] 키를 누르면 공이 선 안쪽 ↔ 바깥쪽으로 이동합니다.\n\n" +
    "■ Save Point\n" +
    "트랙 위에 나타나는 Save Point를 지나치면 체크포인트가 활성화됩니다.\n" +
    "장애물에 부딪혀 게임오버가 되더라도 처음부터 시작하지 않고,\n" +
    "가장 최근 세이브포인트에서 자동으로 부활합니다.\n\n" +
    "■ 점수 시스템 \n" +
    "장애물을 무사히 통과할 때마다 +10점을 획득합니다.\n" +
    "세이브포인트를 체크하면 보너스 +100점을 얻습니다.\n" +
    "단, 장애물에 충돌하여 부활할 때마다 -30점이 차감됩니다.\n\n" +
    "■ 플레이 시간 초\n" +
    "게임 화면에 표시되는 TIME은 스테이지가 시작된 후 누적된 '실제 플레이 시간'입니다.\n" +
    "음악 박자에 맞춰 끝까지 생존하여 스테이지를 클리어하는 것이 목표입니다.";
    
  text(manualText, width / 2, height / 2 + 15); 
  drawCloseButton(); 
}

// 공 커스텀 팝업
function drawCustomPopup() { 
  drawPopupBg(); 
  
  fill(uiDarkColor); 
  textStyle(BOLD); 
  textSize(32); 
  textAlign(CENTER, CENTER);
  text("공 커스텀", width / 2, height / 2 - 140); 
  
  textSize(18); 
  textStyle(NORMAL); 
  fill(120, 110, 100); 
  text("플레이어 공의 색상을 변경할 수 있습니다.", width / 2, height / 2 - 80); 
  
  let colors = [
    color(255, 100, 100),   //빨
    color(255, 165, 0),     //주
    color(46, 204, 113),    //초
    color(52, 152, 219),    //파
    color(155, 89, 182)     //보
  ]; 
  
  // 선택한 공 테두리 칠하기
  for (let i = 0; i < 5; i++) { 
    push(); 
    if (colors[i].toString() === playerColor.toString()) { 
      stroke(0); 
      strokeWeight(3.5); 
    } else { 
      noStroke(); 
    } 
    fill(colors[i]); 
    ellipse(width / 2 - 100 + (i * 50), height / 2 + 20, 45, 45); 
    pop(); 
  } 
  
  drawCloseButton(); 
}

// 게임 기록 팝업
function drawRecordPopup() { 
  drawPopupBg(); 
  
  fill(uiDarkColor); 
  textStyle(BOLD); 
  textAlign(CENTER, CENTER); 
  textSize(32); 
  text("리더보드 기록", width / 2, height / 2 - 150); 
  
  textSize(16); 
  textStyle(NORMAL); 
  fill(120, 110, 100); 
  text("최근 클리어 기록 리스트입니다.", width / 2, height / 2 - 100); 
  
  let startY = height / 2 - 40; 
  if (gameRecords.length === 0) { 
    textAlign(CENTER, CENTER); 
    fill(160, 150, 140); 
    textSize(18);
    text("아직 저장된 클리어 기록이 없습니다.", width / 2, height / 2 + 20); 
  } else { 
  // AI 활용 | 최근 5개 기록만 저장하기 위해 Math.min 함수 사용
    for (let i = 0; i < Math.min(gameRecords.length, 5); i++) { 
      let rec = gameRecords[i]; 
      let ballColorStr = rec.color ? rec.color : "기본"; 
      let recordText = `${i + 1}.  [${rec.shape}]  ${rec.name}   |   색상: ${ballColorStr}   |   ${rec.score}점   |   ${rec.time}초`; 
      
      textAlign(LEFT, CENTER); 
      fill(70, 65, 60); 
      textSize(15); 
      text(recordText, width / 2 - 220, startY + (i * 45)); 
    } 
  } 
  
  drawCloseButton(); 
}

// ==========================================
//  제작자 소감 팝업
// ==========================================
function drawReviewPopup() {
  push();
  fill(0, 0, 0, 50);
  noStroke();
  rectMode(CENTER);
  rect(width / 2 + 6, height / 2 + 7, 800, 540, 20); // 그림자 입체감 강화

  fill(255);
  stroke(0);
  strokeWeight(3);
  rect(width / 2, height / 2, 800, 540, 20);
  pop();

  fill(uiDarkColor);
  textStyle(BOLD);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Dodge of Edge - 제작 소감", width / 2, height / 2 - 210);

  let startX = width / 2 - 350;
  let startY = height / 2 - 140;
  
  // 강민지 소감
  push();
  fill(uiDarkColor);
  textStyle(BOLD);
  textSize(15);
  textAlign(LEFT, TOP);
  text("강민지 (글로벌미디어학부)", startX, startY);
  textStyle(NORMAL);
  textSize(13);
  fill(60);
  let reviewMinji = "개발 중반부 이후 지속적인 리팩토링과 수정 작업을 거치며 체계적인 사전 설계가 얼마나 중요한지 실감했습니다. 초기 기획 단계에서 세부 내용을 명확히 정의하지 않고 곧바로 구현을 시작하다보니, 기능이 추가될 때마다 기존 코드와의 충돌이 발생했고, 더 좋은 방안이 떠오를 때마다 수정 작업을 반복해야만 했습니다. 이 과정을 통해 컨셉 설정과 전체 프로세스 과정을 기획하는 등 구현 전 단계적인 기획이 왜 필수적인지 몸소 느끼게 되었습니다. 많은 시행착오가 있었지만, 게임을 완성하고 나니 큰 성취감을 느꼈으며, 이번 프로젝트에서 겪은 경험과 사전 기획의 중요성을 기반으로, 향후의 프로젝트에서는 더욱 효율적이고 완성도 높은 프로그램을 개발할 것입니다.";
  text(reviewMinji, startX, startY + 22, 700, 100);
  pop();
  
  // 김유성 소감
  push();
  fill(uiDarkColor);
  textStyle(BOLD);
  textSize(15);
  textAlign(LEFT, TOP);
  text("김유성 (글로벌미디어학부)", startX, startY + 130);
  textStyle(NORMAL);
  textSize(13);
  fill(60);
  let reviewYuseong = "게임 개발은 생각대로 한 번에 흘러가지 않고 끊임없는 수정을 거쳐야 완성된다는 것을 배웠습니다. 하지만 혼자가 아니라 3명의 팀원이 분업하여 진행한 덕분에 부담을 덜고 효율적으로 완수할 수 있어 든든했습니다. 코드가 수정되면서 게임의 완성도가 점점 높아지는 과정을 지켜보는 것이 정말 흥미롭고 성취감 있었습니다.";
  text(reviewYuseong, startX, startY + 152, 700, 80);
  pop();

  // 이은재 소감
  push();
  fill(uiDarkColor);
  textStyle(BOLD);
  textSize(15);
  textAlign(LEFT, TOP);
  text("이은재 (글로벌미디어학부)", startX, startY + 230);
  textStyle(NORMAL);
  textSize(13);
  fill(60);
  let reviewEunjae = "수많은 시도를 거치며 더 나은 방향을 고민해야 비로소 게임이 완성됨을 알 수 있었습니다. 게임을 개발하는 과정에서 계획했던 업무 분담대로 착실히 진행하는 것이 아닌 여럿이 한 문제에만 몰두하는 등의 상황이 발생하기도 했습니다. 그러다 보니 상당히 비효율적으로 일이 진행된 부분이 없잖아 있었는데 이 과정에서 체계적인 계획의 중요성을 알 수 있었습니다. 이후에 체계적인 분담을 통해 개발을 진행하면서 분업의 필요성과 효율성을 절실히 느낄 수 있었습니다. 또한 기획했던 데로 게임이 완성된 모습에 성취감도 느낄 수 있었습니다. 이후 프로젝트에서 이 경험을 바탕으로 더 발전된 모습을 보이고 싶습니다.";
  text(reviewEunjae, startX, startY + 252, 700, 100);
  pop();

  // 제작소감 팝업 닫기 버튼 (디자인 일관성을 위해 수정)
  let bx = width / 2 + 310;
  let by = height / 2 - 250;
  push();
  rectMode(CORNER);
  let isHover = isMouseInRect(bx, by, 65, 32);
  noStroke();
  fill(40, 30, 30, 40);
  rect(bx + 2, by + 3, 65, 32, 8);
  
  stroke(0);
  strokeWeight(2.5);
  if (isHover) {
    fill("#E52E2E");
    rect(bx + 1, by + 1, 65, 32, 8);
  } else {
    fill("#CC0000");
    rect(bx, by, 65, 32, 8);
  }
  fill(255);
  noStroke();
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(14);
  if (isHover) {
    text("닫기", bx + 33.5, by + 17);
  } else {
    text("닫기", bx + 32.5, by + 16);
  }
  pop();
}

// 클리어 화면 구성
function drawEndingScreen() { 
  textAlign(CENTER, CENTER); 
  fill(46, 204, 113); 
  textStyle(BOLD); 
  textSize(55); 
  text("STAGE CLEARED!", width / 2, height / 2 - 90); 
  
  fill(uiDarkColor); 
  textSize(24); 
  text("최종 획득 점수: " + score + " 점", width / 2, height / 2 - 10); 
  
  textSize(16); 
  textStyle(NORMAL); 
  fill(120, 110, 100); 
  text("제작자 명: 20261532 강민지, 20261538 김유성, 20262743 이은재\n게임명: Dodge of Edge", width / 2, height / 2 + 60); 

  drawDesignButton(width / 2 - 238, height / 2 + 140, 145, 50, "처음 화면으로", 16); 
  drawDesignButton(width / 2 - 73 , height / 2 + 140, 145, 50, "다시 시작하기", 16); 
  drawDesignButton(width / 2 + 92, height / 2 + 140, 145, 50, "제작 소감 보기", 16);
}

// ==========================================
//  사용자 입력 감지 로직
// ==========================================
function isMouseInRect(x, y, w, h) { 
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h; 
}

function mouseClicked() { 
  if (screenState === "TITLE") { 
    // 추가된 기능 팝업이 열려있을 때
    if (popupState === "NEW_FEATURES") {
      // 닫기 버튼을 클릭
      if (isCloseButtonClicked()) { 
        popupState = "NONE";
      }
    } 
    // 일반 시작 화면 상태일 때
    else {
      // 버튼 클릭
      if (isMouseInRect(width - 220, height - 80, 170, 42)) {
        popupState = "NEW_FEATURES"; 
      } else {
      // 일반 화면 클릭 시 레벨 선택 화면으로 넘어감
        screenState = "LEVEL_SELECT"; 
      }
    }
  } 
  else if (screenState === "LEVEL_SELECT") { 
    if (popupState !== "NONE") { 
      if (popupState === "CUSTOM") { 
        let colors = [
          color(255, 100, 100), 
          color(255, 165, 0), 
          color(46, 204, 113), 
          color(52, 152, 219), 
          color(155, 89, 182)
        ]; 
        for (let i = 0; i < 5; i++) { 
          // [수정 완료] 원형 버튼들의 Y축 실질 위치(center y = height/2 + 20)에 맞춰 마우스 검출 범위 매칭
          if (dist(mouseX, mouseY, width / 2 - 100 + (i * 50), height / 2 + 20) < 22.5) { 
            playerColor = colors[i]; 
            saveCustomState(); 
          } 
        } 
      } 
      // 모든 일반 팝업창 공용 닫기 버튼 클릭 감지
      if (isCloseButtonClicked()) {
        popupState = "NONE"; 
      }
    } 
    else { 
      if (isMouseInRect(40, 40, 40, 40)) {
        screenState = "TITLE";
      }
      else if (isMouseInRect(width / 2 - 60, height / 2 - 190, 120, 35)) {
        let input = prompt("사용할 닉네임을 입력하세요:", currentNickname); 
        if (input !== null && input.trim() !== "") { 
          currentNickname = input.trim(); 
          saveCustomState(); 
        }
      }
      else if (isMouseInRect(width / 2 - 150, height / 2 - 50, 300, 60)) { 
  selectLevel("CIRCLE"); // 한 줄로 요약
} 
else if (isMouseInRect(width / 2 - 150, height / 2 + 35, 300, 60)) { 
  selectLevel("TRIANGLE"); // 한 줄로 요약
} 
else if (isMouseInRect(width / 2 - 150, height / 2 + 120, 300, 60)) { 
  selectLevel("SQUARE"); // 한 줄로 요약
}
      else if (isMouseInRect(width / 2 - 200, height / 2 + 220, 120, 50)) { 
        popupState = "MANUAL"; 
      } 
      else if (isMouseInRect(width / 2 - 60, height / 2 + 220, 120, 50)) { 
        popupState = "CUSTOM"; 
      } 
      else if (isMouseInRect(width / 2 + 80, height / 2 + 220, 120, 50)) { 
        popupState = "RECORD"; 
      } 
    } 
  } 
  else if (screenState === "ENDING") { 
    if (popupState === "REVIEW") {
      if (isMouseInRect(width / 2 + 310, height / 2 - 250, 65, 32)) {
        popupState = "NONE";
      }
    }
	else {
      // 시작 화면 버튼
      if (isMouseInRect(width / 2 - 238, height / 2 + 140, 145, 50)) {
        screenState = "TITLE"; 
      // 다시 시작 버튼
      } else if (isMouseInRect(width / 2 - 73, height / 2 + 140, 145, 50)) {
        startGame(); 
      // 제작 소감 화면 버튼
      } else if (isMouseInRect(width / 2 + 92, height / 2 + 140, 145, 50)) {
        popupState = "REVIEW"; 
      }
    }
  }
}

function prepareGame() { 
  startGame(); 
}

function startGame() { 
  score = 0; 
  lastSaveTime = 0; 
  savePointScore = 0; 
  deathCount = 0; 
  realPlayTimer = 0; 
  deathParticles = []; 
  popupState = "NONE"; 
  
  initObstacles(); 
  resetGamePlay(0, true); 
  screenState = "GAME_PLAY"; 
}

function saveCurrentGameRecord() { 
  let colorStr = "빨강"; 
  let cString = playerColor.toString(); 
  
  if (cString === color(255, 100, 100).toString()) {
    colorStr = "빨강"; 
  } else if (cString === color(255, 165, 0).toString()) {
    colorStr = "주황"; 
  } else if (cString === color(46, 204, 113).toString()) {
    colorStr = "초록"; 
  } else if (cString === color(52, 152, 219).toString()) {
    colorStr = "파랑"; 
  } else if (cString === color(155, 89, 182).toString()) {
    colorStr = "보라"; 
  }
  
  let newRecord = { 
    shape: currentShape, 
    name: currentNickname, 
    score: score, 
    time: realPlayTimer.toFixed(2), 
    color: colorStr 
  }; 
  
  gameRecords.unshift(newRecord); 
  localStorage.setItem("dodge_records", JSON.stringify(gameRecords)); 
}

function keyPressed() { 
// 시연용 : M키 누르면 엔딩화면으로
  if (screenState === "GAME_PLAY" && (key === 'm' || key === 'M')) {
    
    if (bgm && bgm.isPlaying()) {
      bgm.stop(); 
    }
    
    screenState = "ENDING"; 
    popupState = "NONE";
    return;
  }
  
  if (screenState === "GAME_PLAY") { 
    if (keyCode === ESCAPE) { 
      if (bgm && bgm.isPlaying()) {
        bgm.stop(); 
      }
      screenState = "LEVEL_SELECT"; 
      return; 
    } 
    if (!isCountingDown && key === ' ') {
      isOutside = !isOutside; 
    }
  } 
}

// ==========================================
//  트랙 기하학 연산 (원, 삼각형, 사각형)
// ==========================================
function getCirclePos(angle, positionType) { 
  let r = TRACK_RADIUS; 
  if (positionType !== "TRACK") {
    // 공의 위치 조정 (안/밖)
    r += (positionType === true) ? 12 : -12; 
  }
  
  let rad = radians((angle % 360 + 360) % 360); 
  return { 
    // 삼각함수를 이용해 극좌표를 x, y로 변환
    x: r * cos(rad), 
    y: r * sin(rad), 
    angle: rad + HALF_PI 
  }; 
}

function getTrianglePos(angle, positionType) { 
  let normAngle = (angle % 360 + 360) % 360;
  let r = TRACK_RADIUS * 1.2;
  
  if (positionType !== "TRACK") {
    r += (positionType === true) ? 24 : -24;
  }

  // 1. 정삼각형의 3 꼭짓점 (높이를 이용한 좌표)
  // 높이 h = r * sin(60도) = r * sqrt(3)/2
  let h = r * 0.866; // 약 0.866
  let p1 = { x: 0, y: -r };             // 위
  let p2 = { x: r * 0.866, y: r * 0.5 };  // 오른쪽 아래
  let p3 = { x: -r * 0.866, y: r * 0.5 }; // 왼쪽 아래
  let vertices = [p1, p2, p3, p1];      // 다시 p1으로 복귀
  
  // 2. 120도(360/3)씩 구간 나누기
  let segment = floor(normAngle / 120) % 3;
  let segmentProgress = (normAngle % 120) / 120;
  
  let startPt = vertices[segment];
  let endPt = vertices[segment + 1];
  
  let posX = lerp(startPt.x, endPt.x, segmentProgress);
  let posY = lerp(startPt.y, endPt.y, segmentProgress);
  
  // 3. 각 변의 기울기 (정삼각형 변은 각각 -30도, 90도, 210도 회전되어 있음)
  let edgeAngles = [radians(-30), radians(90), radians(210)];
  let currentEdgeAngle = edgeAngles[segment];
  
  return {
    x: posX,
    y: posY + 40,
    angle: currentEdgeAngle + HALF_PI
  };
}

function getSquarePos(angle, positionType) { 
  let normAngle = (angle % 360 + 360) % 360; 
  let r = TRACK_RADIUS * 0.9; 
  
  if (positionType !== "TRACK") {
    r += (positionType === true) ? 12 : -12;
  }
  
  //좌표 설정
  let p1 = { x: -r, y: -r }; 
  let p2 = { x: r, y: -r }; 
  let p3 = { x: r, y: r }; 
  let p4 = { x: -r, y: r }; 
  let vertices = [p1, p2, p3, p4, p1]; // 한 바퀴 돌기 위한 배열
  
  let segment = floor(normAngle / 90) % 4; //지금 공의 각도가 몇 번째 변에 있는지 계산
  let segmentProgress = (normAngle % 90) / 90; //그 변 안에서 얼마나 이동했는지 계산
  
  let startPt = vertices[segment]; 
  let endPt = vertices[segment + 1]; 
  
  let posX = lerp(startPt.x, endPt.x, segmentProgress); 
  let posY = lerp(startPt.y, endPt.y, segmentProgress); 
  
  let edgeAngles = [radians(-90), radians(0), radians(90), radians(180)]; 
  let currentEdgeAngle = edgeAngles[segment]; 
  
  return { 
    x: posX, 
    y: posY, 
    angle: currentEdgeAngle + HALF_PI 
  }; 
}